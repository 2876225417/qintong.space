<!-- src/components/MyCounter.vue -->
<template>
  <div id="counter">
    <p>Counter: {{ counter }}</p>
  </div>
</template>

<script>
export default {
  name: 'MyCounter',
  data() {
    return {
      counter: 0
    };
  },
  mounted() {
    setInterval(() => {
      this.counter++;
    }, 1000);
  }
};
</script>

<style scoped>
p {
  font-size: 20px;
  font-weight: bold;
}
</style>
