<template>
  <div>
    <el-scrollbar>
      <el-input />
      <el-menu
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <el-menu-item @click="setCreateWorkVisible()">
          <item title="新建" icon="plus" />
        </el-menu-item>
        <el-submenu v-for="work in Object.keys(workVersions)" :key="work" :index="work" popper-append-to-body @click="chooseWork(work)">
          <template slot="title">
            <item :title="workVersions[work]['workname_cn']" />
          </template>
          <el-menu-item @click="setCurrentPage(work, 'characters')">
            <span>角色管理</span>
            <!-- <item :title="'角色管理'" /> -->
          </el-menu-item>
          <el-menu-item @click="setCurrentPage(work, 'types')">
            <span>类型管理</span>
            <!-- <item :title="'类型管理'" /> -->
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import SidebarItem from '@/layout/components/Sidebar/SidebarItem'
import Item from '@/layout/components/Sidebar/Item'
import variables from '@/styles/variables.scss'

export default {
  name: 'WorkSidebar',
  components: { Item },
  computed: {
    variables() {
      return variables
    },
    workVersions() {
      return this.$store.state.works['workVersions']
    }
  },
  created() {
  },
  methods: {
    chooseWork(workname) {
      console.debug(workname)
      this.$store.commit('works/SET_CURRENT_WORK', workname)
      this.$store.dispatch('works/checkUpdate', workname)
    },
    setCurrentPage(workname, pagename) {
      this.$store.commit('works/SET_CURRENT_WORK', workname)
      this.$store.commit('works/SET_CURRENT_PAGE', pagename)
      if (pagename === 'characters') {
        this.$store.dispatch('works/checkUpdate', workname)
      }
    },
    setCreateWorkVisible() {
      this.$store.commit('works/SET_CREATE_WORK_VISIBLE')
    }
  }
}

</script>
