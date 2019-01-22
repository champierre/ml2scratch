# ML2Scratch(Scratch2ML)

ML2Scratchは機械学習(TensorFlow.js)をScratchXとをつなげます。

*他の言語で読む: [English](README.md), [日本語](README.ja.md), [简体中文](README.zh-cn.md).*

## 環境

- Chromeブラウザ

## デモ動画

- Webカメラでグー、チョキ、パーを判定 [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4) | [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov)
- ジェスチャーで倒立2輪ロボットMiPを動かす [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg) | [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov)

## 使い方

1. https://champierre.github.io/ml2scratch/ を開きます。ウェブカメラへのアクセスを求められたら、許可します。

2. まず最初に学習用の画像を数枚用意します。たとえば、ウェブカメラに顔が映るように座り、何もしていない状態を撮ります。

  <img src="images/en/neutral.png" />

3. 「学習」セクション内、黄色のパネル(ラベル:0)の上のカメラアイコンのボタンをクリックし続けて、ラベル番号0として認識される画像をキャプチャします。

  <img src="images/ja/before_training_0.png" />

  20枚ほどキャプチャすると、「認識」セクション内のバーが黄色になります。これは、何もしていない姿の画像が、100パーセントの確からしさでラベル0として認識されていることを示しています。

  <img src="images/ja/after_training_0.png" />

4. 次に、別のポーズを取った姿の画像を用意します。

  <img src="images/en/gesture.png" />

5. 「学習」セクション内、今度は薄緑色のパネル(ラベル:1)の上のカメラアイコンのボタンをクリックし続けて、ラベル番号1として認識される画像をキャプチャします。

    <img src="images/ja/before_training_1.png" />

    20枚ほどキャプチャすると、「認識」セクション内のバーが薄緑色に変わります。これは、ポーズを取った姿の画像が、100パーセントの確からしさでラベル1として認識されていることを示しています。(もしかしたら80%-90%薄緑色という状態になるかもしれませんが、70%以上であれば問題ありません)

    <img src="images/ja/after_training_1.png" />

6. Make sure that Recognition shows the label according to your pose. If you make the first neutral pose, it should show yellow bar. If you make the second pose, it should switch to green bar.

7. Scroll to the Connect section and copy the connection ID(characters such as "76q669zsk") next to "Connect" button. You need it later. Then, click "Connect" button to connect to the WebSocket server on the cloud.

  <img src="images/en/connect.png" />

8. Click "Open Scratch" button to open Scratch with ML2Scratch extension added.

  <img src="images/en/scratch.png" />

9. Scratch will be opened in other tab.

  On the left lower corner, click the folder icon to chose an extension.

  <img src="images/en/add_extension.png" />

  Then, select "ML2Scratch".

  <img src="images/en/ml2scratch_extension.png" />

  "ML2Scratch" category will be added.

  <img src="images/en/ml2scratch_extension_added.png" />

10. Drag "Connect with ID: []" block to the script area and paste the connection ID you copied on line 7 into the blank area. Once pasted, click the block to connect to the WebSocket server.

  <img src="images/en/scratch3_connect_block.png" />

11. Drag "When received class index:[1]" block to the script area. Drag "start sound Pop" under "Sound" category to the script area and connect them as following.

  <img src="images/en/scratch3_play_sound.png" />

12. Each time you take the pose for label 1, it is recognized as "label 1", that information is sent to Scratch via WebSocket server, and pop sound will be played as you programmed to do so.

## 開発環境のセットアップ方法

```
% npm install
% npm run start
```

## Tシャツ

ML2Scratchのロゴ入りTシャツ、こちらで販売しています ->
https://suzuri.jp/is8r_/1251743/t-shirt/s/white

## 参考

- https://js.tensorflow.org/
- https://github.com/googlecreativelab/teachable-machine-boilerplate
