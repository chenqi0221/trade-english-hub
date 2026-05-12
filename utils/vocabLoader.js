// 词库加载器
// 使用文件系统读取JSON词库，避免大文件内联导致编译超时

const fsm = wx.getFileSystemManager()

const vocabLoader = {
  // 缓存已加载的词库
  cache: {},

  // 加载指定考试的词库
  load(examId, callback) {
    // 检查缓存
    if (this.cache[examId]) {
      callback && callback(null, this.cache[examId])
      return
    }

    // 微信小程序中读取项目内文件的正确路径
    const filePath = `data/${examId}.json`

    // 使用文件系统管理器读取本地JSON文件
    fsm.readFile({
      filePath: filePath,
      encoding: 'utf8',
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          this.cache[examId] = data
          callback && callback(null, data)
        } catch (e) {
          console.error('JSON parse error:', e)
          callback && callback(e, null)
        }
      },
      fail: (err) => {
        console.error('Read file failed:', err)
        callback && callback(err, null)
      }
    })
  }
}

module.exports = vocabLoader
