import fs from 'fs'
import { IncomingForm } from 'formidable'

export const config = {
  api: {
    bodyParser: false
  },
}

// 上传文件
export default (req, res) => {
  try {
    const form = new IncomingForm()
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = 'tmp'; //临时目录
    // 进度条
    form.on("progress", (recivedByte: number, totalByte: number) => {
      const percent = (recivedByte * 100 / totalByte).toFixed(1);
      res.write(percent + ' ');
      if (recivedByte == totalByte) {
        res.statusCode = 200;
        res.send();
      }
    });
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      // 从临时目录移到正确目录
      Object.keys(files).forEach((k) => {
        fs.renameSync(files[k].filepath, process.env.root + fields.path + files[k].originalFilename);
      });
    })
  }
  catch (ex) {
    console.error(ex.stack);
    res.statusCode = 408;
    res.end();
  }
}