var cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-d8gqe1yynedf264b4' })

var https = require('https')

var API_URL = 'ark.cn-beijing.volces.com'
var API_PATH = '/api/v3/chat/completions'
var API_KEY = 'ark-464cc73d-3412-4e84-befa-8f27ac5eb05f-4395a'
var MODEL = 'ep-20260514210034-zr68w'

exports.main = async function (event, context) {
  var messages = event.messages || []
  var topicName = event.topicName || '英语练习'

  console.log('[aiChat] 开始, topic:', topicName, '消息数:', messages.length)

  var systemPrompt = '你是一个专业的英语口语教练，当前场景是"' + topicName + '"。\n请遵守以下规则：\n1. 用英语回复，每句话后面附上中文翻译（用括号标注）\n2. 回复简洁，2-4句话即可\n3. 如果用户的英语有语法错误，先指出错误再给出正确说法\n4. 鼓励用户多说，适当追问引导对话继续'

  var apiMessages = [
    { role: 'system', content: systemPrompt }
  ]

  for (var i = 0; i < messages.length; i++) {
    apiMessages.push({
      role: messages[i].role === 'user' ? 'user' : 'assistant',
      content: messages[i].text || messages[i].content || ''
    })
  }

  try {
    console.log('[aiChat] 准备调用火山API...')
    var result = await callVolcanoAPI(apiMessages)
    console.log('[aiChat] 火山API返回成功, 长度:', result.length)
    return { code: 0, message: 'success', data: result }
  } catch (err) {
    console.error('[aiChat] 调用失败:', err.message || err, err.stack || '')
    return { code: -1, message: err.message || 'AI服务暂时不可用' }
  }
}

function callVolcanoAPI(messages) {
  return new Promise(function (resolve, reject) {
    var postData = JSON.stringify({
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    })

    var options = {
      hostname: API_URL,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }

    console.log('[aiChat] 发起请求到:', API_URL + API_PATH)

    var req = https.request(options, function (res) {
      console.log('[aiChat] 收到响应, 状态码:', res.statusCode)
      var chunks = []
      res.on('data', function (chunk) {
        chunks.push(chunk)
      })
      res.on('end', function () {
        var body = Buffer.concat(chunks).toString('utf8')
        if (res.statusCode !== 200) {
          console.error('[aiChat] API错误响应:', body.substring(0, 500))
          reject(new Error('API返回状态码: ' + res.statusCode))
          return
        }
        try {
          var json = JSON.parse(body)
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content)
          } else {
            reject(new Error('API返回格式异常'))
          }
        } catch (e) {
          console.error('[aiChat] JSON解析失败:', e.message)
          reject(new Error('API响应解析失败'))
        }
      })
    })

    req.on('error', function (err) {
      console.error('[aiChat] 请求error事件:', err.message, err.code || '')
      reject(err)
    })

    req.on('timeout', function () {
      console.error('[aiChat] 请求超时(10s), 销毁连接')
      req.destroy()
      reject(new Error('连接火山API超时(10s)'))
    })

    req.write(postData)
    req.end()
    console.log('[aiChat] 请求已发出, 等待响应...')
  })
}