<template>
  <div class="app-container">
    <create-work />
    <characters v-if="currentPage==='characters'" />
    <types v-if="currentPage==='types'" />
  </div>
</template>

<script>
import characters from './characters'
import types from './types'
import CreateWork from './create-work'

export default {
  name: 'WorkContent',
  components: {
    characters,
    types,
    CreateWork
  },
  computed: {
    workname: function() {
      return this.$store.state.works['currentWork']
    },
    workdata: function() {
      return this.$store.state.works['works'][this.workname]
    },
    currentPage: function() {
      return this.$store.state.works['currentPage']
    }
  }
}
</script>
