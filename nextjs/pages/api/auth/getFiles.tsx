import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path'

const countSize = (size: number) => {
  if (size > 100 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(1) + 'GB';
  }
  else if (size > 100 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + 'MB';
  }
  else if (size > 100) {
    return (size / 1024).toFixed(1) + 'KB';
  }
  else {
    return size + 'B';
  }
}

export function handlePath(p: string) {
  while (!fs.existsSync(process.env.root + p)) {
    p = path.dirname(p);
  }
  return {
    path: p,
    type: fs.statSync(process.env.root + p).isFile()
  };
}

export function readDir(p: string) {
  p = process.env.root + p;
  return fs.readdirSync(p).map((v: string) => {
    const stat = fs.statSync(path.join(p, v));
    return {
      key: stat.ino,
      type: stat.isFile() ? 1 : 0,
      name: v,
      time: stat.mtime.getFullYear() + '.' + (stat.mtime.getMonth()+1) + '.' + stat.mtime.getDate(),
      size: stat.isFile() ? countSize(stat.size) : ''
    };
  }).sort((a, b) => {
    return a.type - b.type + ((a.type - b.type == 0) && (a.name > b.name ? 1 : -1));
  });
}

// 获得路径下文件信息
export default function getFiles(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ret = readDir(req.body);
    res.json(ret);
    res.end();
  }
  catch (ex) {
    console.error(ex.stack);
    res.statusCode = 408;
    res.end();
  }
}