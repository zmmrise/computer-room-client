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
            autocomplete="off"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            autocomplete="off"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="确认密码"
            autocomplete="off"
            v-model="loginForm.checkPass"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="register" :plain="true"
            >注册</el-button
          >
          <el-button type="info" @click="toLogin">已有账户，去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.checkPass !== "") {
          this.$refs.LoginFormRef.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },

      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    register() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/register", this.loginForm);
          console.log(res);

          if (res.data.code !== 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.$router.push("/login");
          }
        }
      });
    },
    toLogin() {
      this.$router.push("/login");
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
  height: 350px;
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
