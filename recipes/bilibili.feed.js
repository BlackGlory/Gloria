fetch('http://api.bilibili.com/x/feed/pull?ps=10&type=0&pn=1')
.then(res => res.json())
.then(json => {
  let notifications = json.data.feeds.map(feed => {
    return {
      title: feed.addition.title
    , message: feed.addition.description
    , iconUrl: feed.source.avatar
    , imageUrl: feed.addition.pic
    , url: feed.addition.link
    }
  })
  commit(notifications)
})
