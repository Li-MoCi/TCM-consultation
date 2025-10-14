// index.js
Page({
  data: {
    // 图片相关
    imageUrl: '',
    imageId: '',
    
    // 表单数据
    name: '',
    age: '',
    genderIndex: null,
    phone: '',
    
    // 分析结果
    analysisResult: false,
    resultType: '',
    resultDesc: '',
    resultColor: '#4CAF50',
    analysisTime: '',
    confidence: '85',
    
    // 加载状态
    loading: false
  },

  onLoad: function() {
    // 初始化页面数据
    this.setData({
      analysisTime: this.getCurrentTime()
    });
  },

  // 选择图片
  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        const imageId = 'IMG_' + new Date().getTime();
        
        that.setData({
          imageUrl: tempFilePaths[0],
          imageId: imageId
        });
        
        // 模拟上传到服务器
        that.uploadImage(tempFilePaths[0], imageId);
      },
      fail: function(err) {
        console.log('选择图片失败', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 上传图片到服务器（模拟）
  uploadImage: function(filePath, imageId) {
    const that = this;
    that.setData({ loading: true });
    
    // 显示上传进度
    wx.showLoading({
      title: '上传中...',
    });
    
    // 模拟上传延迟
    setTimeout(function() {
      wx.hideLoading();
      that.setData({ loading: false });
      
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });
      
      console.log('图片上传成功，ID:', imageId);
    }, 1500);
  },

  // 性别选择变化
  bindGenderChange: function(e) {
    this.setData({
      genderIndex: parseInt(e.detail.value)
    });
  },

  // 开始分析
  startAnalysis: function() {
    const that = this;
    
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    // 显示分析中状态
    that.setData({ loading: true });
    wx.showLoading({
      title: '分析中...',
    });
    
    // 模拟分析过程
    setTimeout(function() {
      wx.hideLoading();
      that.setData({ loading: false });
      
      // 生成模拟分析结果
      const result = that.generateAnalysisResult();
      
      that.setData({
        analysisResult: true,
        resultType: result.type,
        resultDesc: result.desc,
        resultColor: result.color,
        confidence: result.confidence,
        analysisTime: that.getCurrentTime()
      });
      
      // 滚动到结果区域
      wx.pageScrollTo({
        selector: '.result-section',
        duration: 500
      });
    }, 3000);
  },

  // 表单验证
  validateForm: function() {
    const { name, age, genderIndex, imageUrl } = this.data;
    
    if (!imageUrl) {
      wx.showToast({
        title: '请先上传面部照片',
        icon: 'none'
      });
      return false;
    }
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return false;
    }
    
    if (!age.trim()) {
      wx.showToast({
        title: '请输入年龄',
        icon: 'none'
      });
      return false;
    }
    
    if (genderIndex === null) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  // 生成模拟分析结果
  generateAnalysisResult: function() {
    const results = [
      {
        type: '健康状态良好',
        desc: '面部色泽红润有光泽，皮肤弹性良好，无明显病理性特征。建议继续保持健康的生活习惯，注意均衡饮食和适量运动。',
        color: '#4CAF50',
        confidence: '92'
      },
      {
        type: '轻度亚健康',
        desc: '面部略显苍白，可能存在气血不足的情况。建议增加营养摄入，保证充足睡眠，适当进行有氧运动。',
        color: '#FF9800',
        confidence: '78'
      },
      {
        type: '需关注状态',
        desc: '面部出现轻微浮肿，可能与肾脏代谢或睡眠质量有关。建议减少盐分摄入，保证充足休息，如症状持续请咨询医生。',
        color: '#F44336',
        confidence: '85'
      }
    ];
    
    // 随机选择一个结果（实际应用中这里应该是真实的AI分析结果）
    const randomIndex = Math.floor(Math.random() * results.length);
    return results[randomIndex];
  },

  // 获取当前时间
  getCurrentTime: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 输入框数据绑定
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  bindAgeInput: function(e) {
    this.setData({
      age: e.detail.value
    });
  },

  bindPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 重新分析
  reanalyze: function() {
    this.setData({
      analysisResult: false,
      imageUrl: '',
      imageId: ''
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: 'AI面部健康分析',
      path: '/pages/index/index',
      imageUrl: '/images/share-poster.png'
    };
  }
});