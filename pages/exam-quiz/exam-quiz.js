const vocabData = require('../../utils/vocabData.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    options: [],
    selectedOption: -1,
    isCorrect: false,
    score: 0,
    progress: 0,
    showResult: false,
    answered: false
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
      const words = this.shuffleArray(data.slice(0, 20))
      this.setData({ words, progress: 0 })
      this.generateOptions(0, words)
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

  generateOptions(index, words) {
    const currentWord = words[index]
    const correctAnswer = currentWord.word
    
    // 从其他单词中随机选3个错误选项
    const otherWords = words.filter((_, i) => i !== index)
    const wrongOptions = this.shuffleArray(otherWords).slice(0, 3).map(w => w.word)
    
    // 合并并打乱
    const allOptions = this.shuffleArray([correctAnswer, ...wrongOptions])
    
    this.setData({
      options: allOptions,
      selectedOption: -1,
      answered: false,
      isCorrect: false
    })
  },

  selectOption(e) {
    const { index } = e.currentTarget.dataset
    const { words, currentIndex, answered } = this.data
    
    if (answered) return
    
    const currentWord = words[currentIndex]
    const isCorrect = this.data.options[index] === currentWord.word
    
    this.setData({
      selectedOption: index,
      answered: true,
      isCorrect: isCorrect,
      score: isCorrect ? this.data.score + 1 : this.data.score
    })
    
    // 1.5秒后自动下一题
    setTimeout(() => {
      this.nextQuestion()
    }, 1500)
  },

  nextQuestion() {
    const { currentIndex, words } = this.data
    if (currentIndex < words.length - 1) {
      const nextIndex = currentIndex + 1
      this.setData({
        currentIndex: nextIndex,
        progress: Math.round(((nextIndex) / words.length) * 100)
      })
      this.generateOptions(nextIndex, words)
    } else {
      this.setData({ showResult: true })
    }
  },

  restartQuiz() {
    this.setData({
      currentIndex: 0,
      score: 0,
      progress: 0,
      showResult: false
    })
    this.loadWords(this.data.examId)
  },

  goBack() {
    wx.navigateBack()
  }
})
