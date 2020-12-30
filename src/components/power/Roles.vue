<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rolesList" border stripe height="550">
        <el-table-column
          type="index"
          label="#"
          width="140"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="role_rights" label="角色权限" width="600">
          <template slot-scope="scope">
            <el-tag
              :key="item._id"
              v-for="item in scope.row.role_rights"
              closable
              :disable-transitions="false"
              @close="handleRemoveTag(scope.row._id)"
            >
              {{ item.authName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDialog(scope.row._id)"
              >分配权限</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row._id)"
              >删除角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="CloseAddDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="分配权限">
          <el-select v-model="value2" placeholder="请选择" multiple>
            <el-option
              v-for="item in value"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      _id: "",
      rights: [],
      value2: [],
      value: [],
      rolesList: [],
      AddDialogVisible: false,
    };
  },
  methods: {
    showDialog(_id) {
      this.AddDialogVisible = true;
      this._id = _id;
    },
    async setRight() {
      let role = this.rolesList.find((item) => item._id == this._id);

      if (role.role_rights !== undefined && this.value2.length !== 0) {
        for (let i = 0; i < role.role_rights.length; i++) {
          for (let j = 0; j < this.value2.length; j++) {
            if (role.role_rights[i].authName == this.value2[j]) {
              return this.$message.error("重复分配权限");
            }
          }
        }
      }
      const res = await this.$http.post("/setRight", {
        _id: this._id,
        rights: this.value2,
      });
      this.$message.success(res.data.msg);
      this.AddDialogVisible = false;
      this.getRoleList();
    },
    async getRoleList() {
      const res = await this.$http.get("/getRoles");

      this.rolesList = JSON.parse(res.data.data);
      this.rolesList.forEach((item) => {
        this.rights = [...this.rights, ...item.rights];
      });
      for (const item of this.rights) {
        this.value.push(item.authName);
      }
      this.value = Array.from(new Set(this.value));
    },
    async handleRemoveTag(_id) {
      const res = await this.$http.put("/removeRight", { _id });
      this.getRoleList();
    },
    async removeRole(_id) {
      const res = await this.$http.delete("/delRole", { params: { _id } });
      if (res.data.code !== 0) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除成功");
      this.getRoleList();
    },
    CloseAddDialog() {
      this.value2 = [];
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style scoped>
.el-tag {
  margin-left: 10px;
}
</style>
