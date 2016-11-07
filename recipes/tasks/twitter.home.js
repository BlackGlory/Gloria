Promise.all([
  importScripts('gloria-utils')
, fetch('https://twitter.com/').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  html = html.replace(/<script type="text\/twitter-deferred-timeline-stream-items">([\s\S]+)<\/script>/, '$1')
  let $ = cheerio.load(html)
  return $('li.stream-item').map((i, el) => ({
    title: $(el).find('.fullname').text().trim()
  , message: $(el).find('.js-tweet-text-container').text().replace($(el).find('.js-tweet-text-container a[href^="https://t.co/"]').text(), '').trim()
  , url: 'https://twitter.com' + $(el).find('.tweet').data('permalink-path')
  , iconUrl: $(el).find('.avatar').attr('src')
  , imageUrl: $(el).find('.AdaptiveMedia-photoContainer img').attr('src')
  })).get().filter(x => x.title || x.message)
})
.then(commit)
