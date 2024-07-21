<template>
  <div id="app">
    <div class="content-container">
      <nav>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
          <li><router-link to="/projects">项目展示</router-link></li>
          <li><router-link to="/contact">联系我</router-link></li>
          <li><router-link to="/chat">ChatGPT</router-link></li>
          <li><router-link to="/codeEditor">CodeEditor</router-link></li>
        </ul>
      </nav>
      <router-view></router-view>
      <CodeEditor :isDarkMode="isDarkMode" />
      <DarkModeToggle :isDarkMode="isDarkMode" @toggleDarkMode="toggleDarkMode" />
    </div>

  </div>
</template>

<script>
import CodeEditor from './components/CodeEditor.vue';
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import '@fortawesome/fontawesome-free/css/all.css';


export default {
  name: 'App',
  components: {

    CodeEditor,
    DarkModeToggle,
  },
  data() {
    return {
      isDarkMode: localStorage.getItem('darkMode') === 'true',
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode);
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  mounted() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.custom-cursor {
  cursor: url('./assets/pointer.cur'), auto;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 20px;
}

nav ul li a {
  text-decoration: none;
  color: #42b983;
}

nav ul li a.router-link-active {
  font-weight: bold;
}

/* 新增 */
.content-container {
  height: calc(100vh - 60px); /* 高度设置为视口高度减去页眉高度 */
  padding: 10px; /* 添加适当的内边距 */
  box-sizing: border-box;
}
</style>
