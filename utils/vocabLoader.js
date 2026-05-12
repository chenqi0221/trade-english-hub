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

    // 微信小程序中读取项目内文件的路径
    // 尝试多种路径格式
    const paths = [
      `data/${examId}.json`,
      `/data/${examId}.json`,
      `${wx.env.USER_DATA_PATH}/data/${examId}.json`
    ]

    console.log('Loading vocab, trying paths:', paths)
    this.tryReadFile(paths, 0, examId, callback)
  },

  tryReadFile(paths, index, examId, callback) {
    if (index >= paths.length) {
      console.error('All paths failed for exam:', examId)
      if (callback) callback(new Error('无法读取词库文件'), null)
      return
    }

    const filePath = paths[index]
    console.log('Trying path:', filePath)

    fsm.readFile({
      filePath: filePath,
      encoding: 'utf8',
      success: (res) => {
        console.log('File read success from:', filePath, 'length:', res.data.length)
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
        console.error('Read file failed for path:', filePath, err)
        // 尝试下一个路径
        this.tryReadFile(paths, index + 1, examId, callback)
      }
    })
  }
}

module.exports = vocabLoader
