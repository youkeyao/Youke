import style from '../styles/Blog.module.css'
import { GetStaticProps } from 'next';
import fs from 'fs'

import Tree from "../components/Tree/Tree"

export const getStaticProps: GetStaticProps = async () => {
  const readBlogs = (path) => {
    return fs.readdirSync(path).map((name) => {
      const stat = fs.statSync(path + '/' + name);
      if (stat.isFile()) {
        const data = fs.readFileSync(path + '/' + name, 'utf-8');
        return {
          name: name,
          title: (data.match(/---\n([\d\D]*)\n---/)[1].match(/title: (.*)/)[1])
        }
      }
      else {
        return {
          name: name,
          children: readBlogs(path + '/' + name)
        }
      }
    });
  }

  return {
    props: {
      blogs: readBlogs("./posts/blog")
    }
  }
}

export default function Blog(props) {
  return (
    <div className={style.main}>
      <Tree data={props.blogs} root="/blog" />
    </div>
  )
}