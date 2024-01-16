const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('ml5');
const { setupSelectableVideoProvider } = require('./lib/selectable-video-provider');

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */
let formatMessage = require('format-message');

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://champierre.github.io/ml2scratch/ml2scratch.mjs';

const HAT_TIMEOUT = 100;

const blockIconURI = 'data:image/png;base64,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';

const Message = {
  train_label_1: {
    'ja': 'ラベル1を学習する',
    'ja-Hira': 'ラベル1をがくしゅうする',
    'en': 'train label 1',
    'zh-cn': '学习标签1',
    'zh-tw': '學習標籤1'
  },
  train_label_2: {
    'ja': 'ラベル2を学習する',
    'ja-Hira': 'ラベル2をがくしゅうする',
    'en': 'train label 2',
    'zh-cn': '学习标签2',
    'zh-tw': '學習標籤2'
  },
  train_label_3: {
    'ja': 'ラベル3を学習する',
    'ja-Hira': 'ラベル3をがくしゅうする',
    'en': 'train label 3',
    'zh-cn': '学习标签3',
    'zh-tw': '學習標籤3'
  },
  train: {
    'ja': 'ラベル[LABEL]を学習する',
    'ja-Hira': 'ラベル[LABEL]をがくしゅうする',
    'en': 'train label [LABEL]',
    'zh-cn': '学习标签[LABEL]',
    'zh-tw': '學習標籤[LABEL]'
  },
  when_received_block: {
    'ja': 'ラベル[LABEL]を受け取ったとき',
    'ja-Hira': 'ラベル[LABEL]をうけとったとき',
    'en': 'when received label:[LABEL]',
    'zh-cn': '接收到类别[LABEL]时',
    'zh-tw': '接收到類別[LABEL]時'
  },
  label_block: {
    'ja': 'ラベル',
    'ja-Hira': 'ラベル',
    'en': 'label',
    'zh-cn': '标签',
    'zh-tw': '標籤'
  },
  counts_label_1: {
    'ja': 'ラベル1の枚数',
    'ja-Hira': 'ラベル1のまいすう',
    'en': 'counts of label 1',
    'zh-cn': '标签数量1',
    'zh-tw': '標籤數量1'
  },
  counts_label_2: {
    'ja': 'ラベル2の枚数',
    'ja-Hira': 'ラベル2のまいすう',
    'en': 'counts of label 2',
    'zh-cn': '标签数量2',
    'zh-tw': '標籤數量2'
  },
  counts_label_3: {
    'ja': 'ラベル3の枚数',
    'ja-Hira': 'ラベル3のまいすう',
    'en': 'counts of label 3',
    'zh-cn': '标签数量3',
    'zh-tw': '標籤數量3'
  },
  counts_label_4: {
    'ja': 'ラベル4の枚数',
    'ja-Hira': 'ラベル4のまいすう',
    'en': 'counts of label 4',
    'zh-cn': '标签数量4',
    'zh-tw': '標籤數量4'
  },
  counts_label_5: {
    'ja': 'ラベル5の枚数',
    'ja-Hira': 'ラベル5のまいすう',
    'en': 'counts of label 5',
    'zh-cn': '标签数量5',
    'zh-tw': '標籤數量5'
  },
  counts_label_6: {
    'ja': 'ラベル6の枚数',
    'ja-Hira': 'ラベル6のまいすう',
    'en': 'counts of label 6',
    'zh-cn': '标签数量6',
    'zh-tw': '標籤數量6'
  },
  counts_label_7: {
    'ja': 'ラベル7の枚数',
    'ja-Hira': 'ラベル7のまいすう',
    'en': 'counts of label 7',
    'zh-cn': '标签数量7',
    'zh-tw': '標籤數量7'
  },
  counts_label_8: {
    'ja': 'ラベル8の枚数',
    'ja-Hira': 'ラベル8のまいすう',
    'en': 'counts of label 8',
    'zh-cn': '标签数量8',
    'zh-tw': '標籤數量8'
  },
  counts_label_9: {
    'ja': 'ラベル9の枚数',
    'ja-Hira': 'ラベル9のまいすう',
    'en': 'counts of label 9',
    'zh-cn': '标签数量9',
    'zh-tw': '標籤數量9'
  },
  counts_label_10: {
    'ja': 'ラベル10の枚数',
    'ja-Hira': 'ラベル10のまいすう',
    'en': 'counts of label 10',
    'zh-cn': '标签数量10',
    'zh-tw': '標籤數量10'
  },
  counts_label: {
    'ja': 'ラベル[LABEL]の枚数',
    'ja-Hira': 'ラベル[LABEL]のまいすう',
    'en': 'counts of label [LABEL]',
    'zh-cn': '标签数量[LABEL]',
    'zh-tw': '標籤數量[LABEL]'
  },
  any: {
    'ja': 'のどれか',
    'ja-Hira': 'のどれか',
    'en': 'any',
    'zh-cn': '任何',
    'zh-tw': '任何'
  },
  all: {
    'ja': 'の全て',
    'ja-Hira': 'のすべて',
    'en': 'all',
    'zh-cn': '所有',
    'zh-tw': '所有量'
  },
  reset: {
    'ja': 'ラベル[LABEL]の学習をリセット',
    'ja-Hira': 'ラベル[LABEL]のがくしゅうをリセット',
    'en': 'reset label:[LABEL]',
    'zh-cn': '重置[LABEL]',
    'zh-tw': '重置[LABEL]'
  },
  download_learning_data: {
    'ja': '学習データをダウンロード',
    'ja-Hira': 'がくしゅうデータをダウンロード',
    'en': 'download learning data',
    'zh-cn': '下载学习数据',
    'zh-tw': '下載學習資料'
  },
  upload_learning_data: {
    'ja': '学習データをアップロード',
    'ja-Hira': 'がくしゅうデータをアップロード',
    'en': 'upload learning data',
    'zh-cn': '上传学习数据',
    'zh-tw': '上傳學習資料'
  },
  upload: {
    'ja': 'アップロード',
    'ja-Hira': 'アップロード',
    'en': 'upload',
    'zh-cn': '上传',
    'zh-tw': '上傳'
  },
  uploaded: {
    'ja': 'アップロードが完了しました。',
    'ja-Hira': 'アップロードがかんりょうしました。',
    'en': 'The upload is complete.',
    'zh-cn': '上传完成。',
    'zh-tw': '上傳完成。'
  },
  upload_instruction: {
    'ja': 'ファイルを選び、アップロードボタンをクリックして下さい。',
    'ja-Hira': 'ファイルをえらび、アップロードボタンをクリックしてください。',
    'en': 'Select a file and click the upload button.',
    'zh-cn': '选择一个文件，然后单击上传按钮。',
    'zh-tw': '選擇一個檔案，然後點擊上傳按鈕'
  },
  confirm_reset: {
    'ja': '本当にリセットしてもよろしいですか？',
    'ja-Hira': 'ほんとうにリセットしてもよろしいですか？',
    'en': 'Are you sure to reset?',
    'zh-cn': '你确定要重置吗？',
    'zh-tw': '您確定要重置嗎？'
  },
  toggle_classification: {
    'ja': 'ラベル付けを[CLASSIFICATION_STATE]にする',
    'ja-Hira': 'ラベルづけを[CLASSIFICATION_STATE]にする',
    'en': 'turn classification [CLASSIFICATION_STATE]',
    'zh-cn': '[CLASSIFICATION_STATE]分类',
    'zh-tw': '[CLASSIFICATION_STATE]分類'
  },
  set_classification_interval: {
    'ja': 'ラベル付けを[CLASSIFICATION_INTERVAL]秒間に1回行う',
    'ja-Hira': 'ラベルづけを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
    'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
    'zh-cn': '每隔[CLASSIFICATION_INTERVAL]秒标记一次',
    'zh-tw': '每隔[CLASSIFICATION_INTERVAL]秒標記一次'
  },
  video_toggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]',
    'zh-cn': '[VIDEO_STATE]摄像头',
    'zh-tw': '視訊設為[VIDEO_STATE]'
  },
  set_input: {
    'ja': '[INPUT]の画像を学習/判定する',
    'ja-Hira': '[INPUT]のがぞうをがくしゅう/はんていする',
    'en': 'Learn/Classify [INPUT] image',
    'zh-cn': '学习/分类[INPUT]图像',
	'zh-tw': '學習/分類[INPUT]影像'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'zh-cn': '开启',
    'zh-tw': '開啟'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off',
    'zh-cn': '关闭',
    'zh-tw': '關閉'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
    'zh-cn': '镜像开启',
    'zh-tw': '翻轉'
  },
  webcam: {
    'ja': 'カメラ',
    'ja-Hira': 'カメラ',
    'en': 'webcam',
    'zh-cn': '网络摄像头',
    'zh-tw': '網路攝影機'
  },
  stage: {
    'ja': 'ステージ',
    'ja-Hira': 'ステージ',
    'en': 'stage',
    'zh-cn': '舞台',
    'zh-tw': '舞台'
  },
  first_training_warning: {
    'ja': '最初の学習にはしばらく時間がかかるので、何度もクリックしないで下さい。',
    'ja-Hira': 'さいしょのがくしゅうにはしばらくじかんがかかるので、なんどもクリックしないでください。',
    'en': 'The first training will take a while, so do not click again and again.',
    'zh-cn': '第一项研究需要一段时间，所以不要一次又一次地点击。',
    'zh-tw': '第一次訓練需要一段時間，請稍後，不要一直點擊。'
  },
  select_camera: {
    'ja': 'カメラを[DEVICE]に切り替える',
    'ja-Hira': 'かめらを[DEVICE]にきりかえる',
    'en': 'Set camera to [DEVICE]',
    'zh-cn': '切换相机至[DEVICE]',
    'zh-te': '切换相机至[DEVICE]'
  },
  select_camera_default: {
    'ja': '\u{200b}Default\u{200b}', // ビデオデバイスの label にマッチしない値にする
    'ja-Hira': '\u{200b}Default\u{200b}',
    'en': '\u{200b}Default\u{200b}',
    'zh-cn': '\u{200b}Default\u{200b}',
    'zh-te': '\u{200b}Default\u{200b}'
  },
}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn', 'zh-tw'];

