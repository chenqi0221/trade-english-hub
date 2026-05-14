// 批量将 JSON 词库转换为 JS 模块
const fs = require('fs')
const path = require('path')

const files = [
  { json: 'data/cet4.json', js: 'data/cet4.js' },
  { json: 'data/cet6.json', js: 'data/cet6.js' },
  { json: 'data/ielts.json', js: 'data/ielts.js' },
  { json: 'data/gre.json', js: 'data/gre.js' },
  { json: 'data/sat.json', js: 'data/sat.js' },
  { json: 'data2/toefl.json', js: 'data2/toefl.js' },
  { json: 'data2/kaoyan.json', js: 'data2/kaoyan.js' }
]

files.forEach(item => {
  const jsonPath = path.join(__dirname, item.json)
  const jsPath = path.join(__dirname, item.js)

  try {
    const content = fs.readFileSync(jsonPath, 'utf8')
    // 验证 JSON 格式
    const data = JSON.parse(content)
    console.log(`${item.json} -> ${item.js} (${data.length} 条)`)

    // 写入 JS 文件
    const jsContent = `module.exports = ${content}\n`
    fs.writeFileSync(jsPath, jsContent)
    console.log(`  转换成功: ${item.js}`)
  } catch (e) {
    console.error(`  转换失败: ${item.json}`, e.message)
  }
})

console.log('全部转换完成！')
