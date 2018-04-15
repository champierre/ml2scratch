(function(ext) {
    var ws;
    var when_received = false;
    var when_received_arr = Array(3).fill(false);
    var class_index;
    var conn_id;

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function(_conn_id) {
      if (_conn_id.length == 0) {
        alert('Blank ID is invalid.');
        return;
      }
      conn_id = _conn_id;
      ws = new WebSocket('wss://ml2scratch-helper.glitch.me/');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.action == 'predict') {
          class_index = parseInt(data.value, 10);
          when_received = true;
          when_received_arr[class_index] = true
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

    ext.when_received_0 = function() {
      if (when_received_arr[0]) {
        when_received_arr[0] = false;
        return true;
      }
      return false;
    }

    ext.when_received_1 = function() {
      if (when_received_arr[1]) {
        when_received_arr[1] = false;
        return true;
      }
      return false;
    }

    ext.when_received_2 = function() {
      if (when_received_arr[2]) {
        when_received_arr[2] = false;
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
            when_received_0: '「分類0」を受け取ったとき',
            when_received_1: '「分類1」を受け取ったとき',
            when_received_2: '「分類2」を受け取ったとき',
            class_index: '分類'
        },
        en: {
            connect: 'Connect with ID: %s',
            when_received: 'when received',
            when_received_0: 'when received label 0',
            when_received_1: 'when received label 1',
            when_received_2: 'when received label 2',
            class_index: 'class index'
        },
    }

    var descriptor = {
        blocks: [
            [' ', locale[lang].connect, 'connect', ''],
            ['h', locale[lang].when_received, 'when_received'],
            ['h', locale[lang].when_received_0, 'when_received_0'],
            ['h', locale[lang].when_received_1, 'when_received_1'],
            ['h', locale[lang].when_received_2, 'when_received_2'],
            ['r', locale[lang].class_index, 'class_index']
        ]
    };

    ScratchExtensions.register('ML2Scratch', descriptor, ext);
})({});
