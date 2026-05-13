var vocabLoader = require('../../utils/vocabLoader.js')
var audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    currentWord: null,
    isFlipped: false,
    progress: 0,
    knowCount: 0,
    unknownCount: 0,
    isLoading: true
  },

  onLoad: function(options) {
    var examId = options.examId || 'cet4'
    this.setData({ examId: examId })
    this.loadWords(examId)
  },

  onUnload: function() {
    audioManager.destroy()
  },

  loadWords: function(examId) {
    var self = this
    this.setData({ isLoading: true })
    vocabLoader.load(examId, function(err, data) {
      self.setData({ isLoading: false })
      if (err || !data || !data.length) {
        wx.showToast({ title: '加载词库失败', icon: 'none' })
        console.error('词库加载失败:', err)
        return
      }
      var words = self.shuffleArray(data.slice(0, 50))
      self.setData({
        words: words,
        currentWord: words[0],
        progress: 0
      })
    })
  },

  shuffleArray: function(arr) {
    var array = arr.slice()
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },

  flipCard: function() {
    this.setData({ isFlipped: !this.data.isFlipped })
  },

  nextWord: function() {
    var currentIndex = this.data.currentIndex
    var words = this.data.words
    if (currentIndex < words.length - 1) {
      var nextIndex = currentIndex + 1
      this.setData({
        currentIndex: nextIndex,
        currentWord: words[nextIndex],
        isFlipped: false,
        progress: Math.round(((nextIndex) / words.length) * 100)
      })
    } else {
      this.showResult()
    }
  },

  markKnown: function() {
    this.setData({ knowCount: this.data.knowCount + 1 })
    this.nextWord()
  },

  markUnknown: function() {
    this.setData({ unknownCount: this.data.unknownCount + 1 })
    this.nextWord()
  },

  showResult: function() {
    var knowCount = this.data.knowCount
    var unknownCount = this.data.unknownCount
    var examId = this.data.examId
    
    // 保存学习进度
    this.saveStudyProgress(knowCount)
    
    wx.showModal({
      title: '学习完成',
      content: '认识: ' + knowCount + '个  不认识: ' + unknownCount + '个',
      showCancel: false,
      success: function() {
        wx.navigateBack()
      }
    })
  },

  // 保存学习进度 - 统一格式
  saveStudyProgress: function(learnedCount) {
    var examId = this.data.examId
    if (!examId || learnedCount <= 0) return
    
    try {
      // 读取现有进度
      var progress = wx.getStorageSync('studyProgress') || {}
      
      // 确保是基础格式（不是按考试分类的旧格式）
      if (progress.cet4 || progress.cet6) {
        // 如果是旧格式，转换为新格式
        var totalMastered = 0
        for (var key in progress) {
          if (progress[key] && progress[key].mastered) {
            totalMastered += progress[key].mastered
          }
        }
        progress = {
          masteredWords: totalMastered,
          streakDays: 1,
          todayStudyTime: 0,
          lastStudyDate: ''
        }
      }
      
      // 更新进度
      progress.masteredWords = (progress.masteredWords || 0) + learnedCount
      
      // 更新连续打卡
      var today = new Date().toDateString()
      var lastDate = progress.lastStudyDate
      
      if (lastDate === today) {
        // 今天已经学习过，不增加连续天数
      } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
        // 昨天学习过，连续天数+1
        progress.streakDays = (progress.streakDays || 1) + 1
      } else {
        // 断签了，重新计算
        progress.streakDays = 1
      }
      
      progress.lastStudyDate = today
      progress.todayStudyTime = (progress.todayStudyTime || 0) + 5 // 假设学习5分钟
      
      wx.setStorageSync('studyProgress', progress)
      
      console.log('学习进度已保存:', progress)
    } catch (err) {
      console.error('保存学习进度失败:', err)
    }
  },

  onSwipeLeft: function() {
    this.markUnknown()
  },

  onSwipeRight: function() {
    this.markKnown()
  },

  playWordAudio: function() {
    var currentWord = this.data.currentWord
    if (!currentWord || !currentWord.word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    audioManager.playYoudao(currentWord.word, {
      onError: function(err) {
        console.error('单词发音播放失败:', err)
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  }
})
