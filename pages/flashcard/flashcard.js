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
    isLoading: true,
    totalStudied: 0
  },

  onLoad: function(options) {
    var examId = options.examId || 'cet4'
    wx.setNavigationBarTitle({ title: this.getExamName(examId) })
    this.setData({ examId: examId })
    this.loadWords(examId)
  },

  onUnload: function() {
    audioManager.destroy()
  },

  getExamName: function(examId) {
    var map = { cet4: '四级', cet6: '六级', ielts: '雅思', toefl: '托福', gre: 'GRE', sat: 'SAT', kaoyan: '考研' }
    return map[examId] || examId
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

      var storageKey = 'flashcard_progress_' + examId
      var studied = wx.getStorageSync(storageKey) || []
      var studiedSet = {}

      for (var i = 0; i < studied.length; i++) {
        studiedSet[studied[i]] = true
      }

      var unstudied = []
      for (var j = 0; j < data.length; j++) {
        var wordText = (data[j].word || '').toLowerCase()
        if (!studiedSet[wordText]) {
          unstudied.push(data[j])
        }
      }

      self.setData({ totalStudied: studied.length })

      if (unstudied.length === 0) {
        wx.showModal({
          title: '全部学完',
          content: '已学完' + data.length + '个单词，是否重新开始？',
          confirmText: '重新开始',
          cancelText: '返回',
          success: function(res) {
            if (res.confirm) {
              wx.removeStorageSync(storageKey)
              self.setData({ totalStudied: 0 })
              self.loadWords(examId)
            } else {
              wx.navigateBack()
            }
          }
        })
        return
      }

      var batchSize = Math.min(50, unstudied.length)
      var words = self.shuffleArray(unstudied.slice(0, batchSize))

      self.setData({
        words: words,
        currentWord: words[0],
        progress: 0,
        knowCount: 0,
        unknownCount: 0
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
    var totalStudied = this.data.totalStudied
    var nowTotal = totalStudied + this.data.words.length

    this.saveStudiedWords(examId)
    this.saveStudyProgress(knowCount)

    wx.showModal({
      title: '本组完成',
      content: '本组认识: ' + knowCount + '个  不认识: ' + unknownCount + '个\n累计已学: ' + nowTotal + '个',
      showCancel: false,
      success: function() {
        wx.navigateBack()
      }
    })
  },

  saveStudiedWords: function(examId) {
    var storageKey = 'flashcard_progress_' + examId
    var studied = wx.getStorageSync(storageKey) || []
    var words = this.data.words

    for (var i = 0; i < words.length; i++) {
      var wordText = (words[i].word || '').toLowerCase()
      if (wordText && studied.indexOf(wordText) < 0) {
        studied.push(wordText)
      }
    }

    wx.setStorageSync(storageKey, studied)
  },

  saveStudyProgress: function(learnedCount) {
    var examId = this.data.examId
    if (!examId || learnedCount <= 0) return

    try {
      var progress = wx.getStorageSync('studyProgress') || {}

      if (progress.cet4 || progress.cet6) {
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

      progress.masteredWords = (progress.masteredWords || 0) + learnedCount

      var today = new Date().toDateString()
      var lastDate = progress.lastStudyDate

      if (lastDate === today) {
      } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
        progress.streakDays = (progress.streakDays || 1) + 1
      } else {
        progress.streakDays = 1
      }

      progress.lastStudyDate = today
      progress.todayStudyTime = (progress.todayStudyTime || 0) + 5

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
