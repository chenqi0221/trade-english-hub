const wordData = require('../../utils/wordData.js')

Page({
  data: {
    word: null,
    isFavorite: false
  },

  onLoad(options) {
    const { word } = options
    if (word) {
      this.loadWordDetail(word)
      this.checkFavorite(word)
    }
  },

  // 加载单词详情
  loadWordDetail(wordText) {
    const words = wordData.getAllWords()
    const word = words.find(w => w.word.toLowerCase() === wordText.toLowerCase())
    
    if (word) {
      this.setData({ word })
    } else {
      wx.showToast({ title: '单词未找到', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  // 检查是否收藏
  checkFavorite(wordText) {
    const favorites = wx.getStorageSync('favorites') || []
    const isFavorite = favorites.some(f => f.word === wordText)
    this.setData({ isFavorite })
  },

  // 播放发音
  playAudio() {
    const { word } = this.data
    if (!word) return

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.word)}&type=2`
    innerAudioContext.play()
  },

  // 切换收藏
  toggleFavorite() {
    const { word, isFavorite } = this.data
    let favorites = wx.getStorageSync('favorites') || []

    if (isFavorite) {
      favorites = favorites.filter(f => f.word !== word.word)
      wx.showToast({ title: '已取消收藏', icon: 'success' })
    } else {
      favorites.push(word)
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    wx.setStorageSync('favorites', favorites)
    this.setData({ isFavorite: !isFavorite })
  },

  // 添加到错题本
  addToErrorBook() {
    const { word } = this.data
    let errorWords = wx.getStorageSync('errorWords') || []
    
    if (!errorWords.find(w => w.word === word.word)) {
      errorWords.push({
        ...word,
        errorCount: 1,
        lastError: new Date().toISOString()
      })
      wx.setStorageSync('errorWords', errorWords)
      wx.showToast({ title: '已添加到错题本', icon: 'success' })
    } else {
      wx.showToast({ title: '已在错题本中', icon: 'none' })
    }
  }
})
