const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');
const Message = {
  open_ml2scratch: {
    'ja': 'ML2Scratchのページを開く',
    'ja-Hira': 'ML2Scratchのページをひらく',
    'en': 'Open ML2Scratch page',
    'zh-cn': '打开ML2Scratch页面'
  },
  set_wss_url: {
    'ja': '接続先を[WSS_URL]にする',
    'ja-Hira': 'せつぞくさきを[WSS_URL]にする',
    'en': 'Connect to [WSS_URL]',
    'zh-cn': 'Connect to [WSS_URL]'
  },
  connect_block: {
   'ja': 'ID:[CONN_ID]で接続する',
   'ja-Hira': 'ID:[CONN_ID]でせつぞくする',
   'en': 'Connect with ID:[CONN_ID]',
   'zh-cn': '用ID:[CONN_ID]连接'
  },
  when_received_block: {
    'ja': '分類[CLASS_INDEX]を受け取ったとき',
    'ja-Hira': 'ぶんるい[CLASS_INDEX]をうけとったとき',
    'en': 'when received class index:[CLASS_INDEX]',
    'zh-cn': '接收到类别[CLASS_INDEX]时'
  },
  class_index_block: {
    'ja': '分類',
    'ja-Hira': 'ぶんるい',
    'en': 'class index',
    'zh-cn': '类索引'
  },
  label_block: {
    'ja': 'ラベル',
    'ja-Hira': 'ラベル',
    'en': 'label',
    'zh-cn': '标签'
  },
  any_class_index: {
    'ja': 'どれか',
    'ja-Hira': 'どれか',
    'en': 'any',
    'zh-cn': '任何'
  },
  blank_id_error: {
    'ja': 'IDを入力してください。',
    'ja-Hira': 'IDをにゅうりょくしてください。',
    'en': 'Blank ID is invalid.',
    'zh-cn': '空白ID无效。'
  }
}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn'];

class Scratch3ML2ScratchBlocks {
  constructor (runtime) {
    this.runtime = runtime;
    this._wss_url = "wss://ml2scratch-helper.glitch.me";
    this._ws = null;
    this._when_received = false;
    this._when_received_arr = Array(10).fill(false);
    this._class_index = null;
    this._label = null;
    this._locale = this.setLocale();
    this._conn_id = Math.floor(Math.random(100000000) * 100000000);
  }

  getInfo() {
    this._locale = this.setLocale();
    return {
      id: 'ml2scratch',
      name: 'ML2Scratch',
      blocks: [
        {
          opcode: 'openMl2scratch',
          blockType: BlockType.COMMAND,
          text: Message.open_ml2scratch[this._locale]
        },
        {
          opcode: 'setWssUrl',
          blockType: BlockType.COMMAND,
          text: Message.set_wss_url[this._locale],
          arguments: {
            WSS_URL: {
              type: ArgumentType.STRING,
              defaultValue: this._wss_url
            }
          }
        },
        {
          opcode: 'connect',
          blockType: BlockType.COMMAND,
          text: Message.connect_block[this._locale],
          arguments: {
            CONN_ID: {
              type: ArgumentType.STRING,
              defaultValue: this._conn_id
            }
          }
        },
        {
          opcode: 'whenReceived',
          text: Message.when_received_block[this._locale],
          blockType: BlockType.HAT,
          arguments: {
            CLASS_INDEX: {
              type: ArgumentType.STRING,
              menu: 'class_indexes',
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'getClassIndex',
          text: Message.class_index_block[this._locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getLabel',
          text: Message.label_block[this._locale],
          blockType: BlockType.REPORTER
        }
      ],
      menus: {
        class_indexes: this.getIndexMenu()
      }
    };
  }

  openMl2scratch() {
    window.open('https://champierre.github.io/ml2scratch/?conn_id=' + this._conn_id, '_blank');
    this.connectToWSS(this._conn_id);
  }

  setWssUrl(args) {
    this._wss_url = args.WSS_URL;
  }

  connect(args) {
    this._conn_id = args.CONN_ID;
    if (this._conn_id.length == 0) {
      alert(Message.blank_id_error[this._locale]);
      return;
    }

    this.connectToWSS(this._conn_id);
  }

  connectToWSS(conn_id) {
    this._ws = new WebSocket(this._wss_url + '/scratchx');
    this._ws.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      if (data.action == 'predict') {
        log.log(data);
        this._class_index = data.value;
        this._label = data.label;
        this._when_received = true;
        this._when_received_arr[data.value] = true
      }
    }
    this._ws.onopen = (evt) => {
      this._ws.send(JSON.stringify({action: 'connect', conn_id: conn_id}));
    }
  }

  whenReceived(args) {
    if (args.CLASS_INDEX === "any") {
      if (this._when_received) {
        this._when_received = false;
        return true;
      }
      return false;
    } else {
      if (this._when_received_arr[args.CLASS_INDEX]) {
        this._when_received_arr[args.CLASS_INDEX] = false;
        return true;
      }
      return false;
    }
  }

  getClassIndex() {
    return this._class_index;
  }

  getLabel() {
    return this._label;
  }

  getIndexMenu() {
    const arr = []
    arr.push({text: Message.any_class_index[this._locale], value: 'any'});
    for(let i = 0; i <= 9; i++) {
      const obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
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
