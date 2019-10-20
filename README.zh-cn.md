# ML2Scratch(Scratch2ML)

使用ML2Scratch可以将机器学习 (TensorFlow.js)与Scratch连接起来。

*其他语言说明页: [English](README.en.md), [日本語](README.md), [简体中文](README.zh-cn.md).*

[ML2Scratch Website](https://champierre.github.io/ml2scratch/)

<img src="images/qrcode.png" />

## Demo Movie(演示视频)

  <img src="images/en/ml2scratch.gif" width="900" />

- 用电脑摄像头判别石头剪子布 [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov) | [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4)
- 用手势指挥倒立两轮机器人MiP [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov) | [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg)

## License(许可证)

- ML2Scratch受 [Apache 2.0许可](./LICENSE) 的保护，是开源的，任何人均可免费使用。您可以在您的课堂，讲习班上使用它。商业用途也被接受。如果您或您的学生使用ML2Scratch创建了一些很棒的东西，请使用 #ml2scratch 标签在SNS上分享，或者让我知道这些联系人中的任何一个。有趣的项目将添加到“使用例”中。

## Contacts(联络人)

- WeChat

    <img src="images/wechat.jpg" />

- Twitter

    <img src="images/twitter.png" />

## Examples of use(使用例)

- [使用Scratch和micro:bit制作硬币分类AI机器人](http://make-lab.sakura.ne.jp/wordpress/2019/10/12/making-a-coin-sorting-ai-robot-with-scratch-and-micro-bit/)
- [用茉莉花瓶向前走，用罐装咖啡向后走(电影)](https://www.facebook.com/groups/visualprogramming.jp/permalink/531024724134426/)
- [ML2Scratch书架排列检查(电影)](https://www.youtube.com/watch?v=ZQ88E6HSUdg)
- [ML2Scratch检测到停车位已满(电影)](https://www.youtube.com/watch?v=vZwfN18op8w)

## Requirements(运行环境)

- OS
  - Windows 8
  - Windows 10
  - MacOS
- Browser
  - Chrome

## How to use(用法)

### Setup(设定)

1. 打开 [https://champierre.github.io/scratch3/](https://champierre.github.io/scratch3/)。

2. 打开“选择扩展”窗口，然后选择“ML2Scratch”。

    <img src="images/en/ml2scratch.png" />

3. Chrome要求您允许访问相机，然后单击“允许”。

4. 选中“标签”，“标签1的计数”，“标签2的计数”和“标签3的计数”块旁边的复选框。

    <img src="images/zh-cn/check_blocks.png" />

### Training(训练)

5. 向摄像机显示“摇滚”手势，然后单击“火车标签1”块。 这是为了训练机器将“岩石”符号识别为标签1。

    <img src="images/en/rock.png" />

6. 持续单击该按钮，直到捕获约20张图像。 捕获的图像数量显示在“阶段”窗口的“标签数量1”字段中。

7. 在相机上显示“纸”手势，并继续单击“火车标签2”块，直到获得20作为“标签2的数量”。

8. 在相机上显示“剪刀”手势，并继续单击“火车标签3”块，直到获得20作为“标签3的数量”。

### Recognition(承认)

9. 训练后，识别结果将显示在“阶段”区域的“标签”字段中。 如果显示“ rock”，则“ label”应显示“ 1”，如果显示“ paper”，则“ label”应显示“ 2”，如果显示“ scissorsors”，则“ label”应显示“ 3” 。

    <img src="images/en/recognition.png" />

10. 您可以使用“何时收到标签＃”块并创建一个示例程序，如下所示：

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

## T-Shirt(文化衫)

这里销售印有ML2Scratch标志的文化衫 -> [https://suzuri.jp/is8r_/1251743/t-shirt/s/white](https://suzuri.jp/is8r_/1251743/t-shirt/s/white)

## Reference(参考链接)

- [https://js.tensorflow.org/](https://js.tensorflow.org/)
- [https://github.com/googlecreativelab/teachable-machine-boilerplate](https://github.com/googlecreativelab/teachable-machine-boilerplate)
