<template>
  <div>
    <h1>联系我</h1>
    <p>请通过以下方式联系我。</p>
    <audio ref="audio" controls>
      <source src="./Youth.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'AudioVisualizer',
  mounted() {
    this.initAudioVisualizer();
  },
  methods: {
    initAudioVisualizer() {
      const audio = this.$refs.audio;
      const canvas = this.$refs.canvas;
      const canvasCtx = canvas.getContext('2d');
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();

      audio.addEventListener('play', () => {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        this.visualize(analyser, canvasCtx, canvas);
      });
    },
    visualize(analyser, canvasCtx, canvas) {
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };

      draw();
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
