# CS30 Major Project Proposal
## Description
This project will be a javascript version of my Research Methods 20 class. My research topic is about how artificial intelligence and machine learning assist and replace traditional coaching methods in table tennis. The main steps in sports analysis is computer vision > stroke classification > analysis of strokes and feedback. Javascript can utilize services such as mediapipe and ml5 which can use a camera and plot key points onto the screen. For this project, the main premise will be making a visually appealing computer vision service, and also saving different sets of strokes to train an AI model to classify them.

## What this Project Needs:
### Frontend (enhances user experience):
- Multiple functions on the entry page:
  - Import database of all coordinates of body pose keypoints, of each video frame and **view all data**
  - Classify strokes, with an database of categorized strokes, but with no names for the strokes
- FULL DATA PAGE
  - Large central viewer that displays all points with customizable colors
  - a scrollable coordinate table that syncs with the player
- Mobile responsiveness
  - portrait: video on top, controls on bottom
  - landscape: video on left, stats on right
- Dark / light theme, can be toggled


## What this Project Could Have (nice to have):
- Settings for saving and exporting images, videos, and datasets
- Interface to import online datasets
- Console or logging system to figure out issues and problems that arise while usage
- A demo page that displays example videos that I upload that users can view to get assistance (may not be the best since will take up storage)
- Statisitcs for the groups of strokes, such as a chart with # of specific stroke hit and success rate
- Design a machine learning model that can classify strokes and have the user give each new stroke a name, such as forehand drive, or backhand push
- Use mediapipe or Ml5 to capture coordinates of keypoints and save them in a dataset or json file