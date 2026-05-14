// 使用 wx-server-sdk 上传词库到云存储
// 运行方式: node upload-vocab-to-cloud.js

const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

// 初始化云开发（使用默认环境）
cloud.init({
  env: 'cloud1-d8gqe1yynedf264b4'
})

const db = cloud.database()

// 词库文件列表
const vocabFiles = [
  { examId: 'cet4', file: 'data/cet4.json' },
  { examId: 'cet6', file: 'data/cet6.json' },
  { examId: 'ielts', file: 'data/ielts.json' },
  { examId: 'toefl', file: 'data2/toefl.json' },
  { examId: 'gre', file: 'data/gre.json' },
  { examId: 'sat', file: 'data/sat.json' },
  { examId: 'kaoyan', file: 'data2/kaoyan.json' }
]

async function uploadVocab() {
  console.log('=== 开始上传词库到云存储 ===')

  for (const item of vocabFiles) {
    const filePath = path.join(__dirname, item.file)
    const cloudPath = `vocab/${item.examId}.json`

    console.log(`\n处理: ${item.examId}`)
    console.log(`本地文件: ${filePath}`)

    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.error(`文件不存在: ${filePath}`)
        continue
      }

      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf8')
      console.log(`文件大小: ${content.length} 字节`)

      // 验证 JSON
      const data = JSON.parse(content)
      console.log(`词库数量: ${data.length} 条`)

      // 上传到云存储
      const result = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: Buffer.from(content)
      })

      console.log(`上传成功: ${result.fileID}`)

      // 同时存入云数据库（可选，作为备份）
      try {
        const collectionName = `vocab_${item.examId}`
        console.log(`尝试存入云数据库: ${collectionName}`)

        // 检查集合是否存在
        const checkResult = await db.collection(collectionName).limit(1).get()
        console.log(`集合已存在，包含 ${checkResult.data.length} 条数据`)

        if (checkResult.data.length === 0) {
          // 集合为空，批量添加数据
          console.log('集合为空，开始批量添加...')
          const batchSize = 100
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize).map((item, index) => ({
              ...item,
              _id: `word_${i + index}`
            }))
            await db.collection(collectionName).add({ data: batch })
            console.log(`已添加 ${i + batch.length}/${data.length} 条`)
          }
          console.log('云数据库写入完成')
        }
      } catch (dbErr) {
        console.log(`云数据库操作失败: ${dbErr.message}`)
      }

    } catch (err) {
      console.error(`处理失败: ${err.message}`)
    }
  }

  console.log('\n=== 上传完成 ===')
}

// 执行上传
uploadVocab().catch(err => {
  console.error('上传过程出错:', err)
})
