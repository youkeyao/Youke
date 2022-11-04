import fs from 'fs'
import { IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false
  },
}

// 上传文件
export default async function uploadFiles(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new IncomingForm();
    form.options.keepExtensions = true;
    form.options.multiples = true;
    form.options.maxFileSize = 1024 * 1024 * 1024;
    form.uploadDir = 'tmp'; //临时目录
    await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        // 从临时目录移到正确目录
        Object.keys(files).forEach((k) => {
          fs.renameSync(files[k].filepath, process.env.root + fields.path + files[k].originalFilename);
        });
        res.statusCode = 200;
        res.end();
        resolve(200);
      });      
    });
  }
  catch (ex) {
    console.error(ex.stack);
    res.statusCode = 408;
    res.end();
  }
}