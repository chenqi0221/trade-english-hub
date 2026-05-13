/**
 * 问候语和名言诗句库
 * 根据时间段显示不同的问候语，随机显示励志名言
 */

// 时间段问候语配置
var GREETINGS = {
  morning: {
    texts: [
      { greeting: '早安，外贸人', emoji: '☀️', sub: '一日之计在于晨，今天也要加油！' },
      { greeting: '早上好', emoji: '🌅', sub: '新的一天，新的订单在等你' },
      { greeting: '早安', emoji: '☕', sub: '喝杯咖啡，开始高效的一天' },
      { greeting: 'Morning', emoji: '🌞', sub: 'The early bird catches the worm' }
    ]
  },
  noon: {
    texts: [
      { greeting: '午安，外贸人', emoji: '🍵', sub: '休息一下，下午继续战斗' },
      { greeting: '中午好', emoji: '🍜', sub: '吃饱喝足，能量满满' },
      { greeting: '午安', emoji: '🌤️', sub: '稍作休息，再战江湖' }
    ]
  },
  afternoon: {
    texts: [
      { greeting: '下午好，外贸人', emoji: '💪', sub: '坚持就是胜利' },
      { greeting: '下午好', emoji: '📈', sub: '订单正在路上' },
      { greeting: 'Good Afternoon', emoji: '🎯', sub: 'Stay focused, stay hungry' },
      { greeting: '下午好', emoji: '☕', sub: '来杯咖啡提提神' }
    ]
  },
  evening: {
    texts: [
      { greeting: '晚上好，外贸人', emoji: '🌙', sub: '充实的一天，辛苦了' },
      { greeting: '晚上好', emoji: '🌆', sub: '日落而息，学习不止' },
      { greeting: 'Evening', emoji: '✨', sub: 'Every day is a new beginning' },
      { greeting: '晚上好', emoji: '📚', sub: '夜晚是学习的最佳时光' }
    ]
  },
  night: {
    texts: [
      { greeting: '夜深了，外贸人', emoji: '🌟', sub: '注意休息，身体最重要' },
      { greeting: '晚安', emoji: '🌌', sub: 'Tomorrow is another day' },
      { greeting: '还没睡呀', emoji: '🦉', sub: '夜猫子也要注意休息哦' },
      { greeting: '深夜好', emoji: '💤', sub: 'Rest well, dream big' }
    ]
  }
}

// 外贸励志名言库
var QUOTES = [
  { en: 'Success is the sum of small efforts, repeated day in and day out.', cn: '成功是日复一日微小努力的总和。', author: 'Robert Collier' },
  { en: 'The only way to do great work is to love what you do.', cn: '做伟大工作的唯一方法就是热爱你所做的事。', author: 'Steve Jobs' },
  { en: 'Every expert was once a beginner.', cn: '每个专家都曾经是初学者。', author: 'Helen Hayes' },
  { en: 'Opportunities don\'t happen. You create them.', cn: '机会不会自己发生，是你创造它们。', author: 'Chris Grosser' },
  { en: 'The harder you work, the luckier you get.', cn: '你越努力，就越幸运。', author: 'Gary Player' },
  { en: 'Your attitude, not your aptitude, will determine your altitude.', cn: '决定你高度的不是你的能力，而是你的态度。', author: 'Zig Ziglar' },
  { en: 'Don\'t watch the clock; do what it does. Keep going.', cn: '不要盯着时钟看，要像时钟一样：不断前行。', author: 'Sam Levenson' },
  { en: 'The secret of getting ahead is getting started.', cn: '领先的秘诀就是开始行动。', author: 'Mark Twain' },
  { en: 'It always seems impossible until it\'s done.', cn: '在完成之前，一切看起来都不可能。', author: 'Nelson Mandela' },
  { en: 'Believe you can and you\'re halfway there.', cn: '相信你能做到，你就已经成功了一半。', author: 'Theodore Roosevelt' },
  { en: 'Quality is not an act, it is a habit.', cn: '质量不是一种行为，而是一种习惯。', author: 'Aristotle' },
  { en: 'The best way to predict the future is to create it.', cn: '预测未来的最好方式就是创造它。', author: 'Peter Drucker' },
  { en: 'A journey of a thousand miles begins with a single step.', cn: '千里之行，始于足下。', author: 'Lao Tzu' },
  { en: 'Success usually comes to those who are too busy to be looking for it.', cn: '成功通常降临在那些忙得没时间寻找它的人身上。', author: 'Henry David Thoreau' },
  { en: 'The difference between ordinary and extraordinary is that little extra.', cn: '平凡与非凡的区别就在于那一点点额外的努力。', author: 'Jimmy Johnson' },
  { en: 'Don\'t let yesterday take up too much of today.', cn: '不要让昨天占据今天太多的时间。', author: 'Will Rogers' },
  { en: 'You learn more from failure than from success.', cn: '你从失败中学到的比从成功中学到的更多。', author: 'Unknown' },
  { en: 'If you want to achieve greatness, stop asking for permission.', cn: '如果你想成就伟大，就不要再寻求许可。', author: 'Unknown' },
  { en: 'Everything you\'ve ever wanted is on the other side of fear.', cn: '你想要的一切都在恐惧的另一边。', author: 'George Addair' },
  { en: 'Dream big and dare to fail.', cn: '敢于梦想，敢于失败。', author: 'Norman Vaughan' }
]

function getGreeting() {
  var hour = new Date().getHours()
  var period = 'morning'
  
  if (hour >= 5 && hour < 11) {
    period = 'morning'
  } else if (hour >= 11 && hour < 14) {
    period = 'noon'
  } else if (hour >= 14 && hour < 18) {
    period = 'afternoon'
  } else if (hour >= 18 && hour < 22) {
    period = 'evening'
  } else {
    period = 'night'
  }
  
  var texts = GREETINGS[period].texts
  var randomIndex = Math.floor(Math.random() * texts.length)
  var randomText = texts[randomIndex]
  
  return {
    greeting: randomText.greeting + ' ' + randomText.emoji,
    sub: randomText.sub
  }
}

function getRandomQuote() {
  var randomIndex = Math.floor(Math.random() * QUOTES.length)
  var quote = QUOTES[randomIndex]
  return {
    text: quote.en,
    chinese: quote.cn,
    author: quote.author
  }
}

function getHomeContent() {
  var greeting = getGreeting()
  var quote = getRandomQuote()
  
  return {
    greeting: greeting.greeting,
    subTitle: greeting.sub,
    quote: quote
  }
}

module.exports = {
  getGreeting: getGreeting,
  getRandomQuote: getRandomQuote,
  getHomeContent: getHomeContent
}