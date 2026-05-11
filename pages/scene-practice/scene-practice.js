const sceneData = require('../../utils/sceneData.js')

Page({
  data: {
    scenes: [],
    currentScene: null,
    currentDialogIndex: 0,
    isPlaying: false,
    showTranslation: true,
    practiceMode: 'listen', // listen, speak, roleplay
    userRole: 'sales', // sales, customer
    showPhrases: false,
    commonPhrases: []
  },

  onLoad() {
    const scenes = sceneData.getAllScenes()
    this.setData({ 
      scenes,
      commonPhrases: sceneData.getAllPhrases()
    })
  },

  // 选择场景
  selectScene(e) {
    const { id } = e.currentTarget.dataset
    const scene = sceneData.getSceneById(id)
    
    this.setData({
      currentScene: scene,
      currentDialogIndex: 0,
      isPlaying: false,
      practiceMode: 'listen'
    })
  },

  // 返回场景列表
  backToScenes() {
    this.setData({
      currentScene: null,
      currentDialogIndex: 0,
      isPlaying: false
    })
  },

  // 播放当前对话
  playCurrentDialog() {
    const { currentScene, currentDialogIndex } = this.data
    if (!currentScene || currentDialogIndex >= currentScene.dialogs.length) return

    const dialog = currentScene.dialogs[currentDialogIndex]
    
    this.setData({ isPlaying: true })

    // 播放音频
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(dialog.text)}&type=2`
    innerAudioContext.onEnded(() => {
      this.setData({ isPlaying: false })
    })
    innerAudioContext.play()
  },

  // 播放下一句
  nextDialog() {
    const { currentScene, currentDialogIndex } = this.data
    if (!currentScene) return

    if (currentDialogIndex < currentScene.dialogs.length - 1) {
      this.setData({
        currentDialogIndex: currentDialogIndex + 1,
        isPlaying: false
      })
      
      // 自动播放
      setTimeout(() => {
        this.playCurrentDialog()
      }, 500)
    } else {
      // 场景完成
      wx.showModal({
        title: '场景完成',
        content: '恭喜！您已完成这个场景的练习。',
        showCancel: false,
        success: () => {
          this.setData({
            currentDialogIndex: 0,
            isPlaying: false
          })
        }
      })
    }
  },

  // 上一句
  prevDialog() {
    const { currentDialogIndex } = this.data
    if (currentDialogIndex > 0) {
      this.setData({
        currentDialogIndex: currentDialogIndex - 1,
        isPlaying: false
      })
    }
  },

  // 切换翻译显示
  toggleTranslation() {
    this.setData({ showTranslation: !this.data.showTranslation })
  },

  // 切换练习模式
  switchMode(e) {
    const { mode } = e.currentTarget.dataset
    this.setData({ practiceMode: mode })
  },

  // 切换角色
  switchRole() {
    const newRole = this.data.userRole === 'sales' ? 'customer' : 'sales'
    this.setData({ userRole: newRole })
  },

  // 显示/隐藏常用句型
  togglePhrases() {
    this.setData({ showPhrases: !this.data.showPhrases })
  },

  // 使用常用句型
  usePhrase(e) {
    const { phrase } = e.currentTarget.dataset
    wx.showModal({
      title: '常用句型',
      content: `${phrase.en}\n\n${phrase.cn}`,
      showCancel: false
    })
  },

  // 录音练习
  startRecording() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      wx.showToast({ title: '录音中...', icon: 'none' })
    })

    recorderManager.onStop((res) => {
      wx.hideToast()
      wx.showToast({ title: '录音完成', icon: 'success' })
      
      // 播放录音
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = res.tempFilePath
      innerAudioContext.play()
    })

    recorderManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  // 获取当前对话
  getCurrentDialog() {
    const { currentScene, currentDialogIndex } = this.data
    if (!currentScene) return null
    return currentScene.dialogs[currentDialogIndex]
  },

  // 获取进度百分比
  getProgress() {
    const { currentScene, currentDialogIndex } = this.data
    if (!currentScene) return 0
    return ((currentDialogIndex + 1) / currentScene.dialogs.length) * 100
  }
})
