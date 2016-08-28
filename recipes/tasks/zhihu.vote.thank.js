Promise.all([
  importScripts('gloria-utils')
, fetch('https://www.zhihu.com/noti7/stack/vote_thank?limit=10').then(res => res.json())
])
.then(([{ cheerio }, { msg }]) => {
  let $ = cheerio.load(msg)
  return $('.zm-noti7-content-item').map((i, el) => {
    return {
      iconUrl: 'https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg'
    , message: $(el).text().trim().replace(/\n/g, '')
    , url: ((base, href) => {
        if (!href.startsWith('http')) {
          if (href.startsWith('/')) {
            return `${base}${href}`
          } else {
            return `${base}/${href}`
          }
        }
        return href
      })('http://www.zhihu.com', $(el).find('a.question_link, a.post-link').attr('href'))
    }
  }).get()
})
.then(commit)
