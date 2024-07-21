<template>
  <footer>
    <p>这是页脚</p>
  </footer>
</template>

<script>
export default {
  name: 'FooterVue'
}
</script>



<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #eee;
  z-index: 5;
}
</style>