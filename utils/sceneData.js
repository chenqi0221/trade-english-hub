/**
 * 外贸场景对话数据
 * 模拟真实外贸沟通场景
 */

const SCENES = [
  {
    id: 'customer_dev',
    name: '客户开发',
    icon: '👋',
    description: '展会交流、Cold Email、客户拜访',
    dialogs: [
      {
        role: 'sales',
        text: 'Hello, welcome to our booth. I\'m David from ABC Trading Company.',
        chinese: '您好，欢迎光临我们的展位。我是ABC贸易公司的大卫。'
      },
      {
        role: 'customer',
        text: 'Hi David, nice to meet you. I\'m interested in your electronic products.',
        chinese: '你好大卫，很高兴认识你。我对你们的电子产品很感兴趣。'
      },
      {
        role: 'sales',
        text: 'Great! We specialize in consumer electronics. May I have your business card?',
        chinese: '太好了！我们专注于消费电子产品。能给我一张您的名片吗？'
      },
      {
        role: 'customer',
        text: 'Sure, here you go. We are a distributor based in Germany.',
        chinese: '当然，给您。我们是德国的经销商。'
      },
      {
        role: 'sales',
        text: 'Excellent! We are looking for distributors in Europe. Let me show you our catalog.',
        chinese: '太好了！我们正在寻找欧洲经销商。让我给您看一下我们的产品目录。'
      }
    ]
  },
  {
    id: 'product_inquiry',
    name: '产品询价',
    icon: '📋',
    description: '产品咨询、规格确认、样品请求',
    dialogs: [
      {
        role: 'customer',
        text: 'I saw your product on Alibaba. Can you give me more details about Model X200?',
        chinese: '我在阿里巴巴上看到了你们的产品。能给我更多关于X200型号的详细信息吗？'
      },
      {
        role: 'sales',
        text: 'Of course. The X200 is our bestseller. It comes with a 2-year warranty.',
        chinese: '当然可以。X200是我们的畅销产品。它提供两年质保。'
      },
      {
        role: 'customer',
        text: 'What\'s the MOQ? And do you offer samples?',
        chinese: '最小起订量是多少？你们提供样品吗？'
      },
      {
        role: 'sales',
        text: 'Our MOQ is 500 units. Yes, we provide free samples, but you need to pay for shipping.',
        chinese: '我们的最小起订量是500件。是的，我们提供免费样品，但您需要支付运费。'
      },
      {
        role: 'customer',
        text: 'That sounds reasonable. Can you send me the specifications?',
        chinese: '听起来合理。你能把规格书发给我吗？'
      }
    ]
  },
  {
    id: 'price_negotiation',
    name: '价格谈判',
    icon: '💰',
    description: '报价、还价、折扣谈判',
    dialogs: [
      {
        role: 'customer',
        text: 'Your price is much higher than other suppliers. Can you offer a better price?',
        chinese: '你们的价格比其他供应商高很多。能给个更好的价格吗？'
      },
      {
        role: 'sales',
        text: 'We use high-quality materials. However, for orders over 1000 units, we can offer a 5% discount.',
        chinese: '我们使用高质量材料。不过，订单超过1000件的话，我们可以提供5%的折扣。'
      },
      {
        role: 'customer',
        text: 'What about 10% discount for 2000 units?',
        chinese: '2000件的话10%折扣怎么样？'
      },
      {
        role: 'sales',
        text: 'That\'s a bit difficult. How about 8% discount and free shipping?',
        chinese: '这有点困难。8%折扣加免费运输怎么样？'
      },
      {
        role: 'customer',
        text: 'Deal! Please send me the updated quotation.',
        chinese: '成交！请给我更新后的报价单。'
      }
    ]
  },
  {
    id: 'order_confirm',
    name: '订单确认',
    icon: '📄',
    description: 'PI、合同条款、付款方式',
    dialogs: [
      {
        role: 'sales',
        text: 'Thank you for your order. I will send you the Proforma Invoice shortly.',
        chinese: '感谢您的订单。我稍后会发给您形式发票。'
      },
      {
        role: 'customer',
        text: 'What are your payment terms?',
        chinese: '你们的付款条件是什么？'
      },
      {
        role: 'sales',
        text: 'Our standard terms are 30% deposit by T/T, and 70% balance before shipment.',
        chinese: '我们的标准条款是30%定金电汇，70%尾款发货前支付。'
      },
      {
        role: 'customer',
        text: 'Can we do L/C at 60 days?',
        chinese: '我们可以做60天信用证吗？'
      },
      {
        role: 'sales',
        text: 'For the first order, we prefer T/T. For future orders, we can consider L/C.',
        chinese: '首单我们 prefer 电汇。后续订单我们可以考虑信用证。'
      }
    ]
  },
  {
    id: 'shipping',
    name: '物流沟通',
    icon: '🚢',
    description: '货期、运输方式、报关',
    dialogs: [
      {
        role: 'customer',
        text: 'When will my order be shipped?',
        chinese: '我的订单什么时候发货？'
      },
      {
        role: 'sales',
        text: 'Production will be completed by next Friday. Shipment will be arranged the following Monday.',
        chinese: '生产将于下周五完成。下周一安排发货。'
      },
      {
        role: 'customer',
        text: 'What\'s the ETA at Hamburg port?',
        chinese: '到汉堡港的预计到达时间是什么时候？'
      },
      {
        role: 'sales',
        text: 'The sea freight takes about 25 days. So ETA should be around March 20th.',
        chinese: '海运大约需要25天。所以预计到达时间应该是3月20日左右。'
      },
      {
        role: 'customer',
        text: 'Please send me the B/L and packing list once shipped.',
        chinese: '发货后请把提单和装箱单发给我。'
      }
    ]
  },
  {
    id: 'after_sales',
    name: '售后服务',
    icon: '🔧',
    description: '质量问题、退换货、维修',
    dialogs: [
      {
        role: 'customer',
        text: 'We found some defective products in the last shipment.',
        chinese: '我们在上一批货中发现了一些有缺陷的产品。'
      },
      {
        role: 'sales',
        text: 'I\'m sorry to hear that. How many units are affected?',
        chinese: '很抱歉听到这个消息。有多少件产品受影响？'
      },
      {
        role: 'customer',
        text: 'About 50 units out of 1000. The buttons are not working properly.',
        chinese: '1000件中大约有50件。按钮不能正常工作。'
      },
      {
        role: 'sales',
        text: 'We will send replacements immediately. Could you send us photos of the defective items?',
        chinese: '我们会立即发送替换品。您能把有缺陷产品的照片发给我们吗？'
      },
      {
        role: 'customer',
        text: 'Sure, I\'ll send them today. We hope this won\'t happen again.',
        chinese: '当然，我今天会发。希望这种情况不要再发生。'
      }
    ]
  },
  {
    id: 'complaint',
    name: '投诉处理',
    icon: '📞',
    description: '客户投诉、纠纷解决',
    dialogs: [
      {
        role: 'customer',
        text: 'I\'m very disappointed. The products don\'t match the samples you sent.',
        chinese: '我非常失望。产品和你们寄来的样品不符。'
      },
      {
        role: 'sales',
        text: 'I sincerely apologize for this issue. Let me investigate immediately.',
        chinese: '对此我深表歉意。我立即调查。'
      },
      {
        role: 'customer',
        text: 'This has caused serious problems with our customers. We may need to cancel future orders.',
        chinese: '这给我们的客户造成了严重问题。我们可能需要取消后续订单。'
      },
      {
        role: 'sales',
        text: 'I understand your frustration. We are willing to offer compensation and ensure quality for all future orders.',
        chinese: '我理解您的沮丧。我们愿意提供赔偿，并确保所有后续订单的质量。'
      },
      {
        role: 'customer',
        text: 'What kind of compensation are you offering?',
        chinese: '你们提供什么样的赔偿？'
      }
    ]
  },
  {
    id: 'video_meeting',
    name: '视频会议',
    icon: '💻',
    description: '在线会议、屏幕共享、演示',
    dialogs: [
      {
        role: 'sales',
        text: 'Good morning everyone. Thanks for joining this video conference.',
        chinese: '大家早上好。感谢参加这次视频会议。'
      },
      {
        role: 'customer',
        text: 'Good morning. Can you share your screen to show the new product designs?',
        chinese: '早上好。你能共享屏幕展示新产品设计吗？'
      },
      {
        role: 'sales',
        text: 'Sure, let me share my screen. Here are our latest designs for 2026.',
        chinese: '当然，让我共享屏幕。这是我们2026年的最新设计。'
      },
      {
        role: 'customer',
        text: 'These look great. Can you walk us through the key features?',
        chinese: '看起来不错。你能给我们介绍一下主要特点吗？'
      },
      {
        role: 'sales',
        text: 'Absolutely. The main improvements are better battery life and faster charging.',
        chinese: '当然。主要改进是更长的电池续航和更快的充电速度。'
      }
    ]
  }
]

