import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next';

// 新建文件夹
export default function newFolder(req: NextApiRequest, res: NextApiResponse) {
  try {
    fs.mkdirSync(process.env.root + req.body)
    res.statusCode = 200;
  }
  catch (ex) {
    console.error(ex.stack);
    res.statusCode = 408;
  }
  finally {
    res.end();
  }
}