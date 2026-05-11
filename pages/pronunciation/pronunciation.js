const wordData = require('../../utils/wordData.js')

Page({
  data: {
    currentWord: null,
    isRecording: false,
    recordedAudio: null,
    showComparison: false,
    wordList: [],
    currentIndex: 0,
    categories: [],
    selectedCategory: null,
    playbackRate: 1.0,
    showPhonetic: true,
    showMeaning: true,
    commonErrors: []
  },

  onLoad() {
    const categories = wordData.getCategories()
    const allWords = wordData.getAllWords()
    
    // 筛选出有常见发音错误的单词
    const wordsWithErrors = allWords.filter(w => w.wrongPronunciation && w.wrongPronunciation.length > 0)
    
    this.setData({
      categories,
      wordList: wordsWithErrors,
      currentWord: wordsWithErrors[0] || allWords[0],
      commonErrors: this.getCommonErrors()
    })
  },

  // 获取常见发音错误列表
  getCommonErrors() {
    const allWords = wordData.getAllWords()
    return allWords
      .filter(w => w.wrongPronunciation && w.wrongPronunciation.length > 0)
      .map(w => ({
        word: w.word,
        correct: w.phonetic,
        wrong: w.wrongPronunciation[0],
        meaning: w.meaning
      }))
      .slice(0, 10)
  },

  // 选择分类
  selectCategory(e) {
    const { id } = e.currentTarget.dataset
    const words = wordData.getWordsByCategory(id)
    
    this.setData({
      selectedCategory: id,
      wordList: words,
      currentIndex: 0,
      currentWord: words[0]
    })
  },

  // 播发音
  playCorrectAudio() {
    const { currentWord } = this.data
    if (!currentWord) return

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(currentWord.word)}&type=2`
    innerAudioContext.playbackRate = this.data.playbackRate
    innerAudioContext.play()
  },

  // 播放错误发音示例
  playWrongAudio() {
    const { currentWord } = this.data
    if (!currentWord || !currentWord.wrongPronunciation) return

    // 使用TTS播放错误发音提示
    const wrongPhonetic = currentWord.wrongPronunciation[0]
    wx.showToast({
      title: `错误发音: ${wrongPhonetic}`,
      icon: 'none',
      duration: 2000
    })
  },

  // 开始录音
  startRecording() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      this.setData({ isRecording: true })
    })

    recorderManager.onStop((res) => {
      this.setData({
        isRecording: false,
        recordedAudio: res.tempFilePath,
        showComparison: true
      })
      
      // 播放录音
      this.playRecording()
    })

    recorderManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  // 停止录音
  stopRecording() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  // 播放录音
  playRecording() {
    const { recordedAudio } = this.data
    if (!recordedAudio) return

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = recordedAudio
    innerAudioContext.play()
  },

  // 下一个单词
  nextWord() {
    const { wordList, currentIndex } = this.data
    const nextIndex = (currentIndex + 1) % wordList.length
    
    this.setData({
      currentIndex: nextIndex,
      currentWord: wordList[nextIndex],
      showComparison: false,
      recordedAudio: null
    })
  },

  // 上一个单词
  prevWord() {
    const { wordList, currentIndex } = this.data
    const prevIndex = currentIndex === 0 ? wordList.length - 1 : currentIndex - 1
    
    this.setData({
      currentIndex: prevIndex,
      currentWord: wordList[prevIndex],
      showComparison: false,
      recordedAudio: null
    })
  },

  // 调整播放速度
  changePlaybackRate() {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5]
    const currentIndex = rates.indexOf(this.data.playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    
    this.setData({ playbackRate: nextRate })
    
    wx.showToast({
      title: `播放速度: ${nextRate}x`,
      icon: 'none'
    })
  },

  // 切换音标显示
  togglePhonetic() {
    this.setData({ showPhonetic: !this.data.showPhonetic })
  },

  // 切换释义显示
  toggleMeaning() {
    this.setData({ showMeaning: !this.data.showMeaning })
  },

  // 查看单词详情
  viewWordDetail() {
    const { currentWord } = this.data
    wx.navigateTo({
      url: `/pages/word-detail/word-detail?word=${currentWord.word}`
    })
  }
})
