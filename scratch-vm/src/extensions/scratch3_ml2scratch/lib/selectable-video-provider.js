import { requestVideoStream, requestDisableVideo } from './camera.js';
// import log from '../log.js';
import minilog from 'minilog';
minilog.enable();
const log = minilog('gui');


/**
 * Video Manager for video extensions.
 */
class SelectableVideoProvider {
    constructor () {
        /**
         * Default value for mirrored frames.
         * @type boolean
         */
        this.mirror = true;

        /**
         * Cache frames for this many ms.
         * @type number
         */
        this._frameCacheTimeout = 16;

        /**
         * DOM Video element
         * @private
         */
        this._video = null;

        /**
         * Usermedia stream track
         * @private
         */
        this._track = null;

        /**
         * Stores some canvas/frame data per resolution/mirror states
         */
        this._workspace = [];

        /**
         * The video descriptor used in getUserMedia
         * @type {MediaStreamConstraints['video']}
         */
        this._videoDescriptor = {}

        /**
         * A list of available video devices.
         * This array remains empty until camera permission is granted.
         * @type {Array<MediaDeviceInfo>}
         */
        this._videoDevices = [];
        navigator.mediaDevices.addEventListener("devicechange", () => this._updateVideoDevices())
        navigator.permissions.query({name: "camera"}).then(p => p.addEventListener("change", () => this._updateVideoDevices()))
        this._updateVideoDevices()
    }

    static get FORMAT_IMAGE_DATA () {
        return 'image-data';
    }

