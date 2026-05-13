var wordData = require('../../utils/wordData.js')
var audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    currentWord: null,
    isRecording: false,
    recordedAudio: null,
    showComparison: false,
    wordList: [],
    currentIndex: 0,
    categories: [],
    selectedCategory: null,
    playbackRate: 1.0,
    showPhonetic: true,
    showMeaning: true,
    commonErrors: []
  },

  onLoad: function() {
    var categories = wordData.getCategories()
    var allWords = wordData.getAllWords()

    var wordsWithErrors = []
    for (var i = 0; i < allWords.length; i++) {
      if (allWords[i].wrongPronunciation && allWords[i].wrongPronunciation.length > 0) {
        wordsWithErrors.push(allWords[i])
      }
    }

    this.setData({
      categories: categories,
      wordList: wordsWithErrors,
      currentWord: wordsWithErrors[0] || allWords[0],
      commonErrors: this.getCommonErrors()
    })
  },

  onUnload: function() {
    audioManager.destroy()
  },

  getCommonErrors: function() {
    var allWords = wordData.getAllWords()
    var result = []
    for (var i = 0; i < allWords.length; i++) {
      if (allWords[i].wrongPronunciation && allWords[i].wrongPronunciation.length > 0) {
        result.push({
          word: allWords[i].word,
          correct: allWords[i].phonetic,
          wrong: allWords[i].wrongPronunciation[0],
          meaning: allWords[i].meaning
        })
      }
    }
    return result.slice(0, 10)
  },

  selectCategory: function(e) {
    var id = e.currentTarget.dataset.id
    var words = wordData.getWordsByCategory(id)

    this.setData({
      selectedCategory: id,
      wordList: words,
      currentIndex: 0,
      currentWord: words[0]
    })
  },

  playCorrectAudio: function() {
    var currentWord = this.data.currentWord
    if (!currentWord || !currentWord.word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    var self = this
    audioManager.playYoudao(currentWord.word, {
      playbackRate: self.data.playbackRate,
      onError: function(err) {
        console.error('发音播放失败:', err)
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  },

  playWrongAudio: function() {
    var currentWord = this.data.currentWord
    if (!currentWord || !currentWord.wrongPronunciation) {
      wx.showToast({ title: '暂无错误发音示例', icon: 'none' })
      return
    }

    var wrongPhonetic = currentWord.wrongPronunciation[0]
    wx.showToast({
      title: '错误发音: ' + wrongPhonetic,
      icon: 'none',
      duration: 2000
    })
  },

  startRecording: function() {
    var recorderManager = wx.getRecorderManager()
    var self = this

    recorderManager.onStart(function() {
      self.setData({ isRecording: true })
    })

    recorderManager.onStop(function(res) {
      self.setData({
        isRecording: false,
        recordedAudio: res.tempFilePath,
        showComparison: true
      })
      self.playRecording()
    })

    recorderManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  stopRecording: function() {
    var recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  playRecording: function() {
    var recordedAudio = this.data.recordedAudio
    if (!recordedAudio) {
      wx.showToast({ title: '暂无录音', icon: 'none' })
      return
    }

    audioManager.playLocal(recordedAudio, {
      onError: function(err) {
        console.error('录音播放失败:', err)
        wx.showToast({ title: '录音播放失败', icon: 'none' })
      }
    })
  },

  nextWord: function() {
    var wordList = this.data.wordList
    var currentIndex = this.data.currentIndex
    var nextIndex = (currentIndex + 1) % wordList.length

    this.setData({
      currentIndex: nextIndex,
      currentWord: wordList[nextIndex],
      showComparison: false,
      recordedAudio: null
    })
  },

  prevWord: function() {
    var wordList = this.data.wordList
    var currentIndex = this.data.currentIndex
    var prevIndex = currentIndex === 0 ? wordList.length - 1 : currentIndex - 1

    this.setData({
      currentIndex: prevIndex,
      currentWord: wordList[prevIndex],
      showComparison: false,
      recordedAudio: null
    })
  },

  changePlaybackRate: function() {
    var rates = [0.5, 0.75, 1.0, 1.25, 1.5]
    var currentIndex = 0
    for (var i = 0; i < rates.length; i++) {
      if (rates[i] === this.data.playbackRate) {
        currentIndex = i
        break
      }
    }
    var nextRate = rates[(currentIndex + 1) % rates.length]

    this.setData({ playbackRate: nextRate })

    wx.showToast({
      title: '播放速度: ' + nextRate + 'x',
      icon: 'none'
    })
  },

  togglePhonetic: function() {
    this.setData({ showPhonetic: !this.data.showPhonetic })
  },

  toggleMeaning: function() {
    this.setData({ showMeaning: !this.data.showMeaning })
  },

  viewWordDetail: function() {
    var currentWord = this.data.currentWord
    if (!currentWord) return
    wx.navigateTo({
      url: '/pages/word-detail/word-detail?word=' + currentWord.word
    })
  }
})
