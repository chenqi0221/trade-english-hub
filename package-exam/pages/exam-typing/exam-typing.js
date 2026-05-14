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
    wrongCount: 0,
    timeLeft: 60,
    isPlaying: false,
    timer: null,
    isFinished: false,
    showResult: false,
    isLoading: true
  },

  onLoad: function(options) {
    var examId = options.examId || 'cet4'
    this.setData({ examId: examId })
    this.loadWords(examId)
  },

  onUnload: function() {
    this.stopTimer()
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
      var words = self.shuffleArray(data.slice(0, 20))
      self.setData({
        words: words,
        currentWord: words[0],
        currentIndex: 0
      })
      self.startTimer()
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

  startTimer: function() {
    var self = this
    this.setData({ isPlaying: true })
    this.data.timer = setInterval(function() {
      var timeLeft = self.data.timeLeft
      if (timeLeft <= 1) {
        self.finishExam()
      } else {
        self.setData({ timeLeft: timeLeft - 1 })
      }
    }, 1000)
  },

  stopTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  onInput: function(e) {
    var userInput = e.detail.value
    this.setData({ userInput: userInput })

    if (userInput.length >= this.data.currentWord.word.length) {
      this.checkAnswer()
    }
  },

  checkAnswer: function() {
    var userInput = this.data.userInput
    var currentWord = this.data.currentWord
    if (!currentWord) return

    var isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase()

    if (isCorrect) {
      this.setData({
        isCorrect: true,
        isWrong: false,
        correctCount: this.data.correctCount + 1
      })
    } else {
      this.setData({
        isCorrect: false,
        isWrong: true,
        wrongCount: this.data.wrongCount + 1
      })
    }

    var self = this
    setTimeout(function() {
      self.nextWord()
    }, 500)
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
        isWrong: false
      })
    } else {
      this.finishExam()
    }
  },

  finishExam: function() {
    this.stopTimer()
    var correctCount = this.data.correctCount
    var wrongCount = this.data.wrongCount
    var total = correctCount + wrongCount
    var accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

    this.setData({
      isFinished: true,
      showResult: true,
      isPlaying: false,
      finalResult: {
        total: total,
        correctCount: correctCount,
        wrongCount: wrongCount,
        accuracy: accuracy,
        timeUsed: 60 - this.data.timeLeft
      }
    })
  },

  playWord: function() {
    var currentWord = this.data.currentWord
    if (!currentWord || !currentWord.word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    audioManager.playYoudao(currentWord.word, {
      onError: function(err) {
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  },

  restartExam: function() {
    this.setData({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      timeLeft: 60,
      isFinished: false,
      showResult: false,
      userInput: '',
      isCorrect: false,
      isWrong: false
    })
    this.loadWords(this.data.examId)
  },

  backToSelect: function() {
    wx.navigateBack()
  }
})
