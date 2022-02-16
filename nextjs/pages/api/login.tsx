import nookies from 'nookies'
import jwt from 'jsonwebtoken'

// 判断token是否合法，s: string | NextApiRequest
export function isValid(s) {
  const token = typeof s === 'string' ? s : nookies.get(s).token;
  try {
    jwt.verify(token, process.env.secret);
    return true;
  }
  catch (err) {
    return false;
  }
}

// 登陆
export default (req, res) => {
  try {
    const user = JSON.parse(req.body);
    if (user.username == process.env.username && user.password == process.env.password) {
      res.statusCode = 200;
      nookies.set({res}, 'token', jwt.sign(user.username, process.env.secret), {
        maxAge: 5 * 60,
        path: '/',
        httpOnly: true
      });
      res.send();
    }
    else {
      throw new Error('Account Error');
    }
  }
  catch (ex) {
    console.log(ex.stack);
    res.statusCode = 403;
    res.end();
  }
}