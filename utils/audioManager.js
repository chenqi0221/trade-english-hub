/**
 * 统一音频管理器
 * 单例模式，管理所有音频播放，防止内存泄漏
 * 简化版 - 移除启动时的复杂计算，避免超时
 */

function AudioManager() {
  this.innerAudioContext = null
  this.isPlaying = false
  this.currentSrc = ''
  this.playCallbacks = {
    onEnded: null,
    onError: null,
    onPlay: null
  }
}

AudioManager.instance = null

AudioManager.getInstance = function() {
  if (!AudioManager.instance) {
    AudioManager.instance = new AudioManager()
  }
  return AudioManager.instance
}

AudioManager.prototype.stop = function() {
  if (this.innerAudioContext) {
    try {
      this.innerAudioContext.stop()
    } catch (e) {
      console.log('Audio stop error:', e)
    }
  }
  this.isPlaying = false
  this.currentSrc = ''
}

AudioManager.prototype.destroy = function() {
  if (this.innerAudioContext) {
    try {
      this.innerAudioContext.stop()
      this.innerAudioContext.destroy()
    } catch (e) {
      console.log('Audio destroy error:', e)
    }
    this.innerAudioContext = null
  }
  this.isPlaying = false
  this.currentSrc = ''
  this.playCallbacks = {
    onEnded: null,
    onError: null,
    onPlay: null
  }
}

/**
 * 简单版有道 TTS - 直接使用有道词典的免费接口
 */
AudioManager.prototype.playYoudao = function(text, options) {
  options = options || {}

  if (!text || typeof text !== 'string') {
    console.error('AudioManager.playYoudao: text is required')
    if (options.onError) options.onError({ errMsg: '文本不能为空' })
    return false
  }

  this.destroy()

  var encodedText = encodeURIComponent(text.trim())
  var src = 'https://dict.youdao.com/dictvoice?audio=' + encodedText + '&type=2'

  this.currentSrc = src
  this.playCallbacks = {
    onEnded: options.onEnded || null,
    onError: options.onError || null,
    onPlay: options.onPlay || null
  }

  var self = this

  try {
    this.innerAudioContext = wx.createInnerAudioContext()

    if (options.playbackRate) {
      this.innerAudioContext.playbackRate = options.playbackRate
    }

    this.innerAudioContext.onPlay(function() {
      self.isPlaying = true
      if (self.playCallbacks.onPlay) {
        self.playCallbacks.onPlay()
      }
    })

    this.innerAudioContext.onEnded(function() {
      self.isPlaying = false
      if (self.playCallbacks.onEnded) {
        self.playCallbacks.onEnded()
      }
      self.destroy()
    })

    this.innerAudioContext.onError(function(err) {
      console.error('Audio play error:', err)
      self.isPlaying = false
      if (self.playCallbacks.onError) {
        self.playCallbacks.onError(err)
      }
      self.destroy()
    })

    this.innerAudioContext.onStop(function() {
      self.isPlaying = false
    })

    this.innerAudioContext.src = src
    this.innerAudioContext.play()

    return true
  } catch (err) {
    console.error('AudioManager play failed:', err)
    this.isPlaying = false
    if (this.playCallbacks.onError) {
      this.playCallbacks.onError(err)
    }
    return false
  }
}

AudioManager.prototype.playLocal = function(src, options) {
  options = options || {}

  if (!src) {
    if (options.onError) options.onError({ errMsg: '音频路径不能为空' })
    return false
  }

  this.destroy()

  this.currentSrc = src
  this.playCallbacks = {
    onEnded: options.onEnded || null,
    onError: options.onError || null,
    onPlay: options.onPlay || null
  }

  try {
    this.innerAudioContext = wx.createInnerAudioContext()

    if (options.playbackRate) {
      this.innerAudioContext.playbackRate = options.playbackRate
    }

    var self = this

    this.innerAudioContext.onPlay(function() {
      self.isPlaying = true
      if (self.playCallbacks.onPlay) {
        self.playCallbacks.onPlay()
      }
    })

    this.innerAudioContext.onEnded(function() {
      self.isPlaying = false
      if (self.playCallbacks.onEnded) {
        self.playCallbacks.onEnded()
      }
      self.destroy()
    })

    this.innerAudioContext.onError(function(err) {
      console.error('Local audio error:', err)
      self.isPlaying = false
      if (self.playCallbacks.onError) {
        self.playCallbacks.onError(err)
      }
      self.destroy()
    })

    this.innerAudioContext.src = src
    this.innerAudioContext.play()

    return true
  } catch (err) {
    console.error('Local audio play failed:', err)
    if (options.onError) options.onError(err)
    this.destroy()
    return false
  }
}

AudioManager.prototype.getStatus = function() {
  return {
    isPlaying: this.isPlaying,
    currentSrc: this.currentSrc
  }
}

var audioManager = AudioManager.getInstance()
module.exports = audioManager
