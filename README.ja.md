# ML2Scratch

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

## 環境

- Chromeブラウザ
- macOS High Sierra(10.13.3) または Windows 10(1607 OS build 14393.576)

## デモ動画

https://www.youtube.com/watch?v=DkH1hwc-Gb4

## セットアップ

1. https://nodejs.org/ja/からNode.js よりNode.jsをインストールします。

2. https://github.com/champierre/ml2scratch よりML2Scratchのソースコードをダウンロードします。

3. ZIPファイルを解凍します。

  ```
  ％ unzip ml2scratch-master.zip
  ```

4. 必要なパッケージをインストールします。

  ```
  ％ mv ml2scratch-master ml2scratch
  ％ cd ml2scratch/helper
  ％ npm install
  ```

## Windows 10でのセットアップ

- Windows PowerShellを使用してください。

![PowerShell](https://user-images.githubusercontent.com/10215/38457066-c3aae2aa-3ac6-11e8-8e08-800a08926a01.PNG)

## 使い方

1. ML2Scratch Helperを起動します。

  ```
  ％ node ml2scratch_helper.js
  ```

2. [MLScratch](https://champierre.github.io/ml2scratch/) ページを開きます。

3. ML2Scratchの拡張機能が読み込まれた [ScratchX](http://scratchx.org/?url=https://champierre.github.io/ml2scratch/ml2scratch.js) ページを開きます。拡張機能が読み込まれた状態でScratchXを開くことができない場合は、 [ScratchX](http://scratchx.org/) ページを開いて「Open Extension URL」をクリックし、次のURLを貼り付けて「Open」をクリックしてください。

  ```
  https://champierre.github.io/ml2scratch/ml2scratch.js
  ```

4. ScratchXの警告ダイアログで、「I understand, continue」をクリックします。

## 参考

- https://js.tensorflow.org/
- https://github.com/googlecreativelab/teachable-machine-boilerplate
