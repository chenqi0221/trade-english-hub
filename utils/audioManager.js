/**
 * 音频管理器 - 单词走有道TTS，长句走火山引擎云函数
 */

function AudioManager() {
  this.innerAudioContext = null
  this.isPlaying = false
  this.currentSrc = ''
  this.callbacks = { onEnded: null, onError: null, onPlay: null }
}

AudioManager.instance = null
AudioManager.getInstance = function () {
  if (!AudioManager.instance) AudioManager.instance = new AudioManager()
  return AudioManager.instance
}

AudioManager.prototype.stop = function () {
  if (this.innerAudioContext) {
    try { this.innerAudioContext.stop() } catch (e) { }
  }
  this.isPlaying = false
}

AudioManager.prototype.destroy = function () {
  if (this.innerAudioContext) {
    try { this.innerAudioContext.destroy() } catch (e) { }
    this.innerAudioContext = null
  }
  this.isPlaying = false
  this.currentSrc = ''
  this.callbacks = { onEnded: null, onError: null, onPlay: null }
}

AudioManager.prototype._play = function (src, opts) {
  opts = opts || {}
  this.destroy()
  this.currentSrc = src

  var self = this
  this.callbacks = {
    onEnded: opts.onEnded || null,
    onError: opts.onError || null,
    onPlay: opts.onPlay || null
  }

  try {
    this.innerAudioContext = wx.createInnerAudioContext()

    this.innerAudioContext.onPlay(function () {
      self.isPlaying = true
      if (self.callbacks.onPlay) self.callbacks.onPlay()
    })

    this.innerAudioContext.onEnded(function () {
      self.isPlaying = false
      if (self.callbacks.onEnded) self.callbacks.onEnded()
      self.destroy()
    })

    this.innerAudioContext.onError(function (err) {
      console.error('Audio error:', err)
      self.isPlaying = false
      if (self.callbacks.onError) self.callbacks.onError(err)
      self.destroy()
    })

    this.innerAudioContext.onStop(function () { self.isPlaying = false })

    if (opts.playbackRate) this.innerAudioContext.playbackRate = opts.playbackRate

    this.innerAudioContext.src = src
    this.innerAudioContext.play()
    return true
  } catch (err) {
    console.error('Play failed:', err)
    this.isPlaying = false
    if (this.callbacks.onError) this.callbacks.onError(err)
    return false
  }
}

/**
 * 有道词典 TTS - 单词发音
 */
AudioManager.prototype.playYoudao = function (text, opts) {
  if (!text) return false
  var src = 'https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(text.trim()) + '&type=0'
  return this._play(src, opts)
}

/**
 * 火山引擎云函数 TTS - 长句朗读
 */
AudioManager.prototype.playVolcanoTTS = function (text, opts) {
  opts = opts || {}
  if (!text) return false

  var self = this

  wx.cloud.callFunction({
    name: 'tts',
    data: { text: text.trim() },
    success: function (res) {
      if (res.result && res.result.code === 0 && res.result.data && res.result.data.fileID) {
        var fileID = res.result.data.fileID
        wx.cloud.downloadFile({
          fileID: fileID,
          success: function (downloadRes) {
            self._play(downloadRes.tempFilePath, opts)
          },
          fail: function (err) {
            console.error('Cloud download failed:', err)
            if (opts.onError) opts.onError(err)
          }
        })
      } else {
        console.error('Cloud TTS failed:', res.result)
        if (opts.onError) opts.onError(res.result)
      }
    },
    fail: function (err) {
      console.error('Cloud function call failed:', err)
      if (opts.onError) opts.onError(err)
    }
  })
  return true
}

/**
 * 判断是否为长句（词数 > 2）
 */
function isLongSentence(text) {
  return text.trim().split(/\s+/).length > 2
}

/**
 * TTS 播放 - 单词走有道，长句走火山引擎
 */
AudioManager.prototype.playTTS = function (text, opts) {
  opts = opts || {}
  if (!text) return false

  var trimmed = text.trim()

  if (isLongSentence(trimmed)) {
    return this.playVolcanoTTS(trimmed, opts)
  } else {
    return this.playYoudao(trimmed, opts)
  }
}

AudioManager.prototype.playLocal = function (src, opts) {
  if (!src) return false
  return this._play(src, opts)
}

AudioManager.prototype.getStatus = function () {
  return { isPlaying: this.isPlaying, currentSrc: this.currentSrc }
}

/**
 * 云端TTS测试 - 控制台调用: getApp().testCloudTTS()
 */
AudioManager.prototype.testCloudTTS = function (text) {
  var testText = text || 'Hello, thank you for your inquiry about our products.'
  console.log('========== 云端TTS测试开始 ==========')
  console.log('测试文本:', testText)
  console.log('步骤1: 调用云函数 tts...')

  var self = this
  wx.cloud.callFunction({
    name: 'tts',
    data: { text: testText },
    success: function (res) {
      console.log('步骤2: 云函数返回:', JSON.stringify(res.result))
      if (res.result && res.result.code === 0) {
        console.log('  ✅ 云函数调用成功')
        console.log('  fileID:', res.result.data.fileID)
        console.log('步骤3: 下载音频文件...')

        wx.cloud.downloadFile({
          fileID: res.result.data.fileID,
          success: function (downloadRes) {
            console.log('  ✅ 下载成功, tempFilePath:', downloadRes.tempFilePath)
            console.log('步骤4: 播放音频...')
            console.log('========== 测试通过，正在播放 ==========')
            self._play(downloadRes.tempFilePath, {})
          },
          fail: function (err) {
            console.error('  ❌ 下载失败:', err)
            console.log('========== 测试失败 ==========')
          }
        })
      } else {
        console.error('  ❌ 云函数返回错误:', res.result)
        console.log('========== 测试失败 ==========')
      }
    },
    fail: function (err) {
      console.error('  ❌ 云函数调用失败:', err)
      console.log('========== 测试失败（云函数可能未部署）==========')
    }
  })
}

module.exports = AudioManager.getInstance()