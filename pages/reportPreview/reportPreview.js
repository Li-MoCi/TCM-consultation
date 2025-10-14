Page({
  data: {
    reportTime: '',
    resultColor: '#e1bee7',
    resultType: '白色 - 气血两虚',
    detectTime: '2025年10月14日 18:55:10',
    name: '',
    age: '',
    gender: '',
    confidence: '95.01%'
  },
  onLoad: function() {
    this.setData({
      reportTime: new Date().toLocaleString()
    });
    // 模拟从缓存获取患者信息（实际需结合业务逻辑）
    const patientInfo = wx.getStorageSync('patientInfo') || {};
    this.setData({
      name: patientInfo.name,
      age: patientInfo.age,
      gender: patientInfo.gender
    });
  },
  downloadReport: function() {
    wx.showLoading({
      title: '下载中...'
    });
    // 模拟下载（实际需调用后端报告生成/下载接口）
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '报告下载成功',
        icon: 'success'
      });
    }, 1000);
  }
})