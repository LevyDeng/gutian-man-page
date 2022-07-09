
<template>
  <div class="footer">
    <el-button class="right" @click="submit">提交</el-button>
  </div>
</template>

<script>

export default {
  name: 'AppFooter',
  props: {
    eventname: {
      type: String,
      default: ''
    },
    payload: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    submit() {
      if (this.eventname === 'work-character') {
        console.log('work-character')
      }
    }
  }
}

</script>

<style scoped>
.footer
{
  position:absolute;
  bottom:0;
  width:100%;
  height:50px;
  background-color: #9dbfff;
}
.right {
  position: absolute;
  text-align: center;
  right: 20px;
  width: 60px;
  border: 3px solid #73AD21;
  padding: 10px;
  margin: auto;
}
</style>
