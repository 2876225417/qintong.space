<template>
  <div id="content">
    <input type="file" id="thefile" accept="audio/*" @change="handleFileChange" />
    <canvas ref="canvas"></canvas>
    <audio ref="audio" controls></audio>
  </div>
</template>

<script>
export default {
  name: 'AudioVisualizer',
  methods: {
    handleFileChange(event) {
      const files = event.target.files;
      const audio = this.$refs.audio;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();

      const context = new (window.AudioContext || window.webkitAudioContext)();
      const src = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();

      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          const r = barHeight + (25 * (i / bufferLength));
          const g = 250 * (i / bufferLength);
          const b = 50;

          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      renderFrame();
    }
  }
};
</script>

<style scoped>
#thefile {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
}

#canvas {
  color: #42b983;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

audio {
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: calc(100% - 20px);
}
</style>
