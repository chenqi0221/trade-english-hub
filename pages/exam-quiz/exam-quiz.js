const vocabLoader = require('../../utils/vocabLoader.js')

Page({
  data: {
    examId: '',
    words: [],
    currentIndex: 0,
    currentWord: null,
    options: [],
    selectedOption: -1,
    isCorrect: false,
    score: 0,
    progress: 0,
    showResult: false,
    answered: false,
    isLoading: true
  },

  onLoad(options) {
    const examId = options.examId || 'cet4'
    this.setData({ examId })
    this.loadWords(examId)
  },

  loadWords(examId) {
    this.setData({ isLoading: true })
    vocabLoader.load(examId, (err, data) => {
      this.setData({ isLoading: false })
      if (err || !data || !data.length) {
        wx.showToast({ title: '加载词库失败', icon: 'none' })
        console.error('词库加载失败:', err)
        return
      }
      const words = this.shuffleArray(data.slice(0, 20))
      this.setData({ words, currentWord: words[0], progress: 0 })
      this.generateOptions(0, words)
    })
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

    const otherWords = words.filter((_, i) => i !== index)
    const wrongOptions = this.shuffleArray(otherWords).slice(0, 3).map(w => w.word)

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
    const { currentWord, answered } = this.data

    if (answered || !currentWord) return

    const isCorrect = this.data.options[index] === currentWord.word

    this.setData({
      selectedOption: index,
      answered: true,
      isCorrect: isCorrect,
      score: isCorrect ? this.data.score + 1 : this.data.score
    })

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
        currentWord: words[nextIndex],
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
