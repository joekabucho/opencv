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

  // do some cool stuff with img

  // save img
  let croppedImg = img.crop(100, 100, 100, 100);
  croppedImg('./img/croppedImg');
});