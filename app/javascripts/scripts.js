// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import $ from 'jquery'
import 'jquery.cookie';
import 'bootstrap'
import FileSaver from 'file-saver';

// Number of classes to classify
const NUM_CLASSES = 8;

String.prototype.sprintf = function()
{
    let str = this + '';
    const args = Array.prototype.slice.call(arguments);

    let ph = true;
    if (str.indexOf('%s', 0) != -1) {
        ph = false;
    }

    if (args.length === 1) {
        if (ph) {
            return str.replace(/%1$s/g, args[0]);
        } else {
            return str.replace(/%s/g, args[0]);
        }
    } else {
        for (let i=0; i<args.length; i++) {
            const n = i + 1;
            if (ph) {
                str = str.replace('%'+n+'$s', args[i]);
            } else {
                str = str.replace('%s', args[i]);
            }
        }
    }
    return str;
}

const LOCALIZED_TEXT = {
  ja: {
    input: "入力",
    connection: "接続",
    trained_model: "学習済みモデル",
    trained_model_text: "学習済みのモデルをアップロードして、これまで学習したモデルと入れ替えます。",
    training: "学習",
    trained_images: "学習済み画像",
    settings: "設定",
    settings_help_text: "WebSocketサーバーのURL",
    connect: "接続",
    connection_id: "接続ID",
    recognition: '認識',
    blank_id_is_invalid: "接続IDを入力してください。",
    no_examples_added: "まだ学習していません",
    examples: "枚",
    train: '「分類%s」として学習する',
    edit_label: 'ラベルを編集',
    clear: 'リセット',
    clear_all: 'すべてをリセット',
    download: '学習済みモデルをダウンロード',
    upload: 'アップロード',
    help_text: "ML2Scratch用の拡張機能が追加されたScratchのページを開いて、下記の接続IDを「ID: [ ]で接続する」ブロックにコピー&ペーストしてください。",
    open_scratch: 'Scratchを開く',
    choose_file: 'ファイルを選択...',
    readme: "README(説明)",
    readme_url: "https://github.com/champierre/ml2scratch/blob/master/README.ja.md"
  },
  en: {
    input: "Input",
    connection: "Connect",
    trained_model: "Trained Model",
    trained_model_text: 'Upload trained model.',
    training: "Training",
    trained_images: "Trained Images",
    settings: "Settings",
    settings_help_text: "WebSocket Server URL",
    connect: "Connect",
    connection_id: "Connection ID",
    recognition: 'Recognition',
    blank_id_is_invalid: "Blank ID is invalid.",
    no_examples_added: "No examples added",
    examples: "examples",
    train: 'Train %s',
    edit_label: 'Edit label',
    clear: 'Reset',
    clear_all: 'Reset all',
    download: 'Download trained model',
    upload: 'Upload',
    help_text: "Open Scratch with ML2Scratch extension added and use this ID when you connect.",
    open_scratch: 'Open Scratch',
    choose_file: 'Choose File...',
    readme: 'README',
    readme_url: "https://github.com/champierre/ml2scratch/blob/master/README.md"
  },
  zh_cn: {
    input: "输入",
    connection: "连接",
    trained_model: "学习模型",
    trained_model_text: "上传学习模型",
    training: "学习",
    trained_images: "Trained Images",
    settings: "设置",
    settings_help_text: "WebSocket服务器链接",
    connect: "连接",
    connection_id: "连接ID",
    recognition: "识别",
    blank_id_is_invalid: "Blank ID is invalid.",
    no_examples_added: "尚未学习",
    examples: "examples",
    train: '学习类别 %s',
    edit_label: '编辑类别',
    clear: '重置',
    clear_all: '重置所有类别',
    download: '下载',
    upload: '上传',
    help_text: "打开已加入扩展功能的Scratch的页面，把上面的连接ID拷贝到[用ID: []连接]模块的空白处。",
    open_scratch: '打开Scratch',
    choose_file: '选取文件...',
    readme: 'README',
    readme_url: "https://github.com/champierre/ml2scratch/blob/master/README.zh-cn.md"
  }
}

class I18n {
  constructor(){
    window.I18n = this;

    $('[data-locale]').each(function(i, el) {
      $(el).html(I18n.t($(el).data("locale")));
    });
  }

