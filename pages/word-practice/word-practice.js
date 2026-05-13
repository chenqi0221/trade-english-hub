var wordData = require('../../utils/wordData.js')
var audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    categories: [],
    currentCategory: null,
    words: [],
    currentWordIndex: 0,
    currentWord: null,
    userInput: '',
    isCorrect: null,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    showResult: false,
    practiceMode: 'typing',
    options: [],
    isFinished: false,
    errorWords: [],
    startTime: null,
    studyTime: 0
  },

  onLoad: function(options) {
    var categories = wordData.getCategories()
    this.setData({
      categories: categories,
      startTime: Date.now()
    })
    this.loadErrorWords()
  },

  onUnload: function() {
    this.saveStudyTime()
    audioManager.destroy()
  },

  loadErrorWords: function() {
    var errorWords = wx.getStorageSync('errorWords') || []
    this.setData({ errorWords: errorWords })
  },

  selectCategory: function(e) {
    var id = e.currentTarget.dataset.id
    var words = wordData.getWordsByCategory(id)
    if (words.length === 0) {
      wx.showToast({ title: '该分类暂无单词', icon: 'none' })
      return
    }

    this.setData({
      currentCategory: id,
      words: this.shuffleArray(words.slice()),
      currentWordIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      isFinished: false,
      showResult: false
    })
    this.loadCurrentWord()
  },

  shuffleArray: function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },

  loadCurrentWord: function() {
    var words = this.data.words
    var currentWordIndex = this.data.currentWordIndex
    if (currentWordIndex >= words.length) {
      this.finishPractice()
      return
    }

    var currentWord = words[currentWordIndex]
    var options = this.generateOptions(currentWord)

    this.setData({
      currentWord: currentWord,
      userInput: '',
      isCorrect: null,
      showResult: false,
      options: options,
      practiceMode: Math.random() > 0.5 ? 'typing' : 'choice'
    })
  },

  generateOptions: function(correctWord) {
    var allWords = wordData.getAllWords()
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

  onInput: function(e) {
    var userInput = e.detail.value
    this.setData({ userInput: userInput })

    if (userInput.length >= this.data.currentWord.word.length) {
      this.checkAnswer(userInput)
    }
  },

  selectOption: function(e) {
    var word = e.currentTarget.dataset.word
    this.checkAnswer(word)
  },

  checkAnswer: function(answer) {
    var currentWord = this.data.currentWord
    var streak = this.data.streak
    var bestStreak = this.data.bestStreak
    var isCorrect = answer.toLowerCase().trim() === currentWord.word.toLowerCase()

    var newStreak = isCorrect ? streak + 1 : 0
    var newBestStreak = bestStreak > newStreak ? bestStreak : newStreak

    this.setData({
      isCorrect: isCorrect,
      showResult: true,
      streak: newStreak,
      bestStreak: newBestStreak,
      correctCount: isCorrect ? this.data.correctCount + 1 : this.data.correctCount,
      wrongCount: !isCorrect ? this.data.wrongCount + 1 : this.data.wrongCount
    })

    this.playSound(isCorrect)

    if (!isCorrect) {
      this.addToErrorWords(currentWord)
    }

    var self = this
    setTimeout(function() {
      self.setData({
        currentWordIndex: self.data.currentWordIndex + 1
      })
      self.loadCurrentWord()
    }, 1500)
  },

  playSound: function(isCorrect) {
    audioManager.playYoudao(isCorrect ? 'correct' : 'wrong', {
      onError: function(err) {
        console.error('音效播放失败:', err)
      }
    })
  },

  addToErrorWords: function(word) {
    var errorWords = wx.getStorageSync('errorWords') || []
    var found = false
    for (var i = 0; i < errorWords.length; i++) {
      if (errorWords[i].word === word.word) {
        found = true
        break
      }
    }
    if (!found) {
      var wordCopy = {}
      for (var key in word) {
        wordCopy[key] = word[key]
      }
      wordCopy.errorCount = 1
      wordCopy.lastError = new Date().toISOString()
      errorWords.push(wordCopy)
      wx.setStorageSync('errorWords', errorWords)
      this.setData({ errorWords: errorWords })
    }
  },

  finishPractice: function() {
    var correctCount = this.data.correctCount
    var wrongCount = this.data.wrongCount
    var bestStreak = this.data.bestStreak
    var studyTime = this.data.studyTime
    var total = correctCount + wrongCount
    var accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

    this.setData({
      isFinished: true,
      finalStats: {
        total: total,
        correctCount: correctCount,
        wrongCount: wrongCount,
        accuracy: accuracy,
        bestStreak: bestStreak,
        studyTime: Math.round(studyTime / 60)
      }
    })

    this.updateStudyProgress(correctCount)
  },

  updateStudyProgress: function(learnedWords) {
    var progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 1
    }

    progress.masteredWords += learnedWords
    progress.totalWords = wordData.getAllWords().length
    wx.setStorageSync('studyProgress', progress)
  },

  saveStudyTime: function() {
    var studyTime = Math.round((Date.now() - this.data.startTime) / 1000)
    var progress = wx.getStorageSync('studyProgress') || {}
    progress.todayStudyTime = (progress.todayStudyTime || 0) + Math.round(studyTime / 60)
    wx.setStorageSync('studyProgress', progress)
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
  },

  restartPractice: function() {
    this.setData({
      currentCategory: null,
      currentWordIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      isFinished: false,
      showResult: false
    })
  },

  backToCategories: function() {
    this.setData({
      currentCategory: null,
      isFinished: false
    })
  },

  switchMode: function(e) {
    var mode = e.currentTarget.dataset.mode
    this.setData({ practiceMode: mode })
  }
})
