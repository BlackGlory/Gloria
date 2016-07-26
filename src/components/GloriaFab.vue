<template>
  <div class="gloria-fab">
    <ui-fab :type="type" :color="color" :icon="icon" :aria-label="ariaLabel" :disabled="disabled"></ui-fab>
  </div>
</template>

<script lang="livescript">
'use strict'

require! 'keen-ui/lib/UiFab': UiFab

export
  name: 'gloria-fab'
  components:
    { UiFab }
  props: {
    ...UiFab.props
    type:
      type: String
      default: 'normal'
    color:
      type: String
      default: 'default'
  }
</script>

<style lang="stylus">
.gloria-fab
  position: fixed
  right: 1rem
  bottom: 1rem
</style>