// 常用句型库
const COMMON_PHRASES = {
  greeting: [
    { en: 'Nice to meet you.', cn: '很高兴见到您。' },
    { en: 'It\'s a pleasure to connect with you.', cn: '很高兴与您联系。' },
    { en: 'Thank you for your interest in our products.', cn: '感谢您对我们产品的兴趣。' }
  ],
  inquiry: [
    { en: 'Could you please provide more details?', cn: '您能提供更多细节吗？' },
    { en: 'What\'s your target price?', cn: '您的目标价格是多少？' },
    { en: 'Do you have any specific requirements?', cn: '您有什么具体要求吗？' }
  ],
  negotiation: [
    { en: 'We can offer a better price for larger quantities.', cn: '量大我们可以提供更好的价格。' },
    { en: 'This is our best offer.', cn: '这是我们最好的报价。' },
    { en: 'Let\'s meet halfway.', cn: '我们各让一步吧。' }
  ],
  closing: [
    { en: 'Looking forward to your reply.', cn: '期待您的回复。' },
    { en: 'Please let me know if you have any questions.', cn: '如有任何问题请告诉我。' },
    { en: 'Thank you for your time.', cn: '感谢您的时间。' }
  ]
}

function getAllScenes() {
  return SCENES
}

function getSceneById(id) {
  return SCENES.find(scene => scene.id === id)
}

function getCommonPhrases(category) {
  return COMMON_PHRASES[category] || []
}

function getAllPhrases() {
  return COMMON_PHRASES
}

module.exports = {
  SCENES,
  COMMON_PHRASES,
  getAllScenes,
  getSceneById,
  getCommonPhrases,
  getAllPhrases
}
