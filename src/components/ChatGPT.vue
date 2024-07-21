<template>
  <div class="chat-container">
    <div class="chat-box" v-for="message in messages" :key="message.id">
      <div :class="['message', message.sender]" v-html="message.text"></div>
    </div>
    <div class="input-box">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="给ChatGPT发消息..." />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 使用 GitHub 深色样式

export default {
  data() {
    return {
      userInput: '',
      messages: [],
      isTyping: false, // 添加标识符
    };
  },
  methods: {
    formatMessage(text) {
      // 使用 marked 格式化消息并添加语法高亮
      return marked(text, {
        highlight: function(code, lang) {
          const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(validLanguage, code).value;
        }
      });
    },
    async sendMessage() {
      if (this.userInput.trim() === '' || this.isTyping) return; // 防止重复发送和正在打字时发送

      // 添加用户输入到消息列表中
      const userMessage = { id: Date.now(), text: this.userInput, sender: 'user' };
      this.messages.push(userMessage);

      // 清空用户输入
      this.userInput = '';

      // 构建要发送给API的消息历史
      const messageHistory = this.messages.map(message => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text
      }));

      try {
        const response = await axios.post('/api/chat', {
          messages: messageHistory,
        });

        console.log("Response from API:", response.data);

        // 解析ChatGPT响应
        const chatGptMessage = this.formatMessage(response.data.choices[0].message.content);
        this.typeMessage(chatGptMessage); // 逐字显示消息
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ id: Date.now(), text: 'Error: ' + error.message, sender: 'bot' });

        // 输出详细的错误信息
        console.error('Error details:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
        }
      }
    },
    typeMessage(message) {
      let index = 0;
      const messageId = Date.now();
      this.isTyping = true;
      this.messages.push({ id: messageId, text: '', sender: 'bot' });

      const typeInterval = setInterval(() => {
        if (index < message.length) {
          const currentMessage = this.messages.find(msg => msg.id === messageId);
          if (currentMessage) {
            currentMessage.text = message.substring(0, index + 1) + '<span class="cursor">|</span>';
            index++;
          }
        } else {
          clearInterval(typeInterval);
          this.isTyping = false;
          const currentMessage = this.messages.find(msg => msg.id === messageId);
          if (currentMessage) {
            currentMessage.text = message; // 去掉光标
          }
        }
      }, 50); // 调整打字速度
    }
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 800px; /* 增加宽度 */
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #333; /* 调整边框颜色 */
  border-radius: 10px;
  background-color: #1e1e1e; /* 深色背景 */
  color: #f1f1f1; /* 调整文本颜色 */
}

.chat-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  max-width: 90%; /* 增加最大宽度 */
  word-break: break-word;
  background-color: #2e2e2e; /* 深色消息背景 */
}

.message.user {
  align-self: flex-end;
  background-color: #4e4e4e; /* 深色用户消息背景 */
}

.message.bot {
  align-self: flex-start;
}

.message pre {
  margin: 0;
  background-color: inherit;
  border: none;
  font-family: 'Courier New', Courier, monospace; /* 设置字体 */
  padding: 10px;
}

.hljs {
  background: #2e2e2e; /* 设置代码块背景颜色 */
  border-radius: 5px; /* 设置圆角 */
  padding: 10px; /* 增加内边距 */
}

.cursor_ {
  display: inline-block;
  width: 10px;
  background-color: #f1f1f1;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.input-box {
  display: flex;
  margin-top: 10px;
}

.input-box input {
  flex: 1;
  padding: 10px;
  border: 1px solid #333; /* 调整边框颜色 */
  border-radius: 5px;
  background-color: #2e2e2e; /* 深色输入框背景 */
  color: #f1f1f1; /* 调整输入框文本颜色 */
}

.input-box button {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.input-box button:hover {
  background-color: #0056b3;
}
</style>
