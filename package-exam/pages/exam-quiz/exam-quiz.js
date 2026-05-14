var vocabLoader = require('../../../utils/vocabLoader.js')
var audioManager = require('../../../utils/audioManager.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    currentWord: null,
    options: [],
    selectedOption: null,
    isCorrect: false,
    correctCount: 0,
    wrongCount: 0,
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
        currentIndex: 0
      })
      self.loadQuestion()
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

  loadQuestion: function() {
    var words = this.data.words
    var currentIndex = this.data.currentIndex
    if (currentIndex >= words.length) {
      this.finishQuiz()
      return
    }

    var currentWord = words[currentIndex]
    var options = this.generateOptions(currentWord, words)

    this.setData({
      currentWord: currentWord,
      options: options,
      selectedOption: null,
      isCorrect: false
    })
  },

  generateOptions: function(correctWord, allWords) {
    var wrongOptions = []
    for (var i = 0; i < allWords.length; i++) {
      if (allWords[i].word !== correctWord.word) {
        wrongOptions.push(allWords[i])
      }
    }
    wrongOptions = this.shuffleArray(wrongOptions).slice(0, 3)

    var options = wrongOptions.concat([correctWord])
    options = this.shuffleArray(options)

    var result = []
    for (var k = 0; k < options.length; k++) {
      result.push({
        word: options[k].word,
        meaning: options[k].meaning,
        isCorrect: options[k].word === correctWord.word
      })
    }

    return result
  },

  selectOption: function(e) {
    var index = e.currentTarget.dataset.index
    var option = this.data.options[index]

    if (this.data.selectedOption !== null) return

    var isCorrect = option.isCorrect
    this.setData({
      selectedOption: index,
      isCorrect: isCorrect,
      correctCount: isCorrect ? this.data.correctCount + 1 : this.data.correctCount,
      wrongCount: !isCorrect ? this.data.wrongCount + 1 : this.data.wrongCount
    })

    var self = this
    setTimeout(function() {
      self.setData({
        currentIndex: self.data.currentIndex + 1
      })
      self.loadQuestion()
    }, 1000)
  },

  finishQuiz: function() {
    var correctCount = this.data.correctCount
    var wrongCount = this.data.wrongCount
    var total = correctCount + wrongCount
    var accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

    this.setData({
      isFinished: true,
      showResult: true,
      finalResult: {
        total: total,
        correctCount: correctCount,
        wrongCount: wrongCount,
        accuracy: accuracy
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

  restartQuiz: function() {
    this.setData({
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      isFinished: false,
      showResult: false,
      selectedOption: null,
      isCorrect: false
    })
    this.loadWords(this.data.examId)
  },

  backToSelect: function() {
    wx.navigateBack()
  }
})
