const wordData = require('../../utils/wordData.js')

Page({
  data: {
    categories: [],
    currentCategory: null,
    words: [],
    currentWordIndex: 0,
    currentWord: null,
    userInput: '',
    isCorrect: null,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    showResult: false,
    practiceMode: 'typing', // typing, choice, spelling
    options: [],
    isFinished: false,
    errorWords: [],
    startTime: null,
    studyTime: 0
  },

  onLoad(options) {
    const categories = wordData.getCategories()
    this.setData({ 
      categories,
      startTime: Date.now()
    })
    this.loadErrorWords()
  },

  onUnload() {
    this.saveStudyTime()
  },

  // 加载错题本
  loadErrorWords() {
    const errorWords = wx.getStorageSync('errorWords') || []
    this.setData({ errorWords })
  },

  // 选择分类
  selectCategory(e) {
    const { id } = e.currentTarget.dataset
    const words = wordData.getWordsByCategory(id)
    if (words.length === 0) {
      wx.showToast({ title: '该分类暂无单词', icon: 'none' })
      return
    }
    
    this.setData({
      currentCategory: id,
      words: this.shuffleArray([...words]),
      currentWordIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      isFinished: false,
      showResult: false
    })
    this.loadCurrentWord()
  },

  // 打乱数组
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  },

  // 加载当前单词
  loadCurrentWord() {
    const { words, currentWordIndex } = this.data
    if (currentWordIndex >= words.length) {
      this.finishPractice()
      return
    }

    const currentWord = words[currentWordIndex]
    const options = this.generateOptions(currentWord)
    
    this.setData({
      currentWord,
      userInput: '',
      isCorrect: null,
      showResult: false,
      options,
      practiceMode: Math.random() > 0.5 ? 'typing' : 'choice'
    })
  },

  // 生成选择题选项
  generateOptions(correctWord) {
    const allWords = wordData.getAllWords()
    const wrongOptions = allWords
      .filter(w => w.word !== correctWord.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    
    const options = [...wrongOptions, correctWord]
      .sort(() => 0.5 - Math.random())
      .map(w => ({
        word: w.word,
        meaning: w.meaning,
        isCorrect: w.word === correctWord.word
      }))
    
    return options
  },

  // 输入处理（打字模式）
  onInput(e) {
    const userInput = e.detail.value
    this.setData({ userInput })

    // 实时检查
    if (userInput.length >= this.data.currentWord.word.length) {
      this.checkAnswer(userInput)
    }
  },

  // 选择答案（选择模式）
  selectOption(e) {
    const { word } = e.currentTarget.dataset
    this.checkAnswer(word)
  },

  // 检查答案
  checkAnswer(answer) {
    const { currentWord, streak, bestStreak } = this.data
    const isCorrect = answer.toLowerCase().trim() === currentWord.word.toLowerCase()
    
    let newStreak = isCorrect ? streak + 1 : 0
    let newBestStreak = Math.max(bestStreak, newStreak)
    
    this.setData({
      isCorrect,
      showResult: true,
      streak: newStreak,
      bestStreak: newBestStreak,
      correctCount: isCorrect ? this.data.correctCount + 1 : this.data.correctCount,
      wrongCount: !isCorrect ? this.data.wrongCount + 1 : this.data.wrongCount
    })

    // 播放音效
    this.playSound(isCorrect)

    // 如果错误，加入错题本
    if (!isCorrect) {
      this.addToErrorWords(currentWord)
    }

    // 延迟加载下一个
    setTimeout(() => {
      this.setData({
        currentWordIndex: this.data.currentWordIndex + 1
      })
      this.loadCurrentWord()
    }, 1500)
  },

  // 播放音效
  playSound(isCorrect) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = isCorrect 
      ? 'https://www.soundjay.com/buttons/sounds/button-09.mp3'
      : 'https://www.soundjay.com/buttons/sounds/button-10.mp3'
    innerAudioContext.play()
  },

  // 加入错题本
  addToErrorWords(word) {
    let errorWords = wx.getStorageSync('errorWords') || []
    if (!errorWords.find(w => w.word === word.word)) {
      errorWords.push({
        ...word,
        errorCount: 1,
        lastError: new Date().toISOString()
      })
      wx.setStorageSync('errorWords', errorWords)
      this.setData({ errorWords })
    }
  },

  // 完成练习
  finishPractice() {
    const { correctCount, wrongCount, bestStreak, studyTime } = this.data
    const total = correctCount + wrongCount
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0

    this.setData({
      isFinished: true,
      finalStats: {
        total,
        correctCount,
        wrongCount,
        accuracy,
        bestStreak,
        studyTime: Math.round(studyTime / 60)
      }
    })

    // 更新学习进度
    this.updateStudyProgress(correctCount)
  },

  // 更新学习进度
  updateStudyProgress(learnedWords) {
    const progress = wx.getStorageSync('studyProgress') || {
      totalWords: 0,
      masteredWords: 0,
      todayStudyTime: 0,
      streakDays: 1
    }
    
    progress.masteredWords += learnedWords
    progress.totalWords = wordData.getAllWords().length
    wx.setStorageSync('studyProgress', progress)
  },

  // 保存学习时间
  saveStudyTime() {
    const studyTime = Math.round((Date.now() - this.data.startTime) / 1000)
    const progress = wx.getStorageSync('studyProgress') || {}
    progress.todayStudyTime = (progress.todayStudyTime || 0) + Math.round(studyTime / 60)
    wx.setStorageSync('studyProgress', progress)
  },

  // 播放单词发音
  playWordAudio() {
    const { currentWord } = this.data
    if (!currentWord) return

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(currentWord.word)}&type=2`
    innerAudioContext.play()
  },

  // 重新开始
  restartPractice() {
    this.setData({
      currentCategory: null,
      currentWordIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      isFinished: false,
      showResult: false
    })
  },

  // 返回分类选择
  backToCategories() {
    this.setData({
      currentCategory: null,
      isFinished: false
    })
  },

  // 切换练习模式
  switchMode(e) {
    const { mode } = e.currentTarget.dataset
    this.setData({ practiceMode: mode })
  }
})