class Scratch3ML2ScratchBlocks {

  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return 'ML2Scratch';
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return 'ml2scratch';
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * extensionURL will be reset when the module is loaded from the web.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  constructor(runtime) {
    this.runtime = runtime;
    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }

    this.when_received = false;
    this.when_received_arr = Array(8).fill(false);
    this.label = null;
    this.locale = this.setLocale();

    this.blockClickedAt = null;

    this.counts = null;
    this.firstTraining = true;

    this.interval = 1000;
    this.globalVideoTransparency = 0;
    this.setVideoTransparency({
        TRANSPARENCY: this.globalVideoTransparency
    });

    this.canvas = document.querySelector('canvas');

    //初めて video を利用する前に VidepProvider を差し替えておく
    this.selectableVideoProvider = setupSelectableVideoProvider(runtime)

    this.runtime.ioDevices.video.enableVideo().then(() => {this.input = this.runtime.ioDevices.video.provider.video});

    this.knnClassifier = ml5.KNNClassifier();
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      console.log('[featureExtractor] Model Loaded!');
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    });
  }

  getInfo() {
    this.locale = this.setLocale();

    return {
      id: Scratch3ML2ScratchBlocks.EXTENSION_ID,
      name: Scratch3ML2ScratchBlocks.EXTENSION_NAME,
      extensionURL: Scratch3ML2ScratchBlocks.extensionURL,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'addExample1',
          blockType: BlockType.COMMAND,
          text: Message.train_label_1[this.locale]
        },
        {
          opcode: 'addExample2',
          blockType: BlockType.COMMAND,
          text: Message.train_label_2[this.locale]
        },
        {
          opcode: 'addExample3',
          blockType: BlockType.COMMAND,
          text: Message.train_label_3[this.locale]
        },
        {
          opcode: 'train',
          text: Message.train[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'train_menu',
              defaultValue: '4'
            }
          }
        },
        {
          opcode: 'trainAny',
          text: Message.train[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'getLabel',
          text: Message.label_block[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'whenReceived',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'received_menu',
              defaultValue: 'any'
            }
          }
        },
        {
          opcode: 'whenReceivedAny',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'getCountByLabel1',
          text: Message.counts_label_1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel2',
          text: Message.counts_label_2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel3',
          text: Message.counts_label_3[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel4',
          text: Message.counts_label_4[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel5',
          text: Message.counts_label_5[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel6',
          text: Message.counts_label_6[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel7',
          text: Message.counts_label_7[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel8',
          text: Message.counts_label_8[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel9',
          text: Message.counts_label_9[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel10',
          text: Message.counts_label_10[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel',
          text: Message.counts_label[this.locale],
          blockType: BlockType.REPORTER,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'reset',
          blockType: BlockType.COMMAND,
          text: Message.reset[this.locale],
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'reset_menu',
              defaultValue: 'all'
            }
          }
        },
        {
          opcode: 'resetAny',
          blockType: BlockType.COMMAND,
          text: Message.reset[this.locale],
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              defaultValue: '11'
            }
          }
        },
        {
          opcode: 'download',
          text: Message.download_learning_data[this.locale],
          blockType: BlockType.COMMAND
        },
        {
          opcode: 'upload',
          text: Message.upload_learning_data[this.locale],
          blockType: BlockType.COMMAND
        },
        {
          opcode: 'toggleClassification',
          text: Message.toggle_classification[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_STATE: {
              type: ArgumentType.STRING,
              menu: 'classification_menu',
              defaultValue: 'off'
            }
          }
        },
        {
          opcode: 'setClassificationInterval',
          text: Message.set_classification_interval[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_INTERVAL: {
              type: ArgumentType.STRING,
              menu: 'classification_interval_menu',
              defaultValue: '1'
            }
          }
        },
        {
          opcode: 'videoToggle',
          text: Message.video_toggle[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            VIDEO_STATE: {
              type: ArgumentType.STRING,
              menu: 'video_menu',
              defaultValue: 'off'
            }
          }
        },
        {
          opcode: 'setVideoTransparency',
          text: formatMessage({
              id: 'videoSensing.setVideoTransparency',
              default: 'set video transparency to [TRANSPARENCY]',
              description: 'Controls transparency of the video preview layer'
          }),
          arguments: {
              TRANSPARENCY: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 50
              }
          }
        },
        {
          opcode: 'setInput',
          text: Message.set_input[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            INPUT: {
              type: ArgumentType.STRING,
              menu: 'input_menu',
              defaultValue: 'webcam'
            }
          }
        },
        {
          opcode: 'selectCamera',
          text: Message.select_camera[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            DEVICE: {
              type: ArgumentType.STRING,
              menu: 'select_camera_menu',
              defaultValue: 'Default'
            }
          }
        }
      ],
      menus: {
        received_menu: {
          items: this.getMenu('received')
        },
        reset_menu: {
          items: this.getMenu('reset')
        },
        train_menu: {
          items: this.getTrainMenu()
        },
        count_menu: {
          items: this.getTrainMenu()
        },
        video_menu: this.getVideoMenu(),
        classification_interval_menu: {
          acceptReporters: true,
          items: this.getClassificationIntervalMenu()
        },
        classification_menu: this.getClassificationMenu(),
        input_menu: this.getInputMenu(),
        select_camera_menu: 'getSelectCameraMenu'
      }
    };
  }

  /**
   * The transparency setting of the video preview stored in a value
   * accessible by any object connected to the virtual machine.
   * @type {number}
   */
  get globalVideoTransparency () {
      const stage = this.runtime.getTargetForStage();
      if (stage) {
          return stage.videoTransparency;
      }
      return 50;
  }

  set globalVideoTransparency (transparency) {
      const stage = this.runtime.getTargetForStage();
      if (stage) {
          stage.videoTransparency = transparency;
      }
      return transparency;
  }

  addExample1() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '1');
    this.updateCounts();
  }

  addExample2() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '2');
    this.updateCounts();
  }

  addExample3() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '3');
    this.updateCounts();
  }

  train(args) {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, args.LABEL);
    this.updateCounts();
  }

  trainAny(args) {
    this.train(args);
  }

  getLabel() {
    return this.label;
  }

  whenReceived(args) {
    if (args.LABEL === 'any') {
      if (this.when_received) {
        setTimeout(() => {
            this.when_received = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    } else {
      if (this.when_received_arr[args.LABEL]) {
        setTimeout(() => {
          this.when_received_arr[args.LABEL] = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    }
  }

  whenReceivedAny(args) {
    return this.whenReceived(args);
  }

  getCountByLabel1() {
    if (this.counts) {
      return this.counts['1'];
    } else {
      return 0;
    }
  }

  getCountByLabel2() {
    if (this.counts) {
      return this.counts['2'];
    } else {
      return 0;
    }
  }

  getCountByLabel3() {
    if (this.counts) {
      return this.counts['3'];
    } else {
      return 0;
    }
  }

  getCountByLabel4() {
    if (this.counts) {
      return this.counts['4'];
    } else {
      return 0;
    }
  }

  getCountByLabel5() {
    if (this.counts) {
      return this.counts['5'];
    } else {
      return 0;
    }
  }

  getCountByLabel6() {
    if (this.counts) {
      return this.counts['6'];
    } else {
      return 0;
    }
  }

  getCountByLabel7() {
    if (this.counts) {
      return this.counts['7'];
    } else {
      return 0;
    }
  }

  getCountByLabel8() {
    if (this.counts) {
      return this.counts['8'];
    } else {
      return 0;
    }
  }

  getCountByLabel9() {
    if (this.counts) {
      return this.counts['9'];
    } else {
      return 0;
    }
  }

  getCountByLabel10() {
    if (this.counts) {
      return this.counts['10'];
    } else {
      return 0;
    }
  }

  getCountByLabel(args) {
    if (this.counts[args.LABEL]) {
      return this.counts[args.LABEL];
    } else {
      return 0;
    }
  }

  reset(args) {
    if (this.actionRepeated()) { return };

    setTimeout(() => {
      let result = confirm(Message.confirm_reset[this.locale]);
      if (result) {
        if (args.LABEL == 'all') {
          this.knnClassifier.clearAllLabels();
          for (let label in this.counts) {
            this.counts[label] = 0;
          }
        } else {
          if (this.counts[args.LABEL] > 0) {
            this.knnClassifier.clearLabel(args.LABEL);
            this.counts[args.LABEL] = 0;
          }
        }
      }
    }, 1000);
  }

  resetAny(args) {
    this.reset(args);
  }

  download() {
    if (this.actionRepeated()) { return };
    let fileName = String(Date.now());
    this.knnClassifier.save(fileName);
  }

  upload() {
    if (this.actionRepeated()) { return };
    let width = 480;
    let height = 200;
    let left = window.innerWidth / 2;
    let top = window.innerHeight / 2;
    let x = left - (width / 2);
    let y = top - (height / 2);
    uploadWindow = window.open('', null, 'top=' + y + ',left=' + x + ',width=' + width + ',height=' + height);
    uploadWindow.document.open();
    uploadWindow.document.write('<html><head><title>' + Message.upload_learning_data[this.locale] + '</title></head><body>');
    uploadWindow.document.write('<p>' + Message.upload_instruction[this.locale] + '</p>');
    uploadWindow.document.write('<input type="file" id="upload-files">');
    uploadWindow.document.write('<input type="button" value="' + Message.upload[this.locale] + '" id="upload-button">');
    uploadWindow.document.write('</body></html>');
    uploadWindow.document.close();

    uploadWindow.document.getElementById("upload-button").onclick = () =>{
      this.uploadButtonClicked(uploadWindow);
    }
  }

  toggleClassification (args) {
    let state = args.CLASSIFICATION_STATE;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (state === 'on') {
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    }
  }

  setClassificationInterval (args) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
  }

  videoToggle (args) {
    let state = args.VIDEO_STATE;
    if (state === 'off') {
      this.runtime.ioDevices.video.disableVideo();
    } else {
      this.runtime.ioDevices.video.enableVideo().then(() => {this.input = this.runtime.ioDevices.video.provider.video});
      this.runtime.ioDevices.video.mirror = state === "on";
    }
  }

  /**
   * A scratch command block handle that configures the video preview's
   * transparency from passed arguments.
   * @param {object} args - the block arguments
   * @param {number} args.TRANSPARENCY - the transparency to set the video
   *   preview to
   */
  setVideoTransparency (args) {
      const transparency = Cast.toNumber(args.TRANSPARENCY);
      this.globalVideoTransparency = transparency;
      this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  setInput (args) {
    let input = args.INPUT;
    if (input === 'webcam') {
      this.input = this.runtime.ioDevices.video.provider.video;
    } else {
      this.input = this.canvas;
    }
  }

  uploadButtonClicked(uploadWindow) {
    let files = uploadWindow.document.getElementById('upload-files').files;

    if (files.length <= 0) {
      uploadWindow.alert('Please select JSON file.');
      return false;
    }

    let fr = new FileReader();

    fr.onload = (e) => {
      let data = JSON.parse(e.target.result);
      this.knnClassifier.load(data, () => {
        console.log('uploaded!');

        this.updateCounts();
        alert(Message.uploaded[this.locale]);
      });
    }

    fr.onloadend = (e) => {
      uploadWindow.document.getElementById('upload-files').value = "";
    }

    fr.readAsText(files.item(0));
    uploadWindow.close();
  }

  classify() {
    let numLabels = this.knnClassifier.getNumLabels();
    if (numLabels == 0) return;

    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.classify(features, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        this.label = this.getTopConfidenceLabel(result.confidencesByLabel);
        this.when_received = true;
        this.when_received_arr[this.label] = true
      }
    });
  }

  getTopConfidenceLabel(confidences) {
    let topConfidenceLabel;
    let topConfidence = 0;

    for (let label in confidences) {
      if (confidences[label] > topConfidence) {
        topConfidenceLabel = label;
      }
    }

    return topConfidenceLabel;
  }

  updateCounts() {
    this.counts = this.knnClassifier.getCountByLabel();
    console.debug(this.counts);
  }

  actionRepeated() {
    let currentTime = Date.now();
    if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
      console.log('Please do not repeat trigerring this block.');
      this.blockClickedAt = currentTime;
      return true;
    } else {
      this.blockClickedAt = currentTime;
      return false;
    }
  }

  getMenu(name) {
    let arr = [];
    let defaultValue = 'any';
    let text = Message.any[this.locale];
    if (name == 'reset') {
      defaultValue = 'all';
      text = Message.all[this.locale];
    }
    arr.push({text: text, value: defaultValue});
    for(let i = 1; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }

  getTrainMenu() {
    let arr = [];
    for(let i = 4; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }

  getVideoMenu() {
    return [
      {
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      },
      {
        text: Message.video_on_flipped[this.locale],
        value: 'on-flipped'
      }
    ]
  }

  getInputMenu() {
    return [
      {
        text: Message.webcam[this.locale],
        value: 'webcam'
      },
      {
        text: Message.stage[this.locale],
        value: 'stage'
      }
    ]
  }

  getClassificationIntervalMenu() {
    return [
      {
        text: '1',
        value: '1'
      },
      {
        text: '0.5',
        value: '0.5'
      },
      {
        text: '0.2',
        value: '0.2'
      },
      {
        text: '0.1',
        value: '0.1'
      }
    ]
  }

  getClassificationMenu() {
    return [
      {
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      }
    ]
  }

  firstTrainingWarning() {
    if (this.firstTraining) {
      alert(Message.first_training_warning[this.locale]);
      this.firstTraining = false;
    }
  }

  selectCamera(args) {
    const label = args.DEVICE || ''
    this.selectableVideoProvider.setVideoDescriptor({ label })
  }

  getSelectCameraMenu() {
    const defaultValue = {
      text: Message.select_camera_default[this.locale],
      value: Message.select_camera_default[this.locale]
    }
    const devices = this.selectableVideoProvider.videoDevices.map(dev => ({
      text: dev.label,
      value: dev.label
    }))
    return [defaultValue].concat(devices)
  }

  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return 'en';
    }
  }
}

exports.blockClass = Scratch3ML2ScratchBlocks; // loadable-extension needs this line.
module.exports = Scratch3ML2ScratchBlocks;
