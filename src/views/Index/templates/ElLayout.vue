<template>
  <el-card>
    <div slot="header" class="clearfix" v-if='title'>
      <span>{{title.left}}</span>
      <span>{{title.right}}</span>
    </div>
    <el-row v-if="type ==='row'">
      <el-col :span="24/data.length | roundOff" v-for="(item,index) in data" :key="index">
      <span>{{item.num}}</span>
      <span>{{item.desc}}</span>
      </el-col>
    </el-row>
    <div v-if="type ==='chart'" ref="chart">
    </div>
    <div v-if="type ==='display'">
      <ul v-for="(item,index) in data" :key="index">
        <li>{{item.time}}</li>
        <li>
          <p>订单量（件）{{item.num}}</p>
          <p>订单金额（元）{{item.money}}</p>
        </li>
      </ul>
    </div>
    <el-table
      v-if="type ==='table'"
      :data="data" height="250"
      border
      style="width: 100%">
      <el-table-column></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'ElLayout',
  props: {
    title: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  filters: {
    roundOff: val => Math.floor(val),
  },
  mounted() {
    this.drawCharts();
  },
  methods: {
    drawCharts() {
      const myChart = echarts.init(this.$refs.chart);
      myChart.setOptions(this.data[0]);
    },
  },
};
</script>

<style>

</style>
