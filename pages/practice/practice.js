Page({
  data: {
    practiceItems: [
      {
        id: 'ai-chat',
        name: 'AI口语课',
        icon: '🤖',
        desc: '与AI进行英语对话练习',
        color: '#52C41A',
        page: '/pages/ai-chat/ai-chat'
      },
      {
        id: 'scene',
        name: '场景演练',
        icon: '🎭',
        desc: '8大外贸场景模拟对话',
        color: '#722ED1',
        page: '/pages/scene-practice/scene-practice'
      }
    ],
    recentPractice: []
  },

  onLoad() {
    this.loadRecentPractice()
  },

  onShow() {
    this.loadRecentPractice()
  },

  loadRecentPractice() {
    const recent = wx.getStorageSync('recentPractice') || []
    this.setData({ recentPractice: recent.slice(0, 5) })
  },

  // 跳转到练习页面
  navigateToPractice(e) {
    const { page, name } = e.currentTarget.dataset
    
    // 记录练习历史
    this.addToRecentPractice(name)
    
    wx.navigateTo({ url: page })
  },

  // 添加到最近练习
  addToRecentPractice(name) {
    let recent = wx.getStorageSync('recentPractice') || []
    
    // 移除重复项
    recent = recent.filter(item => item.name !== name)
    
    // 添加到开头
    recent.unshift({
      name,
      time: new Date().toLocaleString()
    })
    
    // 只保留最近10条
    recent = recent.slice(0, 10)
    
    wx.setStorageSync('recentPractice', recent)
  }
})
