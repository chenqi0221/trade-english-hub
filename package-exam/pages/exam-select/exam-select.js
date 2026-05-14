// 内联考试数据，避免require问题
var EXAM_DATA = {
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

  onLoad: function(options) {
    var examId = options.id
    console.log('ExamSelect onLoad, id:', examId)
    if (!examId) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    var exam = null
    for (var i = 0; i < EXAM_DATA.exams.length; i++) {
      if (EXAM_DATA.exams[i].id === examId) {
        exam = EXAM_DATA.exams[i]
        break
      }
    }
    if (exam) {
      this.setData({ examInfo: exam })
      wx.setNavigationBarTitle({ title: exam.name })
    } else {
      wx.showToast({ title: '未找到考试信息', icon: 'none' })
    }
  },

  navigateToFlashcard: function() {
    if (!this.data.examInfo) {
      console.log('navigateToFlashcard: examInfo is null')
      return
    }
    var url = '/package-study/pages/flashcard/flashcard?examId=' + this.data.examInfo.id
    console.log('Navigating to:', url)
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error('navigateTo flashcard failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToTyping: function() {
    if (!this.data.examInfo) {
      console.log('navigateToTyping: examInfo is null')
      return
    }
    var url = '/package-exam/pages/exam-typing/exam-typing?examId=' + this.data.examInfo.id
    console.log('Navigating to:', url)
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error('navigateTo typing failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToDictation: function() {
    if (!this.data.examInfo) {
      console.log('navigateToDictation: examInfo is null')
      return
    }
    var url = '/package-study/pages/dictation/dictation?examId=' + this.data.examInfo.id
    console.log('Navigating to:', url)
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error('navigateTo dictation failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  navigateToQuiz: function() {
    if (!this.data.examInfo) {
      console.log('navigateToQuiz: examInfo is null')
      return
    }
    var url = '/package-exam/pages/exam-quiz/exam-quiz?examId=' + this.data.examInfo.id
    console.log('Navigating to:', url)
    wx.navigateTo({
      url: url,
      fail: function(err) {
        console.error('navigateTo quiz failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  }
})
