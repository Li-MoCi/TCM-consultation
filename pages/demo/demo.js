Page({
  data: {
    inputText: '',
    messages: [],
    isLoading: false,
    scrollTop: 0
  },

  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  async sendMessage() {
    const text = this.data.inputText.trim();
    if (!text || this.data.isLoading) return;

    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: text
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      isLoading: true
    });

    // 滚动到底部
    this.scrollToBottom();

    try {
      // 调用Kimi API
      const response = await this.callKimiAPI(text);
      
      // 添加AI回复
      const aiMessage = {
        role: 'assistant',
        content: response
      };

      this.setData({
        messages: [...this.data.messages, aiMessage],
        isLoading: false
      });

      // 再次滚动到底部
      this.scrollToBottom();

    } catch (error) {
      console.error('API调用失败:', error);
      
      // 添加错误消息
      const errorMessage = {
        role: 'assistant',
        content: '抱歉，我暂时无法回复您的问题。请稍后再试。'
      };

      this.setData({
        messages: [...this.data.messages, errorMessage],
        isLoading: false
      });

      this.scrollToBottom();
    }
  },

  async callKimiAPI(userMessage) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.moonshot.cn/v1/chat/completions',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE' // 替换为你的实际API Key
        },
        data: {
          model: "kimi-k2-0905-preview",
          messages: [
            {
              role: "system",
              content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.6,
          stream: false
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices.length > 0) {
            resolve(res.data.choices[0].message.content);
          } else {
            reject(new Error('API返回数据格式错误'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: 99999 // 设置一个足够大的值确保滚动到底部
      });
    }, 100);
  },

  onLoad() {
    // 可以在这里添加初始消息
    const welcomeMessage = {
      role: 'assistant',
      content: '你好！我是Kimi AI助手，很高兴为您服务。请问有什么可以帮助您的吗？'
    };
    
    this.setData({
      messages: [welcomeMessage]
    });
  }
});