import Heart from './heart.js'
import SoundHeart from './sound-heart.js'

function setupAudioNode(songName) {
  const audio = new Audio()
  const source = document.createElement('source')

  if (audio.canPlayType('audio/mpeg')) {
    source.type = 'audio/mpeg'
    source.src = `${songName}.mp3`
  } else {
    source.type = 'audio/ogg'
    source.src = `${songName}.ogg`
  }

  audio.appendChild(source)
  audio.autoplay = true
  audio.controls = true
  audio.loop = true

  return audio
}

function setupSoundHearts(canvasWidth, canvasHeight, count = 32) {
  let baseSize = 10
  const hearts = []

  for (let i = 0; i < count; i++) {
    hearts.push(SoundHeart({
      originX: canvasWidth / 2,
      originY: canvasHeight / 2 + baseSize / 2,
      size: baseSize,
    }))

    baseSize += 20
  }

  return hearts
}

function render(renderData, soundHearts, hearts) {
  window.requestAnimationFrame(() =>
    render(renderData, soundHearts, hearts))

  renderData.context.clearRect(0, 0, renderData.width, renderData.height)

  const freqByteData = new Uint8Array(renderData.analyser.frequencyBinCount)
  renderData.analyser.getByteFrequencyData(freqByteData)

  const offset = 30
  const ratio =  Math.floor(freqByteData.length / soundHearts.length)
  const amp = 1 / 255

  soundHearts.forEach((heart, index) => {
    const alpha = (freqByteData[index * ratio] - offset) * amp
    heart.draw(renderData.context, alpha)
  })

  hearts.push(Heart({
    originX: Math.floor(Math.random() * renderData.width),
    originY: Math.floor(Math.random() * renderData.height),
  }))

  for (let i = 0, len = hearts.length; i < len;) {
    hearts[i].draw(renderData.context)

    if (hearts[i].alpha > 0) {
      ++i
    } else {
      hearts.splice(i, 1)
      --len
    }
  }
}

(function() {
  const SONG_NAME = 'Loveshadow_-_Heart_On_Redial'
  const canvas = document.getElementById('canvas')
  const canvasContext = canvas.getContext('2d')
  const audioContext = new AudioContext()
  const audioAnalyser = audioContext.createAnalyser()
  const audioNode = setupAudioNode(SONG_NAME)

  document.body.appendChild(audioNode)

  if (audioContext) {
    const source = audioContext.createMediaElementSource(audioNode)
    source.connect(audioAnalyser)
    audioAnalyser.connect(audioContext.destination)
  }

  document.getElementById('play-toggle').addEventListener('click', function() {
    if (audioNode.paused) {
      audioNode.play()
    } else {
      audioNode.pause()
    }
  })

  const soundHearts = setupSoundHearts(canvas.width, canvas.height)
  const hearts = []

  render(
    {
      context: canvasContext,
      width: canvas.width,
      height: canvas.height,
      analyser: audioAnalyser,
    },
    soundHearts,
    hearts
  )
})()
