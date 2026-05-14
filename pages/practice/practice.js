Page({
  data: {
    practiceItems: [
      {
        id: 'ai-chat',
        name: 'AI口语课',
        icon: '🤖',
        desc: '与AI进行英语对话练习',
        color: '#52C41A',
        page: '/package-practice/pages/ai-chat/ai-chat'
      },
      {
        id: 'scene',
        name: '场景演练',
        icon: '🎭',
        desc: '8大外贸场景模拟对话',
        color: '#722ED1',
        page: '/package-practice/pages/scene-practice/scene-practice'
      }
    ],
    recentPractice: []
  },

  onLoad: function() {
    this.loadRecentPractice()
  },

  onShow: function() {
    this.loadRecentPractice()
  },

  loadRecentPractice: function() {
    var recent = wx.getStorageSync('recentPractice') || []
    this.setData({ recentPractice: recent.slice(0, 5) })
  },

  // 跳转到练习页面
  navigateToPractice: function(e) {
    var page = e.currentTarget.dataset.page
    var name = e.currentTarget.dataset.name
    
    // 记录练习历史
    this.addToRecentPractice(name)
    
    wx.navigateTo({ url: page })
  },

  // 添加到最近练习
  addToRecentPractice: function(name) {
    var recent = wx.getStorageSync('recentPractice') || []
    
    // 移除重复项
    var filtered = []
    for (var i = 0; i < recent.length; i++) {
      if (recent[i].name !== name) {
        filtered.push(recent[i])
      }
    }
    recent = filtered
    
    // 添加到开头
    recent.unshift({
      name: name,
      time: new Date().toLocaleString()
    })
    
    // 只保留最近10条
    recent = recent.slice(0, 10)
    
    wx.setStorageSync('recentPractice', recent)
  }
})
