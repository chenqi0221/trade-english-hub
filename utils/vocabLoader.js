// 词库加载器 - 内存缓存 → 本地Storage → 分包加载 → 云端降级
// 规则：不允许跨分包 require，词库通过 wx.loadSubpackage 加载后写入 globalData

var SUBPACKAGE_MAP = {
  cet4: 'vocabCet4',
  cet6: 'vocabCet6',
  ielts: 'vocabIelts',
  toefl: 'vocabToefl',
  gre: 'vocabGre',
  sat: 'vocabSat',
  kaoyan: 'vocabKaoyan'
}

// 主包内的极小降级数据（10个单词，确保页面能打开）
var FALLBACK_VOCAB = {
  cet4: [
    { word: 'abandon', meaning: '放弃，抛弃', phonetic: '/əˈbændən/' },
    { word: 'ability', meaning: '能力，才能', phonetic: '/əˈbɪləti/' },
    { word: 'absence', meaning: '缺席，缺乏', phonetic: '/ˈæbsəns/' },
    { word: 'absolute', meaning: '绝对的', phonetic: '/ˈæbsəluːt/' },
    { word: 'absorb', meaning: '吸收，吸引', phonetic: '/əbˈsɔːrb/' },
    { word: 'abstract', meaning: '抽象的', phonetic: '/ˈæbstrækt/' },
    { word: 'abundant', meaning: '丰富的', phonetic: '/əˈbʌndənt/' },
    { word: 'academic', meaning: '学术的', phonetic: '/ˌækəˈdemɪk/' },
    { word: 'academy', meaning: '学院', phonetic: '/əˈkædəmi/' },
    { word: 'accelerate', meaning: '加速', phonetic: '/əkˈseləreɪt/' }
  ],
  cet6: [
    { word: 'abbreviate', meaning: '缩写', phonetic: '/əˈbriːvieɪt/' },
    { word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːrml/' },
    { word: 'abolish', meaning: '废除', phonetic: '/əˈbɑːlɪʃ/' },
    { word: 'abortion', meaning: '流产', phonetic: '/əˈbɔːrʃn/' },
    { word: 'abrupt', meaning: '突然的', phonetic: '/əˈbrʌpt/' },
    { word: 'absurd', meaning: '荒谬的', phonetic: '/əbˈsɜːrd/' },
    { word: 'abundance', meaning: '丰富', phonetic: '/əˈbʌndəns/' },
    { word: 'accommodate', meaning: '容纳', phonetic: '/əˈkɑːmədeɪt/' },
    { word: 'accomplish', meaning: '完成', phonetic: '/əˈkʌmplɪʃ/' },
    { word: 'accordance', meaning: '一致', phonetic: '/əˈkɔːrdns/' }
  ],
  ielts: [
    { word: 'abandon', meaning: '放弃', phonetic: '/əˈbændən/' },
    { word: 'abide', meaning: '遵守', phonetic: '/əˈbaɪd/' },
    { word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːrml/' },
    { word: 'abolish', meaning: '废除', phonetic: '/əˈbɑːlɪʃ/' },
    { word: 'abortion', meaning: '流产', phonetic: '/əˈbɔːrʃn/' },
    { word: 'abrupt', meaning: '突然的', phonetic: '/əˈbrʌpt/' },
    { word: 'absence', meaning: '缺席', phonetic: '/ˈæbsəns/' },
    { word: 'absorb', meaning: '吸收', phonetic: '/əbˈsɔːrb/' },
    { word: 'abstract', meaning: '抽象的', phonetic: '/ˈæbstrækt/' },
    { word: 'absurd', meaning: '荒谬的', phonetic: '/əbˈsɜːrd/' }
  ],
  toefl: [
    { word: 'abandon', meaning: '放弃', phonetic: '/əˈbændən/' },
    { word: 'abate', meaning: '减少', phonetic: '/əˈbeɪt/' },
    { word: 'abbreviate', meaning: '缩写', phonetic: '/əˈbriːvieɪt/' },
    { word: 'aberrant', meaning: '异常的', phonetic: '/æˈberənt/' },
    { word: 'abhor', meaning: '憎恶', phonetic: '/əbˈhɔːr/' },
    { word: 'abide', meaning: '遵守', phonetic: '/əˈbaɪd/' },
    { word: 'abject', meaning: '可怜的', phonetic: '/ˈæbdʒekt/' },
    { word: 'abjure', meaning: '发誓放弃', phonetic: '/əbˈdʒʊr/' },
    { word: 'ablaze', meaning: '燃烧的', phonetic: '/əˈbleɪz/' },
    { word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːrml/' }
  ],
  gre: [
    { word: 'abate', meaning: '减少', phonetic: '/əˈbeɪt/' },
    { word: 'aberrant', meaning: '异常的', phonetic: '/æˈberənt/' },
    { word: 'abeyance', meaning: '中止', phonetic: '/əˈbeɪəns/' },
    { word: 'abhor', meaning: '憎恶', phonetic: '/əbˈhɔːr/' },
    { word: 'abject', meaning: '可怜的', phonetic: '/ˈæbdʒekt/' },
    { word: 'abjure', meaning: '发誓放弃', phonetic: '/əbˈdʒʊr/' },
    { word: 'ablution', meaning: '沐浴', phonetic: '/əˈbluːʃn/' },
    { word: 'abnegate', meaning: '放弃', phonetic: '/ˈæbnɪɡeɪt/' },
    { word: 'abolish', meaning: '废除', phonetic: '/əˈbɑːlɪʃ/' },
    { word: 'abominate', meaning: '憎恶', phonetic: '/əˈbɑːmɪneɪt/' }
  ],
  sat: [
    { word: 'abate', meaning: '减少', phonetic: '/əˈbeɪt/' },
    { word: 'abdicate', meaning: '退位', phonetic: '/ˈæbdɪkeɪt/' },
    { word: 'aberration', meaning: '脱离常规', phonetic: '/ˌæbəˈreɪʃn/' },
    { word: 'abet', meaning: '教唆', phonetic: '/əˈbet/' },
    { word: 'abhor', meaning: '憎恶', phonetic: '/əbˈhɔːr/' },
    { word: 'abide', meaning: '遵守', phonetic: '/əˈbaɪd/' },
    { word: 'abject', meaning: '可怜的', phonetic: '/ˈæbdʒekt/' },
    { word: 'abjure', meaning: '发誓放弃', phonetic: '/əbˈdʒʊr/' },
    { word: 'ablaze', meaning: '燃烧的', phonetic: '/əˈbleɪz/' },
    { word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːrml/' }
  ],
  kaoyan: [
    { word: 'abandon', meaning: '放弃', phonetic: '/əˈbændən/' },
    { word: 'abide', meaning: '遵守', phonetic: '/əˈbaɪd/' },
    { word: 'abnormal', meaning: '异常的', phonetic: '/æbˈnɔːrml/' },
    { word: 'abolish', meaning: '废除', phonetic: '/əˈbɑːlɪʃ/' },
    { word: 'abortion', meaning: '流产', phonetic: '/əˈbɔːrʃn/' },
    { word: 'abrupt', meaning: '突然的', phonetic: '/əˈbrʌpt/' },
    { word: 'absence', meaning: '缺席', phonetic: '/ˈæbsəns/' },
    { word: 'absorb', meaning: '吸收', phonetic: '/əbˈsɔːrb/' },
    { word: 'abstract', meaning: '抽象的', phonetic: '/ˈæbstrækt/' },
    { word: 'absurd', meaning: '荒谬的', phonetic: '/əbˈsɜːrd/' }
  ]
}

var vocabLoader = {
  cache: {},

  _isArray: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  },

  load: function(examId, callback) {
    if (!examId || typeof examId !== 'string') {
      if (callback) callback(new Error('考试ID不能为空'), null)
      return
    }

    // 1. 内存缓存
    if (this.cache[examId] && this.cache[examId].length > 10) {
      console.log('内存缓存命中:', examId, this.cache[examId].length)
      if (callback) callback(null, this.cache[examId])
      return
    }

    // 2. 本地 Storage 缓存
    var stored = wx.getStorageSync('vocab_cache_' + examId)
    if (stored && this._isArray(stored) && stored.length > 10) {
      console.log('本地存储缓存命中:', examId, stored.length)
      this.cache[examId] = stored
      if (callback) callback(null, stored)
      return
    }

    // 3. globalData（其他页面已加载过）
    var app = getApp()
    if (app && app.globalData && app.globalData.vocabData && app.globalData.vocabData[examId]) {
      var gd = app.globalData.vocabData[examId]
      if (this._isArray(gd) && gd.length > 10) {
        console.log('globalData 命中:', examId, gd.length)
        this.cache[examId] = gd
        if (callback) callback(null, gd)
        return
      }
    }

    // 4. 加载分包词库
    var self = this
    this._loadFromSubpackage(examId, function(err, data) {
      if (!err && data && data.length > 10) {
        self._cacheAndReturn(examId, data, callback)
        return
      }

      // 5. 云端降级
      console.log('分包加载失败，尝试云端:', examId)
      self._loadFromCloud(examId, function(err2, data2) {
        if (!err2 && data2 && data2.length > 10) {
          self._cacheAndReturn(examId, data2, callback)
        } else {
          // 6. 最终降级：主包内的 10 个单词
          console.warn('所有加载方式失败，使用降级数据:', examId)
          var fallback = FALLBACK_VOCAB[examId] || FALLBACK_VOCAB.cet4
          if (callback) callback(null, fallback)
        }
      })
    })
  },

  // 通过 wx.loadSubpackage 加载词库分包，加载完后读取 globalData
  _loadFromSubpackage: function(examId, callback) {
    var self = this
    var subpkg = SUBPACKAGE_MAP[examId]

    if (!subpkg || !wx.loadSubpackage) {
      if (callback) callback(new Error('不支持分包加载'), null)
      return
    }

    wx.loadSubpackage({
      name: subpkg,
      success: function() {
        // 分包加载成功，词库数据已通过分包内的 init 写入 globalData
        var app = getApp()
        if (app && app.globalData && app.globalData.vocabData && app.globalData.vocabData[examId]) {
          var data = app.globalData.vocabData[examId]
          if (self._isArray(data) && data.length > 10) {
            console.log('分包加载成功:', examId, data.length)
            if (callback) callback(null, data)
            return
          }
        }
        // 分包加载了但数据还没写入 globalData（不应该发生）
        if (callback) callback(new Error('分包数据未找到'), null)
      },
      fail: function(err) {
        console.warn('分包加载失败:', examId, err)
        if (callback) callback(new Error('分包加载失败'), null)
      }
    })
  },

  _loadFromCloud: function(examId, callback) {
    if (!wx.cloud) {
      if (callback) callback(new Error('云开发未启用'), null)
      return
    }

    wx.cloud.callFunction({
      name: 'getVocab',
      data: { examId: examId },
      success: function(res) {
        if (res.result && res.result.code === 0 && res.result.data) {
          var data = res.result.data
          if (Object.prototype.toString.call(data) === '[object Array]' && data.length > 0) {
            console.log('云端加载成功:', examId, data.length)
            if (callback) callback(null, data)
          } else {
            if (callback) callback(new Error('云端返回数据格式错误'), null)
          }
        } else {
          if (callback) callback(new Error((res.result && res.result.message) || '云端返回空'), null)
        }
      },
      fail: function(err) {
        console.error('云函数调用失败:', err)
        if (callback) callback(err, null)
      }
    })
  },

  _cacheAndReturn: function(examId, data, callback) {
    var normalized = this.normalizeData(data)
    if (normalized.length > 10) {
      this.cache[examId] = normalized
      try {
        wx.setStorageSync('vocab_cache_' + examId, normalized)
      } catch (e) {
        console.warn('缓存到本地存储失败:', e.message)
      }
      console.log('词库加载成功:', examId, normalized.length)
      if (callback) callback(null, normalized)
    } else {
      if (callback) callback(new Error('词库数据不足: ' + examId), null)
    }
  },

  normalizeData: function(data) {
    if (!this._isArray(data)) return []

    var result = []
    for (var i = 0; i < data.length; i++) {
      var item = data[i]
      if (typeof item === 'string') {
        result.push({ word: item, meaning: '', phonetic: '' })
      } else if (typeof item === 'object' && item !== null) {
        var word = item.word || item.en || item.english || item.name || ''
        if (word) {
          result.push({
            word: word,
            meaning: item.meaning || item.translation || item.cn || item.chinese || item.def || '',
            phonetic: item.phonetic || item.phonetics || item.pronunciation || item.ipa || '',
            example: item.example || '',
            category: item.category || ''
          })
        }
      }
    }
    return result
  },

  clearCache: function() {
    this.cache = {}
  }
}

module.exports = vocabLoader