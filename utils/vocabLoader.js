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
      if (callback) callback(null, this.cache[examId])
      return
    }

    // 微信小程序中读取项目内文件的正确路径
    // 使用 wx.env.USER_DATA_PATH 作为基础路径
    const filePath = `data/${examId}.json`

    console.log('Loading vocab:', filePath)

    // 使用文件系统管理器读取本地JSON文件
    fsm.readFile({
      filePath: filePath,
      encoding: 'utf8',
      success: (res) => {
        console.log('File read success, length:', res.data.length)
        // 使用 setTimeout 避免 JSON.parse 阻塞主线程
        setTimeout(() => {
          try {
            const data = JSON.parse(res.data)
            this.cache[examId] = data
            console.log('Vocab parsed, count:', data.length)
            if (callback) callback(null, data)
          } catch (e) {
            console.error('JSON parse error:', e)
            if (callback) callback(e, null)
          }
        }, 0)
      },
      fail: (err) => {
        console.error('Read file failed:', err)
        if (callback) callback(err, null)
      }
    })
  }
}

module.exports = vocabLoader
