<template>
  <div class="gloria-notification">
    {{ options.title }} {{ options.message }}
  </div>
</template>

<script lang="livescript">
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
