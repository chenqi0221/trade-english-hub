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
    wrongCount: 0,
    streak: 0,
    progress: 0,
    showAnswer: false
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
      const words = this.shuffleArray(data.slice(0, 50))
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

  onInput(e) {
    const userInput = e.detail.value
    this.setData({ userInput })
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
        correctCount: this.data.correctCount + 1,
        streak: this.data.streak + 1
      })
      
      setTimeout(() => {
        this.nextWord()
      }, 800)
    } else {
      this.setData({
        isCorrect: false,
        isWrong: true,
        wrongCount: this.data.wrongCount + 1,
        streak: 0,
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
      this.showResult()
    }
  },

  showResult() {
    const { correctCount, wrongCount } = this.data
    wx.showModal({
      title: '练习完成',
      content: `正确: ${correctCount}个  错误: ${wrongCount}个`,
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  },

  skipWord() {
    this.nextWord()
  }
})
