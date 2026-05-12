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
    const exam = EXAM_DATA.exams.find(item => item.id === examId)
    if (exam) {
      this.setData({ examInfo: exam })
      wx.setNavigationBarTitle({ title: exam.name })
    } else {
      wx.showToast({ title: '未找到考试信息', icon: 'none' })
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
