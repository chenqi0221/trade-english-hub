var audioManager = require('../../../utils/audioManager.js')

var VOLCANO_API = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
var VOLCANO_KEY = 'ark-464cc73d-3412-4e84-befa-8f27ac5eb05f-4395a'
var VOLCANO_MODEL = 'ep-20260514210034-zr68w'

var TOPICS = [
  { id: 'business', name: '商务洽谈', icon: '💼' },
  { id: 'travel', name: '旅行出行', icon: '✈️' },
  { id: 'shopping', name: '购物消费', icon: '🛒' },
  { id: 'dining', name: '餐饮美食', icon: '🍽️' },
  { id: 'hotel', name: '酒店住宿', icon: '🏨' },
  { id: 'phone', name: '电话沟通', icon: '📞' },
  { id: 'email', name: '邮件写作', icon: '📧' },
  { id: 'meeting', name: '会议讨论', icon: '📊' },
  { id: 'interview', name: '面试求职', icon: '🎯' },
  { id: 'daily', name: '日常对话', icon: '💬' }
]

var GRAMMAR_TIPS = [
  '记住：第三人称单数动词要加 -s 或 -es，例如 "He works hard."',
  '一般疑问句把助动词提前：Do/Does/Did + 主语 + 动词原形',
  '现在完成时表示过去的动作对现在的影响：have/has + 过去分词',
  '被动语态的结构是 be + 过去分词，例如 "The email was sent."',
  '条件句 If + 一般现在时, will + 动词原形',
  '比较级：形容词 + -er + than，或 more + 形容词 + than',
  '情态动词后接动词原形：can do, should go, must finish',
  '介词后面跟名词或动名词：after finishing, before leaving',
  '定语从句用 who(人) / which(物) / that(通用) 引导',
  '倒装句：Never have I seen... / Not only does he...'
]

