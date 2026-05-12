App({
  globalData: {
    userInfo: null,
    studyProgress: {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 0
    }
  },

  onLaunch() {
    console.log('外贸英语通 启动')
    // 暂时禁用云开发初始化，避免超时
    // this.initCloud()
    this.loadStudyProgress()
  },

  initCloud() {
    try {
      wx.cloud.init({
        env: 'your-cloud-env-id',
        traceUser: true
      })
    } catch (e) {
      console.error('Cloud init failed:', e)
    }
  },

  loadStudyProgress() {
    const progress = wx.getStorageSync('studyProgress')
    if (progress) {
      this.globalData.studyProgress = progress
    }
  },

  saveStudyProgress(progress) {
    this.globalData.studyProgress = { ...this.globalData.studyProgress, ...progress }
    wx.setStorageSync('studyProgress', this.globalData.studyProgress)
  }
})
