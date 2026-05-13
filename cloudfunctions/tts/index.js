/**
 * 火山引擎 TTS 云函数
 * 调用豆包语音合成大模型 API
 */

const https = require('https')

// 火山引擎配置 - 请替换为你的实际配置
const CONFIG = {
  // 豆包语音合成大模型 v3 API 地址
  host: 'openspeech.bytedance.com',
  path: '/api/v3/tts/unidirectional',
  // 你的应用 ID (从火山方舟控制台获取)
  appId: '',
  // 你的 Access Token (从火山方舟控制台获取)
  accessToken: '',
  // 资源 ID - 豆包语音合成模型
  resourceId: 'seed-tts-2.0',
  // 默认音色 - 英文推荐音色 (Amanda - 美式英语女声)
  defaultSpeaker: 'en_female_amanda_mars_bigtts',
  // 默认音频格式
  defaultFormat: 'mp3',
  // 默认采样率
  defaultSampleRate: 24000
}

/**
 * 调用火山引擎 TTS API
 */
function callVolcanoTTS(text, speaker, format, sampleRate) {
  return new Promise(function(resolve, reject) {
    if (!text || text.trim().length === 0) {
      reject(new Error('文本不能为空'))
      return
    }

    // 构建请求体
    var requestBody = {
      user: {
        uid: 'wxmp_user'
      },
      namespace: 'BidirectionalTTS',
      req_params: {
        text: text.trim(),
        speaker: speaker || CONFIG.defaultSpeaker,
        audio_params: {
          format: format || CONFIG.defaultFormat,
          sample_rate: sampleRate || CONFIG.defaultSampleRate
        }
      }
    }

    var postData = JSON.stringify(requestBody)

    var options = {
      hostname: CONFIG.host,
      path: CONFIG.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Api-App-Id': CONFIG.appId,
        'X-Api-Access-Key': CONFIG.accessToken,
        'X-Api-Resource-Id': CONFIG.resourceId
      }
    }

    var req = https.request(options, function(res) {
      var chunks = []

      res.on('data', function(chunk) {
        chunks.push(chunk)
      })

      res.on('end', function() {
        try {
          var buffer = Buffer.concat(chunks)
          var responseStr = buffer.toString('utf8')
          
          // 流式响应可能是多行 JSON
          var lines = responseStr.split('\n').filter(function(line) {
            return line.trim().length > 0
          })

          var audioData = []
          var lastPayload = null

          for (var i = 0; i < lines.length; i++) {
            try {
              var data = JSON.parse(lines[i])
              if (data.data) {
                // 收集音频数据 (base64)
                audioData.push(data.data)
              }
              if (data.payload) {
                lastPayload = JSON.parse(data.payload)
              }
            } catch (e) {
              console.log('Parse line error:', e)
            }
          }

          if (audioData.length > 0) {
            // 合并所有音频数据
            var fullAudioBase64 = audioData.join('')
            resolve({
              audioBase64: fullAudioBase64,
              payload: lastPayload,
              format: format || CONFIG.defaultFormat
            })
          } else {
            reject(new Error('未获取到音频数据'))
          }
        } catch (err) {
          reject(err)
        }
      })
    })

    req.on('error', function(err) {
      reject(err)
    })

    req.write(postData)
    req.end()
  })
}

/**
 * 云函数入口
 */
exports.main = async function(event, context) {
  var text = event.text
  var speaker = event.speaker
  var format = event.format || 'mp3'
  var sampleRate = event.sampleRate || 24000

  if (!text || text.trim().length === 0) {
    return {
      code: -1,
      message: '文本不能为空',
      data: null
    }
  }

  try {
    var result = await callVolcanoTTS(text, speaker, format, sampleRate)
    return {
      code: 0,
      message: 'success',
      data: {
        audioBase64: result.audioBase64,
        format: result.format,
        payload: result.payload
      }
    }
  } catch (err) {
    console.error('TTS调用失败:', err)
    return {
      code: -1,
      message: err.message || 'TTS调用失败',
      data: null
    }
  }
}
