<template>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="selectedLanguage" @change="changeLanguage" placeholder="Select Language" size="medium">
            <el-option v-for="option in languageOptions" :key="option.value" :label="option.label" :value="option.value">
              <template #default="{  }">
                <span>{{ option.label }}</span>
                <el-image :src="option.icon" style="float: right; width: 20px; height: 20px;"></el-image>
              </template>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <div v-if="selectedLanguage === 'c_cpp'">
            <el-select v-model="selectedCppStandard" placeholder="Select C++ Standard" size="medium">
              <el-option label="C++98" value="c++98"></el-option>
              <el-option label="C++03" value="c++03"></el-option>
              <el-option label="C++11" value="c++11"></el-option>
              <el-option label="C++14" value="c++14"></el-option>
              <el-option label="C++17" value="c++17"></el-option>
              <el-option label="C++20" value="c++20"></el-option>
              <el-option label="C++23" value="c++23"></el-option>
              <el-option label="C++26_pre" value="c++26"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input v-model="userInput" placeholder="Input：" size="medium"/>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="runCode" size="medium">运行</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="12">
          <div id="editor" ref="editor" class="editor" style="height: 500px; width: 100%; margin-top: 20px;"></div>
        </el-col>
        <el-col :span="12">
          <el-card style="height: 500px; margin-top: 20px; overflow-y: auto;">
            <pre>{{ output }}</pre>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-language_tools'; // 引入代码补全扩展
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-haskell'; // 引入Haskell模式
import 'ace-builds/src-noconflict/snippets/c_cpp'; // 引入C++的代码片段
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/snippets/haskell'; // 引入Haskell的代码片段
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';

export default {
  props: {
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedLanguage: 'c_cpp',
      selectedCppStandard: 'c++20',  // 修改这里的默认值
      userInput: '',
      output: '',
      languageOptions: [
        { label: 'C++', value: 'c_cpp', icon: require('@/assets/C++.png') }, // 使用自定义 C++ 图标
        { label: 'Python', value: 'python', icon: require('@/assets/python.png') },  // 使用自定义 Python 图标
        { label: 'Haskell', value: 'haskell', icon: require('@/assets/Haskell.png') } // 使用自定义 Haskell 图标
      ]
    };
  },
  mounted() {
    this.editor = ace.edit(this.$refs.editor);
    this.setTheme(this.isDarkMode);
    this.editor.session.setMode('ace/mode/c_cpp');
    this.enableAutocomplete(); // 启用代码补全
    this.loadStylesheet('darkmode.css');
  },
  watch: {
    isDarkMode(newVal) {
      this.setTheme(newVal);
    }
  },
  methods: {
    setTheme(isDarkMode) {
      const theme = isDarkMode ? 'ace/theme/twilight' : 'ace/theme/github';
      this.editor.setTheme(theme);
    },
    changeLanguage() {
      let mode;
      switch (this.selectedLanguage) {
        case 'c_cpp':
          mode = 'ace/mode/c_cpp';
          break;
        case 'python':
          mode = 'ace/mode/python';
          break;
        case 'haskell': // 添加Haskell的处理
          mode = 'ace/mode/haskell';
          break;
        default:
          mode = 'ace/mode/text';
      }
      this.editor.session.setMode(mode);
      console.log('Language changed to:', this.selectedLanguage); // 添加日志
      if (this.selectedLanguage === 'c_cpp') {
        console.log('Selected C++ standard:', this.selectedCppStandard); // 添加日志
      }
    },
    runCode() {
      const code = this.editor.getValue();
      const language = this.selectedLanguage;
      const inputData = this.userInput;
      const cppStandard = this.selectedCppStandard;  // 修改这里的变量名

      console.log('cppStandard:', cppStandard); // 确认前端参数是否正确

      fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, inputData, cppStandard }), // 发送JSON数据
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            this.output = data.result || data.error;
          })
          .catch(error => {
            this.output = 'Error: ' + error.message;
          });
    },
    enableAutocomplete() {
      ace.require('ace/ext/language_tools'); // 加载语言工具扩展

      this.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });

      const langTools = ace.require('ace/ext/language_tools');
      const staticWordCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
          const wordList = prefix === '' ? [] : ['include', 'iostream', 'int', 'main', 'return', 'std'];
          callback(null, wordList.map(function(word) {
            return {
              caption: word,
              value: word,
              meta: 'static'
            };
          }));
        }
      };
      langTools.addCompleter(staticWordCompleter);
    },
    loadStylesheet(url) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  },
};
</script>

<style scoped>
.custom-header {
  font-family: 'JetBrains Mono', monospace;
  background-color: #f0f0f0;
  border-bottom: 1px solid #dcdcdc;
}

.el-select {
  font-family: 'JetBrains Mono', monospace;
  width: 100%;
}

.el-input {
  font-family: 'JetBrains Mono', monospace;
  width: 100%;
}

.el-button {
  font-weight: bold;
  font-family: 'JetBrains Mono', monospace;
  width: 100%;
}

#editor {
  font-family: 'JetBrains Mono', monospace;
  border-radius: 10px;
  border: 1px solid #1e1e1e;
  margin-bottom: 10px;
  background-image: url('~@/assets/cd3.svg'); /* 使用背景图 */
  background-size: cover; /* 调整背景图大小以覆盖整个区域 */
  background-repeat: no-repeat; /* 防止背景图重复 */
  background-position: center; /* 将背景图置于中心 */
  background-color: transparent; /* 确保背景透明以显示图片 */
  transition: background-image 0.5s ease-in-out, background-color 0.5s ease-in-out;
}

[data-dark-mode=false] #editor {
  font-family: 'JetBrains Mono', monospace;
  background-image: url('~@/assets/ce.svg');
  transition: background-image 0.5s ease-in-out, background-color 0.5s ease-in-out;
}

[data-dark-mode=true] pre {
  border-radius: 10px;
  background: #121212;
  color: #ffffff; /* 白色字体 */
  padding: 20px;
  transition: background 1s ease-in-out, background-color 3s ease-in-out, color 1s ease-in-out;
  white-space: pre-wrap; /* 确保长内容能够换行 */
  word-wrap: break-word; /* 确保长单词能够换行 */
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px; /* 设置字体大小 */
}

pre {
  font-family: 'JetBrains Mono', monospace;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 20px;
  transition: background 1s ease-in-out, background-color 1s ease-in-out;
  white-space: pre-wrap; /* 确保长内容能够换行 */
  word-wrap: break-word; /* 确保长单词能够换行 */
  font-size: 14px; /* 设置字体大小 */
}

.el-card {
  font-family: 'JetBrains Mono', monospace;
  background-color: #ffffff;
  border: transparent;
  transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
}

[data-dark-mode=true] .el-card {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  background-color: #1e1e1e;
  color: #ffffff;
}
</style>
