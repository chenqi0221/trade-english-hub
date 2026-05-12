const app = getApp()
const indexData = require('../../data/index.json')

Page({
  data: {
    exams: [],
    studyProgress: {
      totalWords: 0,
      masteredWords: 0
    }
  },

  onLoad() {
    this.setData({
      exams: indexData.exams
    })
    this.loadStudyProgress()
  },

  onShow() {
    this.loadStudyProgress()
  },

  loadStudyProgress() {
    const progress = wx.getStorageSync('examStudyProgress') || {}
    let masteredWords = 0
    let totalWords = 0
    
    this.data.exams.forEach(exam => {
      const examProgress = progress[exam.id] || { mastered: 0 }
      masteredWords += examProgress.mastered || 0
      totalWords += exam.wordCount
    })
    
    this.setData({
      'studyProgress.totalWords': totalWords,
      'studyProgress.masteredWords': masteredWords
    })
  },

  navigateToExamSelect(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/exam-select/exam-select?id=${id}`
    })
  }
})
