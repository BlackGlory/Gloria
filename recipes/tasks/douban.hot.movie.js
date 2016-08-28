fetch('https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&watched=on&page_limit=20&page_start=0')
.then(res => res.json())
.then(({ subjects }) => {
  return subjects.map(x => {
    return {
      title: `豆瓣热门电影: ${x.title}`
    , message: `评分: ${x.rate}`
    , url: x.url
    , iconUrl: x.cover
    }
  })
})
.then(commit)
