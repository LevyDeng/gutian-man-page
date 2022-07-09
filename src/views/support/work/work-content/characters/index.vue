<template>
  <div>
    <!-- 从excel读取数据 -->
    <table width="100%">
      <tr>
        <td width="60%">
          <el-form :inline="true">
            <el-form-item label="从excel读取:">
              <el-upload
                action=""
                :auto-upload="false"
                :multiple="false"
                :show-file-list="true"
                :limit="1"
                :on-change="beforeUpload"
              >
                <el-button size="small" type="primary">选择excel文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传图片:">
              <el-upload
                :file-list="form.imageList"
                action=""
                multiple
                :auto-upload="false"
                :on-change="handleImageUpload"
                :on-remove="handleRemove"
              >
                <el-button size="small" type="primary">选择图片文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" :loading="submitLoading" :disabled="submitLoading" @click="submitExcel">提交</el-button>
            </el-form-item>
          </el-form>
        </td>
        <td width="30%" align="right">
          <el-button size="small" type="primary" @click="exportXLSX">导出excel文件</el-button>
        </td>
      </tr>
    </table>
    <el-button icon="el-icon-plus" @click="createCharacter()">新建角色</el-button>
    <el-dialog :visible.sync="createCharacterVisible">
      <el-form ref="createCharacterForm" label-position="left" :rules="rules" label-width="100px" :model="form">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input autocomplete="off" type="textarea" :value="form.nickname.join('\n')" @input="form.nickname = $event.split('\n')" />
        </el-form-item>
        <el-form-item label="别名" :label-width="formLabelWidth" prop="anothername">
          <el-input autocomplete="off" type="textarea" :value="form.anothername.join('\n')" @input="form.anothername = $event.split('\n')" />
        </el-form-item>
        <el-form-item label="错名" :label-width="formLabelWidth" prop="falsename">
          <el-input autocomplete="off" type="textarea" :value="form.falsename.join('\n')" @input="form.falsename = $event.split('\n')" />
        </el-form-item>
        <el-form-item label="全拼" :label-width="formLabelWidth" prop="quanpin">
          <el-input autocomplete="off" type="textarea" :value="form.quanpin.join('\n')" @input="form.quanpin = $event.split('\n')" />
        </el-form-item>
        <el-form-item label="色值">
          <el-upload
            :file-list="imageList"
            action=""
            multiple
            :auto-upload="false"
            :on-change="handleImageUpload"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="立绘" :label-width="formLabelWidth" prop="painting">
          <el-input v-model="form.painting" autocomplete="off" />
        </el-form-item>
        <el-form-item label="卡片" :label-width="formLabelWidth" prop="card">
          <el-input v-model="form.card" autocomplete="off" />
        </el-form-item>
        <el-form-item label="职业" :label-width="formLabelWidth" prop="class">
          <el-input v-model="form.class" autocomplete="off" />
        </el-form-item>
        <el-form-item label="稀有度" :label-width="formLabelWidth" prop="rarity">
          <el-input v-model="form.rarity" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" :loading="submitLoading" :disabled="submitLoading" @click="submitCreate">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-table
      v-loading="listLoading"
      :data="currentData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :cell-class-name="cellClassName"
      :row-class-name="delCharacterClass"
      @cell-dblclick="handleDblclick"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + (page - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="首字母" property="first_word">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'first_word' && editable[1] === scope.row['id'])" :ref="'first_word'+scope.row['id'].toString()" v-model="scope.row['first_word']" @blur="blurInput(scope.row['id'], 'first_word', $event)" />
          <span v-else><font :ref="'first_word_span'+scope.row['id'].toString()">{{ scope.row['first_word'] }}</font></span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="名字" property="name">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'name' && editable[1] === scope.row['id'])" :ref="'name'+scope.row['id'].toString()" v-model="scope.row['name']" @blur="blurInput(scope.row['id'], 'name', $event)" />
          <span v-else><font :ref="'name_span'+scope.row['id'].toString()">{{ scope.row['name'] }}</font></span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="昵称" property="nickname">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'nickname' && editable[1] === scope.row['id'])" :ref="'nickname'+scope.row['id'].toString()" v-focus type="textarea" rows="6" :value="scope.row['nickname'].join('\n')" @input="scope.row['nickname'] = $event.split('\n')" @blur="blurInput(scope.row['id'], 'nickname', $event)" />
          <span v-else>{{ scope.row['nickname'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="别名" property="anothername" width="160">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'anothername' && editable[1] === scope.row['id'])" :ref="'anothername'+scope.row['id'].toString()" v-focus type="textarea" rows="6" :value="scope.row['anothername'].join('\n')" @input="scope.row['anothername'] = $event.split('\n')" @blur="blurInput(scope.row['id'], 'anothername', $event)" />
          <span v-else>{{ scope.row['anothername'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="错名" property="falsename">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'falsename' && editable[1] === scope.row['id'])" :ref="'falsename'+scope.row['id'].toString()" v-focus type="textarea" rows="6" :value="scope.row['falsename'].join('\n')" @input="scope.row['falsename'] = $event.split('\n')" @blur="blurInput(scope.row['id'], 'falsename', $event)" />
          <span v-else>{{ scope.row['falsename'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="全拼" property="quanpin">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'quanpin' && editable[1] === scope.row['id'])" :ref="'quanpin'+scope.row['id'].toString()" v-focus type="textarea" rows="6" :value="scope.row['quanpin'].join('\n')" @input="scope.row['quanpin'] = $event.split('\n')" @blur="blurInput(scope.row['id'], 'quanpin', $event)" />
          <span v-else>{{ scope.row['quanpin'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="色值" property="colors" width="160">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'colors' && editable[1] === scope.row['id'])" :ref="'colors'+scope.row['id'].toString()" v-focus type="textarea" rows="8" :value="scope.row['colors'].join('\n')" @input="scope.row['colors'] = $event.split('\n')" @blur="blurInput(scope.row['id'], 'colors', $event)" />
          <span v-else>{{ scope.row['colors'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="立绘" property="painting">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'painting' && editable[1] === scope.row['id'])" :ref="'painting'+scope.row['id'].toString()" v-model="scope.row['painting']" v-focus @blur="blurInput(scope.row['id'], 'painting', $event)" />
          <span v-else>{{ scope.row['painting'] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="卡片" property="card">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'card' && editable[1] === scope.row['id'])" :ref="'card'+scope.row['id'].toString()" v-model="scope.row['card']" v-focus @blur="blurInput(scope.row['id'], 'card', $event)" />
          <span v-else>{{ scope.row['card'] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="职业" property="class">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'class' && editable[1] === scope.row['id'])" :ref="'class'+scope.row['id'].toString()" v-model="scope.row['class']" v-focus @blur="blurInput(scope.row['id'], 'class', $event)" />
          <span v-else>{{ scope.row['class'] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="稀有度" property="rarity">
        <template slot-scope="scope">
          <el-input v-if="(editable[0] === 'rarity' && editable[1] === scope.row['id'])" :ref="'rarity'+scope.row['id'].toString()" v-model="scope.row['rarity']" v-focus @blur="blurInput(scope.row['id'], 'rarity', $event)" />
          <span v-else>{{ scope.row['rarity'] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除" property="delete">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" backgroup-color="red" @click="delCharacter(scope.row['name'])" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="撤销删除" property="cancel">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-refresh-left" backgroup-color="red" @click="cancelChanges(scope.row['name'], scope.$index + (page - 1) * pageSize)" />
        </template>
      </el-table-column>
      <!--
      <el-table-column align="center" autosize label="错名">
        <template slot-scope="scope">
          <el-input v-show="editable" type="textarea" :value="scope.row['falsename'].join('\n')" @input="scope.row['falsename'] = $event.split('\n')" />
          <span v-show="!editable">{{ scope.row['falsename'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" autosize label="全拼">
        <template slot-scope="scope">
          <el-input v-show="editable" type="textarea" :value="scope.row['quanpin'].join('\n')" @input="scope.row['quanpin'] = $event.split('\n')" />
          <span v-show="!editable">{{ scope.row['quanpin'].join('\n') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="色值" width="160">
        <template slot-scope="scope">
          <el-input v-show="editable" type="textarea" rows="8" :value="scope.row['colors'].join('\n')" @input="scope.row['colors'] = $event.split('\n')" />
          <span v-show="!editable">{{ scope.row['colors'].join('\n') }}</span>
        </template>
      </el-table-column>
      -->
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="workdata.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div class="footer">
      <button class="right" @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
// import BackTop from '@/layout/components/backTop'
// import AppFooter from '@/layout/components/Footer'
import { updateWork } from '@/api/work'
import { readExcelToJson, generateCharacterData, transImage, saveJsonToExcel } from '@/utils/xlsx'

export default {
  name: 'WorkContent',
  data() {
    const validateName = (rule, value, callback) => {
      for (var c of this.originData) {
        if (c['name'] === value) {
          callback(new Error('角色名已存在'))
        }
      }
      callback()
    }
    return {
      listLoading: true,
      triggerFlag: false,
      submitLoading: false,
      formLabelWidth: '120px',
      arrKey: [],
      imageList: [],
      forbidKeyboard: false,
      page: 1,
      pageSize: 20,
      editable: ['', 0],
      changes: {},
      originData: [],
      creates: [],
      deleted: [],
      createCharacterVisible: false,
      sheets: 'default',
      currentColors: [],
      form: {
        'first_word': '',
        'name': '',
        'nickname': [],
        'anothername': [],
        'falsename': [],
        'quanpin': [],
        'imageList': [],
        'painting': 0,
        'card': '',
        'class': '',
        'rarity': ''
      },
      rules: {
        name: [
          { required: false },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' },
          { trigger: 'change', validator: validateName }
        ]
      }
    }
    // workHeader: [
    //   ['id', 'id'],
    //   ['首字母', 'first_word'],
    //   ['名字', 'name'],
    //   ['昵称', 'nickname'],
    //   ['别名', 'anothername'],
    //   ['错名', 'falsename'],
    //   ['全拼', 'quanpin'],
    //   ['色值', 'colors'],
    //   ['立绘', 'painting'],
    //   ['卡片', 'card'],
    //   ['职业', 'class'],
    //   ['稀有度', 'rarity']
    // ]
  },
  computed: {
    workname: function() {
      return this.$store.state.works['currentWork']
    },
    workdata: function() {
      const data = this.$store.state.works['works'][this.workname]
      const res_data = []
      for (var k in data['characters']) {
        res_data.push(data['characters'][k])
      }
      return res_data.sort(this.compare('id'))
    },
    currentData: {
      get: function() {
        return this.workdata.slice((this.page - 1) * this.pageSize, Math.min(this.page * this.pageSize, this.workdata.length))
      },
      set: function(value) {
        this.currentData = value
      }
    },
    pageTotal: function() {
      const pageTotal = Math.ceil(this.workdata.length / this.pageSize)
      return pageTotal
    }
  },
  watch: {
    workdata: function(data) {
      if (data.length === 0) {
        this.listLoading = true
      } else {
        this.listLoading = false
        location.reload()
      }
    }
  },
  created() {
    if (this.workdata.length === 0) {
      this.listLoading = true
    } else {
      this.listLoading = false
    }
    this.originData = JSON.parse(JSON.stringify(this.workdata))
    // document.addEventListener('keydown', this.handleKeyDown)
    // document.addEventListener('keyup', this.handleKeyUp)
  },
  destroyed() {
    // document.addEventListener('keydown', this.handleKeyDown)
    // document.addEventListener('keyup', this.handleKeyUp)
  },
  // directives: {
  //   // 通过自定义指令实现的表单自动获得光标的操作
  //   focus: {
  //     inserted: function(el) {
  //       if (el.tagName.toLocaleLowerCase() === "el-input") {
  //         el.focus()
  //       } else {
  //         if (el.getElementsByTagName("el-input")) {
  //           el.getElementsByTagName("el-input")[0].focus()
  //         }
  //       }
  //       el.focus()
  //     }
  //   },
  //   focusTextarea: {
  //     inserted: function(el) {
  //       if (el.tagName.toLocaleLowerCase() === "el-textarea") {
  //         el.focus()
  //       } else {
  //         if (el.getElementsByTagName("el-textarea")) {
  //           el.getElementsByTagName("el-textarea")[0].focus()
  //         }
  //       }
  //       el.focus()
  //     }
  //   }
  // },
  methods: {
    compare: (val) => (a, b) => (a[val] - b[val]),
    // handleKeyDown(e) {
    //   const that = this
    //   if (that.arrKey.length > 0) {
    //     // a-z的按键 长按去重
    //     if (that.arrKey.indexOf(e.key.toLowerCase()) >= 0) {
    //       return
    //     }
    //   }
    //   that.arrKey.push(e.key.toLowerCase())
    //   this.keydown = that.arrKey.join('+')
    //   // 监听按键捕获
    //   console.log(this.keydown)
    //   if (this.keydown === 'e') {
    //     if (that.forbidKeyboard) {
    //       e.preventDefault()
    //       return
    //     }
    //     this.keydown = ''
    //     this.editable = true
    //     e.preventDefault()
    //     // 取消浏览器原有的操作
    //   } else if (this.keydown === 'escape') {
    //     if (that.forbidKeyboard) {
    //       e.preventDefault()
    //       return
    //     }
    //     this.keydown = ''
    //     this.editable = false
    //     e.preventDefault()
    //     // 取消浏览器原有的操作
    //   }
    // },
    // handleKeyUp(e) {
    //   this.arrKey.splice(this.arrKey.indexOf(e.key.toLowerCase()), 1)
    //   this.keydown = this.arrKey.join('+')
    //   e.preventDefault()
    // },
    handleSizeChange(e) {
      this.pageSize = e
    },
    handleCurrentChange(e) {
      this.page = e
    },
    handleColors(e) {

    },
    handleDblclick(row, column, e) {
      if (column.property === 'delete') {
        this.delCharacter(row['name'])
      } else {
        this.editable = [column.property, row.id]
        const _this = this
        setTimeout(function() {
          _this.$refs[column.property + row.id.toString()].focus()
        }, 1)
      }
    },
    blurInput(id, key, e) {
      id = id - 1
      this.editable = ['', 0]
      var value = e.target.value
      if (['nickname', 'anothername', 'falsename', 'quanpin'].includes(key)) {
        if (value !== this.originData[id][key].join('\n')) {
          // save shanged data
          if (id in this.changes) {
            this.changes[id][key] = value.split('\n')
          } else {
            this.changes[id] = {}
            this.changes[id][key] = value.split('\n')
          }
        } else {
          delete this.changes[id][key]
          if (Object.keys(this.changes[id]).length === 0) {
            delete this.changes[id]
          }
        }
      } else if (key === 'colors') {
        try {
          const colors = value.split('\n')
          for (var i in colors) {
            var cc = colors[i].split(',')
            for (var j in cc) {
              cc[j] = parseInt(cc[j])
            }
            colors[i] = cc
          }
          if (JSON.stringify(colors) !== JSON.stringify(this.originData[id][key])) {
            if (id in this.changes) {
              this.changes[id][key] = colors
            } else {
              this.changes[id] = {}
              this.changes[id][key] = colors
            }
          } else {
            delete this.changes[id][key]
            if (Object.keys(this.changes[id]).length === 0) {
              delete this.changes[id]
            }
          }
        } catch (e) {
          console.log(e)
          return e
        }
      } else {
        if (key === 'painting') {
          value = parseInt(value)
        }
        if (value !== this.originData[id][key]) {
          // save shanged data
          if (id in this.changes) {
            this.changes[id][key] = value
          } else {
            this.changes[id] = {}
            this.changes[id][key] = value
          }
        } else {
          delete this.changes[id][key]
          if (Object.keys(this.changes[id]).length === 0) {
            delete this.changes[id]
          }
        }
      }
    },
    cellClassName({ row, column }) {
      if (row['id'] - 1 in this.changes && column['property'] in this.changes[row['id'] - 1]) {
        return 'bgRed'
      } else {
        return ''
      }
    },
    async submit() {
      const _originData = JSON.parse(JSON.stringify(this.originData))
      for (var id in this.changes) {
        for (var k in this.changes[id]) {
          _originData[id][k] = this.changes[id][k]
        }
      }
      var content = {}
      for (var c of _originData) {
        if (!this.deleted.includes(c['name'])) {
          content[c['name']] = c
        }
      }
      try {
        await updateWork(this.workname, JSON.stringify(content))
      } catch (e) {
        this.$message.error({ message: '上传数据失败', type: 'error' })
        return
      }
      try {
        await this.$store.dispatch('works/checkUpdate', this.workname)
      } catch (e) {
        this.$message.error({ message: '拉取更新后的数据失败', type: 'error' })
        return
      }
      this.originData = JSON.parse(JSON.stringify(this.workdata))
      this.$message.success({ message: '更新成功', type: 'success' })
    },
    beforeUpload(file) {
      if (!file) {
        // 没有文件
        return false
      } else if (!/\.(xlsx)$/.test(file.name.toLowerCase())) {
        // 格式根据自己需求定义
        this.$message.error('上传格式不正确，请上传xlsx格式')
        return false
      }
      // console.debug(file.path)
      this.submitLoading = true
      readExcelToJson(file).then(res => {
        this.sheets = res
      })
      this.submitLoading = false
      // this.$refs.upload.clearFiles()
    },
    handleCreateImage(file, fileList) {
      this.submitLoading = true
      for (var f of fileList) {
        if (!/\.(png)$/.test(file.name.toLowerCase())) {
          this.$message.error('图片格式不正确,只支持png')
          continue
        }
        this.form.imageList[0] = f
      }
    },
    handleImageUpload(file, fileList) {
      this.submitLoading = true
      for (var f of fileList) {
        if (!/\.(png)$/.test(file.name.toLowerCase())) {
          this.$message.error('图片格式不正确,只支持png')
          continue
        }
        var IN = 0
        for (var ff of this.imageList) {
          if (f.name === ff.name) {
            IN = 1
          }
        }
        if (IN === 0) {
          this.imageList.push(f)
        }
      }
      this.submitLoading = false
    },
    async submitCreate() {
      this.submitLoading = true
      if (this.form['imageList'].length !== 0) {
        try {
          this.form['colors'] = await transImage(this.form.imageList[0].raw)
        } catch (e) {
          this.$message.error('获取色值失败')
        }
      } else {
        this.form['colors'] = []
      }
      const form1 = {}
      for (var k in this.form) {
        if (k !== 'imageList') {
          form1[k] = this.form[k]
        }
      }
      form1['id'] = this.originData.length + 1
      const _originData = JSON.parse(JSON.stringify(this.originData))
      _originData.push(form1)
      var content = {}
      for (var c of _originData) {
        content[c['name']] = c
      }
      try {
        await updateWork(this.workname, JSON.stringify(content))
      } catch (e) {
        this.$message.error({ message: '上传数据失败', type: 'error' })
        this.submitLoading = false
        return
      }
      try {
        await this.$store.dispatch('works/checkUpdate', this.workname)
      } catch (e) {
        this.$message.error({ message: '拉取更新后的数据失败', type: 'error' })
        this.submitLoading = false
        return
      }
      this.submitLoading = false
      this.originData = JSON.parse(JSON.stringify(this.workdata))
      this.$message.success({ message: '更新成功', type: 'success' })
    },
    handleRemove(file) {
      for (var i in this.imageList) {
        if (this.imageList[i].name === file.name) {
          this.imageList.splice(i, 1)
        }
      }
    },
    async submitExcel() {
      this.submitLoading = true
      var content = {}
      if (this.sheets !== 'default') {
        content = await generateCharacterData(this.sheets, this.imageList)
      } else {
        const _originData = JSON.parse(JSON.stringify(this.originData))
        for (var c of _originData) {
          content[c['name']] = c
        }
        for (var cc of this.imageList) {
          var name = cc['name'].split('.')[0]
          if (Object.keys(content).includes(name)) {
            content[name]['colors'] = await transImage(cc.raw)
          }
        }
      }
      this.submitLoading = false
      try {
        await updateWork(this.workname, JSON.stringify(content))
      } catch (e) {
        this.$message.error({ message: '上传数据失败', type: 'error' })
      }
      try {
        await this.$store.dispatch('works/checkUpdate', this.workname)
      } catch (e) {
        this.$message.error({ message: '拉取更新后的数据失败', type: 'error' })
      }
      this.originData = JSON.parse(JSON.stringify(this.workdata))
      this.$message.success({ message: '更新成功', type: 'success' })
    },
    exportXLSX() {
      saveJsonToExcel(this.originData, this.workname + '.xlsx')
    },
    updateOriginData() {
      this.originData = JSON.parse(JSON.stringify(this.workdata))
    },
    createCharacter(index) {
      // this.$store.commit('works/CREATE_CHARACTER')
      // this.creates.push({
      //   'first_word': '',
      //   'name': 'new_character',
      //   'nickname': [],
      //   'anothername': [],
      //   'falsename': [],
      //   'quanpin': [],
      //   'colors': [],
      //   'painting': '',
      //   'card': '',
      //   'class': '',
      //   'rarity': ''
      // })
      this.createCharacterVisible = true
    },
    delCharacterClass({ row }) {
      if (this.deleted.includes(row['name'])) {
        return 'bgGray'
      } else {
        return ''
      }
    },
    delCharacter(name) {
      if (!this.deleted.includes(name)) {
        this.deleted.push(name)
      }
    },
    cancelChanges(name, index) {
      for (var i in this.deleted) {
        if (this.deleted[i] === name) {
          this.deleted.splice(i, 1)
        }
      }
      console.log(index)
      delete this.changes[index]
    }
  }
}
</script>

<style>
@import "~@/styles/footer.css";

.el-table .cell {
  white-space: pre-line;
}
.bgRed {
  background: rgba(255, 0, 0, 0.4);
}
.bgGray {
  color: red;
}
</style>
