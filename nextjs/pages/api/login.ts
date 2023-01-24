import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT, jwtVerify } from 'jose'

export async function isValid(token: string) {
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.secret)
    )
    return true;
  } catch (err) {
    return false;
  }
}

// 登陆
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = JSON.parse(req.body);
    console.log(new Date(Date.now()).toLocaleString());

    if (user.username == process.env.username && user.password == process.env.password) {
      console.log(req.body);
      res.statusCode = 200;
      const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.secret))
      res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly;`);
      res.end();
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