    static get FORMAT_CANVAS () {
        return 'canvas';
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS () {
        return [480, 360];
    }

    /**
     * Order preview drawable is inserted at in the renderer.
     * @type {number}
     */
    static get ORDER () {
        return 1;
    }

    /**
     * Get the HTML video element containing the stream
     */
    get video () {
        return this._video;
    }

    /**
     * Get the list of available video devices.
     * This array remains empty until camera permission is granted.
     * @type {Array<MediaDeviceInfo>}
     */
    get videoDevices() {
        return this._videoDevices;
    }

    /**
     * Request video be enabled.  Sets up video, creates video skin and enables preview.
     *
     * @return {Promise.<Video>} resolves a promise to this video provider when video is ready.
     */
    enableVideo () {
        this.enabled = true;
        return this._setupVideo();
    }

    /**
     * Disable video stream (turn video off)
     *
     * @return {Promise.<Video>} resolves a promise to this video provider when video is disabled.
     */
    disableVideo () {
        this.enabled = false;
        // If we have begun a setup process, call _teardown after it completes
        if (this._singleSetup) {
            return this._singleSetup
                .then(this._teardown.bind(this))
                .catch(err => this.onError(err));
        }
        return Promise.resolve()
    }

    /**
     * async part of disableVideo
     * @private
     */
    _teardown () {
        // we might be asked to re-enable before _teardown is called, just ignore it.
        if (this.enabled === false) {
            const disableTrack = requestDisableVideo();
            this._singleSetup = null;
            // by clearing refs to video and track, we should lose our hold over the camera
            this._video = null;
            if (this._track && disableTrack) {
                this._track.stop();
            }
            this._track = null;
        }
    }

    /**
     * Return frame data from the video feed in a specified dimensions, format, and mirroring.
     *
     * @param {object} frameInfo A descriptor of the frame you would like to receive.
     * @param {Array.<number>} frameInfo.dimensions [width, height] array of numbers.  Defaults to [480,360]
     * @param {boolean} frameInfo.mirror If you specificly want a mirror/non-mirror frame, defaults to true
     * @param {string} frameInfo.format Requested video format, available formats are 'image-data' and 'canvas'.
     * @param {number} frameInfo.cacheTimeout Will reuse previous image data if the time since capture is less than
     *                                        the cacheTimeout.  Defaults to 16ms.
     *
     * @return {ArrayBuffer|Canvas|string|null} Frame data in requested format, null when errors.
     */
    getFrame ({
        dimensions = VideoProvider.DIMENSIONS,
        mirror = this.mirror,
        format = VideoProvider.FORMAT_IMAGE_DATA,
        cacheTimeout = this._frameCacheTimeout
    }) {
        if (!this.videoReady) {
            return null;
        }
        const [width, height] = dimensions;
        const workspace = this._getWorkspace({dimensions, mirror: Boolean(mirror)});
        const {videoWidth, videoHeight} = this._video;
        const {canvas, context, lastUpdate, cacheData} = workspace;
        const now = Date.now();

        // if the canvas hasn't been updated...
        if (lastUpdate + cacheTimeout < now) {

            if (mirror) {
                context.scale(-1, 1);
                context.translate(width * -1, 0);
            }

            context.drawImage(this._video,
                // source x, y, width, height
                0, 0, videoWidth, videoHeight,
                // dest x, y, width, height
                0, 0, width, height
            );

            // context.resetTransform() doesn't work on Edge but the following should
            context.setTransform(1, 0, 0, 1, 0, 0);
            workspace.lastUpdate = now;
        }

        // each data type has it's own data cache, but the canvas is the same
        if (!cacheData[format]) {
            cacheData[format] = {lastUpdate: 0};
        }
        const formatCache = cacheData[format];

        if (formatCache.lastUpdate + cacheTimeout < now) {
            if (format === VideoProvider.FORMAT_IMAGE_DATA) {
                formatCache.lastData = context.getImageData(0, 0, width, height);
            } else if (format === VideoProvider.FORMAT_CANVAS) {
                // this will never change
                formatCache.lastUpdate = Infinity;
                formatCache.lastData = canvas;
            } else {
                log.error(`video io error - unimplemented format ${format}`);
                // cache the null result forever, don't log about it again..
                formatCache.lastUpdate = Infinity;
                formatCache.lastData = null;
            }

            // rather than set to now, this data is as stale as it's canvas is
            formatCache.lastUpdate = Math.max(workspace.lastUpdate, formatCache.lastUpdate);
        }

        return formatCache.lastData;
    }

    /**
     * Method called when an error happens.  Default implementation is just to log error.
     *
     * @abstract
     * @param {Error} error An error object from getUserMedia or other source of error.
     */
    onError (error) {
        log.error('Unhandled video io device error', error);
    }

    /**
     * Create a video stream.
     * @private
     * @return {Promise} When video has been received, rejected if video is not received
     */
    _setupVideo () {
        // We cache the result of this setup so that we can only ever have a single
        // video/getUserMedia request happen at a time.
        if (this._singleSetup) {
            return this._singleSetup;
        }

        this._singleSetup = requestVideoStream(Object.assign({
            width: { min: 480, ideal: 640 },
            height: { min: 360, ideal: 480 }
        }, this._videoDescriptor))
            .then(stream => {
                if(this._video == null) {
                    this._video = document.createElement('video');
                } else {
                    if(!this.video.paused) {
                        this.video.pause()
                    }
                }
                /** @type {Omit<HTMLVideoElement, keyof HTMLElement>} */
                const video = this.video
                if(!video.paused) {
                    video.pause()
                }

                // Use the new srcObject API, falling back to createObjectURL
                try {
                    this._video.srcObject = stream;
                } catch (error) {
                    this._video.src = window.URL.createObjectURL(stream);
                }
                // Hint to the stream that it should load. A standard way to do this
                // is add the video tag to the DOM. Since this extension wants to
                // hide the video tag and instead render a sample of the stream into
                // the webgl rendered Scratch canvas, another hint like this one is
                // needed.
                this._video.play(); // Needed for Safari/Firefox, Chrome auto-plays.
                this._track = stream.getTracks()[0];
                return this;
            })
            .catch(error => {
                this._singleSetup = null;
                this.onError(error);
            });

        return this._singleSetup;
    }

    get videoReady () {
        if (!this.enabled) {
            return false;
        }
        if (!this._video) {
            return false;
        }
        if (!this._track) {
            return false;
        }
        const {videoWidth, videoHeight} = this._video;
        if (typeof videoWidth !== 'number' || typeof videoHeight !== 'number') {
            return false;
        }
        if (videoWidth === 0 || videoHeight === 0) {
            return false;
        }
        return true;
    }

    /**
     * get an internal workspace for canvas/context/caches
     * this uses some document stuff to create a canvas and what not, probably needs abstraction
     * into the renderer layer?
     * @private
     * @return {object} A workspace for canvas/data storage.  Internal format not documented intentionally
     */
    _getWorkspace ({dimensions, mirror}) {
        let workspace = this._workspace.find(space => (
            space.dimensions.join('-') === dimensions.join('-') &&
            space.mirror === mirror
        ));
        if (!workspace) {
            workspace = {
                dimensions,
                mirror,
                canvas: document.createElement('canvas'),
                lastUpdate: 0,
                cacheData: {}
            };
            workspace.canvas.width = dimensions[0];
            workspace.canvas.height = dimensions[1];
            workspace.context = workspace.canvas.getContext('2d');
            this._workspace.push(workspace);
        }
        return workspace;
    }

    /**
     * Set a new video descriptor and update the media stream if video is enabled.
     *
     * @param {MediaStreamConstraints['video']} videoDescriptor The new video descriptor to be set.
     * @returns {Promise<void>} A promise that resolves when the video source has been successfully updated,
     *                           or rejects with an error if the update fails.
     */
    setVideoDescriptor(videoDescriptor) {
        if (JSON.stringify(videoDescriptor) === JSON.stringify(this._videoDescriptor)) {
            return Promise.resolve()
        }
        const oldVideoDescriptor = this._videoDescriptor
        this._videoDescriptor = videoDescriptor;
        const dev = this._findDesiredVideoDevice()
        if(dev != null) {
            this._videoDescriptor = { deviceId: dev.deviceId }
            if (JSON.stringify(oldVideoDescriptor) === JSON.stringify(this._videoDescriptor)) {
                return Promise.resolve()
            }
        }
        const currentVideoReady = this.videoReady
        return this.disableVideo().then(() => {
            this._singleSetup = null;
            if (currentVideoReady) {
                return this.enableVideo()
            }
        })
    }

    /**
     *
     */
    _findDesiredVideoDevice() {
        const videoDescriptor = this._videoDescriptor
        if (typeof videoDescriptor.deviceId !== "undefined" && videoDescriptor.deviceId !== "") {
            return this._videoDevices.find(dev => dev.deviceId === videoDescriptor.deviceId)
        }
        // label指定の場合は完全一致と先頭一致と部分一致をチェックする
        if (typeof videoDescriptor.label !== "undefined" && videoDescriptor.label !== "") {
            const dev =
                this._videoDevices.find(dev => dev.label === videoDescriptor.label) ||
                this._videoDevices.find(dev => dev.label.startsWith(videoDescriptor.label)) ||
                this._videoDevices.find(dev => dev.label.includes(videoDescriptor.label)) ||
                this._videoDevices.find(dev => dev.label.toLocaleLowerCase().includes(videoDescriptor.label.toLocaleLowerCase()))
            if (dev != null) {
                return dev
            }
        }
        return null
    }

    /**
     * Updates the list of available video devices.
     * @private
     */
    _updateVideoDevices() {
        navigator.mediaDevices.enumerateDevices()
            .catch(() => [])
            .then((devices) => {
                this._videoDevices = devices
                    .filter(d => d.deviceId && d.kind === 'videoinput')
                    .sort((a, b) => b.label < a.label);
            })
            .then(devices => {
                // 希望デバイスの指定がある場合はカメラを切り替える
                const dev = this._findDesiredVideoDevice()
                if(dev != null) {
                    this.setVideoDescriptor(dev)
                }
                return devices
            })
    }

}

/**
 * Replaces the current video provider in the runtime with a SelectableVideoProvider.
 * Preserves the video state and settings during the switch.
 *
 * @param {Object} runtime The runtime to inject the video provider into.
 * @returns {SelectableVideoProvider} The new or existing video provider.
 */
export const setupSelectableVideoProvider = (runtime) => {
    if(isSelectableVideoProvider(runtime.ioDevices.video.provider)) {
        return runtime.ioDevices.video.provider
    }
    const newProvider = new SelectableVideoProvider()
    const oldProvider = runtime.ioDevices.video.provider
    const oldVideoReady = oldProvider != null && oldProvider.videoReady
    if (oldProvider != null) {
        newProvider._workspace = oldProvider._workspace
        newProvider._track = oldProvider._track
        newProvider._video = oldProvider._video
        newProvider.mirror = oldProvider.mirror
        if(oldProvider.videoReady) {
            oldProvider.disableVideo()
        }
    }
    // New VideoProvider from here
    runtime.ioDevices.video.setProvider(newProvider)
    if(oldVideoReady) {
        runtime.ioDevices.video.enableVideo()
    }
    return newProvider
}

/**
 * Checks if the provided videoProvider meets the criteria of a SelectableVideoProvider.
 * @param {Object} videoProvider - The video provider object to check.
 * @returns {boolean} - Returns true if videoProvider meets the criteria of a SelectableVideoProvider, false otherwise.
 */
export const isSelectableVideoProvider = (videoProvider) => {
    return videoProvider
        && typeof videoProvider.videoDevices !== "undefined"
        && typeof videoProvider.setVideoDescriptor !== "undefined"
}

export const VideoProvider = SelectableVideoProvider;
export default VideoProvider;
