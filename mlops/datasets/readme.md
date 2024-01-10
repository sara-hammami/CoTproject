# YOLO Waste Detection Computer Vision Project

## Overview

This repository contains a dataset for garbage class detection, specifically designed for a YOLO v8 computer vision project. The dataset is sourced from Roboflow and is named "YOLO Waste Detection Computer Vision Project." It includes images annotated with various classes representing different types of waste items commonly found in the environment.

## Dataset Classes

The dataset is annotated with the following classes:

- Aluminum can, Aluminum caps, Tin
- Cardboard
- Ceramic
- Electronics
- Furniture
- Glass bottle, Milk bottle
- Liquid
- Organic
- Paper,Paper bag,Paper cups
- Plastic bag, Plastic bottle,Plastic can,Plastic canister,Plastic caps,Plastic cup,Plastic shaker,Plastic toys
- Postal packaging,Printing industry
- Scrap metal
- Stretch film
- Tetra pack
- Textile
- Wood

## Downloading the Dataset

You can download the dataset from the [Roboflow website](https://universe.roboflow.com/projectverba/yolo-waste-detection/dataset/1#). Choose one of the following options:

### Download ZIP

Click on the "Download ZIP" button on the Roboflow website.

### Download Code

#### Jupyter Notebook

```python
!pip install roboflow

from roboflow import Roboflow
rf = Roboflow(api_key="#####")
project = rf.workspace("projectverba").project("yolo-waste-detection")
dataset = project.version(1).download("yolov8")
```

#### Terminal

Run the following command in the terminal:

```bash
curl -L "https://universe.roboflow.com/ds/RTniKJtBfr?key=#####" > roboflow.zip && unzip roboflow.zip && rm roboflow.z
```