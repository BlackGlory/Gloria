<template>
  <div class="gloria-notification">
    <ui-alert :dismissible="false" hide-icon @click="open" style="" :class="options.url ? 'pointer' : ''">
      {{ options.title }} {{ options.message }} {{ options.contextMessage }}
    </ui-alert>
  </div>
</template>

<script lang="livescript">
'use strict'

require! '../store.ls': store
require! '../actions/creator.ls': creator

export
  name: 'gloria-notification'
  methods:
    open: ->
      if @options.url
        chrome.tabs.create { url: @options.url }
  props:
    options:
      type: Object
</script>

<style lang="stylus">
.gloria-notification
  .pointer
    cursor: pointer
</style>
