const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('../ml5.min.js');
const formatMessage = require('format-message');

const HAT_TIMEOUT = 100;

const Message = {
  train_label_1: {
    'ja': 'ラベル1を学習する',
    'ja-Hira': 'ラベル1をがくしゅうする',
    'en': 'train label 1',
    'zh-cn': '学习标签1'
  },
  train_label_2: {
    'ja': 'ラベル2を学習する',
    'ja-Hira': 'ラベル2をがくしゅうする',
    'en': 'train label 2',
    'zh-cn': '学习标签2'
  },
  train_label_3: {
    'ja': 'ラベル3を学習する',
    'ja-Hira': 'ラベル3をがくしゅうする',
    'en': 'train label 3',
    'zh-cn': '学习标签3'
  },
  train: {
    'ja': 'ラベル[LABEL]を学習する',
    'ja-Hira': 'ラベル[LABEL]をがくしゅうする',
    'en': 'train label [LABEL]',
    'zh-cn': '学习标签[LABEL]'
  },
  when_received_block: {
    'ja': 'ラベル[LABEL]を受け取ったとき',
    'ja-Hira': 'ラベル[LABEL]をうけとったとき',
    'en': 'when received label:[LABEL]',
    'zh-cn': '接收到类别[LABEL]时'
  },
  label_block: {
    'ja': 'ラベル',
    'ja-Hira': 'ラベル',
    'en': 'label',
    'zh-cn': '标签'
  },
  counts_label_1: {
    'ja': 'ラベル1の枚数',
    'ja-Hira': 'ラベル1のまいすう',
    'en': 'counts of label 1',
    'zh-cn': '标签数量1'
  },
  counts_label_2: {
    'ja': 'ラベル2の枚数',
    'ja-Hira': 'ラベル2のまいすう',
    'en': 'counts of label 2',
    'zh-cn': '标签数量2'
  },
  counts_label_3: {
    'ja': 'ラベル3の枚数',
    'ja-Hira': 'ラベル3のまいすう',
    'en': 'counts of label 3',
    'zh-cn': '标签数量3'
  },
  counts_label_4: {
    'ja': 'ラベル4の枚数',
    'ja-Hira': 'ラベル4のまいすう',
    'en': 'counts of label 4',
    'zh-cn': '标签数量4'
  },
  counts_label_5: {
    'ja': 'ラベル5の枚数',
    'ja-Hira': 'ラベル5のまいすう',
    'en': 'counts of label 5',
    'zh-cn': '标签数量5'
  },
  counts_label_6: {
    'ja': 'ラベル6の枚数',
    'ja-Hira': 'ラベル6のまいすう',
    'en': 'counts of label 6',
    'zh-cn': '标签数量6'
  },
  counts_label_7: {
    'ja': 'ラベル7の枚数',
    'ja-Hira': 'ラベル7のまいすう',
    'en': 'counts of label 7',
    'zh-cn': '标签数量7'
  },
  counts_label_8: {
    'ja': 'ラベル8の枚数',
    'ja-Hira': 'ラベル8のまいすう',
    'en': 'counts of label 8',
    'zh-cn': '标签数量8'
  },
  any: {
    'ja': 'のどれか',
    'ja-Hira': 'のどれか',
    'en': 'any',
    'zh-cn': '任何'
  },
  all: {
    'ja': 'の全て',
    'ja-Hira': 'のすべて',
    'en': 'all',
    'zh-cn': '所有'
  },
  reset: {
    'ja': 'ラベル[LABEL]の学習をリセット',
    'ja-Hira': 'ラベル[LABEL]のがくしゅうをリセット',
    'en': 'reset label:[LABEL]',
    'zh-cn': '重置[LABEL]'
  },
  download_learning_data: {
    'ja': '学習データをダウンロード',
    'ja-Hira': 'がくしゅうデータをダウンロード',
    'en': 'download learning data',
    'zh-cn': '下载学习数据'
  },
  upload_learning_data: {
    'ja': '学習データをアップロード',
    'ja-Hira': 'がくしゅうデータをアップロード',
    'en': 'upload learning data',
    'zh-cn': '上传学习数据'
  },
  upload: {
    'ja': 'アップロード',
    'ja-Hira': 'アップロード',
    'en': 'upload',
    'zh-cn': '上传'
  },
  uploaded: {
    'ja': 'アップロードが完了しました。',
    'ja-Hira': 'アップロードがかんりょうしました。',
    'en': 'The upload is complete.',
    'zh-cn': '上传完成。'
  },
  upload_instruction: {
    'ja': 'ファイルを選び、アップロードボタンをクリックして下さい。',
    'ja-Hira': 'ファイルをえらび、アップロードボタンをクリックしてください。',
    'en': 'Select a file and click the upload button.',
    'zh-cn': '选择一个文件，然后单击上传按钮。'
  },
  confirm_reset: {
    'ja': '本当にリセットしてもよろしいですか？',
    'ja-Hira': 'ほんとうにリセットしてもよろしいですか？',
    'en': 'Are you sure to reset?',
    'zh-cn': '你确定要重置吗？'
  },
  toggle_classification: {
    'ja': 'ラベル付けを[CLASSIFICATION_STATE]にする',
    'ja-Hira': 'ラベルづけを[CLASSIFICATION_STATE]にする',
    'en': 'turn classification [CLASSIFICATION_STATE]',
    'zh-cn': '[CLASSIFICATION_STATE]分类'
  },
  set_classification_interval: {
    'ja': 'ラベル付けを[CLASSIFICATION_INTERVAL]秒間に1回行う',
    'ja-Hira': 'ラベルづけを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
    'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
    'zh-cn': '每隔[CLASSIFICATION_INTERVAL]秒标记一次'
  },
  video_toggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]',
    'zh-cn': '[VIDEO_STATE]摄像头'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'zh-cn': '开启'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off',
    'zh-cn': '关闭'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
    'zh-cn': '镜像开启'
  },
  first_training_warning: {
    'ja': '最初の学習にはしばらく時間がかかるので、何度もクリックしないで下さい。',
    'ja-Hira': 'さいしょのがくしゅうにはしばらくじかんがかかるので、なんどもクリックしないでください。',
    'en': 'The first training will take a while, so do not click again and again.',
    'zh-cn': '第一项研究需要一段时间，所以不要一次又一次地点击。'
  }
}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn'];

