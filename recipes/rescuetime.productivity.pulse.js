Promise.all([
  importScripts('http://bundle.gloria.pub/cheerio-0.20.0-bundle.js')
, fetch('https://www.rescuetime.com/dashboard').then(res => res.text())
])
.then(([cheerio, body]) => {
  let $ = cheerio.load(body)
    , productivityScore = $('.productivity-score-chart').data('productivity-score')
    , comparison = $('.productivity-score-chart').data('comparison-productivity-score')
    , comparisonLabel = $('.productivity-score-chart').data('comparison-label')
  return {
    title: `Current productivity pulse: ${productivityScore}`
  , message: `${Math.round((productivityScore - comparison) / comparison * 100)}% from ${comparisonLabel}`
  , iconUrl: 'https://www.rescuetime.com/assets/icons/clock-green.png'
  }
})
.then(commit)
