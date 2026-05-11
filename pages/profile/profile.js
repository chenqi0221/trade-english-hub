Page({
  data: {
    userInfo: null,
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    },
    menuItems: [
      {
        id: 'error-book',
        name: '错题本',
        icon: '⚠️',
        page: '/pages/error-book/error-book'
      },
      {
        id: 'favorites',
        name: '收藏夹',
        icon: '⭐',
        page: '/pages/favorites/favorites'
      },
      {
        id: 'settings',
        name: '设置',
        icon: '⚙️',
        action: 'showSettings'
      },
      {
        id: 'about',
        name: '关于',
        icon: 'ℹ️',
        action: 'showAbout'
      }
    ],
    showSettings: false,
    showAbout: false
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStudyProgress()
  },

  onShow() {
    this.loadStudyProgress()
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  // 加载学习进度
  loadStudyProgress() {
    const progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    }
    this.setData({ studyProgress: progress })
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })
      }
    })
  },

  // 菜单点击
  onMenuTap(e) {
    const { item } = e.currentTarget.dataset
    
    if (item.page) {
      wx.navigateTo({ url: item.page })
    } else if (item.action) {
      this[item.action]()
    }
  },

  // 显示设置
  showSettings() {
    this.setData({ showSettings: true })
  },

  // 隐藏设置
  hideSettings() {
    this.setData({ showSettings: false })
  },

  // 显示关于
  showAbout() {
    this.setData({ showAbout: true })
  },

  // 隐藏关于
  hideAbout() {
    this.setData({ showAbout: false })
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有学习数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          this.setData({
            userInfo: null,
            studyProgress: {
              totalWords: 0,
              masteredWords: 0,
              todayStudyTime: 0,
              streakDays: 0
            }
          })
          wx.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '外贸英语通 - 专为外贸人打造的英语学习工具',
      path: '/pages/index/index'
    }
  }
})
