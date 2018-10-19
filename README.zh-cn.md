# ML2Scratch(Scratch2ML)

使用ML2Scratch将机器学习框架(TensorFlow.js)接入ScratchX。

*Read this in other languages: [English](README.md), [日本語](README.ja.md), [简体中文](README.zh-cn.md).*

Chinese Translation by 陶旭(Tao Xu)<toukyoku@163.com>

## 环境

- Chrome浏览器

## Demo Movie

- 通过电脑摄像头判断石头剪刀布 [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov) | [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4)
- 用手势指挥机器人MiP [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov) | [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg)

## 用法

1. 打开 https://champierre.github.io/ml2scratch/ 。许可摄像头访问权限。

2. 点击[Connect]，连接到服务器。

    <kbd><img src="images/en/1.png" style="width:500px;border:1px solid #999" /></kbd>

3. 将[Connect]按钮旁边的连接ID（如字符串am2x6t5xrp）复制到剪贴板，以备之后使用。

4. 点击[ScratchX with extension loaded]，打开ScratchX页。在弹出的警告框上点击[I understand, continue]。

    \* 如果在已经读取扩展功能的状态下无法打开ScratchX，则可以在打开[ScratchX](http://scratchx.org/) 页后点击[Open Extension URL]并粘贴如下URL后点击[Open]。

    ```
    https://champierre.github.io/ml2scratch/ml2scratch.js
    ```

5. 在ScratchX的窗口中，把[Connect with ID: []]模块拖到脚本区，在空白里粘贴之前复制在剪贴板上的连接ID。填好后点击模块连接服务器。

    <img src="images/en/5.png" style="width:200px;border:1px solid #999" />

6. 按照下图的样子拼模块，做成[When received label 1]+[ play sound pop]的效果。

    <img src="images/en/6.png" style="width:200px;border:1px solid #999" />


7. 回到摄像头拍照的页面，点击[Train 0]后，让机器学习属于类别0的20张图片。注意拍摄姿态的时候可以通过晃动身体等方式使每张图片稍有区别。

    <kbd><img src="images/en/7.png" style="width:400px;border:1px solid #999" /></kbd>

8. 下面用另外一个姿态，点击[Train 1]后，让机器学习类别1。这时也要注意让每张图片稍有不同。

    <kbd><img src="images/en/8.png" style="width:400px;border:1px solid #999" /></kbd>

9. 如果是两种姿态，则每个类别各20张左右图片即可完成识别。在识别类别0和类别1的姿态时，已经完成识别的呈粗体字，可以清楚地确认每个类别是否完成识别。如果没能顺利识别，可以增加供学习的图片，或点击[Clear]重新学习。

10. ScratchX连接服务器后，识别出的类别信息会传到ScratchX，所以如果识别到类别1的姿态应该就可以发出声音了。

## How to develop

```
% npm install
% npm run start
```

## 参考链接

- https://js.tensorflow.org/
- https://github.com/googlecreativelab/teachable-machine-boilerplate
