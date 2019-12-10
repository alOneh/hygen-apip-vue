---
to: "<%= !isTS ? path : null %>"
---
<template>
  <div>JS Component</div>
</template>

<script>
export default {
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
}
</script>

<style>

</style>
