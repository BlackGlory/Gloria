fetch('https://movie.douban.com/j/search_subjects?type=tv&tag=%E7%BE%8E%E5%89%A7&sort=recommend&watched=on&page_limit=20&page_start=0')
.then(res => res.json())
.then(({ subjects }) => {
  return subjects.map(x => {
    return {
      title: `豆瓣热门美剧: ${x.title}`
    , message: `评分: ${x.rate}`
    , url: x.url
    , iconUrl: x.cover
    }
  })
})
.then(commit)
