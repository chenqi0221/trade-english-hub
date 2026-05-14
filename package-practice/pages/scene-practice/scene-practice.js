var sceneData = require('../../../utils/sceneData.js')
var audioManager = require('../../../utils/audioManager.js')

Page({
  data: {
    scenes: [],
    currentScene: null,
    currentDialogue: null,
    dialogueIndex: 0,
    isPlaying: false,
    showTranslation: false,
    practiceMode: 'listen',
    userRecording: null,
    isRecording: false,
    score: 0,
    showScore: false
  },

  onLoad: function() {
    this.loadScenes()
  },

  onUnload: function() {
    audioManager.destroy()
  },

  loadScenes: function() {
    var scenes = sceneData.getAllScenes()
    this.setData({ scenes: scenes })
  },

  selectScene: function(e) {
    var id = e.currentTarget.dataset.id
    var scene = sceneData.getSceneById(id)

    if (!scene) {
      wx.showToast({ title: '场景不存在', icon: 'none' })
      return
    }

    this.setData({
      currentScene: scene,
      dialogueIndex: 0,
      currentDialogue: scene.dialogues ? scene.dialogues[0] : null,
      practiceMode: 'listen',
      score: 0,
      showScore: false
    })
  },

  backToScenes: function() {
    this.setData({
      currentScene: null,
      currentDialogue: null,
      dialogueIndex: 0
    })
  },

  playDialogue: function() {
    var currentDialogue = this.data.currentDialogue
    if (!currentDialogue || !currentDialogue.content) {
      wx.showToast({ title: '暂无对话可播放', icon: 'none' })
      return
    }

    if (this.data.isPlaying) {
      audioManager.stop()
      this.setData({ isPlaying: false })
      return
    }

    this.setData({ isPlaying: true })

    var self = this
    audioManager.playYoudao(currentDialogue.content, {
      onEnded: function() {
        self.setData({ isPlaying: false })
      },
      onError: function(err) {
        self.setData({ isPlaying: false })
        wx.showToast({ title: '音频播放失败', icon: 'none' })
      }
    })
  },

  nextDialogue: function() {
    var scene = this.data.currentScene
    var dialogueIndex = this.data.dialogueIndex

    if (!scene || !scene.dialogues) return

    if (dialogueIndex < scene.dialogues.length - 1) {
      var nextIndex = dialogueIndex + 1
      this.setData({
        dialogueIndex: nextIndex,
        currentDialogue: scene.dialogues[nextIndex],
        showTranslation: false,
        userRecording: null
      })
    } else {
      this.finishPractice()
    }
  },

  prevDialogue: function() {
    var dialogueIndex = this.data.dialogueIndex
    if (dialogueIndex > 0) {
      var prevIndex = dialogueIndex - 1
      this.setData({
        dialogueIndex: prevIndex,
        currentDialogue: this.data.currentScene.dialogues[prevIndex],
        showTranslation: false,
        userRecording: null
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

  startRecording: function() {
    var recorderManager = wx.getRecorderManager()
    var self = this

    recorderManager.onStart(function() {
      self.setData({ isRecording: true })
    })

    recorderManager.onStop(function(res) {
      self.setData({
        isRecording: false,
        userRecording: res.tempFilePath
      })
      self.playRecording()
    })

    recorderManager.start({
      duration: 30000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  stopRecording: function() {
    var recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  playRecording: function() {
    var userRecording = this.data.userRecording
    if (!userRecording) {
      wx.showToast({ title: '暂无录音', icon: 'none' })
      return
    }

    audioManager.playLocal(userRecording, {
      onError: function(err) {
        wx.showToast({ title: '录音播放失败', icon: 'none' })
      }
    })
  },

  scorePractice: function() {
    var currentDialogue = this.data.currentDialogue
    if (!currentDialogue) return

    var randomScore = Math.floor(Math.random() * 40) + 60
    var newTotalScore = this.data.score + randomScore

    this.setData({
      score: newTotalScore,
      showScore: true
    })

    wx.showToast({
      title: '得分: ' + randomScore,
      icon: 'none'
    })
  },

  finishPractice: function() {
    var scene = this.data.currentScene
    var totalScore = this.data.score
    var dialogues = scene.dialogues || []
    var averageScore = dialogues.length > 0 ? Math.round(totalScore / dialogues.length) : 0

    wx.showModal({
      title: '练习完成',
      content: '场景: ' + scene.name + '\n平均得分: ' + averageScore + '\n继续加油！',
      showCancel: false,
      success: function() {
        wx.navigateBack()
      }
    })
  },

  replayScene: function() {
    this.setData({
      dialogueIndex: 0,
      currentDialogue: this.data.currentScene.dialogues[0],
      score: 0,
      showScore: false,
      showTranslation: false,
      userRecording: null
    })
  }
})
