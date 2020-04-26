Before using the OpenCV library in Node.js, you need to install it globally. On MacOS, you can install it through Homebrew. In this article, I am using and installing OpenCV version 2.4.

$ brew tap homebrew/science
$ brew install opencv
If you are using another platform, here is a tutorial for Linux and Windows. After successful installation we can install node-opencv to our Node.js project.

$ npm install --save opencv
Sometimes the installation could fail (this is open-source, and it isn't in the final phase), but you can find a solution for your problem on project’s GitHub.

OpenCV basics
Loading and saving images + Matrix
The basic OpenCV feature enables us to load and save images. You can do this by using the following methods: cv#readImage() and Matrix#save();

const cv = require('opencv');

cv.readImage('./img/myImage.jpg', function (err, img) {
  if (err) {
    throw err;
  }

  const width = im.width();
  const height = im.height();

  if (width < 1 || height < 1) {
    throw new Error('Image has no size');
  }

  // do some cool stuff with img

  // save img
  img.save('./img/myNewImage.jpg');
});
A loaded image is an Object that represents the basic data structure to work with in OpenCV - Matrix. Each loaded or created image is represented by a matrix, where one field is one pixel of the image. The size of the Matrix is defined by the size of the loaded image. You can create a new Matrix in Node.js by calling new Matrix() constructor with specified parameters.

new cv.Matrix(rows, cols);
new cv.Matrix(rows, cols, type, fillValue);
Image modifying
One of the basic methods that we can use is converting color. For example, we can get a grayscale image by simply calling the Matrix#convertGrayscale() method.
img.convertGrayscale();
img.save('./img/myGrayscaleImg.jpg');
This method is often used before using an edge detector.

We can convert images to HSV cylindrical-coordinate representation just by calling
Matrix#convertHSVscale().

 img. convertHSVscale();
 img.save('./img/myGrayscaleImg.jpg');
 We can crop an image by calling the Matrix#crop(x, y, width, height) method with specified arguments.
This method doesn't modify our current image, it returns a new one.

  let croppedImg = img.crop(1000, 1000, 1000, 1000);
  croppedImg('./img/croppedImg');
  If we need to copy a file from one variable to another, we can use the Matrix#copy() method which returns a new image Object.

  let newImg = img.copy();
In this way, we can work with basic Matrix functions. We can also find various blur filter features for drawing and editing images. You can find all implemented methods on Matrix Object in the Matrix.cc file on project’s Github.

Dilation and Erosion
Dilation and erosion are fundamental methods of mathematical morphology. I will explain how they work using the following image modifications.
The dilation of the binary image A by the structuring element B is defined by

OpenCV dilate

OpenCV has a Matrix#dilate(iterations, structEl) method where iterations is the number of the dilation that will be performed, and structEl is the structuring element used for dilation (default is 3x3).

We can call a dilate method with this parameter.

img.dilate(3);
OpenCV calls a dilate method like this.

cv::dilate(self->mat, self->mat, structEl, cv::Point(-1, -1), 3);
After this call, we can get modified image like this.
The erosion of the binary image A by the structuring element B is defined by

OpenCV Erode

In OpenCV, we can call a Matrix#erode(iterations, structEl) method which is similar to the dilation method.

We can use it like this:

img.erode(3);
and we get an eroded image.

Edge detection
For edge detection, we can use the Canny Edge Detector algorithm, which was developed in 1986 and became a very popular algorithm - often being called the “optimal detector”. This algorithm meets the following three criteria, which are important in edge detection:

Detection of edge with low error rate
Good localization of edge - distance between edge and real edge pixels have to be minimal
Edges in the image can only be marked once
Before using the Canny Edge Detector algorithm, we can convert the image to grayscale format, which can sometimes produce better results. Then, we can eliminate unnecessary noise from the image by using a Gaussian Blur filter which receives a parameter as a field - Gaussian kernel size. After using these two methods, we can get better and more accurate results in a Canny Edge.

im.convertGrayscale();
im.gaussianBlur([3, 3]);
The image is now ready to be detected by the Canny Edge algorithm. This algorithm receives parameters: lowThreshold and highThreshold.

Two thresholds allow you to divide pixels into three groups.

If the value of a gradient pixel is higher as highThreshold, the pixels are marked as strong edge pixels.
If the value of the gradient is between the high and low threshold, the pixels are marked as weak edge pixels.
If the value is below the low threshold level, those pixels are completely suppressed.
There isn't something like a global setting of the threshold for all images. You need to properly set up each threshold for each image separately. There are some possibilities for predicting the right thresholds, but I will not specify them in this article.

After calling the Canny Edge method, we also call a dilate method.
 const lowThresh = 0;
  const highThresh = 150;
  const iterations = 2;

  img.canny(lowThresh, highThresh);
  img.dilate(iterations);
After these steps, we have an analyzed image. From this image, we can now select all the contours by calling the Matrix#findContours() method and writing it as a new Image.

  const WHITE = [255, 255, 255];
  let contours = img.findContours();
  let allContoursImg = img.drawAllContours(contours, WHITE);
  allContoursImg.save('./img/allContoursImg.jpg');
  Image with dilate.

Canny edge image without dilate
Image without dilate.

In this picture, we can see all the contours found by the Canny Edge Detector.

If we want to select only the biggest of them, we can do it by using the following code, which goes through each contour and saves the biggest one. We can draw it by the Matrix#drawContour() method.

  const WHITE = [255, 255, 255];
  let contours = img.contours();
  let largestContourImg;
  let largestArea = 0;
  let largestAreaIndex;

  for (let i = 0; i < contours.size(); i++) {
    if (contours.area(i) > largestArea) {
      largestArea = contours.area(i);
      largestAreaIndex = i;
    }
  }

  largestContourImg.drawContour(contours, largestAreaIndex, GREEN, thickness, lineType);
Canny edge image with only one contour

If we want to draw more contours, for example, all contours larger than a certain value, we only move the Matrix#drawContour() method into a for loop and modify the if condition.

  const WHITE = [255, 255, 255];
  let contours = img.contours();
  let largestContourImg;
  let largestArea = 500;
  let largestAreaIndex;

  for (let i = 0; i < contours.size(); i++) {
    if (contours.area(i) > largestArea) {
      largestContourImg.drawContour(contours, i, GREEN, thickness, lineType);
    }
  }
Canny edge image with only more contour

Polygon Approximations
Polygon approximation can be used for several useful things. The most trivial is an approximation by bounding a rectangle around our object using the Contours#boundingRect(index) method. We call this method on the Contours object, which we get by calling the Matrix#findContours() method on an image after the Canny Edge Detection (which we discussed in the previous example).

let bound = contours.boundingRect(largestAreaIndex);
largestContourImg.rectangle([bound.x, bound.y], [bound.width, bound.height], WHITE, 2);
Polygon approximation

The second alternative to using approximation is the approximation of precision specified polygons by calling the Contours#approxPolyDP() method. By using the Contours#cornerCount(index) method, you get the number of angles in our polygon. I attached two images with various levels of precision below.

  let poly;
  let RED = [0, 0, 255];
  let arcLength = contours.arcLength(largestAreaIndex, true);
  contours.approxPolyDP(largestAreaIndex, arcLength * 0.05, true);
  poly.drawContour(contours, largestAreaIndex, RED);

  // number of corners
  console.log(contours.cornerCount(largestAreaIndex));
Approximation with specific precision 1

Approximation with specific precision 2

It is also interesting to use an approximation by the rotated rectangle of the minimum area, using the Contours#minAreaRect() method.

I use this method in my project to determine the angle of a particular object which is rotated into the right position after. In the next example, we add a rotated polygon into the largestContourImg variable and print the angle of our rotated polygon.

  let rect = contours.minAreaRect(largestAreaIndex);
  for (let i = 0; i < 4; i++) {
      largestContourImg.line([rect.points[i].x, rect.points[i].y], [rect.points[(i+1)%4].x, rect.points[(i+1)%4].y], RED, 3);
  }

// angle of polygon
console.log(rect.angle);

Approximation by the rotated rectangle

Image rotation without cropping
One of the things which I needed to solve and OpenCV have not implemented it, is image rotation without image cropping. We can easily rotate an image with the following code.

img.rotate(90);
But we get something like this:

Rotated image with rotate method

How can we rotate an image without cropping? Before the rotation, we create a new square 8-bit 3-channel Matrix called bgImg whose size is the diagonal size of our image for rotation.

After that, we calculate the position for our image which we can put into new bgImg Matrix. On the bgImg, we call the Matrix#rotate(angle) method with our value.

  let rect = contours.minAreaRect(largestAreaIndex);
  let diagonal = Math.round(Math.sqrt(Math.pow(im.size()[1], 2) + Math.pow(im.size()[0], 2)));
  let bgImg = new cv.Matrix(diagonal, diagonal, cv.Constants.CV_8UC3, [255, 255, 255]);
  let offsetX = (diagonal - im.size()[1]) / 2;
  let offsetY = (diagonal - im.size()[0]) / 2;

  IMG_ORIGINAL.copyTo(bgImg, offsetX, offsetY);
  bgImg.rotate(rect.angle + 90);

  bgImg.save('./img/rotatedImg.jpg');
Rotated image without crop

After that, we can run the Canny Edge Detector on our new rotated image.

  const GREEN = [0, 255, 0];;
  let rotatedContour = new cv.Matrix(diagonal, diagonal);
  bgImg.canny(lowThresh, highThresh);
  bgImg.dilate(nIters);
  let contours = bgImg.findContours();

  for (let i = 0; i < contours.size(); i++) {
    if (contours.area(i) > largestArea) {
      largestArea = contours.area(i);
      largestAreaIndex = i;
    }
  }

  rotatedContour.drawContour(contours, largestAreaIndex, GREEN, thickness, lineType);
  rotatedContour.save('./img/rotatedImgContour.jpg');
Rotated image with contour

There are so many other methods that we can use on a picture. For example, there’s background removing, which can be very useful - but they are not covered in this article.

Object detection
I work with plants and I don't use a detector for faces, cars or other objects in my application.

Even so, I decided to mention face detection in this article because it can show the strength of OpenCV technology.

We call the Matrix#detectObject() method on our loaded image, which accepts a parameter as a path to cascade classifier, which we want to use. OpenCV comes with some pre-trained classifiers which can find figures, faces, eyes, ears, cars and some other object in pictures.

cv.readImage('./img/face.jpg', function(err, im){
  if (err) throw err;
  if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

  im.detectObject('./data/haarcascade_frontalface_alt2.xml', {}, function(err, faces){
    if (err) throw err;

    for (var i = 0; i < faces.length; i++){
      var face = faces[i];
      im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2, [255, 255, 0], 3);
    }

    im.save('./img/face-detection.jpg');
    console.log('Image saved.');
  });
});
OpenCV Face detection example

based on https://community.risingstack.com/opencv-tutorial-computer-vision-with-node-js/ 