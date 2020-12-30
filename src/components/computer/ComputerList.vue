<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机房管理</el-breadcrumb-item>
      <el-breadcrumb-item>计算机列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getComputerList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getComputerList"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="ShowAddDialog"
              >添加计算机</el-button
            >
          </div></el-col
        >
      </el-row>
      <el-table border stripe :data="ComputerList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="编号" prop="computer_number"></el-table-column>
        <el-table-column label="机房号" prop="room_number"></el-table-column>
        <el-table-column label="品牌" prop="brand"></el-table-column>
        <el-table-column label="待机状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-text="开机"
              inactive-text="关机"
              @change="computerStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="编辑计算机" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除计算机" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeComputerById(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 6, 9, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加计算机"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="CloseAddDialog"
    >
      <el-form
        label-width="100px"
        :model="AddRuleForm"
        :rules="AddRules"
        ref="AddRuleFormRef"
      >
        <el-form-item label="IP" prop="ip">
          <el-input v-model="AddRuleForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="computer_number">
          <el-input v-model="AddRuleForm.computer_number"></el-input>
        </el-form-item>
        <el-form-item label="机房号" prop="room_number">
          <el-input v-model="AddRuleForm.room_number"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="AddRuleForm.brand"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddComputer">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改计算机信息"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="CloseEditDialog"
    >
      <el-form
        label-width="100px"
        :model="EditRuleForm"
        :rules="EditRules"
        ref="EditRuleFormRef"
      >
        <el-form-item label="IP" prop="ip">
          <el-input v-model="EditRuleForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="computer_number">
          <el-input v-model="EditRuleForm.computer_number"></el-input>
        </el-form-item>
        <el-form-item label="机房号" prop="room_number">
          <el-input v-model="EditRuleForm.room_number"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="EditRuleForm.brand"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdateComppter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ComputerList",
  data() {
    return {
      ComputerList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      EditRuleForm: {},
      AddRules: {
        ip: [{ required: true, message: "IP不能为空", trigger: "blur" }],
        computer_number: [
          { required: true, message: "编号不能为空", trigger: "blur" },
        ],
        room_number: [
          { required: true, message: "机房号不能为空", trigger: "blur" },
        ],
        brand: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
      },
      EditRules: {
        ip: [{ required: true, message: "IP不能为空", trigger: "blur" }],
        computer_number: [
          { required: true, message: "编号不能为空", trigger: "blur" },
        ],
        room_number: [
          { required: true, message: "机房号不能为空", trigger: "blur" },
        ],
        brand: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
      },
      AddRuleForm: {
        ip: "",
        computer_number: "",
        room_number: "",
        brand: "",
      },
      AddDialogVisible: false,
      EditDialogVisible: false,
    };
  },
  methods: {
    // 获取计算机列表
    async getComputerList() {
      const res = await this.$http.get("/computerlist", {
        params: this.queryInfo,
      });
      this.total = res.data.data.total;
      this.ComputerList = res.data.data.ComputerList;
    },
    // 改变 每页显示多少条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getComputerList();
    },
    // 切换到当前页码
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getComputerList();
    },
    ShowAddDialog() {
      this.AddDialogVisible = true;
    },
    async showEditDialog(_id) {
      const res = await this.$http.get("/getComputer", { params: { _id } });

      this.EditRuleForm = res.data.data;
      this.EditDialogVisible = true;
    },
    // 监听 添加对话框的关闭
    CloseAddDialog() {
      this.$refs.AddRuleFormRef.resetFields();
    },
    CloseEditDialog() {
      this.$refs.EditRuleFormRef.resetFields();
    },
    async computerStateChange(computerinfo) {
      const res = await this.$http.put("/updateComputerState", {
        _id: computerinfo._id,
        state: computerinfo.state,
      });
      if (res.data.code !== 0) {
        computerinfo.state = !computerinfo.state;
        return this.$message.error("更新状态失败!");
      }
      this.$message.success("更新状态成功!");
    },
    AddComputer() {
      this.$refs.AddRuleFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/addcomputer", this.AddRuleForm);
          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          }
          this.$message.success(res.data.msg);
          this.AddDialogVisible = false;
          this.getComputerList();
        }
      });
    },
    UpdateComppter() {
      this.$refs.EditRuleFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.put("/updateComputer", {
            ip: this.EditRuleForm.ip,
            brand: this.EditRuleForm.brand,
            _id: this.EditRuleForm._id,
            computer_number: this.EditRuleForm.computer_number,
            room_number: this.EditRuleForm.room_number,
          });

          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.EditDialogVisible = false;
            this.getComputerList();
          }
        }
      });
    },
    async removeComputerById(_id) {
      const res = await this.$confirm(
        "此操作将永久删除该计算机, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (res !== "confirm") {
        return this.$message.info("已取消删除操作");
      }
      const result = await this.$http.delete("/delComputer", {
        params: { _id },
      });
      if (result.data.code !== 0) {
        return this.$message.error("删除失败！");
      } else {
        this.$message.success(result.data.msg);
        this.getComputerList();
      }
    },
  },
  created() {
    this.getComputerList();
  },
};
</script>

<style scoepd>
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
</style>
