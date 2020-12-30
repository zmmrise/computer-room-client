<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getStudentList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getStudentList"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="ShowAddDialog"
              >添加学生</el-button
            >
          </div></el-col
        >
      </el-row>
      <el-table border stripe :data="StudentList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="性别" prop="sex"></el-table-column>
        <el-table-column label="学号" prop="student_number"></el-table-column>
        <el-table-column label="班级" prop="class_number"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="编辑学生" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除学生" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeStudentById(scope.row._id)"
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
      title="添加学生"
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="AddRuleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="AddRuleForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学号" prop="student_number">
          <el-input v-model="AddRuleForm.student_number"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class_number">
          <el-input v-model="AddRuleForm.class_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddStudent">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改学生信息"
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="EditRuleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="EditRuleForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学号" prop="student_number">
          <el-input v-model="EditRuleForm.student_number"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class_number">
          <el-input v-model="EditRuleForm.class_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdateStudent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StudentList",
  data() {
    return {
      StudentList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      EditRuleForm: {},
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
      EditRules: {
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
        name: "",
        sex: "",
        student_number: "",
        class_number: "",
      },
      AddDialogVisible: false,
      EditDialogVisible: false,
    };
  },
  methods: {
    // 获取学生列表
    async getStudentList() {
      const res = await this.$http.get("/studentlist", {
        params: this.queryInfo,
      });
      this.total = res.data.data.total;
      this.StudentList = res.data.data.StudentList;
    },
    // 改变 每页显示多少条
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getStudentList();
    },
    // 切换到当前页码
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getStudentList();
    },
    ShowAddDialog() {
      this.AddDialogVisible = true;
    },
    async showEditDialog(_id) {
      const res = await this.$http.get("/getStudent", { params: { _id } });

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
    AddStudent() {
      this.$refs.AddRuleFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/addstudent", this.AddRuleForm);
          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          }
          this.$message.success(res.data.msg);
          this.AddDialogVisible = false;
          this.getStudentList();
        }
      });
    },
    UpdateStudent() {
      this.$refs.EditRuleFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.put("/updateStudent", {
            name: this.EditRuleForm.name,
            sex: this.EditRuleForm.sex,
            _id: this.EditRuleForm._id,
            student_number: this.EditRuleForm.student_number,
            class_number: this.EditRuleForm.class_number,
          });

          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.EditDialogVisible = false;
            this.getStudentList();
          }
        }
      });
    },
    async removeStudentById(_id) {
      const res = await this.$confirm(
        "此操作将永久删除该学生, 是否继续?",
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
      const result = await this.$http.delete("/delStudent", {
        params: { _id },
      });
      if (result.data.code !== 0) {
        return this.$message.error("删除失败！");
      } else {
        this.$message.success(result.data.msg);
        this.getStudentList();
      }
    },
  },
  created() {
    this.getStudentList();
  },
};
</script>

<style scoepd>
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
</style>
