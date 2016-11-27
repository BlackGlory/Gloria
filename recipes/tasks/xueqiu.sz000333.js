fetch('https://xueqiu.com/v4/stock/quotec.json?code=SZ000333&_=' + Date.now())
.then(res => res.json())
.then(({ SZ000333: [price, stockUp, quotePercentage, date] }) => ({
  title: '美的集团 股价变动'
, message: `￥${price} ${stockUp > 0 ? '+' + stockUp : stockUp} (${ quotePercentage })`
, url: 'https://xueqiu.com/S/SZ000333'
, iconUrl: 'https://assets.imedao.com/images/favicon.png'
}))
.then(commit)
