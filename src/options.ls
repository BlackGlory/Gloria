'use strict'

require! 'vue':Vue
require! 'keen-ui':Keen
require! './components/GloriaApp.vue': GloriaApp

Vue.use Keen

new Vue {
  el: 'body'
  components: { GloriaApp }
}
