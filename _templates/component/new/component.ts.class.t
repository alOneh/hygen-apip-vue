---
to: "<%= isTS && isTSClass ? path : null %>"
---
<template>
  <div>TS Component</div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
<% if (usesVuex) { %>import { Getter, Action } from 'vuex-class'<% } %>

@Component({
  name: '<%= h.capitalize(compName) %>'
})

export default class <%= h.capitalize(compName) %> extends Vue {

}
</script>

<style>

</style>
