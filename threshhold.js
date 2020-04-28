import { readImage } from 'opencv';



readImage('./img/leaf.jpg', function (err, img) {
  if (err) {
    throw err;
  }

  const width = img.width();
  const height = img.height();

  if (width < 1 || height < 1) {
    throw new Error('Image not found');
  }

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