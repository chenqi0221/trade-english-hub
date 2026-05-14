var app = getApp()

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
    exams: [],
    studyProgress: {
      totalWords: 0,
      masteredWords: 0
    }
  },

  onLoad: function() {
    console.log('Exam page onLoad')
    this.setData({
      exams: EXAM_DATA.exams
    })
    console.log('Exams set:', this.data.exams)
    this.loadStudyProgress()
  },

  onShow: function() {
    console.log('Exam page onShow')
    this.loadStudyProgress()
  },

  loadStudyProgress: function() {
    try {
      var progress = wx.getStorageSync('studyProgress') || {}
      
      // 统一读取 masteredWords
      var masteredWords = 0
      
      if (typeof progress.masteredWords === 'number') {
        // 新格式
        masteredWords = progress.masteredWords
      } else {
        // 旧格式或空数据
        // 尝试从各个考试汇总
        for (var key in progress) {
          if (progress[key] && typeof progress[key].mastered === 'number') {
            masteredWords += progress[key].mastered
          }
        }
      }
      
      // 计算总单词数
      var totalWords = 0
      var exams = this.data.exams || EXAM_DATA.exams
      for (var i = 0; i < exams.length; i++) {
        totalWords += exams[i].wordCount
      }
      
      this.setData({
        'studyProgress.totalWords': totalWords,
        'studyProgress.masteredWords': masteredWords
      })
      
      console.log('Study progress loaded:', this.data.studyProgress)
    } catch (err) {
      console.error('加载学习进度失败:', err)
    }
  },

  navigateToExamSelect: function(e) {
    var id = e.currentTarget.dataset.id
    console.log('Navigate to exam:', id)
    if (!id) {
      wx.showToast({ title: '考试ID为空', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: '/package-exam/pages/exam-select/exam-select?id=' + id,
      fail: function(err) {
        console.error('navigateTo exam-select failed:', err)
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  }
})
