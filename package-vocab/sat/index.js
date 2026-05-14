var words = require('./words.js')
var app = getApp()
if (app && app.globalData) {
    app.globalData.vocabData = app.globalData.vocabData || {}
    app.globalData.vocabData.sat = words
}
module.exports = words
