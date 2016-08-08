<template>
  <div class="gloria-notification">
    <div @click="open">
      <div class="columns">
        <div class="column icon-url">
          <img :src="options.iconUrl" />
        </div>
        <div class="column">
          <p class="title">{{ options.title }}</p>
          <p class="message">{{ options.message }}</p>
          <p class="context-message">{{ options.contextMessage }}</p>
        </div>
      </div>
      <div class="image-url" v-if="options.type === 'image'">
        <img :src="options.imageUrl" />
      </div>
    </div>
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
