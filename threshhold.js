const cv = require('opencv');

var im;
var width;
var height;

cv.readImage('./img/leaf.jpg', function (err, img) {
  if (err) {
    throw err;
  }

//   const width = im.width();
//   const height = im.height();

//   if (width < 1 || height < 1) {
//     throw new Error('Image has no size');
//   }

  // do some cool stuff with img

  // save img

  const lowThresh = 0;
  const highThresh = 150;
  const iterations = 2;

  img.canny(lowThresh, highThresh);
  img.dilate(iterations);

  const WHITE = [255, 255, 255];
  let contours = img.findContours();
  let allContoursImg = img.drawAllContours(contours, WHITE);
  allContoursImg.save('./img/allContoursImg.jpg');
});