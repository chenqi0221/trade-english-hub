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

  onLaunch: function() {
    console.log('外贸英语通 启动')
    this.loadStudyProgress()
  },

  loadStudyProgress: function() {
    var progress = wx.getStorageSync('studyProgress')
    if (progress) {
      this.globalData.studyProgress = progress
    }
  },

  saveStudyProgress: function(progress) {
    this.globalData.studyProgress = progress
    wx.setStorageSync('studyProgress', progress)
  }
})