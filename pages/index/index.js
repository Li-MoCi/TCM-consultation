Page({
  data: {
    // 标记各区块是否已触发动画
    animateStatus: {
      whatIs: false,   // 什么是中医望诊
      fiveColors: false, // 五色主病
      history: false,    // 千年传承
      techIntegration: false, // 科技融合
      cta: false         // 行动号召
    }
  },

  onLoad() {
    // 页面加载时初始化
  },

  // 滚动事件监听：检测元素是否进入视口，触发动画
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const windowHeight = wx.getSystemSetting().windowHeight;

    // 检测“什么是中医望诊”区块
    this._checkElement(scrollTop, windowHeight, 'whatIs', '#what-is');
    // 检测“五色主病”区块
    this._checkElement(scrollTop, windowHeight, 'fiveColors', '#five-colors');
    // 检测“千年传承”区块
    this._checkElement(scrollTop, windowHeight, 'history', '#history');
    // 检测“科技融合”区块
    this._checkElement(scrollTop, windowHeight, 'techIntegration', '#tech-integration');
    // 检测“行动号召”区块
    this._checkElement(scrollTop, windowHeight, 'cta', '#cta');
  },

  // 检测元素是否在视口内，触发动画
  _checkElement(scrollTop, windowHeight, statusKey, selector) {
    const query = wx.createSelectorQuery().in(this);
    query.select(selector).boundingClientRect(rect => {
      if (rect && rect.top < windowHeight * 0.8 && !this.data.animateStatus[statusKey]) {
        // 元素进入视口（顶部距离小于窗口80%高度）且未触发过动画
        this.setData({
          [`animateStatus.${statusKey}`]: true
        });
        // 给子元素添加“淡入”动画类
        const childQuery = wx.createSelectorQuery().in(this);
        childQuery.selectAll(`${selector} [data-animate]`).nodes(res => {
          if (res && res.nodes) {
            res.nodes.forEach(node => {
              if (node.nodeType === 1) { // 确保是元素节点
                node.classList.add('animate-fadeIn');
              }
            });
          }
        }).exec();
      }
    }).exec();
  },

  // 返回顶部
  backToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  goto(){
    // wx.navigateTo({ url: 'pages/detect/detect' });
    wx.switchTab({
      url: 'pages/detect/detect',
    })
  }
});