fetch('https://store.playstation.com/chihiro-api/viewfinder/HK/zh/19/STORE-MSF86012-NEWESTRELEASE?game_content_type=games&size=30&gkb=1&geoCountry=CN')
.then(res => res.json())
.then(({ links }) => links.map(x => {
  return {
    title: `${x.name} ${x.default_sku.name}`
  , message: `${x.game_contentType} ${x.default_sku.display_price}`
  , url: `https://store.playstation.com/#!/zh-hans-hk/${x.game_contentType}/${x.name.toLowerCase()}/cid=${x.id}`
  , id: x.id
  , iconUrl: x.images[0].url
  , imageUrl: x.promomedia.length ? x.promomedia[0].materials[0].urls[0].url : x.images[x.images.length - 1].url
  }
}))
.then(commit)
