const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

const iv = Buffer.from('0102030405060708');
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud');
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----';

const aesEncrypt = (buffer, mode, key, iv) => {
  const cipher = crypto.createCipheriv('aes-128-' + mode, key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

const rsaEncrypt = (buffer, key) => {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer]);
  return crypto.publicEncrypt(
    { key: key, padding: crypto.constants.RSA_NO_PADDING },
    buffer,
  );
}

const weapi = (object) => {
  const text = JSON.stringify(object);
  const secretKey = crypto
    .randomBytes(16)
    .map((n) => base62.charAt(n % 62).charCodeAt(0));
  return {
    params: aesEncrypt(
      Buffer.from(
        aesEncrypt(Buffer.from(text), 'cbc', presetKey, iv).toString('base64'),
      ),
      'cbc',
      secretKey,
      iv,
    ).toString('base64'),
    encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex'),
  };
}

export default function neteasecloud(req, res) {
  return new Promise<void>((resolve, reject) => {
    console.log(new Date(Date.now()).toLocaleString());
    console.log('neteasecloud: ' + req.body);
    try {
      const body = JSON.parse(req.body);
      let result = '';
      const options = {
        host: 'music.163.com',
        path: '',
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      options.path = body.api;
      const request = https.request(options, (response) => {
        response.on('data', (d) => {
          result += ('' + d);
        });
        response.on('end', () => {
          res.send(result);
          resolve();
        });
      });
      request.write(querystring.stringify(weapi(body.data)));
      request.end();
    }
    catch (ex) {
      console.log(ex.stack);
      res.statusCode = 403;
      res.end();
      reject();
    }
  });
}