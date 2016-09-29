Promise.all([
  importScripts('gloria-utils')
, fetch('https://store.steampowered.com/account/store_transactions/').then(res => res.text())
])
.then(([{ cheerio }, html]) => {
  let $ = cheerio.load(html)
  return {
    title: $('.accountLabel').text()
  , message: $('.accountData.price').text()
  , iconUrl: 'https://steamstore-a.akamaihd.net/public/shared/images/header/globalheader_logo.png?t=962016'
  }
})
.then(commit)
