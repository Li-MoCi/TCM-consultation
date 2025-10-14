Page({
  data: {
    selectedColor: '',
    selectedType: '',
    question: '',
    aiMessage: ''
  },
  selectColor: function(e) {
    const color = e.currentTarget.dataset.color;
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedColor: color,
      selectedType: type,
      aiMessage: `您选择了${type}，请输入您的问题，我会为您解答。`
    });
  },
  inputQuestion: function(e) {
    this.setData({
      question: e.detail.value
    });
  },
  sendQuestion: function() {
    if (!this.data.question) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none'
      });
      return;
    }
    // 模拟AI回复（实际需调用后端智能对话接口）
    setTimeout(() => {
      this.setData({
        aiMessage: `您的问题是：${this.data.question}\n根据${this.data.selectedType}的情况，建议您...（此处为AI生成的建议内容）`,
        question: ''
      });
    }, 1000);
  }
})