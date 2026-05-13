/**
 * 外贸英语词库数据
 * 整合自 qwerty-learner 商务英语词库 + 外贸专业术语
 */

var TRADE_CATEGORIES = {
  CUSTOMER_DEVELOPMENT: {
    id: 'customer_dev',
    name: '客户开发',
    icon: '👋',
    description: '展会交流、Cold Email、客户拜访'
  },
  PRODUCT_INQUIRY: {
    id: 'product_inquiry',
    name: '产品询价',
    icon: '📋',
    description: '产品咨询、规格确认、样品请求'
  },
  PRICE_NEGOTIATION: {
    id: 'price_negotiation',
    name: '价格谈判',
    icon: '💰',
    description: '报价、还价、折扣谈判'
  },
  ORDER_CONFIRMATION: {
    id: 'order_confirm',
    name: '订单确认',
    icon: '📄',
    description: 'PI、合同条款、付款方式'
  },
  SHIPPING_LOGISTICS: {
    id: 'shipping',
    name: '物流沟通',
    icon: '🚢',
    description: '货期、运输方式、报关'
  },
  AFTER_SALES: {
    id: 'after_sales',
    name: '售后服务',
    icon: '🔧',
    description: '质量问题、退换货、维修'
  },
  COMPLAINT_HANDLING: {
    id: 'complaint',
    name: '投诉处理',
    icon: '📞',
    description: '客户投诉、纠纷解决'
  },
  VIDEO_CONFERENCE: {
    id: 'video_meeting',
    name: '视频会议',
    icon: '💻',
    description: '在线会议、屏幕共享、演示'
  }
}

