var raspivid = require('raspivid');
var fs = require('fs');

var file = fs.createWriteStream(__dirname + '/video.h264');
var video = raspivid({
  profile:'high',
  width:1280,
  height:720,
  framerate:60,
  vflip:'',
  bitrate:8000000,
  exposure:'auto'
});
video.pipe(file);
