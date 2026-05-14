/**
 * 词库初始化云函数
 * action: 'uploadStorage' → 上传到云存储
 * action: 'initDatabase'  → 导入到云数据库
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const fs = require('fs')
const path = require('path')

const VOCAB_FILES = {
  cet4: 'data/cet4.json',
  cet6: 'data/cet6.json',
  ielts: 'data/ielts.json',
  toefl: 'data2/toefl.json',
  gre: 'data/gre.json',
  sat: 'data/sat.json',
  kaoyan: 'data2/kaoyan.json'
}

exports.main = async function (event, context) {
  const { examId, initAll, action } = event

  console.log('initVocab 被调用, action:', action, 'examId:', examId, 'initAll:', initAll)

  try {
    if (action === 'uploadStorage') {
      return await uploadToStorage(examId, initAll)
    }

    if (action === 'initDatabase') {
      return await initToDatabase(examId, initAll)
    }

    return {
      code: -1,
      message: '请指定 action: "uploadStorage" 或 "initDatabase"'
    }
  } catch (err) {
    console.error('初始化词库失败:', err)
    return {
      code: -1,
      message: err.message || '初始化词库失败'
    }
  }
}

async function uploadToStorage(examId, initAll) {
  if (initAll) {
    const results = {}
    for (const id in VOCAB_FILES) {
      try {
        results[id] = await uploadOneFile(id)
      } catch (err) {
        results[id] = { success: false, error: err.message }
      }
    }
    return { code: 0, message: '全部上传完成', data: results }
  }

  if (!examId) {
    return { code: -1, message: '请指定 examId 或设置 initAll: true' }
  }

  const result = await uploadOneFile(examId)
  return { code: 0, message: '上传完成', data: result }
}

async function uploadOneFile(examId) {
  const filePath = VOCAB_FILES[examId]
  if (!filePath) {
    throw new Error('未知的考试ID: ' + examId)
  }

  const fullPath = path.join(__dirname, '../../', filePath)
  console.log('读取文件:', fullPath)

  if (!fs.existsSync(fullPath)) {
    throw new Error('文件不存在: ' + fullPath)
  }

  const content = fs.readFileSync(fullPath, 'utf8')

  const cloudPath = 'vocab/' + examId + '.json'
  console.log('上传到云存储:', cloudPath)

  const uploadResult = await cloud.uploadFile({
    cloudPath: cloudPath,
    fileContent: Buffer.from(content, 'utf8')
  })

  console.log('上传成功, fileID:', uploadResult.fileID)

  return {
    success: true,
    examId: examId,
    cloudPath: cloudPath,
    fileID: uploadResult.fileID
  }
}

async function initToDatabase(examId, initAll) {
  if (initAll) {
    const results = {}
    for (const id in VOCAB_FILES) {
      try {
        results[id] = await initOneCollection(id)
      } catch (err) {
        results[id] = { success: false, error: err.message }
      }
    }
    return { code: 0, message: '全部初始化完成', data: results }
  }

  if (!examId) {
    return { code: -1, message: '请指定 examId 或设置 initAll: true' }
  }

  const result = await initOneCollection(examId)
  return { code: 0, message: '初始化完成', data: result }
}

async function initOneCollection(examId) {
  const filePath = VOCAB_FILES[examId]
  if (!filePath) {
    throw new Error('未知的考试ID: ' + examId)
  }

  const fullPath = path.join(__dirname, '../../', filePath)
  console.log('读取文件:', fullPath)

  if (!fs.existsSync(fullPath)) {
    throw new Error('文件不存在: ' + fullPath)
  }

  const content = fs.readFileSync(fullPath, 'utf8')
  const data = JSON.parse(content)
  console.log('词库数量:', data.length)

  const collectionName = 'vocab_' + examId

  try {
    const checkResult = await db.collection(collectionName).limit(1).get()
    if (checkResult.data.length > 0) {
      console.log('集合已存在数据，跳过:', collectionName)
      return { success: true, examId: examId, count: data.length, message: '集合已存在，跳过初始化' }
    }
  } catch (e) {
    console.log('集合不存在或为空，需要创建:', collectionName)
  }

  const batchSize = 100
  let addedCount = 0

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map(function(item, index) {
      item._id = 'word_' + (i + index)
      return item
    })

    try {
      await db.collection(collectionName).add({ data: batch })
      addedCount += batch.length
      console.log('已添加 ' + addedCount + '/' + data.length + ' 条')
    } catch (err) {
      console.error('批量添加失败:', err)
      throw err
    }
  }

  console.log('数据库初始化完成:', examId, '共添加:', addedCount)

  return {
    success: true,
    examId: examId,
    count: addedCount,
    message: '初始化成功'
  }
}