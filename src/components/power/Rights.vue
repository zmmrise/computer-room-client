<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" border stripe height="550">
        <el-table-column type="index" label="#" width="400"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="400">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" width="400">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get("/getRights");
      this.rightsList = res.data.data;
    },
  },
  created() {
    this.getRightList();
  },
};
</script>

<style>
</style>