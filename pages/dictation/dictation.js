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
      const data = require(`../../data/${examId}.json`)
      const words = this.shuffleArray(data.slice(0, 30))
      this.setData({ words, progress: 0 })
    } catch (e) {
      wx.showToast({ title: '加载词库失败', icon: 'none' })
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
    
    // 使用微信内置语音合成
    const innerAudioContext = wx.createInnerAudioContext()
    // 使用有道语音API
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`
    innerAudioContext.play()
    
    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false })
      innerAudioContext.destroy()
    })
    
    innerAudioContext.onError(() => {
      this.setData({ isPlaying: false })
      wx.showToast({ title: '播放失败', icon: 'none' })
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
