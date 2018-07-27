(function(ext) {
    var ws;
    var when_received = false;
    var when_received_arr = Array(10).fill(false);
    var class_index;
    var conn_id;

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.connect = function() {
      ws = new WebSocket('ws://localhost:8080/scratchx');
      ws.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        if (data.action == 'predict') {
          class_index = parseInt(data.value, 10);
          when_received = true;
          when_received_arr[class_index] = true
        }
      }
      ws.onopen = function(evt) {
        ws.send(JSON.stringify({action: 'connect'}));
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

    var lang = ((navigator.language || navigator.userLanguage) == 'ja') ? 'ja' : 'en';
    var locale = {
        ja: {
            connect: '接続する',
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
            class_index: '分類'
        },
        en: {
            connect: 'Connect',
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
            class_index: 'class index'
        },
    }

    var descriptor = {
        blocks: [
            [' ', locale[lang].connect, 'connect'],
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
            ['r', locale[lang].class_index, 'class_index']
        ]
    };

    ScratchExtensions.register('ML2Scratch Local', descriptor, ext);
})({});
