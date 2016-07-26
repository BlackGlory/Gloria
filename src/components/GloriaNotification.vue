<template>
  <div class="gloria-notification">
    <ui-alert :dismissible="false" hide-icon>
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
  props:
    options:
      type: Object
</script>

<style lang="stylus">
</style>
