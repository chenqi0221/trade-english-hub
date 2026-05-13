var sceneData = require('../../utils/sceneData.js')
var audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    scenes: [],
    currentScene: null,
    currentDialogIndex: 0,
    isPlaying: false,
    showTranslation: true,
    practiceMode: 'listen',
    userRole: 'sales',
    showPhrases: false,
    commonPhrases: []
  },

  onLoad: function() {
    var scenes = sceneData.getAllScenes()
    this.setData({
      scenes: scenes,
      commonPhrases: sceneData.getAllPhrases()
    })
  },

  onUnload: function() {
    audioManager.destroy()
  },

  selectScene: function(e) {
    var id = e.currentTarget.dataset.id
    var scene = sceneData.getSceneById(id)

    this.setData({
      currentScene: scene,
      currentDialogIndex: 0,
      isPlaying: false,
      practiceMode: 'listen'
    })
  },

  backToScenes: function() {
    this.setData({
      currentScene: null,
      currentDialogIndex: 0,
      isPlaying: false
    })
    audioManager.destroy()
  },

  playCurrentDialog: function() {
    var currentScene = this.data.currentScene
    var currentDialogIndex = this.data.currentDialogIndex
    if (!currentScene || currentDialogIndex >= currentScene.dialogs.length) return

    var dialog = currentScene.dialogs[currentDialogIndex]

    this.setData({ isPlaying: true })

    var self = this
    
    // 使用有道智云 TTS 播放
    audioManager.playYoudaoAPI(dialog.text, {
      voiceName: 'youxiaomei',
      onEnded: function() {
        self.setData({ isPlaying: false })
      },
      onError: function(err) {
        console.error('有道智云TTS播放失败，尝试有道词典:', err)
        // 如果有道智云失败，回退到有道词典 TTS
        audioManager.playYoudao(dialog.text, {
          onEnded: function() {
            self.setData({ isPlaying: false })
          },
          onError: function(err2) {
            console.error('有道词典TTS也失败:', err2)
            self.setData({ isPlaying: false })
            wx.showToast({ title: '音频播放失败', icon: 'none' })
          }
        })
      }
    })
  },

  nextDialog: function() {
    var currentScene = this.data.currentScene
    var currentDialogIndex = this.data.currentDialogIndex
    if (!currentScene) return

    if (currentDialogIndex < currentScene.dialogs.length - 1) {
      this.setData({
        currentDialogIndex: currentDialogIndex + 1,
        isPlaying: false
      })

      var self = this
      setTimeout(function() {
        self.playCurrentDialog()
      }, 500)
    } else {
      wx.showModal({
        title: '场景完成',
        content: '恭喜！您已完成这个场景的练习。',
        showCancel: false,
        success: function() {
          this.setData({
            currentDialogIndex: 0,
            isPlaying: false
          })
        }
      })
    }
  },

  prevDialog: function() {
    var currentDialogIndex = this.data.currentDialogIndex
    if (currentDialogIndex > 0) {
      this.setData({
        currentDialogIndex: currentDialogIndex - 1,
        isPlaying: false
      })
    }
  },

  toggleTranslation: function() {
    this.setData({ showTranslation: !this.data.showTranslation })
  },

  switchMode: function(e) {
    var mode = e.currentTarget.dataset.mode
    this.setData({ practiceMode: mode })
  },

  switchRole: function() {
    var newRole = this.data.userRole === 'sales' ? 'customer' : 'sales'
    this.setData({ userRole: newRole })
  },

  togglePhrases: function() {
    this.setData({ showPhrases: !this.data.showPhrases })
  },

  usePhrase: function(e) {
    var phrase = e.currentTarget.dataset.phrase
    wx.showModal({
      title: '常用句型',
      content: phrase.en + '\n\n' + phrase.cn,
      showCancel: false
    })
  },

  startRecording: function() {
    var recorderManager = wx.getRecorderManager()

    recorderManager.onStart(function() {
      wx.showToast({ title: '录音中...', icon: 'none' })
    })

    recorderManager.onStop(function(res) {
      wx.hideToast()
      wx.showToast({ title: '录音完成', icon: 'success' })

      audioManager.playLocal(res.tempFilePath, {
        onError: function(err) {
          console.error('录音播放失败:', err)
          wx.showToast({ title: '录音播放失败', icon: 'none' })
        }
      })
    })

    recorderManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  getCurrentDialog: function() {
    var currentScene = this.data.currentScene
    var currentDialogIndex = this.data.currentDialogIndex
    if (!currentScene) return null
    return currentScene.dialogs[currentDialogIndex]
  },

  getProgress: function() {
    var currentScene = this.data.currentScene
    var currentDialogIndex = this.data.currentDialogIndex
    if (!currentScene) return 0
    return ((currentDialogIndex + 1) / currentScene.dialogs.length) * 100
  }
})
