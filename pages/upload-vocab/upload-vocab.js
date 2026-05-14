Page({
  data: {
    exams: [
      { id: 'cet4', name: '四级', file: 'data/cet4.json' },
      { id: 'cet6', name: '六级', file: 'data/cet6.json' },
      { id: 'ielts', name: '雅思', file: 'data/ielts.json' },
      { id: 'toefl', name: '托福', file: 'data2/toefl.json' },
      { id: 'gre', name: 'GRE', file: 'data/gre.json' },
      { id: 'sat', name: 'SAT', file: 'data/sat.json' },
      { id: 'kaoyan', name: '考研', file: 'data2/kaoyan.json' }
    ],
    uploadStatus: {}
  },

  onLoad: function() {
    console.log('上传词库页面加载')
  },

  uploadVocab: function(e) {
    var examId = e.currentTarget.dataset.examId
    var examName = e.currentTarget.dataset.examName
    var self = this

    console.log('开始上传词库:', examId)

    // 更新状态
    var status = this.data.uploadStatus
    status[examId] = '上传中...'
    this.setData({ uploadStatus: status })

    // 读取本地 JSON 文件
    var fs = wx.getFileSystemManager()
    var filePath = ''

    // 找到对应的文件路径
    for (var i = 0; i < this.data.exams.length; i++) {
      if (this.data.exams[i].id === examId) {
        filePath = this.data.exams[i].file
        break
      }
    }

    if (!filePath) {
      console.error('未找到文件路径:', examId)
      status[examId] = '失败: 未找到文件'
      this.setData({ uploadStatus: status })
      return
    }

    console.log('读取文件:', filePath)

    try {
      // 读取文件内容
      var content = fs.readFileSync(filePath, 'utf8')
      console.log('文件读取成功，长度:', content.length)

      // 验证 JSON
      var data = JSON.parse(content)
      console.log('JSON 验证成功，数量:', data.length)

      // 上传到云存储
      var cloudPath = 'vocab/' + examId + '.json'
      console.log('上传到云存储:', cloudPath)

      // 先将内容写入临时文件
      var tempFilePath = wx.env.USER_DATA_PATH + '/' + examId + '.json'
      fs.writeFileSync(tempFilePath, content, 'utf8')
      console.log('临时文件写入成功:', tempFilePath)

      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: tempFilePath,
        success: function(res) {
          console.log('上传成功:', res.fileID)
          status[examId] = '上传成功'
          self.setData({ uploadStatus: status })
          wx.showToast({ title: examName + '上传成功', icon: 'success' })
        },
        fail: function(err) {
          console.error('上传失败:', err)
          status[examId] = '失败: ' + err.message
          self.setData({ uploadStatus: status })
          wx.showToast({ title: '上传失败', icon: 'none' })
        }
      })
    } catch (e) {
      console.error('读取或上传失败:', e)
      status[examId] = '失败: ' + e.message
      this.setData({ uploadStatus: status })
      wx.showToast({ title: '读取失败', icon: 'none' })
    }
  },

  uploadAll: function() {
    var self = this
    var exams = this.data.exams

    wx.showModal({
      title: '批量上传',
      content: '将上传所有词库到云存储，是否继续？',
      success: function(res) {
        if (res.confirm) {
          self.uploadNext(0)
        }
      }
    })
  },

  uploadNext: function(index) {
    var self = this
    var exams = this.data.exams

    if (index >= exams.length) {
      wx.showToast({ title: '全部上传完成', icon: 'success' })
      return
    }

    var exam = exams[index]
    console.log('批量上传第', index + 1, '个:', exam.id)

    // 模拟点击上传
    var e = {
      currentTarget: {
        dataset: {
          examId: exam.id,
          examName: exam.name
        }
      }
    }

    this.uploadVocab(e)

    // 延迟上传下一个
    setTimeout(function() {
      self.uploadNext(index + 1)
    }, 2000)
  }
})