// BEC商务英语核心词汇 + 外贸专业术语
var WORD_LIST = [
  // 客户开发
  {
    word: 'prospect',
    phonetic: '/ˈprɒspekt/',
    meaning: '潜在客户',
    category: 'customer_dev',
    example: 'We have identified several new prospects in the European market.',
    difficulty: 2,
    wrongPronunciation: ['/prəˈspekt/']
  },
  {
    word: 'lead',
    phonetic: '/liːd/',
    meaning: '销售线索',
    category: 'customer_dev',
    example: 'How many qualified leads did you get from the trade show?',
    difficulty: 1,
    wrongPronunciation: ['/led/']
  },
  {
    word: 'referral',
    phonetic: '/rɪˈfɜːrəl/',
    meaning: '推荐',
    category: 'customer_dev',
    example: 'Most of our new clients come from referrals.',
    difficulty: 3,
    wrongPronunciation: ['/ˈrefərəl/']
  },
  {
    word: 'cold call',
    phonetic: '/kəʊld kɔːl/',
    meaning: '陌生拜访电话',
    category: 'customer_dev',
    example: 'Cold calling is still an effective way to find new customers.',
    difficulty: 2
  },
  
  // 产品询价
  {
    word: 'inquiry',
    phonetic: '/ɪnˈkwaɪəri/',
    meaning: '询盘',
    category: 'product_inquiry',
    example: 'We received an inquiry for 500 units of Model A.',
    difficulty: 2,
    wrongPronunciation: ['/ˈɪnkwəri/']
  },
  {
    word: 'specification',
    phonetic: '/ˌspesɪfɪˈkeɪʃn/',
    meaning: '规格',
    category: 'product_inquiry',
    example: 'Please check the product specifications in the attachment.',
    difficulty: 3
  },
  {
    word: 'catalog',
    phonetic: '/ˈkætəlɒɡ/',
    meaning: '产品目录',
    category: 'product_inquiry',
    example: 'I will send you our latest catalog by email.',
    difficulty: 2,
    wrongPronunciation: ['/ˈkætəˈlɒɡ/']
  },
  {
    word: 'sample',
    phonetic: '/ˈsɑːmpl/',
    meaning: '样品',
    category: 'product_inquiry',
    example: 'We can provide free samples for your evaluation.',
    difficulty: 1
  },
  {
    word: 'MOQ',
    phonetic: '/em əʊ kjuː/',
    meaning: '最小起订量 (Minimum Order Quantity)',
    category: 'product_inquiry',
    example: 'Our MOQ is 1000 pieces per color.',
    difficulty: 2
  },
  
  // 价格谈判
  {
    word: 'quotation',
    phonetic: '/kwəʊˈteɪʃn/',
    meaning: '报价单',
    category: 'price_negotiation',
    example: 'Could you send me a formal quotation?',
    difficulty: 2,
    wrongPronunciation: ['/ˈkwəʊteɪʃn/']
  },
  {
    word: 'FOB',
    phonetic: '/ef əʊ biː/',
    meaning: '离岸价 (Free On Board)',
    category: 'price_negotiation',
    example: 'Our price is USD 10 per unit FOB Shanghai.',
    difficulty: 2
  },
  {
    word: 'CIF',
    phonetic: '/siː aɪ ef/',
    meaning: '到岸价 (Cost, Insurance and Freight)',
    category: 'price_negotiation',
    example: 'We usually quote CIF prices to our European clients.',
    difficulty: 2
  },
  {
    word: 'counteroffer',
    phonetic: '/ˈkaʊntərˌɒfər/',
    meaning: '还盘',
    category: 'price_negotiation',
    example: 'Your price is too high. Here is our counteroffer.',
    difficulty: 3
  },
  {
    word: 'discount',
    phonetic: '/ˈdɪskaʊnt/',
    meaning: '折扣',
    category: 'price_negotiation',
    example: 'We can offer a 5% discount for orders over 10,000 units.',
    difficulty: 2,
    wrongPronunciation: ['/dɪsˈkaʊnt/']
  },
  {
    word: 'bulk',
    phonetic: '/bʌlk/',
    meaning: '大宗，批量',
    category: 'price_negotiation',
    example: 'We offer special prices for bulk orders.',
    difficulty: 2
  },
  
  // 订单确认
  {
    word: 'PI',
    phonetic: '/piː aɪ/',
    meaning: '形式发票 (Proforma Invoice)',
    category: 'order_confirm',
    example: 'Please sign and return the PI to confirm your order.',
    difficulty: 1
  },
  {
    word: 'purchase order',
    phonetic: '/ˈpɜːtʃəs ˈɔːrdər/',
    meaning: '采购订单',
    category: 'order_confirm',
    example: 'We have issued the purchase order. Please check.',
    difficulty: 2
  },
  {
    word: 'deposit',
    phonetic: '/dɪˈpɒzɪt/',
    meaning: '定金',
    category: 'order_confirm',
    example: 'We require a 30% deposit before production.',
    difficulty: 2
  },
  {
    word: 'balance',
    phonetic: '/ˈbæləns/',
    meaning: '尾款',
    category: 'order_confirm',
    example: 'The balance should be paid before shipment.',
    difficulty: 1
  },
  {
    word: 'T/T',
    phonetic: '/tiː tiː/',
    meaning: '电汇 (Telegraphic Transfer)',
    category: 'order_confirm',
    example: 'Our payment term is 30% T/T in advance.',
    difficulty: 1
  },
  {
    word: 'L/C',
    phonetic: '/el siː/',
    meaning: '信用证 (Letter of Credit)',
    category: 'order_confirm',
    example: 'We prefer payment by L/C at sight.',
    difficulty: 2
  },
  
  // 物流沟通
  {
    word: 'shipment',
    phonetic: '/ˈʃɪpmənt/',
    meaning: '装运，出货',
    category: 'shipping',
    example: 'When can you arrange the shipment?',
    difficulty: 2
  },
  {
    word: 'lead time',
    phonetic: '/liːd taɪm/',
    meaning: '交货期',
    category: 'shipping',
    example: 'Our standard lead time is 30 days after order confirmation.',
    difficulty: 2
  },
  {
    word: 'container',
    phonetic: '/kənˈteɪnər/',
    meaning: '集装箱',
    category: 'shipping',
    example: 'One 20-foot container can hold about 500 cartons.',
    difficulty: 2
  },
  {
    word: 'customs',
    phonetic: '/ˈkʌstəmz/',
    meaning: '海关',
    category: 'shipping',
    example: 'The goods are held at customs for inspection.',
    difficulty: 2
  },
  {
    word: 'clearance',
    phonetic: '/ˈklɪərəns/',
    meaning: '清关',
    category: 'shipping',
    example: 'We need to complete customs clearance before delivery.',
    difficulty: 3
  },
  {
    word: 'ETA',
    phonetic: '/iː tiː eɪ/',
    meaning: '预计到达时间 (Estimated Time of Arrival)',
    category: 'shipping',
    example: 'The ETA at Hamburg port is March 15th.',
    difficulty: 1
  },
  {
    word: 'ETD',
    phonetic: '/iː tiː diː/',
    meaning: '预计离港时间 (Estimated Time of Departure)',
    category: 'shipping',
    example: 'The ETD from Shanghai is next Monday.',
    difficulty: 1
  },
  
  // 售后服务
  {
    word: 'warranty',
    phonetic: '/ˈwɒrənti/',
    meaning: '质保',
    category: 'after_sales',
    example: 'We offer a one-year warranty for all our products.',
    difficulty: 2,
    wrongPronunciation: ['/ˈwɔːrənti/']
  },
  {
    word: 'defective',
    phonetic: '/dɪˈfektɪv/',
    meaning: '有缺陷的',
    category: 'after_sales',
    example: 'We found some defective units in the last shipment.',
    difficulty: 3
  },
  {
    word: 'replacement',
    phonetic: '/rɪˈpleɪsmənt/',
    meaning: '更换',
    category: 'after_sales',
    example: 'We will send a replacement free of charge.',
    difficulty: 2
  },
  {
    word: 'refund',
    phonetic: '/ˈriːfʌnd/',
    meaning: '退款',
    category: 'after_sales',
    example: 'We can offer a full refund if you are not satisfied.',
    difficulty: 2
  },
  
  // 投诉处理
  {
    word: 'complaint',
    phonetic: '/kəmˈpleɪnt/',
    meaning: '投诉',
    category: 'complaint',
    example: 'We received a complaint about the product quality.',
    difficulty: 2
  },
  {
    word: 'compensation',
    phonetic: '/ˌkɒmpenˈseɪʃn/',
    meaning: '赔偿',
    category: 'complaint',
    example: 'We are willing to offer compensation for the loss.',
    difficulty: 3
  },
  {
    word: 'resolve',
    phonetic: '/rɪˈzɒlv/',
    meaning: '解决',
    category: 'complaint',
    example: 'We hope to resolve this issue as soon as possible.',
    difficulty: 2
  },
  
  // 视频会议
  {
    word: 'agenda',
    phonetic: '/əˈdʒendə/',
    meaning: '议程',
    category: 'video_meeting',
    example: 'Please check the meeting agenda I sent earlier.',
    difficulty: 2
  },
  {
    word: 'follow-up',
    phonetic: '/ˈfɒləʊ ʌp/',
    meaning: '跟进',
    category: 'video_meeting',
    example: 'Let us schedule a follow-up meeting next week.',
    difficulty: 2
  },
  {
    word: 'action item',
    phonetic: '/ˈækʃn ˈaɪtəm/',
    meaning: '行动事项',
    category: 'video_meeting',
    example: 'Here are the action items from today\'s meeting.',
    difficulty: 2
  }
]

