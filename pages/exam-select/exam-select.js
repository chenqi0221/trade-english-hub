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
    examInfo: null
  },

  onLoad(options) {
    const examId = options.id
    console.log('ExamSelect onLoad, id:', examId)
    if (!examId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    const exam = EXAM_DATA.exams.find(item => item.id === examId)
    if (exam) {
      this.setData({ examInfo: exam })
      wx.setNavigationBarTitle({ title: exam.name })
    } else {
      wx.showToast({ title: '未找到考试信息', icon: 'none' })
    }
  },

  navigateToFlashcard() {
    if (!this.data.examInfo) {
      console.log('navigateToFlashcard: examInfo is null')
      return
    }
    const url = `/pages/flashcard/flashcard?examId=${this.data.examInfo.id}`
    console.log('Navigating to:', url)
    wx.navigateTo({
      url,
      fail: (err) => {
        console.error('navigateTo flashcard failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToTyping() {
    if (!this.data.examInfo) {
      console.log('navigateToTyping: examInfo is null')
      return
    }
    const url = `/pages/exam-typing/exam-typing?examId=${this.data.examInfo.id}`
    console.log('Navigating to:', url)
    wx.navigateTo({
      url,
      fail: (err) => {
        console.error('navigateTo typing failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToDictation() {
    if (!this.data.examInfo) {
      console.log('navigateToDictation: examInfo is null')
      return
    }
    const url = `/pages/dictation/dictation?examId=${this.data.examInfo.id}`
    console.log('Navigating to:', url)
    wx.navigateTo({
      url,
      fail: (err) => {
        console.error('navigateTo dictation failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToQuiz() {
    if (!this.data.examInfo) {
      console.log('navigateToQuiz: examInfo is null')
      return
    }
    const url = `/pages/exam-quiz/exam-quiz?examId=${this.data.examInfo.id}`
    console.log('Navigating to:', url)
    wx.navigateTo({
      url,
      fail: (err) => {
        console.error('navigateTo quiz failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  }
})
