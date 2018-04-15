String.prototype.sprintf = function()
{
    var str = this + '';
    var args = Array.prototype.slice.call(arguments);

    var ph = true;
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
        for (var i=0; i<args.length; i++) {
            var n = i + 1;
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
    link_to_other_lang: "&raquo; <a href=\"?lang=en\">English</a>",
    connect: "接続する",
    connection_id: "接続ID",
    blank_id_is_invalid: "接続IDを入力してください。",
    no_examples_added: "まだ学習していません",
    examples: "枚",
    train: '「分類%s」として学習する',
    clear: '「分類%s」をリセットする',
    help_text: "&uarr; <a href=\"http://scratchx.org/?url=https://champierre.github.io/ml2scratch/ml2scratch.js\" target=\"_blank\">拡張機能を読み込んだScratchX</a>のページを開いて、上記の接続IDを「ID: [ ]で接続する」ブロックにコピー&ペーストしてください。",
  },
  en: {
    link_to_other_lang: "&raquo; <a href=\"?lang=ja\">日本語</a>",
    connect: "Connect",
    connection_id: "Connection ID",
    blank_id_is_invalid: "Blank ID is invalid.",
    no_examples_added: "No examples added",
    examples: "examples",
    train: 'Train %s',
    clear: 'Clear %s',
    help_text: "&uarr; Open <a href=\"http://scratchx.org/?url=https://champierre.github.io/ml2scratch/ml2scratch.js\" target=\"_blank\">ScratchX with extension loaded</a> and use this ID when you connect.",
  }
}

class I18n {
  constructor(){
    window.I18n = this;
  }

  static t(key, arg = '') {
    var lang = window.navigator.language;
    var vars = this.getUrlVars();
    if (vars['lang'] && vars['lang'].length > 0) {
      lang = vars['lang'];
    }
    if (lang == 'ja') {
      return LOCALIZED_TEXT['ja'][key].sprintf(arg);
    } else {
      return LOCALIZED_TEXT['en'][key].sprintf(arg);
    }
  }

  static getUrlVars() {
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

    hash  = url.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');
        vars.push(array[0]);
        vars[array[0]] = array[1];
    }
    return vars;
  }
}

window.addEventListener('load', () => new I18n());
