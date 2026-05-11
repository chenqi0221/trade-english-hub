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
    this.initCloud()
    this.loadStudyProgress()
  },

  initCloud() {
    wx.cloud.init({
      env: 'your-cloud-env-id',
      traceUser: true
    })
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
