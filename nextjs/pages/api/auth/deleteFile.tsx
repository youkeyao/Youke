import fs from 'fs'
import path from 'path'

const removeFileOrDir = (p) => {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(p);
    files.forEach((file) => {
      removeFileOrDir(path.join(p, file));  
    });
    fs.rmdirSync(p);
  }
  else {
    fs.unlinkSync(p);
  }
}

// 上传文件
export default (req, res) => {
  try {
    removeFileOrDir(process.env.root + req.body);
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