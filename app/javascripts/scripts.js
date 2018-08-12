import $ from 'jquery'
import 'bootstrap'

const IMAGE_SIZE = 270;
let videoPlaying = false;

$(function () {
  // Setup webcam
  let video = $('video')[0];
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (stream) {
    video.srcObject = stream;
    // _this.video.width = IMAGE_SIZE;
    // _this.video.height = IMAGE_SIZE;

    video.addEventListener('playing', function () {
      videoPlaying = true;
    });
    video.addEventListener('paused', function () {
      videoPlaying = false;
    });
  });

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

      <a href="#" class="button is-w100 is-mini">
        <i class="icon-camera is-mini"></i>
      </a>
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
})
