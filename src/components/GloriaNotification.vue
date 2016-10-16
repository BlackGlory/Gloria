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
      target = @options.url
      if target
        try
          target = (new URL target).href
        catch error
          console.error error
        finally
          chrome.tabs.query url: target.replace(/^https?/, '*'), (tabs) ->
            if not chrome.runtime.lastError and tabs[0]
              chrome.tabs.highlight window-id: tabs[0].windowId, tabs: tabs[0].index
            else
              chrome.windows.getCurrent windowTypes: ['normal'], (window) ->
                if not chrome.runtime.lastError and window
                  chrome.tabs.create url: target, active: false
                else
                  chrome.windows.create (window) ->
                    chrome.tabs.create url: target, windowId: window.id, active: false

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
    display: -webkit-box
    -webkit-box-orient: vertical
    -webkit-line-clamp: 3
    overflow: hidden
    word-break: break-all
    text-overflow: ellipsis

  .pointer
    cursor: pointer

  .image-url
    background-color: #000
    height: 230px

    img
      width: auto
      max-height: 230px
      max-width: 320px

</style>
