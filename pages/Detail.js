import React from 'react'
import Head from 'next/head'
import { Row, Col, Icon, Breadcrumb, Affix } from 'antd'
import Header from '../components/Header'
import Author from '../components/Author'
import Advertisement from '../components/Advertisement'
import Footer from '../components/Footer'
import '../public/style/pages/Detail.css'
import 'markdown-navbar/dist/navbar.css';
import axios from 'axios'
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import Tocify from '../components/tocify.tsx'
const Detail = (initialProps) => {

  const renderer = new marked.Renderer();

  const tocify = new Tocify()
  renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
  };
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  let html = marked(initialProps.article_content)

  return (
    <>
      <Head>
        <title>Detailed</title>
      </Head>
      <Header />
      <Row className="comm-main" type="flex" justify="center">
        <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}  >
          <div>
            <div className="bread-div">
              <Breadcrumb>
                <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
                <Breadcrumb.Item>{initialProps.typeName}</Breadcrumb.Item>
                <Breadcrumb.Item> {initialProps.title}</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div>
              <div className="detailed-title">
                {initialProps.title}
              </div>

              <div className="list-icon center">
                <span><Icon type="calendar" /> {initialProps.addTime}</span>
                <span><Icon type="folder" /> {initialProps.typeName}</span>
                <span><Icon type="fire" /> {initialProps.view_count}</span>
              </div>

              <div className="detailed-content" >
                <div className="detailed-content" dangerouslySetInnerHTML={{ __html: html }}>

                </div>
              </div>

            </div>

          </div>
        </Col>

        <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Advertisement />
          <Affix offsetTop={5}>
            <div className="detailed-nav comm-box">
              <div className="nav-title">文章目录</div>
              {tocify && tocify.render()}
            </div>
          </Affix>
        </Col>
      </Row>
      <Footer />
    </>
  )
}

Detail.getInitialProps = async (context) => {
  console.log(context.query.id)
  let id = context.query.id
  const promise = new Promise((resolve) => {

    axios('http://127.0.0.1:7001/default/getArticleById/' + id).then(
      (res) => {
        console.log(res)
        resolve(res.data.data[0])
      }
    )
  })

  return await promise
}

export default Detail