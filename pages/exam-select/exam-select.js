const indexData = require('../../data/index.json')

Page({
  data: {
    examInfo: null
  },

  onLoad(options) {
    const examId = options.id
    const exam = indexData.exams.find(item => item.id === examId)
    if (exam) {
      this.setData({ examInfo: exam })
      wx.setNavigationBarTitle({ title: exam.name })
    }
  },

  navigateToFlashcard() {
    wx.navigateTo({
      url: `/pages/flashcard/flashcard?examId=${this.data.examInfo.id}`
    })
  },

  navigateToTyping() {
    wx.navigateTo({
      url: `/pages/exam-typing/exam-typing?examId=${this.data.examInfo.id}`
    })
  },

  navigateToDictation() {
    wx.navigateTo({
      url: `/pages/dictation/dictation?examId=${this.data.examInfo.id}`
    })
  },

  navigateToQuiz() {
    wx.navigateTo({
      url: `/pages/exam-quiz/exam-quiz?examId=${this.data.examInfo.id}`
    })
  }
})
