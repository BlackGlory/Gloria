fetch('https://xueqiu.com/v4/stock/quotec.json?code=SH600050&_=' + Date.now())
.then(res => res.json())
.then(({ SH600050: [price, stockUp, quotePercentage, date] }) => ({
  title: '中国联通 股价变动'
, message: `￥${price} ${stockUp > 0 ? '+' + stockUp : stockUp} (${ quotePercentage })`
, url: 'https://xueqiu.com/S/SH600050'
, iconUrl: 'https://assets.imedao.com/images/favicon.png'
}))
.then(commit)
