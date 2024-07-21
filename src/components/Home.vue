<template>
  <div>
    <p>欢迎来到 qintong 的个人网站</p>
    <MyCounter />
  </div>
</template>

<script>
import MyCounter from './MyCounter.vue';

export default {
  name: 'HomeComponent',
  components: {
    MyCounter
  }
};
</script>
