import fs from 'fs'

// 新建文件夹
export default (req, res) => {
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