'use strict'

require! 'vue':Vue
require! 'keen-ui':Keen
require! './components/GloriaTask.vue': GloriaTask
require! './components/GloriaFab.vue': GloriaFab

Vue.use Keen

new Vue {
  el: '#app'
  components: {
    GloriaTask
  , GloriaFab
  }
}
