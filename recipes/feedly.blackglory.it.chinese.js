fetch('http://feedly.com/v3/streams/contents?streamId=user%2Fa6bcdcfc-6fc2-4660-ba74-84d9e923d63a%2Fcategory%2FIT%E8%B5%84%E8%AE%AF&count=20&ranked=newest')
.then(res => res.json())
.then(({ items }) => {
  return items.map(item => {
    let notification = {
      title: item.title
    , message: item.summary.content.replace(/(<([^>]+)>)/ig, '')
    , url: item.originId
    }
    if (item.visual && item.visual.url && item.visual.url !== 'none') {
      notification.imageUrl = item.visual.url
    }
    return notification
  })
})
.then(commit)
