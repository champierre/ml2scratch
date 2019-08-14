# ML2Scratch(Scratch2ML)

ML2Scratch connects Machine Learning(TensorFlow.js) to Scratch.

*Read this in other languages: [English](README.md), [日本語](README.ja.md), [简体中文](README.zh-cn.md).*

## New Version(Beta)

- https://champierre.github.io/scratch3/

    <img src="images/ml2scratch.gif" width="900" />

## Requirements

- Chrome browser

## Demo Movie

- Rock/Scissors/Paper Demo [YouTube](https://www.youtube.com/watch?v=DkH1hwc-Gb4) | [.mov file](https://s3.amazonaws.com/champierre/movies/rsp_demo.mov)
- Control a toy robot, MiP, by hand gestures [YouTube](https://www.youtube.com/watch?v=GKXimEB5WQg) | [.mov file](https://s3.amazonaws.com/champierre/movies/mip_demo.mov)

## How to use(Step by step)

### Setup

1. Open https://champierre.github.io/scratch3/.

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

9. After training, the recognition result shows in the "label" field in Stage area. If you show "rock", the "label" should show "1", if you show "paper", the "label" should show "2" and if you show "scissors", the "label" should show "3".

    <img src="images/en/recognition.png" />

10. You can use "when received label #" blocks and create a sample program like this:

    <img src="images/en/scratch_program.png" />

## Reference

- https://js.tensorflow.org/
- https://github.com/googlecreativelab/teachable-machine-boilerplate
