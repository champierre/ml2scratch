(function(ext) {
    var ws;
    var when_received = false;
    var when_received_arr = Array(10).fill(false);
    var class_index;
    var label;
    var conn_id;
    var wss_url = "wss://ml2scratch-helper.glitch.me";

    var r = document.cookie.split(';');
    r.forEach(function(value) {
      var content = value.split('=');
      if (content[0] == ' wss_url' && content[1] != "") {
        wss_url = content[1];
      }
    });

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
      ws = new WebSocket(wss_url + '/scratchx');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.action == 'predict') {
          class_index = data.value;
          label = data.label;
          when_received = true;
          when_received_arr[class_index] = true
        }
      }
      ws.onopen = function(evt) {
        ws.send(JSON.stringify({action: 'connect', conn_id: conn_id}));
      }
    }

    ext.set_wss_url = function(_wss_url) {
      wss_url = _wss_url;
      document.cookie = "wss_url=" + wss_url + "; max-age=7776000";
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

    ext.when_received_3 = function() {
      if (when_received_arr[3]) {
        when_received_arr[3] = false;
        return true;
      }
      return false;
    }

    ext.when_received_4 = function() {
      if (when_received_arr[4]) {
        when_received_arr[4] = false;
        return true;
      }
      return false;
    }

    ext.when_received_5 = function() {
      if (when_received_arr[5]) {
        when_received_arr[5] = false;
        return true;
      }
      return false;
    }

    ext.when_received_6 = function() {
      if (when_received_arr[6]) {
        when_received_arr[6] = false;
        return true;
      }
      return false;
    }

    ext.when_received_7 = function() {
      if (when_received_arr[7]) {
        when_received_arr[7] = false;
        return true;
      }
      return false;
    }

    ext.when_received_8 = function() {
      if (when_received_arr[8]) {
        when_received_arr[8] = false;
        return true;
      }
      return false;
    }

    ext.when_received_9 = function() {
      if (when_received_arr[9]) {
        when_received_arr[9] = false;
        return true;
      }
      return false;
    }

    ext.class_index = function() {
      return class_index;
    }

    ext.label = function() {
      return label;
    }

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : (((navigator.language || navigator.userLanguage) == 'zh-CN') ? 'zh_cn' : 'en');
    var locale = {
        ja: {
            connect: 'ID: %s で接続する',
            set_wss_url: '%s をWebSocketサーバーのURLに設定する',
            when_received: '分類を受け取ったとき',
            when_received_0: '「分類0」を受け取ったとき',
            when_received_1: '「分類1」を受け取ったとき',
            when_received_2: '「分類2」を受け取ったとき',
            when_received_3: '「分類3」を受け取ったとき',
            when_received_4: '「分類4」を受け取ったとき',
            when_received_5: '「分類5」を受け取ったとき',
            when_received_6: '「分類6」を受け取ったとき',
            when_received_7: '「分類7」を受け取ったとき',
            when_received_8: '「分類8」を受け取ったとき',
            when_received_9: '「分類9」を受け取ったとき',
            class_index: '分類',
            label: 'ラベル'
        },
        en: {
            connect: 'Connect with ID: %s',
            set_wss_url: 'Set %s as WebSocket Server URL',
            when_received: 'when received',
            when_received_0: 'when received label 0',
            when_received_1: 'when received label 1',
            when_received_2: 'when received label 2',
            when_received_3: 'when received label 3',
            when_received_4: 'when received label 4',
            when_received_5: 'when received label 5',
            when_received_6: 'when received label 6',
            when_received_7: 'when received label 7',
            when_received_8: 'when received label 8',
            when_received_9: 'when received label 9',
            class_index: 'class index',
            label: 'label'
        },
        zh_cn: {
            connect: '用ID: [ %s ]连接',
            set_wss_url: 'Set %s as WebSocket Server URL',
            when_received: '接收到类别',
            when_received_0: '接收到类别0时',
            when_received_1: '接收到类别1时',
            when_received_2: '接收到类别2时',
            when_received_3: '接收到类别3时',
            when_received_4: '接收到类别4时',
            when_received_5: '接收到类别5时',
            when_received_6: '接收到类别6时',
            when_received_7: '接收到类别7时',
            when_received_8: '接收到类别8时',
            when_received_9: '接收到类别9时',
            class_index: '类索引',
            label: 'label'
        }
    }

    var descriptor = {
        blocks: [
            [' ', locale[lang].connect, 'connect', ''],
            [' ', locale[lang].set_wss_url, 'set_wss_url', wss_url],
            ['h', locale[lang].when_received, 'when_received'],
            ['h', locale[lang].when_received_0, 'when_received_0'],
            ['h', locale[lang].when_received_1, 'when_received_1'],
            ['h', locale[lang].when_received_2, 'when_received_2'],
            ['h', locale[lang].when_received_3, 'when_received_3'],
            ['h', locale[lang].when_received_4, 'when_received_4'],
            ['h', locale[lang].when_received_5, 'when_received_5'],
            ['h', locale[lang].when_received_6, 'when_received_6'],
            ['h', locale[lang].when_received_7, 'when_received_7'],
            ['h', locale[lang].when_received_8, 'when_received_8'],
            ['h', locale[lang].when_received_9, 'when_received_9'],
            ['r', locale[lang].class_index, 'class_index'],
            ['r', locale[lang].label, 'label']
        ]
    };

    ScratchExtensions.register('ML2Scratch', descriptor, ext);
})({});
