Page({
  data: {
    selectedColor: '',
    selectedColorType: '',
    question: '',
    messages: [],
    isLoading: false,
    scrollTop: 0
  },

  // 选择面色类型
  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    const type = e.currentTarget.dataset.type;
    
    this.setData({
      selectedColor: color,
      selectedColorType: type
    });

    // 添加系统欢迎消息
    const welcomeMessage = {
      type: 'ai',
      content: `您选择了${type}，我是中医AI助手，可以为您提供相关的健康咨询和建议。请问您有什么具体问题吗？`
    };

    this.setData({
      messages: [welcomeMessage]
    });
  },

  // 输入问题
  inputQuestion(e) {
    this.setData({
      question: e.detail.value
    });
  },

  // 发送问题
  async sendQuestion() {
    const question = this.data.question.trim();
    if (!question || this.data.isLoading) return;

    // 添加用户消息
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: Date.now()
    };

    // 添加AI消息占位符
    const aiMessage = {
      type: 'ai',
      content: '',
      loading: true,
      timestamp: Date.now()
    };

    this.setData({
      messages: [...this.data.messages, userMessage, aiMessage],
      question: '',
      isLoading: true
    });

    // 滚动到底部
    this.scrollToBottom();

    try {
      // 构建包含面色类型的完整问题
      const fullQuestion = `我选择了${this.data.selectedColorType}面色类型。${question}`;
      
      // 调用DeepSeek API
      const response = await this.callDeepSeekAPI(fullQuestion);
      
      // 更新AI消息
      const updatedMessages = this.data.messages.map((msg, index) => {
        if (index === this.data.messages.length - 1) {
          return {
            ...msg,
            content: response,
            loading: false
          };
        }
        return msg;
      });

      this.setData({
        messages: updatedMessages,
        isLoading: false
      });

      // 再次滚动到底部
      this.scrollToBottom();

    } catch (error) {
      console.error('API调用失败:', error);
      
      // 更新错误消息
      const updatedMessages = this.data.messages.map((msg, index) => {
        if (index === this.data.messages.length - 1) {
          return {
            ...msg,
            content: '抱歉，发生了错误，请稍后重试。',
            loading: false
          };
        }
        return msg;
      });

      this.setData({
        messages: updatedMessages,
        isLoading: false
      });

      wx.showToast({
        title: '请求失败',
        icon: 'none'
      });
    }
  },

  async callDeepSeekAPI(prompt) {
    // 注意：在实际使用中，建议通过自己的服务器转发API请求
    // 避免在前端暴露API密钥
    
    const API_KEY = 'deepseek_API_KEY'; // 替换为你的API密钥
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'; // DeepSeek API端点

    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: API_URL,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          data: {
            model: 'deepseek-chat', // 根据实际情况调整模型名称
            messages: [
              {
                role: 'system',
                content: '你是一位专业的中医健康顾问，请根据用户选择的面色类型提供专业、贴心的健康建议和中医调理方案。回答要专业但易于理解。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            stream: false,
            max_tokens: 2048
          },
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              reject(new Error(`API错误: ${res.statusCode}`));
            }
          },
          fail: reject
        });
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`API调用失败: ${error.message}`);
    }
  },

  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: 99999 // 设置一个足够大的值确保滚动到底部
      });
    }, 100);
  },

  onLoad() {
    // 页面加载时的初始化
    console.log('中医咨询页面加载');
  },

  onUnload() {
    // 页面卸载时清理数据
    this.setData({
      selectedColor: '',
      selectedColorType: '',
      question: '',
      messages: [],
      isLoading: false
    });
  }
});