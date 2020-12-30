<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生充值</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getStudentPayList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getStudentPayList"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="ShowAddDialog"
              >添加学生充值</el-button
            >
          </div></el-col
        >
      </el-row>
      <el-table border stripe :data="studentPayList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="金额" prop="amount"></el-table-column>
        <el-table-column label="办理人" prop="agent"></el-table-column>
        <el-table-column label="充值时间" prop="pay_time">
          <template slot-scope="scope">
            {{ scope.row.pay_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="修改金额" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="ShowEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除记录" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removePay(scope.row._id)"
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
      title="添加学生充值"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="金额￥" prop="amount">
          <el-input v-model="AddRuleForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="办理人" prop="agent">
          <el-input v-model="AddRuleForm.agent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddStudentPay">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改充值金额"
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="CloseEditDialog"
    >
      <el-form label-width="100px" :model="EditRuleForm" ref="EditRuleFormRef">
        <el-form-item label="充值金额">
          <el-input v-model="EditRuleForm.amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditStudentPay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StudentPay",
  data() {
    return {
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      studentPayList: [],
      AddDialogVisible: false,
      EditDialogVisible: false,
      AddRules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        student_number: [
          { required: true, message: "学号不能为空", trigger: "blur" },
        ],
        class_number: [
          { required: true, message: "班级不能为空", trigger: "blur" },
        ],
      },
      AddRuleForm: {
        username: "",
        amount: 0,
        agent: "",
      },
      EditRuleForm: {},
    };
  },
  methods: {
    ShowAddDialog() {
      this.AddDialogVisible = true;
    },
    async ShowEditDialog(row) {
      const res = await this.$http.get("/getAmount", {
        params: { _id: row._id },
      });

      this.EditRuleForm = res.data.data;
      this.EditDialogVisible = true;
    },
    CloseAddDialog() {
      this.$refs.AddRuleFormRef.resetFields();
    },
    async removePay(_id) {
      const res = await this.$confirm(
        "此操作将永久删除该充值记录, 是否继续?",
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
      const result = await this.$http.delete("/deletePay", {
        params: { _id },
      });
      if (result.data.code !== 0) {
        return this.$message.error("删除失败！");
      } else {
        this.$message.success(result.data.msg);
        this.getStudentPayList();
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getStudentPayList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getStudentPayList();
    },
    CloseEditDialog() {
      this.$refs.EditRuleFormRef.resetFields();
    },
    async EditStudentPay() {
      this.EditDialogVisible = false;
      const res = await this.$http.put("/updateAmount", {
        _id: this.EditRuleForm._id,
        amount: this.EditRuleForm.amount,
      });
      if (res.data.code !== 0) {
        return this.$message.error("修改金额失败");
      }
      this.$message.success("成功修改金额");
      this.AddDialogVisible = false;
      this.getStudentPayList();
    },
    AddStudentPay() {
      this.$refs.AddRuleFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/addStudentPay", this.AddRuleForm);
          if (res.data.code !== 0) {
            return this.$message.error("添加失败");
          }
          this.$message.success("成功添加");
          this.AddDialogVisible = false;
          this.getStudentPayList();
        }
      });
    },
    async getStudentPayList() {
      const res = await this.$http.get("/getStudentPay", {
        params: this.queryInfo,
      });
      if (res.data.code !== 0) {
        return this.$message.error("获取学生充值信息失败");
      }
      this.total = res.data.data.total;
      this.studentPayList = res.data.data.StudentPayList;
    },
  },
  created() {
    this.getStudentPayList();
  },
};
</script>

<style>
</style>