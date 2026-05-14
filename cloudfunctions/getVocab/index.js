/**
 * 词库数据云函数
 * 直接从云函数目录内的 vocab/*.json 读取，部署时自带，无需外部云存储
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-d8gqe1yynedf264b4' })

const fs = require('fs')
const path = require('path')

exports.main = async function (event, context) {
  var examId = event.examId

  console.log('getVocab 被调用, examId:', examId)

  if (!examId) {
    return { code: -1, message: '考试ID不能为空' }
  }

  try {
    var filePath = path.join(__dirname, 'vocab', examId + '.json')

    if (!fs.existsSync(filePath)) {
      return { code: -1, message: '词库文件不存在: ' + examId }
    }

    var content = fs.readFileSync(filePath, 'utf8')
    var vocabData = JSON.parse(content)
    console.log('词库加载成功:', examId, '数量:', vocabData.length)

    return {
      code: 0,
      message: 'success',
      data: vocabData,
      source: 'cloud-function-local',
      count: vocabData.length
    }
  } catch (err) {
    console.error('获取词库失败:', err)
    return {
      code: -1,
      message: err.message || '获取词库失败'
    }
  }
}