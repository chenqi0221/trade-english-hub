/**
 * 火山引擎 TTS 云函数
 * 调用豆包语音合成 API (v1 REST + Bearer Token)
 * 返回云存储文件 ID 供小程序播放
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const https = require('https');

const CONFIG = {
  host: 'openspeech.bytedance.com',
  path: '/api/v1/tts',
  appId: '2793309989',
  accessToken: '9Pe27NebV-fEa-ThCEwWryA4PwH-R4bt',
  cluster: 'volcano_tts',
  voiceType: 'en_female_amanda_mars_bigtts',
  encoding: 'mp3',
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function callVolcanoTTS(text) {
  return new Promise(function (resolve, reject) {
    var postData = JSON.stringify({
      app: {
        appid: CONFIG.appId,
        token: CONFIG.accessToken,
        cluster: CONFIG.cluster,
      },
      user: {
        uid: 'wxmp_user',
      },
      audio: {
        voice_type: CONFIG.voiceType,
        encoding: CONFIG.encoding,
        speed_ratio: 1.0,
        volume_ratio: 1.0,
        pitch_ratio: 1.0,
      },
      request: {
        reqid: uuid(),
        text: text,
        text_type: 'plain',
        operation: 'query',
      },
    });

    var options = {
      hostname: CONFIG.host,
      path: CONFIG.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        Authorization: 'Bearer;' + CONFIG.accessToken,
      },
    };

    var req = https.request(options, function (res) {
      var chunks = [];
      res.on('data', function (chunk) {
        chunks.push(chunk);
      });
      res.on('end', function () {
        var buffer = Buffer.concat(chunks);
        var body = buffer.toString('utf8');

        if (res.statusCode !== 200) {
          reject(new Error('HTTP ' + res.statusCode + ': ' + body.substring(0, 200)));
          return;
        }

        try {
          var json = JSON.parse(body);
          if (json.code === 3000 && json.data) {
            var audioBuffer = Buffer.from(json.data, 'base64');
            resolve(audioBuffer);
          } else {
            reject(new Error('API error: code=' + json.code + ' msg=' + json.message));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + e.message));
        }
      });
    });

    req.on('error', function (err) {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

exports.main = async function (event, context) {
  var text = event.text;

  if (!text || text.trim().length === 0) {
    return { code: -1, message: '文本不能为空' };
  }

  // 超长文本截断（API 限制约 1000 字符）
  var trimmed = text.trim();
  if (trimmed.length > 800) {
    trimmed = trimmed.substring(0, 800);
  }

  try {
    var audioBuffer = await callVolcanoTTS(trimmed);
    var cloudPath = 'tts/' + uuid() + '.mp3';

    var uploadResult = await cloud.uploadFile({
      cloudPath: cloudPath,
      fileContent: audioBuffer,
    });

    return {
      code: 0,
      message: 'success',
      data: {
        fileID: uploadResult.fileID,
        cloudPath: cloudPath,
      },
    };
  } catch (err) {
    console.error('TTS error:', err.message || err);
    return {
      code: -1,
      message: err.message || 'TTS调用失败',
    };
  }
};