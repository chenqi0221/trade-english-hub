var vocabLoader = require('../../../utils/vocabLoader.js')
var audioManager = require('../../../utils/audioManager.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    currentWord: null,
    userInput: '',
    isCorrect: false,
    isWrong: false,
    correctCount: 0,
    progress: 0,
    showAnswer: false,
    isPlaying: false,
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
        return
      }
      var words = self.shuffleArray(data.slice(0, 30))
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

  playWord: function() {
    var currentWord = this.data.currentWord
    if (!currentWord || !currentWord.word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    if (this.data.isPlaying) {
      audioManager.stop()
      this.setData({ isPlaying: false })
      return
    }

    this.setData({ isPlaying: true })

    var self = this
    var success = audioManager.playYoudao(currentWord.word, {
      onEnded: function() {
        self.setData({ isPlaying: false })
      },
      onError: function(err) {
        self.setData({ isPlaying: false })
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })

    if (!success) {
      this.setData({ isPlaying: false })
    }
  },

  onInput: function(e) {
    this.setData({ userInput: e.detail.value })
  },

  checkAnswer: function() {
    var userInput = this.data.userInput
    var currentWord = this.data.currentWord
    if (!currentWord) return

    if (!userInput.trim()) {
      wx.showToast({ title: '请输入单词', icon: 'none' })
      return
    }

    var isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase()

    if (isCorrect) {
      this.setData({
        isCorrect: true,
        isWrong: false,
        correctCount: this.data.correctCount + 1
      })
      var self = this
      setTimeout(function() {
        self.nextWord()
      }, 800)
    } else {
      this.setData({
        isCorrect: false,
        isWrong: true,
        showAnswer: true
      })
    }
  },

  nextWord: function() {
    var currentIndex = this.data.currentIndex
    var words = this.data.words
    if (currentIndex < words.length - 1) {
      var nextIndex = currentIndex + 1
      this.setData({
        currentIndex: nextIndex,
        currentWord: words[nextIndex],
        userInput: '',
        isCorrect: false,
        isWrong: false,
        showAnswer: false,
        progress: Math.round(((nextIndex) / words.length) * 100)
      })
    } else {
      wx.showModal({
        title: '听写完成',
        content: '正确: ' + this.data.correctCount + '/' + words.length,
        showCancel: false,
        success: function() {
          wx.navigateBack()
        }
      })
    }
  },

  skipWord: function() {
    this.nextWord()
  }
})
