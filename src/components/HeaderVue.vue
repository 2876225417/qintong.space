<template>
  <header>
    <div class="header-container">
      <h1 class="title">My App Header</h1>
      <nav class="navigation">
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
          <li><router-link to="/projects">项目展示</router-link></li>
          <li><router-link to="/contact">联系我</router-link></li>
          <li><router-link to="/chat">ChatGPT</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderVue',
  mounted() {

  },
  methods(){

  }
}
</script>

<style scoped>
header {
  border-radius: 10px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-image: url("../assets/hd.svg"); /* 深色背景 */
  background-size: cover; /* 确保图片覆盖整个容器 */
  background-position: center; /* 将图片定位在容器的中心 */
  background-repeat: no-repeat; /* 确保图片不重复 */
  z-index: 10;
  padding: 40px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white; /* 白色文本 */
}

.header-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 1.5rem;
}

.navigation ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.navigation ul li {
  margin-right: 20px;
}

.navigation ul li a {
  text-decoration: none;
  color: white; /* 白色链接 */
  font-weight: 500;
  transition: color 0.3s ease;
}

.navigation ul li a.router-link-active {
  font-weight: bold;
  color: #ffdd57; /* 高亮颜色 */
}

.navigation ul li a:hover {
  color: #ffdd57; /* 悬停颜色 */
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
  }

  .navigation ul {
    flex-direction: column;
  }

  .navigation ul li {
    margin: 10px 0;
  }
}
</style>
