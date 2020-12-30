<template>
  <div class="welcome">
    <h1>{{ username }}, 欢迎访问此系统</h1>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      username: "",
    };
  },
  methods: {
    async getUser() {
      const token = window.sessionStorage.getItem("token");
      const res = await this.$http.get("/getUser", { params: { token } });
      this.username = res.data.data.username;
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped>
.welcome {
  text-align: center;
}
</style>