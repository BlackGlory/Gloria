'use strict'

require! 'vue': Vue
require! 'keen-ui': Keen
require! './components/GloriaApp.vue': GloriaApp
require! 'moment': moment

moment.locale chrome.i18n.getUILanguage!

Vue.use Keen

Vue.filter 'n2br', (val) -> val?.replace /\n/g, '<br>'
Vue.filter 'nbsp', (val) -> val?.replace /\s/g, '&nbsp;'
Vue.filter 'i18n', (val, ...args) -> chrome.i18n.get-message val, args
Vue.filter 'relativeDate', (val) -> if val then moment(val).from-now! else null

new Vue {
  el: 'body'
  components: { GloriaApp }
}
