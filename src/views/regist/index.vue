<template>
  <div class="login-container" :style="bgImage">
    <el-form v-if="registType === 'password'" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册谷甜</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegist"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <a class="change-regist-type" @click="registType = 'phone'">手机号注册</a>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegist('password')">注册</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>

    <el-form v-if="registType === 'phone'" ref="phoneForm" :model="phoneForm" :rules="phoneRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册谷甜</h3>
      </div>

      <el-form-item prop="phoneNumber">
        <el-input
          ref="phoneNumber"
          v-model="phoneForm.phoneNumber"
          placeholder="手机号"
          name="phoneNumber"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="otp">
        <div class="code">
          <el-input
            ref="otp"
            v-model="phoneForm.otp"
            placeholder="验证码"
            name="otp"
            tabindex="2"
            auto-complete="on"
          />
          <el-button v-if="sendCodeDisabled === false" :disabled="sendCodeDisabled" @click="sendCode">获取验证码</el-button>
          <el-button v-if="sendCodeDisabled === true" type="button" :disabled="sendCodeDisabled" @click="sendCode">{{ btntxt }}</el-button>
        </div>
      </el-form-item>
      <a class="change-regist-type" @click="registType = 'password'">密码注册</a>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegist('phone')">注册</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getPhoneOtp } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    const validatePhoneNumber = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    const validateOtp = (rule, value, callback) => {
      var reg = /^\w{4,8}$/
      if (!reg.test(value)) {
        callback(new Error('验证码格式错误'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // username: 'super',
        // password: 'MbSceVw3'
        username: '',
        password: ''
      },
      phoneForm: {
        phoneNumber: '',
        otp: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      phoneRules: {
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        otp: [{ required: true, trigger: 'blur', validator: validateOtp }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      bgImage: {
        backgroundImage: 'url(' + require('@/assets/images/bg.jpg') + ')'
      },
      registType: 'phone',
      otpToken: '',
      sendCodeDisabled: false,
      time: 60,
      btntxt: '重新发送'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegist(registType) {
      if (registType === 'password') {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/passwordRegist', this.loginForm).then(() => {
              this.$message.success('注册成功!')
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(error => {
              this.$message.error(error.response.data.errors[0])
              this.loading = false
            })
          } else {
            console.log('输入错误!!')
            return false
          }
        })
      } else if (registType === 'phone') {
        this.$refs.phoneForm.validate(valid => {
          if (valid) {
            this.loading = true
            var postData = {
              phoneNumber: this.phoneForm.phoneNumber,
              otp: this.phoneForm.otp,
              otpToken: this.otpToken
            }
            this.$store.dispatch('user/phoneRegist', postData).then(() => {
              this.$message.success('注册成功!')
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(error => {
              this.$message.error(error.response.data.errors[0])
              this.loading = false
            })
          } else {
            console.log('输入错误!!')
            return false
          }
        })
      }
    },
    async sendCode() {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(this.phoneForm.phoneNumber)) {
        this.$message.error('请输入正确的手机号')
        return false
      }
      this.loading = true
      var r = await getPhoneOtp(this.phoneForm.phoneNumber)
      console.debug(r.otp_token)
      if (Object.keys(r).includes('otp_token') === true) {
        this.otpToken = r.otp_token
        this.loading = false
        this.$message.success('发送验证码成功')
        this.time = 60
        this.sendCodeDisabled = true
        this.timer()
      } else if (Object.keys(r).includes('errors')) {
        this.$message.error(r['errors'][0])
      } else {
        this.$message.error('获取验证码失败,请稍后再试')
      }
      this.loading = false
    },
    timer() {
      if (this.time > 0) {
        this.time--
        this.btntxt = this.time + 's后重新获取'
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '获取验证码'
        this.disabled = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .code {
      .el-input {
          width: 55%;
          border-radius: 0px;
          display: inline-block;
      }
      .el-button {
          width: 45%;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-left: 0px;
          display: inline-block;
      }
      .el-button--primary {
          width: 100%;
          background-color: #ffe86a;
          border: none;
          color: #000;
      }
  }

  .change-regist-type {
    color: lightblue;
    float: right;
    margin-bottom: 10px;
  }
}
</style>
