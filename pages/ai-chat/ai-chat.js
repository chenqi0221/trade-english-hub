const sceneData = require('../../utils/sceneData.js')
const audioManager = require('../../utils/audioManager.js')

Page({
  data: {
    messages: [],
    inputText: '',
    isLoading: false,
    currentTopic: null,
    topics: [
      { id: 'greeting', name: '寒暄问候', icon: '👋' },
      { id: 'inquiry', name: '产品询价', icon: '📋' },
      { id: 'negotiation', name: '价格谈判', icon: '💰' },
      { id: 'order', name: '订单确认', icon: '📄' },
      { id: 'shipping', name: '物流沟通', icon: '🚢' },
      { id: 'complaint', name: '投诉处理', icon: '📞' }
    ],
    showTopics: true,
    scrollToBottom: '',
    isRecording: false
  },

  onLoad() {
    // 初始化欢迎消息
    this.addMessage({
      role: 'ai',
      text: 'Hello! I\'m your AI English practice partner. Choose a topic below or type anything to start practicing!',
      chinese: '你好！我是你的AI英语练习伙伴。选择下方话题或直接输入开始练习！'
    })
  },

  onUnload() {
    // 页面卸载时停止音频
    audioManager.destroy()
  },

  // 选择话题
  selectTopic(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ 
      currentTopic: id,
      showTopics: false
    })
    
    // 根据话题生成开场白
    const openingMessages = {
      greeting: {
        text: 'Let\'s practice business greetings! Imagine we just met at a trade show. How would you introduce yourself?',
        chinese: '让我们练习商务问候！想象我们在展会上刚认识，你会如何介绍自己？'
      },
      inquiry: {
        text: 'I\'m interested in your products. Can you tell me more about your main product lines?',
        chinese: '我对你们的产品感兴趣。能告诉我更多关于你们主要产品线的情况吗？'
      },
      negotiation: {
        text: 'Your price seems a bit high compared to other suppliers. What\'s your best offer?',
        chinese: '和其他供应商相比，你们的价格似乎有点高。你们最好的报价是多少？'
      },
      order: {
        text: 'I\'d like to place an order. What\'s your MOQ and lead time?',
        chinese: '我想下订单。你们的最小起订量和交货期是多少？'
      },
      shipping: {
        text: 'When can you arrange shipment? We need the goods urgently.',
        chinese: '你们什么时候能安排发货？我们急需这批货。'
      },
      complaint: {
        text: 'We received the goods but found some quality issues. How will you handle this?',
        chinese: '我们收到了货物，但发现了一些质量问题。你们会如何处理？'
      }
    }
    
    const opening = openingMessages[id]
    if (opening) {
      this.addMessage({
        role: 'ai',
        text: opening.text,
        chinese: opening.chinese,
        topic: name
      })
    }
  },

  // 添加消息
  addMessage(message) {
    const messages = [...this.data.messages, {
      ...message,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString()
    }]
    
    this.setData({ 
      messages,
      scrollToBottom: `msg-${messages.length - 1}`
    })
  },

  // 输入处理
  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  // 发送消息
  sendMessage() {
    const { inputText } = this.data
    if (!inputText.trim()) return

    // 添加用户消息
    this.addMessage({
      role: 'user',
      text: inputText
    })

    this.setData({ inputText: '', isLoading: true })

    // 模拟AI回复（实际项目中调用AI API）
    this.simulateAIResponse(inputText)
  },

  // 模拟AI回复
  simulateAIResponse(userText) {
    const responses = [
      {
        text: 'That\'s a good point! Could you elaborate more on that?',
        chinese: '说得好！能详细说明一下吗？'
      },
      {
        text: 'I see. What about the payment terms? Do you accept L/C?',
        chinese: '明白了。付款条件呢？你们接受信用证吗？'
      },
      {
        text: 'Interesting! Let me think about it. Can you send me a quotation?',
        chinese: '有意思！让我考虑一下。你能给我发份报价单吗？'
      },
      {
        text: 'That sounds reasonable. When can you deliver the goods?',
        chinese: '听起来合理。你们什么时候能交货？'
      }
    ]

    // 模拟网络延迟
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      this.addMessage({
        role: 'ai',
        text: randomResponse.text,
        chinese: randomResponse.chinese
      })

      this.setData({ isLoading: false })
    }, 1500)
  },

  // 语音输入
  startVoiceInput() {
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      this.setData({ isRecording: true })
    })

    recorderManager.onStop((res) => {
      this.setData({ isRecording: false })
      
      // 模拟语音识别结果
      wx.showToast({
        title: '语音识别中...',
        icon: 'loading'
      })
      
      setTimeout(() => {
        wx.hideToast()
        this.setData({
          inputText: 'I would like to know more about your products.'
        })
      }, 1500)
    })

    recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  // 停止录音
  stopVoiceInput() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },

  // 播放消息音频
  playMessageAudio(e) {
    const { text } = e.currentTarget.dataset
    if (!text) {
      wx.showToast({ title: '暂无内容可播放', icon: 'none' })
      return
    }

    audioManager.playTTS(text)
  },

  // 显示/隐藏话题选择
  toggleTopics() {
    this.setData({ showTopics: !this.data.showTopics })
  },

  // 清空对话
  clearChat() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前对话吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            showTopics: true,
            currentTopic: null
          })
          
          this.addMessage({
            role: 'ai',
            text: 'Hello! I\'m your AI English practice partner. Choose a topic below or type anything to start practicing!',
            chinese: '你好！我是你的AI英语练习伙伴。选择下方话题或直接输入开始练习！'
          })
        }
      }
    })
  },

  // 获取语法建议
  getGrammarTip() {
    const tips = [
      { en: 'Try using "Would you mind..." for polite requests.', cn: '尝试用"Would you mind..."来提出礼貌的请求。' },
      { en: 'Use "Could you please..." instead of "Can you..." in business.', cn: '在商务场合用"Could you please..."代替"Can you..."。' },
      { en: 'Remember to use past tense when discussing previous orders.', cn: '讨论之前的订单时记得用过去时。' }
    ]
    
    const tip = tips[Math.floor(Math.random() * tips.length)]
    
    this.addMessage({
      role: 'ai',
      text: `💡 Grammar Tip: ${tip.en}`,
      chinese: `💡 语法提示: ${tip.cn}`,
      isTip: true
    })
  }
})