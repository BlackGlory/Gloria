fetch('https://feedly.com/v3/streams/contents?streamId=user%2Fa6bcdcfc-6fc2-4660-ba74-84d9e923d63a%2Fcategory%2F%E6%B8%B8%E6%88%8F&count=20&ranked=newest')
.then(res => res.json())
.then(({ items }) => {
  return items.map(item => {
    let notification = {
      title: item.title
    , message: item.summary.content.replace(/(<([^>]+)>)/ig, '')
    , url: item.originId
    }
    if (item.visual && item.visual.url) {
      notification.imageUrl = item.visual.url
    }
    return notification
  })
})
.then(commit)
