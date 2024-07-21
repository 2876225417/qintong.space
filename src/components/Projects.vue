<template>
  <div>
    <h1>项目展示</h1>
    <p>这里是一些项目的展示。</p>
  </div>
  <AudioVisualizer />
</template>


<script>
import AudioVisualizer from './AudioVisualizer.vue';


export default {
  name: 'ProjectsComponent',
  components:{
    AudioVisualizer
  }
};
</script>
