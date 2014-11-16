// requestAnim shim layer by Paul Irish: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1000 / 60);
    };
  })();


var canvas, audio, analyser, gainNode, gContext, aContext,
  CANVAS_WIDTH, CANVAS_HEIGHT;
var hearts = [], sound_hearts = [];

(function init() {
  // canvas initialization
  canvas = document.getElementById('myCanvas');
  gContext = canvas.getContext('2d');

  CANVAS_WIDTH = canvas.width;
  CANVAS_HEIGHT = canvas.height;

  // audio initialization
  audio = new Audio();
  var source = document.createElement('source');
  if (audio.canPlayType('audio/mpeg')) {
    source.type = 'audio/mpeg';
    source.src = 'Loveshadow_-_Heart_On_Redial.mp3';
  } else {
    source.type = 'audio/ogg';
    source.src = 'Loveshadow_-_Heart_On_Redial.ogg';
  }
  audio.appendChild(source);
  audio.controls = true;
  audio.autoplay = true;
  audio.loop = true;
  document.body.appendChild(audio);

  // Check for non Web Audio API browsers.
  if (!window.webkitAudioContext && !window.AudioContext) {
    alert("Awwwww, Web Audio isn't available in your browser. You can still enjoy the music ;)");
    return;
  }

  aContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = aContext.createAnalyser();
  gainNode = aContext.createGain();
})();

// Web Audio API magic
window.addEventListener('load', function(e) {
  if (aContext) {
    var source = aContext.createMediaElementSource(audio);
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(aContext.destination);
  }

  // generate audio hearts
  var base = 10;
  for (var i = 0; i < 32; ++i) {
    sound_hearts.push(new Sound_heart(CANVAS_WIDTH / 2, (CANVAS_HEIGHT / 2) + (base / 2), base));
    base += 20;
  }

  drawAudio();    // draw audio visualisation
}, false);

// Mute sounds
window.addEventListener('keydown', function(e) {
  if (e.keyCode == 77 || e.keyCode == 32) {  // key 'm' or space
    if (aContext) {
      gainNode.gain.value = (gainNode.gain.value) ? 0 : 1;
    } else {
      audio.volume = (audio.volume) ? 0 : 1;
    }
    var checkbox = document.querySelector('#toggle-mute');
    checkbox.checked = (checkbox.checked) ? 0 : 1;
  }
}, false);

document.querySelector('#toggle-mute').addEventListener('click', function(e) {
  if (aContext) {
    gainNode.gain.value = (gainNode.gain.value) ? 0 : 1;
  } else {
    audio.volume = (audio.volume) ? 0 : 1;
  }
}, false);

// Canvas drawing methods
function drawAudio() {
  window.requestAnimFrame(drawAudio);

  gContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
  gContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (aContext) {
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqByteData);

    var offset = 30,
      ratio = Math.floor(freqByteData.length / sound_hearts.length),
      amp = 1 / 255;

    gContext.fillStyle = 'hsla(0, 70%, 80%, 0.4)';
    gContext.lineCap = 'round';

    // draw the sound hearts
    for (var i = sound_hearts.length - 1; i; --i) {
      var alpha = (freqByteData[i * ratio] - offset) * amp;
      sound_hearts[i].draw(alpha);
    }
  } else {
    for (var i = 0, len = sound_hearts.length; i < len; i++) {
      sound_hearts[i].draw(1 - (i * 0.04));
    }
  }

  // generate random hearts
  hearts.push(new Heart(Math.floor(Math.random() * CANVAS_WIDTH), Math.floor(Math.random() * CANVAS_HEIGHT)));

  for (var i = 0, len = hearts.length; i < len;) {
    hearts[i].draw();

    if (hearts[i].alpha > 0) {
      ++i;
    } else {
      hearts.splice(i, 1);
      --len;
    }
  }
}


// Heart object
function Heart(x, y) {
  this.size = Math.floor(Math.random() * 41 + 10);        // from 10 to 50 px
  this.angle = (Math.PI * 2) * Math.random();             // from 0 to 359
  this.saturation = Math.floor(100 - Math.random() * 40); // color saturation
  this.hue = (Math.random() >= 0.5) ? 350 : 0;            // color hue
  this.fade = Math.floor(Math.random() * 4 + 1) / 100;    // fade out speed
  this.alpha = 0.5;   // heart visibility
  this.x = x;         // heart x position
  this.y = y;         // heart y position
}

Heart.prototype.draw = function() {
  var step = Math.floor(this.size * 0.25);

  gContext.save();

  gContext.translate(this.x, this.y);
  gContext.rotate(this.angle);
  gContext.fillStyle = 'hsla(' + this.hue + ', ' + this.saturation + '%, 50%, ' + this.alpha + ')';

  gContext.beginPath();
  gContext.moveTo(0, 0);
  gContext.lineTo(-step, -step);
  gContext.bezierCurveTo(-step, -step, -step * 2.25, -step * 2, -step * 2, -step * 3);
  gContext.arc(-step, -step * 3, step, Math.PI, 0, false);
  gContext.moveTo(0, 0);
  gContext.lineTo(step, -step);
  gContext.bezierCurveTo(step, -step, step * 2.25, -step * 2, step * 2, -step * 3);
  gContext.arc(step, -step * 3, step, 0, Math.PI, true);

  //gContext.stroke();
  gContext.fill();

  gContext.restore();
  this.alpha -= this.fade;
};

// Sound heart object
function Sound_heart(x, y, size) {
  this.size = size;
  this.x = x;      // heart x position
  this.y = y;      // heart y position
}

Sound_heart.prototype.draw = function(alpha) {
  var step = Math.floor(this.size * 0.25);

  gContext.save();
  gContext.translate(this.x, this.y);

  gContext.lineWidth = 15;
  gContext.strokeStyle = 'hsla(0, 60%, 40%, ' + alpha + ')';

  gContext.beginPath();
  gContext.moveTo(0, 0);
  gContext.lineTo(-step, -step);
  gContext.bezierCurveTo(-step, -step, -step * 2.25, -step * 2, -step * 2, -step * 3);
  gContext.arc(-step, -step * 3, step, Math.PI, 0, false);
  gContext.moveTo(0, 0);
  gContext.lineTo(step, -step);
  gContext.bezierCurveTo(step, -step, step * 2.25, -step * 2, step * 2, -step * 3);
  gContext.arc(step, -step * 3, step, 0, Math.PI, true);

  gContext.stroke();

  gContext.restore();
};
