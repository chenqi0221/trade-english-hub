// 词库加载器 - 按需懒加载，避免启动超时

// 文件路径映射
var VOCAB_PATHS = {
  cet4: '../data/cet4.json',
  cet6: '../data/cet6.json',
  ielts: '../data/ielts.json',
  toefl: '../data/toefl.json',
  gre: '../data/gre.json',
  sat: '../data/sat.json',
  kaoyan: '../data/kaoyan.json'
}

// 内联降级词库
var FALLBACK_VOCAB = {
  cet4: [
    { word: 'abruptly', phonetic: '/əˈbrʌptli/', meaning: 'adv. 突然地' },
    { word: 'absorb', phonetic: '/əbˈsɔːrb/', meaning: 'v. 吸收' },
    { word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: 'adj. 抽象的' },
    { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: 'adj. 丰富的' },
    { word: 'academy', phonetic: '/əˈkædəmi/', meaning: 'n. 学院' },
    { word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: 'v. 加速' },
    { word: 'accent', phonetic: '/ˈæksent/', meaning: 'n. 口音' },
    { word: 'access', phonetic: '/ˈækses/', meaning: 'n. 通道，入口' },
    { word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', meaning: 'v. 容纳' },
    { word: 'accompany', phonetic: '/əˈkʌmpəni/', meaning: 'v. 陪伴' }
  ],
  cet6: [
    { word: 'abbreviate', phonetic: '/əˈbriːvieɪt/', meaning: 'v. 缩写' },
    { word: 'abnormal', phonetic: '/æbˈnɔːrml/', meaning: 'adj. 异常的' },
    { word: 'abolish', phonetic: '/əˈbɒlɪʃ/', meaning: 'v. 废除' },
    { word: 'absurd', phonetic: '/əbˈsɜːrd/', meaning: 'adj. 荒谬的' },
    { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: 'adj. 丰富的' }
  ],
  ielts: [
    { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃' },
    { word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力' },
    { word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: 'adj. 绝对的' },
    { word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: 'adj. 学术的' },
    { word: 'accept', phonetic: '/əkˈsept/', meaning: 'v. 接受' }
  ],
  toefl: [
    { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: 'adj. 丰富的' },
    { word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: 'v. 加速' },
    { word: 'accessible', phonetic: '/əkˈsesəbl/', meaning: 'adj. 可到达的' },
    { word: 'acclaim', phonetic: '/əˈkleɪm/', meaning: 'v. 欢呼' },
    { word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', meaning: 'v. 容纳' }
  ],
  gre: [
    { word: 'abate', phonetic: '/əˈbeɪt/', meaning: 'v. 减少' },
    { word: 'aberrant', phonetic: '/æˈberənt/', meaning: 'adj. 异常的' },
    { word: 'abeyance', phonetic: '/əˈbeɪəns/', meaning: 'n. 中止' },
    { word: 'abhor', phonetic: '/əbˈhɔːr/', meaning: 'v. 憎恶' },
    { word: 'abjure', phonetic: '/əbˈdʒʊr/', meaning: 'v. 发誓放弃' }
  ],
  sat: [
    { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃' },
    { word: 'abate', phonetic: '/əˈbeɪt/', meaning: 'v. 减少' },
    { word: 'abdicate', phonetic: '/ˈæbdɪkeɪt/', meaning: 'v. 退位' },
    { word: 'abduct', phonetic: '/æbˈdʌkt/', meaning: 'v. 诱拐' },
    { word: 'aberration', phonetic: '/ˌæbəˈreɪʃn/', meaning: 'n. 脱离常规' }
  ],
  kaoyan: [
    { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃' },
    { word: 'abide', phonetic: '/əˈbaɪd/', meaning: 'v. 遵守' },
    { word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力' },
    { word: 'abnormal', phonetic: '/æbˈnɔːrml/', meaning: 'adj. 异常的' },
    { word: 'aboard', phonetic: '/əˈbɔːrd/', meaning: 'adv. 在船上' }
  ]
}

var vocabLoader = {
  // 缓存已加载的词库
  cache: {},

  // 判断是否为数组
  _isArray: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  },

  // 加载指定考试的词库 - 按需懒加载
  load: function(examId, callback) {
    if (!examId || typeof examId !== 'string') {
      console.error('vocabLoader.load: examId is required')
      if (callback) callback(new Error('考试ID不能为空'), null)
      return
    }

    // 检查缓存
    if (this.cache[examId]) {
      if (callback) callback(null, this.cache[examId])
      return
    }

    // 检查是否有对应的文件路径
    var path = VOCAB_PATHS[examId]
    if (!path) {
      console.warn('Unknown examId:', examId, 'using fallback')
      this.useFallbackData(examId, callback)
      return
    }

    var self = this

    // 使用 setTimeout 将同步 require 异步化，避免阻塞主线程导致 timeout
    setTimeout(function() {
      var data = null
      try {
        data = require(path)
      } catch (e) {
        console.warn('词库文件加载失败:', examId, e.message || e)
      }
      self._processLoadedData(examId, data, callback)
    }, 0)
  },

  // 处理加载后的数据
  _processLoadedData: function(examId, data, callback) {
    if (data && this._isArray(data) && data.length > 0) {
      var normalizedData = this.normalizeData(data)
      if (normalizedData.length > 0) {
        this.cache[examId] = normalizedData
        console.log('词库加载成功:', examId, 'count:', normalizedData.length)
        if (callback) callback(null, normalizedData)
        return
      }
    }

    // 如果文件加载失败或数据为空，使用降级数据
    console.log('词库文件未找到或数据为空，使用降级数据:', examId)
    this.useFallbackData(examId, callback)
  },

  // 标准化词库数据格式
  normalizeData: function(data) {
    if (!this._isArray(data)) {
      console.warn('Vocab data is not an array')
      return []
    }

    var result = []
    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      var normalized = null

      if (typeof item === 'string') {
        normalized = {
          word: item,
          meaning: '',
          phonetic: ''
        }
      } else if (typeof item === 'object' && item !== null) {
        var word = item.word || item.en || item.english || item.name || ''
        if (!word && item.word !== '') {
          word = 'word_' + i
        }
        normalized = {
          word: word,
          meaning: item.meaning || item.translation || item.cn || item.chinese || item.def || '',
          phonetic: item.phonetic || item.phonetics || item.pronunciation || item.ipa || '',
          example: item.example || '',
          category: item.category || ''
        }
      } else {
        normalized = {
          word: 'word_' + i,
          meaning: '',
          phonetic: ''
        }
      }

      // 只保留有真实单词的数据
      if (normalized.word && normalized.word.indexOf('word_') !== 0) {
        result.push(normalized)
      }
    }

    return result
  },

  // 使用降级数据
  useFallbackData: function(examId, callback) {
    var fallback = FALLBACK_VOCAB[examId]
    if (fallback && fallback.length > 0) {
      console.log('Using fallback data for exam:', examId, 'count:', fallback.length)
      this.cache[examId] = fallback
      if (callback) callback(null, fallback)
    } else {
      console.error('No fallback data available for exam:', examId)
      if (callback) callback(new Error('无法读取词库文件且无降级数据'), null)
    }
  },

  // 预加载词库（可选，用于提前加载）
  preload: function(examIds) {
    if (!this._isArray(examIds)) {
      examIds = [examIds]
    }
    var self = this
    for (var i = 0; i < examIds.length; i++) {
      self.load(examIds[i], function(err, data) {
        if (err) {
          console.error('Preload failed:', err)
        } else {
          console.log('Preloaded count:', data.length)
        }
      })
    }
  },

  // 清除缓存
  clearCache: function() {
    this.cache = {}
    console.log('Vocab cache cleared')
  }
}

module.exports = vocabLoader
