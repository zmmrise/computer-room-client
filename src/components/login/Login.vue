<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="rules"
        ref="LoginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :plain="true"
            >登录</el-button
          >
          <el-button type="info" @click="toRegister"
            >没有账号，去注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    toRegister() {
      this.$router.push("/register");
    },
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/login", this.loginForm);

          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          }
          this.$message.success(res.data.msg);
          window.sessionStorage.setItem("token", res.data.data._id);
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  padding: 100px auto;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box {
  width: 130px;
  height: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: center;
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
