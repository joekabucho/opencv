const cv = require('opencv');

cv.readImage('./img/faces.jpeg', function(err, im){
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