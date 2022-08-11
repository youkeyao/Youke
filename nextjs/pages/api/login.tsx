import nookies from 'nookies'
import jwt from 'jsonwebtoken'

// 判断token是否合法
export function isValid(token: string) {
  try {
    jwt.verify(token, process.env.secret);
    return true;
  }
  catch (err) {
    return false;
  }
}

// 登陆
export default function login(req, res) {
  console.log(new Date(Date.now()).toLocaleString());
  try {
    const user = JSON.parse(req.body);
    if (user.token && isValid(user.token)) {
      res.statusCode = 200;
      res.end();
    }
    else if (user.username == process.env.username && user.password == process.env.password) {
      console.log(req.body);
      res.statusCode = 200;
      nookies.set({res}, 'token', jwt.sign(user.username, process.env.secret), {
        // maxAge: 0,
        path: '/',
        httpOnly: true,
      });
      res.send();
    }
    else {
      throw new Error('Account Error');
    }
  }
  catch (ex) {
    console.log(ex.stack);
    res.statusCode = 401;
    res.end();
  }
}
