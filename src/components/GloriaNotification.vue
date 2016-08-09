<template>
  <div class="gloria-notification">
    <div @click="open" :class="{ 'pointer': options.url }">
      <div class="row">
        <img width="75" height="75" :src="options.iconUrl" />
        <div class="col-xs">
          <p class="title">{{ options.title }}</p>
          <p class="message">{{ options.message }}</p>
          <p class="context-message">{{ options.contextMessage }}</p>
        </div>
      </div>
      <div class="row center-xs middle-xs image-url" v-if="options.type === 'image'">
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
@import '~keen-ui/src/styles/md-colors'

.gloria-notification
  width: 360px
  border: 1px solid $md-grey-300

  .context-message
    color: $md-grey-600

  .row
    margin: 0

  .col-xs > *
    word-break: break-all;

  .pointer
    cursor: pointer

  .image-url
    background-color: #000
    height: 230px

</style>
