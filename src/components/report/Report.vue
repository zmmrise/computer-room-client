<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Report",
  data() {
    return {};
  },
  methods: {},
  async mounted() {
    const myChart = echarts.init(document.getElementById("main"));
    const res = await this.$http.get("/getReport");
    if (res.data.code !== 0) {
      this.$message.error("获取饼图数据失败！");
    } else {
      myChart.setOption({
        title: {
          text: "系统访问来源",
          textStyle: {
            fontSize: 30,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}%",
          textStyle: {
            fontSize: 18,
          },
          backgroundColor: "rgb(0, 255, 0)",
        },
        textStyle: {
          fontSize: 26,
        },
        series: [
          {
            name: "访问来源",
            type: "pie", // 设置图表类型为饼图
            radius: "70%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: res.data.data,
          },
        ],
      });
    }
  },
};
</script>

<style>
</style>