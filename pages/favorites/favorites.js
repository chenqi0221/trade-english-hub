const audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    favorites: [],
    isEmpty: true
  },

  onLoad() {
    this.loadFavorites()
  },

  onShow() {
    this.loadFavorites()
  },

  onUnload() {
    // 页面卸载时停止音频
    audioManager.destroy()
  },

  // 加载收藏夹
  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || []
    this.setData({
      favorites,
      isEmpty: favorites.length === 0
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
    if (!word) {
      wx.showToast({ title: '暂无单词可播放', icon: 'none' })
      return
    }

    audioManager.playYoudao(word, {
      onError: (err) => {
        console.error('发音播放失败:', err)
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  },

  // 取消收藏
  removeFavorite(e) {
    const { word } = e.currentTarget.dataset
    
    wx.showModal({
      title: '确认取消',
      content: `确定取消收藏 "${word}" 吗？`,
      success: (res) => {
        if (res.confirm) {
          let favorites = wx.getStorageSync('favorites') || []
          favorites = favorites.filter(f => f.word !== word)
          wx.setStorageSync('favorites', favorites)
          
          this.setData({
            favorites,
            isEmpty: favorites.length === 0
          })
          
          wx.showToast({ title: '已取消收藏', icon: 'success' })
        }
      }
    })
  },

  // 清空收藏夹
  clearAllFavorites() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有收藏吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('favorites')
          this.setData({
            favorites: [],
            isEmpty: true
          })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})