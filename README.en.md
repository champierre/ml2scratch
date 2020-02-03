# ML2Scratch(Scratch2ML)

ML2Scratch connects Machine Learning([TensorFlow.js](https://www.tensorflow.org/js)) with Scratch.

If you take a few images with a webcam, label them, and learn them, you can classify similar new images based on the learning results. The captured images are not sent to the server, and all learning and classification are performed in the browser. (However, a network connection is required to load the application at startup and to download the learning model.)

*Read this in other languages: [English](README.en.md), [日本語](README.md), [简体中文](README.zh-cn.md).*

[ML2Scratch Website](https://champierre.github.io/ml2scratch/)

<img src="images/qrcode.png" />

## Demo Movie

  <img src="images/en/ml2scratch.gif" width="900" />

- Rock/Scissors/Paper Demo [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4) | [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov)
- Control a toy robot, MiP, by hand gestures [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg) | [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov)

## Licence

- ML2Scratch is under [Apache 2.0 License](./LICENSE.md), open source and freely available to anyone. You can use it at your classes, workshops. Commercial usage is also accepted. If you or your students created something cool using ML2Scratch, please share it on SNS using hashtag #ml2scratch or let me know to any of these contacts. Interesting projects will be added to the "Examples of use".

## Contacts

- Twitter

    <img src="images/twitter.png" />

- WeChat

    <img src="images/wechat.jpg" />

## Examples of use

- [Try to avoid obstacles with machine learning # ML2Scratch # ev3(Google Translated)](https://translate.google.com/translate?hl=&sl=auto&tl=en&u=https%3A%2F%2Fwww.ogaworks.com%2Farchives%2F11301&sandbox=1)
- [Control Wagara-saurus(Japanese style dinosaur) using ML2Scratch](https://www.facebook.com/azusa.amino/videos/2408305165934138/)
- [Control an electric fan with illustration](https://www.facebook.com/groups/scratch.microbit/permalink/704715526600743/)
- [Smart Trash Box(Japanese)](https://robotstart.info/2019/10/20/jjpc-4thprog-competition.html)
- [Making a coin sorting AI robot with Scratch and micro:bit](http://make-lab.sakura.ne.jp/wordpress/2019/10/12/making-a-coin-sorting-ai-robot-with-scratch-and-micro-bit/)
- [Go forward with jasmine bottle, go backward with canned coffee (movie)](https://www.facebook.com/groups/visualprogramming.jp/permalink/531024724134426/)
- [ML2Scratch bookshelf arrangement check (movie)](https://www.youtube.com/watch?v=ZQ88E6HSUdg)
- [ML2Scratch detects parking space fullness (movie)](https://www.youtube.com/watch?v=vZwfN18op8w)

## Requirements

- OS
  - Windows 8
  - Windows 10
  - MacOS
- Browser
  - Chrome

ML2Scratch sometimes does not work because of some Chrome extensions. Plese switch to [Guest Mode](https://support.google.com/chrome/answer/6130773) in such cases.

## How to use(Step by step)

### Setup

1. Open [https://champierre.github.io/scratch3/](https://champierre.github.io/scratch3/).

2. Open "Choose an Extension" window and select "ML2Scratch".

    <img src="images/en/ml2scratch.png" />

3. Chrome asks you to allow the access to Camera, then click "Allow".

4. Check the checkboxes besides "label", "counts of label 1", "counts of label 2" and "counts of label 3" blocks.

    <img src="images/en/check_blocks.png" />

### Training

5. Show "rock" hand sign to the camera and click "train label 1" block. This is to train the machine to recognize "rock" sign as label 1.

    <img src="images/en/rock.png" />

6. Keep clicking the button until you capture about 20 images. The number of images captured is displayed in "counts of label 1" field in Stage window.

7. Show "paper" hand sign to the camera and keep clicking "train label 2" block until you get 20 as "counts of label 2".

8. Show "scissors" hand sign to the camera and keep clicking "train label 3" block until you get 20 as "counts of label 3".

### Recognition

9. After training, the recognition result shows in the "label" field in Stage area. If you show "rock", the "label" should show "1", if you show "paper", the "label" should show "2" and if you show "scissors", the "label" should show "3".

    <img src="images/en/recognition.png" />

10. You can use "when received label #" blocks and create a sample program like this:

    <img src="images/en/scratch_program.png" />

## For Developers - How to add ML2Scratch extension to your (customized) Scratch

1. Prepare LLK/scratch-gui on your local machine.

    ```
    % git clone git@github.com:LLK/scratch-gui.git
    % cd scratch-gui
    % npm install
    ```

2. Run the install script.

    ```
    % curl https://raw.githubusercontent.com/champierre/ml2scratch/master/install.sh | sh
    ```

3. Run Scratch, then go to http://localhost:8601/.

    ```
    % npm start
    ```

## Reference

- [https://js.tensorflow.org/](https://js.tensorflow.org/)
- [https://github.com/googlecreativelab/teachable-machine-boilerplate](https://github.com/googlecreativelab/teachable-machine-boilerplate)
