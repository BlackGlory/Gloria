fetch('https://xueqiu.com/v4/stock/quotec.json?code=SH601668&_=' + Date.now())
.then(res => res.json())
.then(({ SH601668: [price, stockUp, quotePercentage, date] }) => ({
  title: '中国建筑 股价变动'
, message: `￥${price} ${stockUp > 0 ? '+' + stockUp : stockUp} (${ quotePercentage })`
, url: 'https://xueqiu.com/S/SH601668'
, iconUrl: 'https://assets.imedao.com/images/favicon.png'
}))
.then(commit)
