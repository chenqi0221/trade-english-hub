const app = getApp()

// 内联考试数据，避免require问题
const EXAM_DATA = {
  exams: [
    { id: 'cet4', name: '大学英语四级', icon: '📘', wordCount: 1500, color: '#4A90D9' },
    { id: 'cet6', name: '大学英语六级', icon: '📗', wordCount: 1500, color: '#5CB85C' },
    { id: 'ielts', name: '雅思', icon: '📕', wordCount: 500, color: '#F0AD4E' },
    { id: 'toefl', name: '托福', icon: '📙', wordCount: 1500, color: '#D9534F' },
    { id: 'gre', name: 'GRE', icon: '📓', wordCount: 500, color: '#6F42C1' },
    { id: 'sat', name: 'SAT', icon: '📔', wordCount: 1500, color: '#17A2B8' },
    { id: 'kaoyan', name: '考研英语', icon: '📚', wordCount: 1500, color: '#E83E8C' }
  ]
}

Page({
  data: {
    exams: [],
    studyProgress: {
      totalWords: 0,
      masteredWords: 0
    }
  },

  onLoad() {
    console.log('Exam page onLoad')
    this.setData({
      exams: EXAM_DATA.exams
    })
    console.log('Exams set:', this.data.exams)
    this.loadStudyProgress()
  },

  onShow() {
    console.log('Exam page onShow')
    this.loadStudyProgress()
  },

  loadStudyProgress() {
    const progress = wx.getStorageSync('examStudyProgress') || {}
    let masteredWords = 0
    let totalWords = 0
    
    const exams = this.data.exams || EXAM_DATA.exams
    exams.forEach(exam => {
      const examProgress = progress[exam.id] || { mastered: 0 }
      masteredWords += examProgress.mastered || 0
      totalWords += exam.wordCount
    })
    
    this.setData({
      'studyProgress.totalWords': totalWords,
      'studyProgress.masteredWords': masteredWords
    })
    console.log('Study progress loaded:', this.data.studyProgress)
  },

  navigateToExamSelect(e) {
    const { id } = e.currentTarget.dataset
    console.log('Navigate to exam:', id)
    if (!id) {
      wx.showToast({ title: '考试ID为空', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: `/pages/exam-select/exam-select?id=${id}`,
      fail: (err) => {
        console.error('navigateTo exam-select failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  }
})
