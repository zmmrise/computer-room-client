<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/logo.png" alt="" />
        <span>机房管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :router="true"
          :default-active="$route.path"
          active-text-color="#409eff"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-user-solid"></i>学生管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/student/list">学生列表</el-menu-item>
              <el-menu-item index="/student/pay">学生充值</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="iconfont icon-quanxian2"></i>权限管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/right/list">权限列表</el-menu-item>
              <el-menu-item index="/role/list">角色列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"
              ><i class="iconfont icon-jifang"></i>机房管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="/computer/list">计算机列表</el-menu-item>
              <el-menu-item index="/roominfo">机房信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"
              ><i class="iconfont icon-shujutongji"></i>数据统计</template
            >
            <el-menu-item-group>
              <el-menu-item index="/report">数据报表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页面
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-header img {
  width: 60px;
}
.el-aside {
  background-color: #333744;
  transition: 0.6s;
}
.el-main {
  background-color: #eaedf1;
  overflow: auto !important;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 4px;
  cursor: pointer;
}
</style>
