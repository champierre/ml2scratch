# ML2Scratch(Scratch2ML)

ML2Scratchは機械学習(TensorFlow.js)をScratchとをつなげます。

Webカメラでいくつかの画像を撮り、ラベルを付けて学習すれば、似たような新たな画像を、学習結果をもとに分類することができます。キャプチャした画像はサーバーに送られることはなく、学習および分類はすべてブラウザ上で行われるのが特徴です。（ただし、起動時にアプリケーションを読み込むのと、学習モデルをダウンロードするためにはネットワーク接続が必要です。）

*他の言語で読む: [English](README.en.md), [日本語](README.md), [简体中文](README.zh-cn.md).*

[ML2Scratch ホームページ](https://champierre.github.io/ml2scratch/)

<img src="images/qrcode.png" />

## Demo Movie(デモ動画)

  <img src="images/ja/ml2scratch.gif" width="900" />

- Webカメラでグー、チョキ、パーを判定 [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4) | [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov)
- ジェスチャーで倒立2輪ロボットMiPを動かす [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg) | [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov)

## Licence(ライセンス)

- ML2Scratchには [Apache 2.0 License](./LICENSE.md) が適用されます。オープンソースで、誰でも自由に利用できます。授業やワークショップで使用でき、商用利用も認められています。あなたやあなたの生徒さんがML2Scratchを使用して何か面白いプロジェクトを作成したときは、ぜひハッシュタグ #ml2scratch を使用してSNSで共有するか、連絡先までお知らせください。以下の「活用例」に追加させていただきます。

## Contacts(連絡先)

- Twitter

    <img src="images/twitter.png" />

- WeChat

    <img src="images/wechat.jpg" />

## Examples of use(活用例)

- [イラストで扇風機をコントロール](https://www.facebook.com/groups/scratch.microbit/permalink/704715526600743/)
- [小学生が作った「未来のゴミ箱」は自律走行＆機械学習でゴミ分別　IoTセンサーで外の環境を検知！JJPC 全国小中学生プログラミング大会レポート](https://robotstart.info/2019/10/20/jjpc-4thprog-competition.html)
- [Scratchとmicro:bitでコイン選別AIロボットを作る](http://make-lab.sakura.ne.jp/wordpress/2019/10/12/scratch%e3%81%a8microbit%e3%81%a7%e3%82%b3%e3%82%a4%e3%83%b3%e9%81%b8%e5%88%a5ai%e3%83%ad%e3%83%9c%e3%83%83%e3%83%88%e3%82%92%e4%bd%9c%e3%82%8b/)
- [ジャスミンボトルで前進、缶コーヒーで後進(動画)](https://www.facebook.com/groups/visualprogramming.jp/permalink/531024724134426/)
- [ML2Scratchで本棚整理チェック(動画)](https://www.youtube.com/watch?v=ZQ88E6HSUdg)
- [ML2Scratchで駐車場の満空検知(動画)](https://www.youtube.com/watch?v=vZwfN18op8w)

## Requirements(推奨環境)

- OS
  - Windows 8
  - Windows 10
  - MacOS
- ブラウザ
  - Chrome

## How to use(使い方)

### Setup(準備)

1. [https://champierre.github.io/scratch3/](https://champierre.github.io/scratch3/) をChromeで開きます。

2. 「拡張機能を選ぶ」画面を開き、「ML2Scratch」を選びます。

    <img src="images/ja/ml2scratch.png" />

3. Chromeがカメラの使用の許可を求めるダイアログが表示されるので、「許可」をクリックします。

4. 「ラベル」、「ラベル1の枚数」、「ラベル2の枚数」、「ラベル3の枚数」の横のチェックボックスにチェックを入れます。

    <img src="images/ja/check_blocks.png" />

### Training(学習)

5. ジャンケンの「グー」のサインをカメラに映し、「ラベル1を学習する」ブロックをクリックします。この操作で、「グー」をラベル1として機械に学習させます。

    <img src="images/en/rock.png" />

6. 撮った写真の枚数が20枚になるまで「ラベル1を学習する」ブロックをクリックし続けます。撮った写真の枚数はステージ上の「ラベル1の枚数」に表示されています。

7. 次に「パー」をカメラに映し、同様に「ラベル2の枚数」が20になるまで、「ラベル2を学習する」ブロックをクリックし続けます。

8. 「チョキ」をカメラに映し、「ラベル3の枚数」が20になるまで、「ラベル3を学習する」ブロックをクリックし続けます。

### Recognition(認識)

9. 学習を終えると、認識結果が常にステージ上の「ラベル」に表示されるようになります。「グー」を見せれば「1」に、「パー」を見せれば「2」に、「チョキ」を見せれば「3」と表示されます。

    <img src="images/en/recognition.png" />

10. 「ラベル◯◯を受け取ったとき」ブロックを使って、以下のようなサンプルプログラムを作ることができます。

    <img src="images/en/scratch_program.png" />

## For Developers - How to add ML2Scratch extension to your (customized) Scratch

1. Prepare LLK/scratch-gui on your local machine.

    ```
    % git clone git@github.com:LLK/scratch-gui.git
    % cd scratch-gui
    % npm install
    ```

2. Copy this repos' scratch-vm/src/extensions/scratch3_ml2scratch folder to scratch-gui/node_modules/scratch-vm/src/extensions/.

3. Download [https://unpkg.com/ml5@0.3.1/dist/ml5.min.js](https://unpkg.com/ml5@0.3.1/dist/ml5.min.js) and move the file(ml5.min.js) to scratch-gui/node_modules/scratch-vm/src/extensions/.

4. Edit scratch-gui/node_modules/scratch-vm/src/extension-support/extension-manager.js, add "ml2scratch" entry to builtinExtensions constant as follows:

    ```
    const builtinExtensions = {
        // This is an example that isn't loaded with the other core blocks,
        // but serves as a reference for loading core blocks as extensions.
        coreExample: () => require('../blocks/scratch3_core_example'),
        // These are the non-core built-in extensions.
        pen: () => require('../extensions/scratch3_pen'),
        wedo2: () => require('../extensions/scratch3_wedo2'),
        music: () => require('../extensions/scratch3_music'),
        microbit: () => require('../extensions/scratch3_microbit'),
        text2speech: () => require('../extensions/scratch3_text2speech'),
        translate: () => require('../extensions/scratch3_translate'),
        videoSensing: () => require('../extensions/scratch3_video_sensing'),
        ev3: () => require('../extensions/scratch3_ev3'),
        makeymakey: () => require('../extensions/scratch3_makeymakey'),
        boost: () => require('../extensions/scratch3_boost'),
        gdxfor: () => require('../extensions/scratch3_gdx_for'), // <= add comma
        ml2scratch: () => require('../extensions/scratch3_ml2scratch') // <= add this line
    };
    ```

5. Edit scratch-gui/src/lib/libraries/extensions/index.jsx, add the following lines at the end of the file.

    ```
            ),
            helpLink: 'https://scratch.mit.edu/vernier'
        }, // <= add comma
        {                              // <= add this
            name: 'ML2Scratch',        // <= add this
            extensionId: 'ml2scratch'  // <= add this
        }
    ];
    ```

6. Run Scratch, then go to http://localhost:8601/.

    ```
    % npm start
    ```

## Tシャツ

ML2Scratchのロゴ入りTシャツ、こちらで販売しています ->
[https://suzuri.jp/is8r_/1251743/t-shirt/s/white](https://suzuri.jp/is8r_/1251743/t-shirt/s/white)

## Reference(参考)

- [https://js.tensorflow.org/](https://js.tensorflow.org/)
- [https://github.com/googlecreativelab/teachable-machine-boilerplate](https://github.com/googlecreativelab/teachable-machine-boilerplate)