  static t(key, arg = '') {
    let lang = window.navigator.language;
    const vars = this.getUrlVars();
    if (vars['lang'] && vars['lang'].length > 0) {
      lang = vars['lang'];
    }
    if (lang == 'ja') {
      return LOCALIZED_TEXT['ja'][key].sprintf(arg);
    } else if (lang == 'zh_cn') {
      return LOCALIZED_TEXT['zh_cn'][key].sprintf(arg);
    }else {
      return LOCALIZED_TEXT['en'][key].sprintf(arg);
    }
  }

  static getUrlVars() {
    let vars = [], max = 0, hash = "", array = "";
    const url = window.location.search;

    hash  = url.slice(1).split('&');
    max = hash.length;
    for (let i = 0; i < max; i++) {
        array = hash[i].split('=');
        vars.push(array[0]);
        vars[array[0]] = array[1];
    }
    return vars;
  }
}

class Main {
  constructor(){
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    this.connId = undefined;
    this.wss_url = $.cookie('wss_url') || "wss://ml2scratch-helper.glitch.me"
    this.video = $('video')[0];
    this.isTouchDevice = 'ontouchstart' in document.documentElement;
    this.knnClassifier = ml5.KNNClassifier();
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      this.start();
    });

    let params = new URLSearchParams(window.location.search);
    if (params.get('conn_id')) {
      this.connId = params.get('conn_id');
    } else {
      this.connId = Math.floor(Math.random(100000000) * 100000000)
    }
    $('#conn-id').val(this.connId);
    this.connect(this.connId);

    // Create cards. This needs to be run at the first place.
    for(let i=0;i<NUM_CLASSES; i++){
      this.addCard();
    }

    this.infoTexts = $('#learning .info-text');

    this.images = [];
    for(let i=0;i<NUM_CLASSES; i++){
      this.images[i] = [];
    }

    // Replace readme href
    $('#readme').attr("href", I18n.t("readme_url"));

    $('#trained-images .images').hide();

    $('#clear-all-menu').on('click', ()=> {
      this.clearAll();
      return false;
    });

    $('#learning .edit-label-menu').each((i, el) => {
      $(el).on('click', ()=> {
        this.editLabel(i);
        return false;
      });
    });

    $('#learning .clear-menu').each((i, el) => {
      $(el).on('click', ()=> {
        this.clear(i);
        return false;
      });
    });

    $('#download-button').on('click', ()=> {
      this.download();
      return false;
    });

    $('#conn-id').on('click', (e)=> {
      $(e.target).select();
    })

    // fileを選択したら名前を表示する
    $('[data-file]').each(function(index, el) {
      $(el).on('change', function(e) {
        let filename = $(e.currentTarget).val().split('\\').pop()
        let element = $(e.currentTarget).closest('.input-file').find('[data-file-name]')[0]
        element.innerText = filename;
        $(e.currentTarget).closest('.input-file').addClass('has-file')
      });
    });

    $("#upload-files").change(()=>{
      this.upload();
    });

    $('.card-block').each((i, el) => {
      $(el).on('click', ()=> {
        $('#trained-images .images').hide();
        $('#trained-images .images').eq(i).show();
        $("#trained-images .training-id").html(i);
      });
    });

    // Create training buttons and info texts
    for(let i=0;i<NUM_CLASSES; i++){
      $('#learning .card-block__label').eq(i).html(`${i}`);

      let button = $('#learning button').eq(i);

      // Listen for mouse events when clicking the button
      button.mousedown(()=>{
        if (this.isTouchDevice == false) {
          this.training = i;
        }
      });

      button.mouseup(()=>{
        if (this.isTouchDevice == false) {
          this.training = -1;
        }
      });

      button.on('touchstart', ()=>{
        if (this.isTouchDevice) {
          this.training = i;
        }
      });

      button.on('touchend', ()=>{
        if (this.isTouchDevice) {
          this.training = -1;
        }
      });

      $('#learning .card-block .input').eq(i).on("blur", ()=>{
        let label =  $('#learning .card-block .card-block__label').eq(i);
        let input = $('#learning .card-block .input').eq(i);
        label.removeClass("none");
        input.addClass("none");
        label.html(input.val() || i);
      })
    }

    $('#wss_url').val(this.wss_url);
    $('#wss_url').on('blur', (e)=> {
      this.wss_url = $(e.target).val();
      $.cookie('wss_url', this.wss_url, { expires: 90 });
    });

    $('#connect-button').on('click', (e)=> {
      let connId = $('#conn-id').val();
      this.connect(connId);
      return false;
    });

    $("#scratch-link").attr('href', 'https://champierre.github.io/scratch/');

    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })

    $(window).on('beforeunload', function() {
      if (location.href != "http://localhost:9966/dist/") {
        return 'ページから離れようとしていますが、よろしいですか？';
      }
    });
  }

  start() {
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  classify() {
    const numLabels = this.knnClassifier.getNumLabels();
    if (numLabels == 0) return;

    const features = this.featureExtractor.infer(this.video);
    this.knnClassifier.classify(features, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        if(this.ws && this.ws.readyState === WebSocket.OPEN){
          let label = $('#learning .card-block .card-block__label').eq(result.classIndex).html();
          this.ws.send(JSON.stringify({action: 'predict', conn_id: this.connId, value: result.classIndex, label: label}));
        }
        this.updateProgress(result.confidences);
      }
    });
  }

  animate() {
    if(this.videoPlaying){
      this.classify();

      // Train class if one of the buttons is held down
      if(this.training != -1){
        const features = this.featureExtractor.infer(this.video);
        this.knnClassifier.addExample(features, String(this.training));
        this.updateCounts();
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  connect(connId) {
    this.ws = new WebSocket(`${this.wss_url}/ml`);
    this.connId = connId;
  }

  download() {
    const fileName = String(Date.now());
    this.knnClassifier.save(fileName);
  }

  upload() {
    const files = document.getElementById('upload-files').files;
    if (files.length <= 0) {
      return false;
    }

    const fr = new FileReader();

    fr.onload = (e) => {
      const data = JSON.parse(e.target.result);
      this.knnClassifier.load(data, () => {
        this.updateCounts();
      });
    }

    fr.onloadend = (e) => {
      document.getElementById('upload-files').value = "";
    }

    fr.readAsText(files.item(0));
  }

  editLabel(i) {
    let label = $('.card-block .card-block__label').eq(i);
    let input = $('.card-block .input').eq(i);

    label.addClass('none');
    input.removeClass('none');

    input.val(label.html());
  }

  clear(i) {
    this.knnClassifier.clearLabel(String(i));
    this.updateCounts();
  }

  clearAll() {
    this.knnClassifier.clearAllLabels()
    this.updateCounts();
  }

  updateProgress(confidences) {
    let html = '';
    let labels = $('.card-block .card-block__label');
    $.each(confidences, function(i, confidence) {
      let label = "";
      if (confidence > 0) {
        label = labels.eq(i).html();
      }
      html += `<div class="bar" style="flex-basis: ${confidence * 100}%"><div class="label">${label}</div></div>`;
    });
    $('.progress').html(html);
  }

  addCard() {
    const html = `
<!-- card-block -->
<div class="card-block">
  <div class="card-block__label"></div>
  <div class="input-group">
    <input class="input none" type="text" />
  </div>
  <!-- <div class="dummy-photo"></div> -->

  <div class="card-block__info">
    <span>
      <i class="icon-photos"></i>
      <span class="info-text">x 0</span>
    </span>
    <div class="dropdown">
      <a href="#" class="link" data-toggle="dropdown">
        <i class="icon-dots-white"></i>
      </a>
      <div class="card-dropdown-menu dropdown-menu dropdown-menu-right">
        <a class="dropdown-item edit-label-menu" href="#" data-locale="edit_label"></a>
        <a class="dropdown-item clear-menu" href="#" data-locale="clear"></a>
      </div>
    </div>
  </div>

  <button class="button is-w100 is-mini">
    <i class="icon-camera is-mini"></i>
  </button>
</div>
    `;
    $('#learning .card-block-container').append(html);
  }

  updateCounts() {
    const counts = this.knnClassifier.getCountByLabel();
    for(let i=0;i<NUM_CLASSES; i++){
      this.infoTexts[i].innerText = `x ${counts[String(i)] || 0}`
    }
  }
}

window.addEventListener('load', () => {
  new Main();
  new I18n();
});
