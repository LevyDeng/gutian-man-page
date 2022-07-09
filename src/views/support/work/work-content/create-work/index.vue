<template>
  <div>
    <el-dialog title="新建作品" :visible.sync="createWorkVisible">
      <el-form ref="createWorkForm" label-position="left" :rules="rules" label-width="100px" :model="form">
        <el-form-item label="作品中文名:" :label-width="formLabelWidth" prop="workname_cn">
          <el-input v-model="form.workname_cn" autocomplete="off" @blur="blurWorknameCN" />
        </el-form-item>
        <el-form-item label="作品英文名:" :label-width="formLabelWidth" prop="workname">
          <el-input v-model="form.workname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="本地文件路径:" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            action=""
            :auto-upload="false"
            :multiple="false"
            :show-file-list="true"
            :limit="1"
            :on-change="beforeUpload"
          ><el-button size="small" type="primary">选择excel文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片:" :label-width="formLabelWidth">
          <el-upload
            ref="imageUpload"
            :file-list="imageList"
            multiple
            action=""
            :auto-upload="false"
            :on-change="handleImageUpload"
            :on-remove="handleRemove"
          ><el-button size="small" type="primary">选择图片文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { readExcelToJson, generateCharacterData } from '@/utils/xlsx'
import { transformImage } from '@/utils/trans-image'
import { createWork, checkWorkName } from '@/api/work'
import { pinyin } from 'pinyin-pro'

export default {
  name: 'CreateWork',
  data() {
    const validateWorkName = async(rule, value, callback) => {
      const {
        msg, errors
      } = await checkWorkName('workname', value)
      if (msg === 'ok') {
        callback()
      } else {
        callback(new Error(errors))
      }
    }
    const validateWorkNameCN = async(rule, value, callback) => {
      const {
        msg, errors
      } = await checkWorkName('workname_cn', value)
      if (msg === 'ok') {
        callback()
      } else {
        callback(new Error(errors))
      }
    }
    return {
      imageList: [],
      submitLoading: false,
      formLabelWidth: '120px',
      workname_cn: '',
      sheets: 'default',
      form: {
        workname: '',
        workname_cn: ''
      },
      rules: {
        workname: [
          { required: false },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' },
          { trigger: 'change', validator: validateWorkName }
        ],
        workname_cn: [
          { required: true, message: '请输入作品名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { trigger: 'blur', validator: validateWorkNameCN }
        ]
      }
    }
  },
  computed: {
    createWorkVisible: function() {
      return this.$store.state.works['createWorkVisible']
    }
  },
  watch: {
    form: function(val) {
      debugger
      if (val.workname === '') {
        this.form.workname = pinyin(val.workname_cn, { toneType: 'none' })
      }
    }
  },
  methods: {
    async submit() {
      const data = await this.generateUploadData()
      const res = await createWork(JSON.stringify(data))
      if (res.status === 200) {
        this.$message.success('创建成功')
      }
      this.$store.commit('works/SET_CREATE_WORK_VISIBLE')
      this.$refs['createWorkForm'].resetFields()
      this.imageList = []
      this.sheets = 'default'
      this.$store.dispatch('works/getWorkVersions')
    },
    cancel() {
      this.$store.commit('works/SET_CREATE_WORK_VISIBLE')
      this.$refs['createWorkForm'].resetFields()
      this.imageList = []
      this.sheets = 'default'
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
    async readImages() {
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
    handleRemove(file) {
      for (var i in this.imageList) {
        if (this.imageList[i].name === file.name) {
          this.imageList.splice(i, 1)
        }
      }
    },
    async transImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => resolve(transformImage(reader.result))
        reader.onerror = error => reject(error)
      })
    },
    async generateUploadData() {
      var data = JSON.parse(JSON.stringify(this.form))
      data['characters'] = await generateCharacterData(this.sheets, this.imageList)
      // for (var c of this.sheets) {
      //   var c_info = {}
      //   c_info['first_word'] = Object.keys(c).includes('首字母') ? c['首字母'] : ''
      //   c_info['id'] = Object.keys(c).includes('序号') ? c['序号'] : ''
      //   c_info['name'] = Object.keys(c).includes('干员姓名') ? c['干员姓名'] : ''
      //   c_info['anothername'] = Object.keys(c).includes('干员别名') ? c['干员别名'].split(',') : []
      //   c_info['nickname'] = Object.keys(c).includes('干员昵称') ? c['干员昵称'].split(',') : []
      //   c_info['falsename'] = Object.keys(c).includes('干员错名') ? c['干员错名'].split(',') : []
      //   c_info['quanpin'] = Object.keys(c).includes('姓名全拼') ? c['姓名全拼'].split(',') : []
      //   c_info['painting'] = Object.keys(c).includes('立绘') ? c['立绘'] : ''
      //   c_info['card'] = Object.keys(c).includes('角色卡') ? c['角色卡'] : ''
      //   c_info['colors'] = Object.keys(c).includes('颜色') ? c['颜色'] : []
      //   c_info['class'] = Object.keys(c).includes('职业') ? c['职业'] : ''
      //   c_info['first_word'] = Object.keys(c).includes('稀有度') ? c['rarity'] : ''
      //   for (var i of this.imageList) {
      //     if ((c_info.name + '.png') === i.name.toLowerCase()) {
      //       c_info['colors'] = await this.transImage(i.raw)
      //     }
      //   }
      //   data['characters'][c_info['name']] = c_info
      // }
      return data
    },
    blurWorknameCN() {
      if (this.form.workname === '') {
        this.form.workname = pinyin(this.form.workname_cn, { toneType: 'none' }).replaceAll(' ', '')
      }
    }
  }
}
</script>
