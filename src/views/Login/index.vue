<template>
  <el-row type="flex" justify="center">
    <el-col :xs="16" :sm="10" :md="8" :lg="8"  :xl="6">
        <el-card>
          <div slot="header">
              <span>UNI-LOGIN</span>
          </div>
          <div>
            <el-form :rules="rules" :model="loginForm" ref="ruleForm">
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  prefix-icon="el-icon-user"
                  placeholder="请输入用户名"
                  type="text"></el-input>
              </el-form-item>
               <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  prefix-icon="el-icon-edit"
                  placeholder="请输入密码"
                  type="password"
                  show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="medium" @click="submit">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Login',
  props: {
    message: Object,
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submit() {
      // console.log(this.$refs.ruleForm);
      this.$refs.ruleForm.validate(e => {
        // e反应的是rules是否通过，type为boolean
        // console.log(e);
        if (!e) return;
        this.$router.push({ name: 'index' });
      });
    },
  },
};
</script>

<style lang="scss" scope>
.el-card__header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.el-button {
  width: 100%;
}
</style>
