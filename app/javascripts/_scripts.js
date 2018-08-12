import $ from 'jquery'
import 'bootstrap'

import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';
import FileSaver from 'file-saver';

// Number of classes to classify
const NUM_CLASSES = 10;
const TOPK = 10;

class Main {
  constructor(){
    this.training = -1;
    this.videoPlaying = false;
    this.video = $('video')[0];

    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })

    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new KNNImageClassifier(NUM_CLASSES, TOPK);

    // Load knn model
    this.knn.load().then(() => this.start());

    let _this = this;
    $('#learning .button').each(function(i) {
      $(this).on('mousedown', ()=> {
        _this.training = i;
        console.log('mousedown:' + i);
      });
      $(this).on('mouseup', ()=> {
        _this.training = -1;
        console.log('mouseup:' + i);
      });
    });
  }

  start(){
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  animate(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = dl.fromPixels(this.video);
      // Train class if one of the buttons is held down
      if(this.training != -1){
        console.log('image added');
        // Add current image to classifier
        // this.knn.addImage(image, this.training)
      }

      // If any examples have been added, run predict
      const exampleCount = this.knn.getClassExampleCount();
      console.log("exampleCount:" + exampleCount);
      if(Math.max(...exampleCount) > 0){
        this.knn.predictClass(image)
        .then((res)=>{
          for(let i=0;i<NUM_CLASSES; i++){
            console.log(res.classIndex);

            // Make the predicted class bold
            if(res.classIndex == i){
              // this.infoTexts[i].style.fontWeight = 'bold';
              if(this.ws && this.ws.readyState === WebSocket.OPEN){
                this.ws.send(JSON.stringify({action: 'predict', conn_id: this.connId, value: res.classIndex}));
              }
            } else {
              // this.infoTexts[i].style.fontWeight = 'normal';
            }

            // Update info text
            if(exampleCount[i] > 0){
              console.log("exampleCount" + exampleCount[i]);
              // this.infoTexts[i].innerText = ` ${exampleCount[i]} ${I18n.t('examples')} - ${res.confidences[i]*100}% `
            }
          }
        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose()
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}


window.addEventListener('load', () => {
  new Main();

  $('#add-card').on('click', function(e) {
    const content =`
    <div class="card-block">
      <div class="dammy-photo"></div>

      <div class="card-block__info">
        <span>
          <i class="icon-photos"></i>
          x 5
        </span>
        <div class="dropdown">
          <a href="#" class="link" data-toggle="dropdown">
            <i class="icon-dots-white"></i>
          </a>
          <div class="card-dropdown-menu dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#">リセット</a>
          </div>
        </div>
      </div>

      <button class="button is-w100 is-mini">
        <i class="icon-camera is-mini"></i>
      </button>
    </div>
    `;

    return false;
  });

  // fileを選択したら名前を表示させる
  $('[data-file]').each(function(index, el) {
    $(el).on('change', function(e) {
      let filename = $(e.currentTarget).val().split('\\').pop()
      let element = $(e.currentTarget).closest('.input-file').find('[data-file-name]')[0]
      element.innerText = filename;
      $(e.currentTarget).closest('.input-file').addClass('has-file')
    });
  });
});
