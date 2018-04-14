(function(ext) {
    var ws;
    var when_received = false;
    var class_index;
    var conn_id;

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function(_conn_id) {
      conn_id = _conn_id;
      ws = new WebSocket('ws://ml2scratch-helper.glitch.me/');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.action == 'predict') {
          class_index = data.value;
          when_received = true;
        }
      }
      ws.onopen = function(evt) {
        ws.send(JSON.stringify({action: 'connect', conn_id: conn_id}));
      }
    }

    ext.when_received = function() {
      if (when_received) {
        when_received = false;
        return true;
      }
      return false;
    }

    ext.class_index = function() {
      return class_index;
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            connect: 'ID: %s で接続する',
            when_received: '分類を受け取ったとき',
            class_index: '分類'
        },
        en: {
            connect: 'Connect with ID: %s',
            when_received: 'when received',
            class_index: 'class index'
        },
    }

    var descriptor = {
        blocks: [
            [' ', locale[lang].connect, 'connect', ''],
            ['h', locale[lang].when_received, 'when_received'],
            ['r', locale[lang].class_index, 'class_index']
        ]
    };

    ScratchExtensions.register('ML2Scratch', descriptor, ext);
})({});