class Scratch3ML2ScratchBlocks {
  constructor (runtime) {
    this.runtime = runtime;
    this.when_received = false;
    this.when_received_arr = Array(8).fill(false);
    this.label = null;
    this.locale = this.setLocale();

    this.video = document.createElement("video");
    this.video.width = 480;
    this.video.height = 360;
    this.video.autoplay = true;
    this.video.style.display = "none";

    this.blockClickedAt = null;
    this.alertOpened = false;

    this.counts = null;
    this.firstTraining = true;

    this.interval = 1000;

    let media = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    media.then((stream) => {
      this.video.srcObject = stream;
    });

    this.knnClassifier = ml5.KNNClassifier();
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      console.log('Model Loaded!');
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    });

    this.runtime.ioDevices.video.enableVideo();
  }

  getInfo() {
    this.locale = this.setLocale();

    return {
      id: 'ml2scratch',
      name: 'ML2Scratch',
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
        }
      ],
      menus: {
        received_menu: this.getMenu('received'),
        reset_menu: this.getMenu('reset'),
        train_menu: this.getTrainMenu(),
        video_menu: this.getVideoMenu(),
        classification_interval_menu: this.getClassificationIntervalMenu(),
        classification_menu: this.getClassificationMenu()
      }
    };
  }

  addExample1() {
    if (this.actionRepeated()) { return };
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.video);
    this.knnClassifier.addExample(features, '1');
    this.updateCounts();
  }

  addExample2() {
    if (this.actionRepeated()) { return };
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.video);
    this.knnClassifier.addExample(features, '2');
    this.updateCounts();
  }

  addExample3() {
    if (this.actionRepeated()) { return };
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.video);
    this.knnClassifier.addExample(features, '3');
    this.updateCounts();
  }

  train(args) {
    if (this.actionRepeated()) { return };
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.video);
    this.knnClassifier.addExample(features, args.LABEL);
    this.updateCounts();
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

  reset(args) {
    if (this.actionRepeated()) { return };

    let result = confirm(Message.confirm_reset[this.locale]);
    if (result) {
      if (args.LABEL == 'all') {
        this.knnClassifier.clearAllLabels();
        for(let i = 1; i <= 8; i++) {
          this.counts[i] = 0;
        }
      } else {
        if (this.counts[args.LABEL] > 0) {
          this.knnClassifier.clearLabel(args.LABEL);
          this.counts[args.LABEL] = 0;
        }
      }
    }
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
    if (this.actionRepeated()) { return };

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
    if (this.actionRepeated()) { return };

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
  }

  videoToggle (args) {
    if (this.actionRepeated()) { return };

    let state = args.VIDEO_STATE;
    if (state === 'off') {
      this.runtime.ioDevices.video.disableVideo();
    } else {
      this.runtime.ioDevices.video.enableVideo();
      this.runtime.ioDevices.video.mirror = state === "on";
    }
  }

  uploadButtonClicked(uploadWindow) {
    let files = uploadWindow.document.getElementById('upload-files').files;

    if (files.length <= 0) {
      alert('Please select JSON file.');
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

    let features = this.featureExtractor.infer(this.video);
    this.knnClassifier.classify(features, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        this.label = result.label;
        this.when_received = true;
        this.when_received_arr[result.label] = true
      }
    });
  }

  updateCounts() {
    this.counts = this.knnClassifier.getCountByLabel();
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
    for(let i = 1; i <= 8; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }

  getTrainMenu() {
    let arr = [];
    for(let i = 4; i <= 8; i++) {
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

  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return 'en';
    }
  }
}

module.exports = Scratch3ML2ScratchBlocks;