// 获取分类列表
function getCategories() {
  var result = []
  for (var key in TRADE_CATEGORIES) {
    result.push(TRADE_CATEGORIES[key])
  }
  return result
}

// 根据分类获取单词
function getWordsByCategory(categoryId) {
  var result = []
  for (var i = 0; i < WORD_LIST.length; i++) {
    if (WORD_LIST[i].category === categoryId) {
      result.push(WORD_LIST[i])
    }
  }
  return result
}

// 获取所有单词
function getAllWords() {
  return WORD_LIST
}

// 根据难度获取单词
function getWordsByDifficulty(difficulty) {
  var result = []
  for (var i = 0; i < WORD_LIST.length; i++) {
    if (WORD_LIST[i].difficulty === difficulty) {
      result.push(WORD_LIST[i])
    }
  }
  return result
}

// 搜索单词
function searchWords(keyword) {
  var lowerKeyword = keyword.toLowerCase()
  var result = []
  for (var i = 0; i < WORD_LIST.length; i++) {
    var word = WORD_LIST[i]
    if (word.word.toLowerCase().indexOf(lowerKeyword) >= 0 ||
        word.meaning.indexOf(keyword) >= 0) {
      result.push(word)
    }
  }
  return result
}

// 获取随机单词（用于每日推荐）
function getRandomWord() {
  var index = Math.floor(Math.random() * WORD_LIST.length)
  return WORD_LIST[index]
}

// 获取今日单词列表（用于每日学习）
function getDailyWords(count) {
  count = count || 10
  var shuffled = WORD_LIST.slice().sort(function() { return 0.5 - Math.random() })
  return shuffled.slice(0, count)
}

module.exports = {
  TRADE_CATEGORIES: TRADE_CATEGORIES,
  WORD_LIST: WORD_LIST,
  getCategories: getCategories,
  getWordsByCategory: getWordsByCategory,
  getAllWords: getAllWords,
  getWordsByDifficulty: getWordsByDifficulty,
  searchWords: searchWords,
  getRandomWord: getRandomWord,
  getDailyWords: getDailyWords
}