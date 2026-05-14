var wordData = require('../../../utils/wordData.js')
var audioManager = require('../../../utils/audioManager.js')

Page({
  data: {
    word: null,
    isFavorite: false
  },

  onLoad: function(options) {
    var word = options.word
    if (word) {
      this.loadWordDetail(word)
      this.checkFavorite(word)
    }
  },

  onUnload: function() {
    audioManager.destroy()
  },

  loadWordDetail: function(wordText) {
    var words = wordData.getAllWords()
    var foundWord = null
    for (var i = 0; i < words.length; i++) {
      if (words[i].word.toLowerCase() === wordText.toLowerCase()) {
        foundWord = words[i]
        break
      }
    }

    if (foundWord) {
      this.setData({ word: foundWord })
    } else {
      wx.showToast({ title: '单词未找到', icon: 'none' })
      setTimeout(function() {
        wx.navigateBack()
      }, 1500)
    }
  },

  checkFavorite: function(wordText) {
    var favorites = wx.getStorageSync('favorites') || []
    var isFavorite = false
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].word === wordText) {
        isFavorite = true
        break
      }
    }
    this.setData({ isFavorite: isFavorite })
  },

  playAudio: function() {
    var word = this.data.word
    if (!word || !word.word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    audioManager.playYoudao(word.word, {
      onError: function(err) {
        console.error('发音播放失败:', err)
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  },

  toggleFavorite: function() {
    var word = this.data.word
    var isFavorite = this.data.isFavorite
    var favorites = wx.getStorageSync('favorites') || []

    if (isFavorite) {
      var newFavorites = []
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].word !== word.word) {
          newFavorites.push(favorites[i])
        }
      }
      favorites = newFavorites
      wx.showToast({ title: '已取消收藏', icon: 'success' })
    } else {
      favorites.push(word)
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    wx.setStorageSync('favorites', favorites)
    this.setData({ isFavorite: !isFavorite })
  },

  addToErrorBook: function() {
    var word = this.data.word
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
      wx.showToast({ title: '已添加到错题本', icon: 'success' })
    } else {
      wx.showToast({ title: '已在错题本中', icon: 'none' })
    }
  }
})
