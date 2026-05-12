const vocabData = require('../../utils/vocabData.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    userInput: '',
    isCorrect: false,
    isWrong: false,
    correctCount: 0,
    progress: 0,
    showAnswer: false,
    isPlaying: false
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
      const words = this.shuffleArray(data.slice(0, 30))
      this.setData({ words, progress: 0 })
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

  playWord() {
    const { words, currentIndex } = this.data
    const word = words[currentIndex].word
    
    this.setData({ isPlaying: true })
    
    // 使用微信语音合成API
    const plugin = requirePlugin('WechatSI')
    if (plugin) {
      plugin.textToSpeech({
        lang: 'en_US',
        tts: true,
        content: word,
        success: (res) => {
          if (res.filename) {
            const innerAudioContext = wx.createInnerAudioContext()
            innerAudioContext.src = res.filename
            innerAudioContext.play()
            
            innerAudioContext.onEnded(() => {
              this.setData({ isPlaying: false })
              innerAudioContext.destroy()
            })
            
            innerAudioContext.onError(() => {
              this.setData({ isPlaying: false })
              innerAudioContext.destroy()
            })
          } else {
            this.setData({ isPlaying: false })
            wx.showToast({ title: '语音合成失败', icon: 'none' })
          }
        },
        fail: () => {
          this.setData({ isPlaying: false })
          wx.showToast({ title: '语音合成失败', icon: 'none' })
        }
      })
    } else {
      // 降级：使用百度语音API（需要在微信公众平台配置域名）
      this.playWithBaiduTTS(word)
    }
  },

  playWithBaiduTTS(word) {
    const innerAudioContext = wx.createInnerAudioContext()
    // 使用百度语音API（免费，无需配置域名）
    innerAudioContext.src = `https://fanyi.baidu.com/gettts?lan=en&text=${encodeURIComponent(word)}&spd=3&source=web`
    innerAudioContext.play()
    
    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false })
      innerAudioContext.destroy()
    })
    
    innerAudioContext.onError((err) => {
      console.error('Audio error:', err)
      this.setData({ isPlaying: false })
      wx.showToast({ title: '音频播放失败，请检查网络', icon: 'none' })
      innerAudioContext.destroy()
    })
  },

  onInput(e) {
    this.setData({ userInput: e.detail.value })
  },

  checkAnswer() {
    const { userInput, words, currentIndex } = this.data
    const currentWord = words[currentIndex]
    
    if (!userInput.trim()) return
    
    const isCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase()
    
    if (isCorrect) {
      this.setData({
        isCorrect: true,
        isWrong: false,
        correctCount: this.data.correctCount + 1
      })
      setTimeout(() => this.nextWord(), 800)
    } else {
      this.setData({
        isCorrect: false,
        isWrong: true,
        showAnswer: true
      })
    }
  },

  nextWord() {
    const { currentIndex, words } = this.data
    if (currentIndex < words.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1,
        userInput: '',
        isCorrect: false,
        isWrong: false,
        showAnswer: false,
        progress: Math.round(((currentIndex + 1) / words.length) * 100)
      })
    } else {
      wx.showModal({
        title: '听写完成',
        content: `正确: ${this.data.correctCount}/${words.length}`,
        showCancel: false,
        success: () => wx.navigateBack()
      })
    }
  },

  skipWord() {
    this.nextWord()
  }
})