Page({
  data: {
    messages: [],
    inputText: '',
    isLoading: false,
    currentTopic: null,
    topics: TOPICS,
    showTopics: true,
    scrollToBottom: '',
    isRecording: false
  },

  onLoad: function() {
    this.setData({ topics: TOPICS, showTopics: true })
  },

  onUnload: function() {
    audioManager.destroy()
  },

  selectTopic: function(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name

    var greeting = 'Welcome to ' + name + '! I am your AI speaking coach. Please start practicing with me.\n（欢迎来到' + name + '！我是你的AI口语教练，请用英语和我对话吧。）'

    var welcomeMessage = {
      id: Date.now(),
      role: 'ai',
      text: greeting,
      isTip: true,
      timestamp: this._formatTime()
    }

    this.setData({
      currentTopic: { id: id, name: name },
      showTopics: false,
      messages: [welcomeMessage],
      scrollToBottom: 'msg-0'
    })

    this._playAudio('Welcome. Please start practicing with me.')
  },

  toggleTopics: function() {
    this.setData({ showTopics: !this.data.showTopics })
  },

  getGrammarTip: function() {
    var tip = GRAMMAR_TIPS[Math.floor(Math.random() * GRAMMAR_TIPS.length)]
    var tipMessage = {
      id: Date.now(),
      role: 'ai',
      text: tip,
      isTip: true,
      timestamp: this._formatTime()
    }
    var messages = this.data.messages.concat([tipMessage])
    this.setData({
      messages: messages,
      scrollToBottom: 'msg-' + (messages.length - 1)
    })
  },

  clearChat: function() {
    var self = this
    wx.showModal({
      title: '清空对话',
      content: '确定要清空当前对话吗？',
      success: function(res) {
        if (res.confirm) {
          self.setData({ messages: [] })
        }
      }
    })
  },

  onInput: function(e) {
    this.setData({ inputText: e.detail.value })
  },

  sendMessage: function() {
    var text = this.data.inputText.trim()
    if (!text) return

    var userMessage = {
      id: Date.now(),
      role: 'user',
      text: text,
      timestamp: this._formatTime()
    }

    var messages = this.data.messages.concat([userMessage])
    var msgIndex = messages.length - 1

    this.setData({
      messages: messages,
      inputText: '',
      isLoading: true,
      scrollToBottom: 'msg-' + msgIndex
    })

    this._getAIResponse(messages)
  },

  _getAIResponse: function(messages) {
    var self = this
    var topicName = this.data.currentTopic ? this.data.currentTopic.name : '英语练习'

    var history = []
    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i]
      if (!msg.isTip) {
        history.push({ role: msg.role, text: msg.text })
      }
    }

    var systemPrompt = '你是英语口语教练，场景：' + topicName + '。只回复1句英语（附中文翻译），简短追问。最多50词。'

    var apiMessages = [{ role: 'system', content: systemPrompt }]
    for (var j = 0; j < history.length; j++) {
      apiMessages.push({
        role: history[j].role === 'user' ? 'user' : 'assistant',
        content: history[j].text
      })
    }

    var placeholderId = Date.now()
    var placeholder = {
      id: placeholderId,
      role: 'ai',
      text: '',
      streaming: true,
      timestamp: self._formatTime()
    }
    var newMessages = messages.concat([placeholder])
    var msgIndex = newMessages.length - 1

    self.setData({
      messages: newMessages,
      isLoading: true,
      scrollToBottom: 'msg-' + msgIndex
    })

    var fullText = ''
    var finished = false
    var buffer = ''
    var lastUpdate = 0
    var hasReceivedChunk = false

    function finalize() {
      if (finished) return
      finished = true
      self._onStreamComplete(messages, placeholderId, fullText)
    }

    var timeoutId = setTimeout(function() {
      if (!finished) {
        console.warn('API请求超时(8秒)，使用本地回复')
        finished = true
        self._useLocalFallback(messages, placeholderId)
      }
    }, 8000)

    var task = wx.request({
      url: VOLCANO_API,
      method: 'POST',
      enableChunked: true,
      responseType: 'text',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + VOLCANO_KEY
      },
      data: {
        model: VOLCANO_MODEL,
        messages: apiMessages,
        temperature: 0.6,
        max_tokens: 120,
        stream: true
      },
      success: function(res) {
        clearTimeout(timeoutId)
        if (!finished) {
          if (fullText === '' && res.data && typeof res.data === 'string') {
            try {
              var lines = res.data.split('\n')
              for (var k = 0; k < lines.length; k++) {
                var line = lines[k].trim()
                if (line.indexOf('data: ') === 0) {
                  var data = line.substring(6)
                  if (data === '[DONE]') break
                  try {
                    var json = JSON.parse(data)
                    if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
                      fullText += json.choices[0].delta.content
                    }
                  } catch (e) {}
                }
              }
            } catch (e) {
              fullText = res.data
            }
          }
          finalize()
        }
      },
      fail: function(err) {
        clearTimeout(timeoutId)
        console.error('火山API请求失败:', JSON.stringify(err))
        if (!finished) {
          finished = true
          self._useLocalFallback(messages, placeholderId)
        }
      }
    })

    task.onChunkReceived(function(chunk) {
      if (finished) return

      if (!hasReceivedChunk) {
        hasReceivedChunk = true
        clearTimeout(timeoutId)
      }

      var chunkStr
      if (typeof chunk.data === 'string') {
        chunkStr = chunk.data
      } else if (chunk.data instanceof ArrayBuffer) {
        var decoder = new TextDecoder('utf-8')
        chunkStr = decoder.decode(chunk.data)
      } else {
        chunkStr = String(chunk.data)
      }

      buffer += chunkStr
      var events = buffer.split('\n\n')
      buffer = events.pop() || ''

      for (var e = 0; e < events.length; e++) {
        var lines = events[e].split('\n')
        for (var l = 0; l < lines.length; l++) {
          var line = lines[l].trim()
          if (line.indexOf('data: ') === 0) {
            var raw = line.substring(6)
            if (raw === '[DONE]') {
              finalize()
              return
            }
            try {
              var parsed = JSON.parse(raw)
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                fullText += parsed.choices[0].delta.content
              }
            } catch (e) {}
          }
        }
      }

      var now = Date.now()
      if (now - lastUpdate > 50) {
        lastUpdate = now
        self._updateStreamingMessage(placeholderId, fullText)
      }
    })
  },

  _updateStreamingMessage: function(placeholderId, text) {
    var messages = this.data.messages
    for (var i = messages.length - 1; i >= 0; i--) {
      if (messages[i].id === placeholderId) {
        messages[i].text = text
        break
      }
    }
    this.setData({ messages: messages })
  },

  _onStreamComplete: function(originalMessages, placeholderId, fullText) {
    var self = this
    var text = fullText || 'Sorry, I didn\'t catch that. Could you repeat?（抱歉没听清，能再说一遍吗？）'

    var translated = self._extractTranslation(text)

    var messages = self.data.messages
    for (var i = messages.length - 1; i >= 0; i--) {
      if (messages[i].id === placeholderId) {
        messages[i].text = translated.english
        messages[i].chinese = translated.chinese || undefined
        messages[i].streaming = false
        break
      }
    }

    var newIndex = messages.length - 1
    self.setData({
      messages: messages,
      isLoading: false,
      scrollToBottom: 'msg-' + newIndex
    })

    self._playAudio(translated.english)
  },

  _extractTranslation: function(text) {
    var match = text.match(/^([\s\S]*?)\n?[（(]([\s\S]*?)[）)]$/)
    if (match) {
      return { english: match[1].trim(), chinese: match[2].trim() }
    }

    var lines = text.split('\n')
    var english = []
    var chinese = []

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (!line) continue
      var parenMatch = line.match(/^([^(（]+)[（(]([^)）]+)[）)]$/)
      if (parenMatch) {
        english.push(parenMatch[1].trim())
        chinese.push(parenMatch[2].trim())
      } else {
        english.push(line)
      }
    }

    return {
      english: english.join('\n'),
      chinese: chinese.length > 0 ? chinese.join('\n') : ''
    }
  },

  _useLocalFallback: function(messages, placeholderId) {
    var self = this
    var topicName = this.data.currentTopic ? this.data.currentTopic.name : '英语练习'

    var responses = [
      'Great! Keep practicing. Can you tell me more about that?（很好！继续练习。你能再多说一些吗？）',
      'Good try! Remember to pay attention to your pronunciation.（不错的尝试！记得注意发音。）',
      'Excellent! In a real ' + topicName + ' situation, you might also say...（很棒！在实际的' + topicName + '场景中，你可能还会说...）',
      'Nice work! Let us continue the conversation.（干得好！让我们继续对话吧。）'
    ]
    var reply = responses[Math.floor(Math.random() * responses.length)]
    var parsed = self._extractTranslation(reply)

    var currentMessages = self.data.messages

    if (placeholderId) {
      for (var i = currentMessages.length - 1; i >= 0; i--) {
        if (currentMessages[i].id === placeholderId) {
          currentMessages[i].text = parsed.english
          currentMessages[i].chinese = parsed.chinese
          currentMessages[i].streaming = false
          break
        }
      }
      self.setData({
        messages: currentMessages,
        isLoading: false,
        scrollToBottom: 'msg-' + (currentMessages.length - 1)
      })
    } else {
      var aiMessage = {
        id: Date.now(),
        role: 'ai',
        text: parsed.english,
        chinese: parsed.chinese,
        timestamp: self._formatTime()
      }
      var newMessages = messages.concat([aiMessage])
      self.setData({
        messages: newMessages,
        isLoading: false,
        scrollToBottom: 'msg-' + (newMessages.length - 1)
      })
    }

    self._playAudio(parsed.english)
  },

  _playAudio: function(text) {
    var clean = this._extractEnglish(text)
    if (!clean) return
    audioManager.playTTS(clean, {
      onError: function(err) {
        console.error('AI语音播放失败:', err)
      }
    })
  },

  _extractEnglish: function(text) {
    var eng = text.replace(/[（(][^）)]*[）)]/g, '')
    eng = eng.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+/g, '')
    eng = eng.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
    if (eng.length > 200) {
      eng = eng.substring(0, eng.lastIndexOf('.', 200) + 1 || 200)
    }
    return eng
  },

  playMessageAudio: function(e) {
    var text = e.currentTarget.dataset.text
    if (!text) return
    var clean = this._extractEnglish(text)
    if (!clean) return
    audioManager.playTTS(clean, {
      onError: function(err) {
        console.error('消息语音播放失败:', err)
      }
    })
  },

  startVoiceInput: function() {
    var self = this
    var recorderManager = wx.getRecorderManager()

    recorderManager.onStart(function() {
      self.setData({ isRecording: true })
    })

    recorderManager.onStop(function(res) {
      self.setData({ isRecording: false })
      if (res.tempFilePath) {
        wx.showToast({ title: '录音完成', icon: 'none' })
      }
    })

    recorderManager.onError(function(err) {
      self.setData({ isRecording: false })
      wx.showToast({ title: '录音失败', icon: 'none' })
    })

    recorderManager.start({
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    })
  },

  stopVoiceInput: function() {
    wx.getRecorderManager().stop()
  },

  _formatTime: function() {
    var d = new Date()
    var h = d.getHours()
    var m = d.getMinutes()
    if (h < 10) h = '0' + h
    if (m < 10) m = '0' + m
    return h + ':' + m
  }
})