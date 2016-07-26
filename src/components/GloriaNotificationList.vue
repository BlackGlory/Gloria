<template>
  <div class="gloria-notification-list">
    <template v-for="notification in notifications" track-by="id">
      <gloria-notification :options="notification.options"></gloria-notification>
    </template>
  </div>
</template>

<script lang="livescript">
'use strict'

require! './GloriaNotification.vue': GloriaNotification

export
  name: 'gloria-notification-list'
  components: {
    GloriaNotification
  }
  props:
    notifications:
      type: Array
      default: []
</script>

<style lang="stylus">
</style>
