Promise.all([
  importScripts('gloria-utils')
, fetch('https://feedly.com/v3/streams/contents?streamId=user%2Fa6bcdcfc-6fc2-4660-ba74-84d9e923d63a%2Fcategory%2F%E6%B8%B8%E6%88%8F&count=20&ranked=newest')
  .then(res => res.json())
])
.then(([{ underscoreString: { stripTags } }, { items }]) => {
  return items.map(item => {
    let notification = {
      title: item.title
    , message: stripTags(item.summary.content).trim()
    , url: item.originId
    }
    if (item.visual && item.visual.url && item.visual.url !== 'none') {
      notification.imageUrl = item.visual.url
    }
    return notification
  })
})
.then(commit)
