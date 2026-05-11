Page({
  data: {
    errorWords: [],
    isEmpty: true
  },

  onLoad() {
    this.loadErrorWords()
  },

  onShow() {
    this.loadErrorWords()
  },

  // 加载错题本
  loadErrorWords() {
    const errorWords = wx.getStorageSync('errorWords') || []
    this.setData({
      errorWords,
      isEmpty: errorWords.length === 0
    })
  },

  // 查看单词详情
  viewWordDetail(e) {
    const { word } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/word-detail/word-detail?word=${word}`
    })
  },

  // 播放发音
  playAudio(e) {
    const { word } = e.currentTarget.dataset
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`
    innerAudioContext.play()
  },

  // 从错题本移除
  removeFromErrorBook(e) {
    const { word } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认移除',
      content: `确定将 "${word}" 从错题本移除吗？`,
      success: (res) => {
        if (res.confirm) {
          let errorWords = wx.getStorageSync('errorWords') || []
          errorWords = errorWords.filter(w => w.word !== word)
          wx.setStorageSync('errorWords', errorWords)
          
          this.setData({
            errorWords,
            isEmpty: errorWords.length === 0
          })
          
          wx.showToast({ title: '已移除', icon: 'success' })
        }
      }
    })
  },

  // 清空错题本
  clearAllErrors() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有错题吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('errorWords')
          this.setData({
            errorWords: [],
            isEmpty: true
          })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})
