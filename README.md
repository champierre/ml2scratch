# ML2Scratch(Scratch2ML)

ML2Scratchは機械学習(TensorFlow.js)をScratchとをつなげます。

*他の言語で読む: [English](README.en.md), [日本語](README.md), [简体中文](README.zh-cn.md).*

旧バージョンをお使いの場合はこちら↓

- [学習パート](https://champierre.github.io/ml2scratch/)
- [分類パート(Scratch)](https://champierre.github.io/scratch/)

学習パートと分類パート(Scratch)とに分かれています。

## デモ動画

  <img src="images/ja/ml2scratch.gif" width="900" />

- Webカメラでグー、チョキ、パーを判定 [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4) | [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov)
- ジェスチャーで倒立2輪ロボットMiPを動かす [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg) | [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov)

## 推奨環境

- OS
  - Windows 8
  - Windows 10
  - MacOS
- ブラウザ
  - Chrome

## 使い方

### 準備

1. https://champierre.github.io/scratch3/ をChromeで開きます。

2. 「拡張機能を選ぶ」画面を開き、「ML2Scratch」を選びます。

    <img src="images/ja/ml2scratch.png" />

3. Chromeがカメラの使用の許可を求めるダイアログが表示されるので、「許可」をクリックします。

4. 「ラベル」、「ラベル1の枚数」、「ラベル2の枚数」、「ラベル3の枚数」の横のチェックボックスにチェックを入れます。

    <img src="images/ja/check_blocks.png" />

### 学習

5. ジャンケンの「グー」のサインをカメラに映し、「ラベル1を学習する」ブロックをクリックします。この操作で、「グー」をラベル1として機械に学習させます。

    <img src="images/en/rock.png" />

6. 撮った写真の枚数が20枚になるまで「ラベル1を学習する」ブロックをクリックし続けます。撮った写真の枚数はステージ上の「ラベル1の枚数」に表示されています。

7. 次に「パー」をカメラに映し、同様に「ラベル2の枚数」が20になるまで、「ラベル2を学習する」ブロックをクリックし続けます。

8. 「チョキ」をカメラに映し、「ラベル3の枚数」が20になるまで、「ラベル3を学習する」ブロックをクリックし続けます。

### 認識

9. 学習を終えると、認識結果が常にステージ上の「ラベル」に表示されるようになります。「グー」を見せれば「1」に、「パー」を見せれば「2」に、「チョキ」を見せれば「3」と表示されます。

    <img src="images/en/recognition.png" />

10. 「ラベル◯◯を受け取ったとき」ブロックを使って、以下のようなサンプルプログラムを作ることができます。

    <img src="images/en/scratch_program.png" />

## Tシャツ

ML2Scratchのロゴ入りTシャツ、こちらで販売しています ->
https://suzuri.jp/is8r_/1251743/t-shirt/s/white

## 参考

- https://js.tensorflow.org/
- https://github.com/googlecreativelab/teachable-machine-boilerplate
