<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" />
    <workWontent class="main-container" />
  </div>
</template>

<script>
import sidebar from './sidebar'
import workWontent from './work-content'

export default ({
  components: {
    sidebar,
    workWontent
  },
  computed: {
    works: function() {
      return this.$store.state.works['works'][this.workname]
    }
  },
  created() {
    this.getWorkVersions()
  },
  methods: {
    getWorkVersions() {
      this.$store.dispatch('works/getWorkVersions')
    }
  }
})
</script>

<style lang="scss" scoped>

  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .sidebar-container {
    transition: width 0.28s;
    // width: $sideBarWidth !important;
    // background-color: $menuBg;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
</style>
