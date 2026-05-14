var words = require('./words.js')
var app = getApp()
if (app && app.globalData) {
    app.globalData.vocabData = app.globalData.vocabData || {}
    app.globalData.vocabData.cet6 = words
}
module.exports = words
