import style from '../../styles/Blog.module.css'
import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import vscDarkPlus from "../../public/vsc-dark-plus"

import 'katex/dist/katex.min.css'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const name = decodeURIComponent(params.name.toString()).replace(',', '/');
  try {
    const data = fs.readFileSync("./posts/blog/" + name, 'utf-8');
    return {
      props: {
        title: data.match(/---\n([\d\D]*)\n---/)[1].match(/title: (.*)/)[1],
        date: data.match(/---\n([\d\D]*)\n---/)[1].match(/date: (.*)/)[1],
        content: data.match(/---([\d\D]*)---\n([\d\D]*)/)[2]
      }
    }
  }
  catch {
    return {
      redirect: {
        destination: '/blog',
        permanent: false,
      },
    }
  }
}

export default function Blog(props) {
  return (
    <div className={style.main}>
      <div className={style.container}>
        <h1 className={style.title}>{props.title}</h1>
        <p className={style.date}>{props.date}</p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >{props.content}</ReactMarkdown>
      </div>
    </div>
  )
}
