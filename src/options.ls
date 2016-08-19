'use strict'

require! './rollbar.ls': Rollbar
require! 'vue': Vue
require! 'keen-ui': Keen
require! './components/GloriaApp.vue': GloriaApp

Vue.use Keen

Vue.filter 'n2br', (val) -> val.replace /\n/g, '<br>'
Vue.filter 'nbsp', (val) -> val.replace /\s/g, '&nbsp;'
Vue.filter 'i18n', (val, ...args) -> chrome.i18n.get-message val, args

new Vue {
  el: 'body'
  components: { GloriaApp }
}
