<template>
  <div class="gloria-slider">
    <ui-slider
      :name="name"
      :value.sync="sliderValue"
      :step="step"
      :icon="icon"
      :label="label"
      :hide-label="hideLabel"
      :disabled="disabled"
    ></ui-slider>
  </div>
</template>

<script lang="livescript">
'use strict'

require! 'keen-ui/lib/UiSlider': UiSlider

export
  name: 'gloria-slider'
  components: {
    UiSlider
  }
  data: ->
    slider-value: Math.round((@value - @min) / (@max - @min) * 100)
  ready: ->
    @$watch '$data.sliderValue', ((slider-value) ~>
      @value = Math.round((slider-value / 100) * (@max - @min)) + @min
    ), immediate: true
  props: {
    ...UiSlider.props
    min:
      type: Number
      default: 1
    max:
      type: Number
      default: 100
    value:
      type: Number
      required: true
      two-way: true
  }
</script>

<style lang="stylus">
</style>
