const vocabData = require('../../utils/vocabData.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    currentWord: null,
    isFlipped: false,
    progress: 0,
    knowCount: 0,
    unknownCount: 0
  },

  onLoad(options) {
    const examId = options.examId || 'cet4'
    this.setData({ examId })
    this.loadWords(examId)
  },

  loadWords(examId) {
    try {
      const data = vocabData[examId] || []
      if (!data.length) {
        wx.showToast({ title: '暂无该词库', icon: 'none' })
        return
      }
      const words = this.shuffleArray(data.slice(0, 50))
      this.setData({
        words,
        currentWord: words[0],
        progress: 0
      })
    } catch (e) {
      wx.showToast({ title: '加载词库失败', icon: 'none' })
      console.error('词库加载失败:', e)
    }
  },

  shuffleArray(arr) {
    const array = [...arr]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  },

  flipCard() {
    this.setData({ isFlipped: !this.data.isFlipped })
  },

  nextWord() {
    const { currentIndex, words } = this.data
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
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

  markKnown() {
    this.setData({ knowCount: this.data.knowCount + 1 })
    this.nextWord()
  },

  markUnknown() {
    this.setData({ unknownCount: this.data.unknownCount + 1 })
    this.nextWord()
  },

  showResult() {
    const { knowCount, unknownCount } = this.data
    wx.showModal({
      title: '学习完成',
      content: `认识: ${knowCount}个  不认识: ${unknownCount}个`,
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  onSwipeLeft() {
    this.markUnknown()
  },

  onSwipeRight() {
    this.markKnown()
  }
})
