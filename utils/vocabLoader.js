
// 词库加载器 - 使用wx.request加载本地JSON
const vocabLoader = {
  cache: {},

  load(examId, callback) {
    if (this.cache[examId]) {
      callback && callback(null, this.cache[examId])
      return
    }

    wx.request({
      url: '/data/' + examId + '.json',
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          this.cache[examId] = data
          callback && callback(null, data)
        } else {
          callback && callback(new Error('加载失败: ' + res.statusCode), null)
        }
      },
      fail: (err) => {
        console.error('词库加载失败:', err)
        callback && callback(err, null)
      }
    })
  }
}

module.exports = vocabLoader
