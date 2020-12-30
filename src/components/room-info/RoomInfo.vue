<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>机房管理</el-breadcrumb-item>
      <el-breadcrumb-item>机房信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7"
          ><div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.query"
              @clear="getRoomInfoList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getRoomInfoList"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="ShowAddDialog"
              >添加机房信息</el-button
            >
          </div></el-col
        >
      </el-row>
      <el-table border stripe :data="RoomInfoList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="机房号" prop="room_number"></el-table-column>
        <el-table-column label="容纳机器数" prop="capacity"></el-table-column>
        <el-table-column
          label="损坏机器数"
          prop="break_computer_count"
        ></el-table-column>
        <el-table-column label="是否空闲">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isFree"
              active-text="空闲"
              inactive-text="忙碌"
              @change="RoomInfoStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑机房信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除机房信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRoomInfoById(scope.row._id)"
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
      title="添加机房信息"
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
        <el-form-item label="机房号" prop="room_number">
          <el-input v-model="AddRuleForm.room_number"></el-input>
        </el-form-item>
        <el-form-item label="容纳机器数" prop="capacity">
          <el-input v-model="AddRuleForm.capacity"></el-input>
        </el-form-item>
        <el-form-item label="损坏机器数" prop="break_computer_count">
          <el-input v-model="AddRuleForm.break_computer_count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddRoomInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改机房信息"
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
        <el-form-item label="机房号" prop="room_number">
          <el-input v-model="EditRuleForm.room_number"></el-input>
        </el-form-item>
        <el-form-item label="容纳机器数" prop="capacity">
          <el-input v-model="EditRuleForm.capacity"></el-input>
        </el-form-item>
        <el-form-item label="损坏机器数" prop="break_computer_count">
          <el-input v-model="EditRuleForm.break_computer_count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdateRoomInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RoomInfo",
  data() {
    return {
      RoomInfoList: [],
      total: 0,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 6,
      },
      AddRules: {
        room_number: [
          { required: true, message: "机房编号不能为空", trigger: "blur" },
        ],
        capacity: [
          { required: true, message: "容纳机器数不能为空", trigger: "blur" },
        ],
        break_computer_count: [
          { required: true, message: "损坏机器数不能为空", trigger: "blur" },
        ],
      },
      EditRules: {
        room_number: [
          { required: true, message: "机房编号不能为空", trigger: "blur" },
        ],
        capacity: [
          { required: true, message: "容纳机器数不能为空", trigger: "blur" },
        ],
        break_computer_count: [
          { required: true, message: "损坏机器数不能为空", trigger: "blur" },
        ],
      },
      EditRuleForm: {},
      AddDialogVisible: false,
      EditDialogVisible: false,
      AddRuleForm: {
        room_number: "",
        capacity: 0,
        break_computer_count: 0,
      },
    };
  },
  methods: {
    ShowAddDialog() {
      this.AddDialogVisible = true;
    },
    CloseAddDialog() {
      this.$refs.AddRuleFormRef.resetFields();
    },
    CloseEditDialog() {
      this.$refs.EditRuleFormRef.resetFields();
    },
    async getRoomInfoList() {
      const res = await this.$http.get("/getRoomInfoList", {
        params: this.queryInfo,
      });
      this.total = res.data.data.total;
      this.RoomInfoList = res.data.data.RoomInfoList;
    },
    async AddRoomInfo() {
      this.$refs.AddRuleFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post("/addRoomInfo", this.AddRuleForm);
          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          }
          this.$message.success(res.data.msg);
          this.AddDialogVisible = false;
          this.getRoomInfoList();
        }
      });
    },
    async showEditDialog(_id) {
      const res = await this.$http.get("/getRoomInfo", { params: { _id } });
      this.EditRuleForm = res.data.data;
      this.EditDialogVisible = true;
    },
    async UpdateRoomInfo() {
      this.$refs.EditRuleFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.put("/updateRoomInfo", {
            room_number: this.EditRuleForm.room_number,
            capacity: this.EditRuleForm.capacity,
            break_computer_count: this.EditRuleForm.break_computer_count,
          });

          if (res.data.code !== 0) {
            return this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            this.EditDialogVisible = false;
            this.getRoomInfoList();
          }
        }
      });
    },
    async removeRoomInfoById(_id) {
      const res = await this.$confirm(
        "此操作将永久删除该机房信息, 是否继续?",
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
      const result = await this.$http.delete("/deleteRoomInfo", {
        params: { _id },
      });
      if (result.data.code !== 0) {
        return this.$message.error("删除失败！");
      } else {
        this.$message.success(result.data.msg);
        this.getRoomInfoList();
      }
    },
    async RoomInfoStateChange(roominfo) {
      const res = await this.$http.put("/updateFreeState", {
        _id: roominfo._id,
        isFree: roominfo.isFree,
      });
      if (res.data.code !== 0) {
        roominfo.isFree = !roominfo.isFree;
        return this.$message.error("更新状态失败!");
      }
      this.$message.success("更新状态成功!");
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getRoomInfoList();
    },
    // 切换到当前页码
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getRoomInfoList();
    },
  },
  created() {
    this.getRoomInfoList();
  },
};
</script>

<style>
</style>