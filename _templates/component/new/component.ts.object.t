---
to: "<%= isTS && !isTSClass ? path : null %>"
---
<template>
  <div>TS Component</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: '<%= h.capitalize(compName) %>',
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {},
  created () {

  },
  mounted () {

  },
  destroyed() {

  }
})
</script>

<style>

</style>
