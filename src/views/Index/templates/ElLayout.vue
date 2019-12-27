<template>
  <el-card>
    <div slot="header" class="clearfix" v-if='title'>
      <span>{{title.left}}</span>
      <span>{{title.right}}</span>
    </div>

      <el-row v-if="type ==='row'" :gutter="20">
        <el-col :span="24/data.length | roundOff" v-for="(item,index) in data" :key="index">
          <div class="content">
            <span>{{item.num}}</span>
            <span>{{item.desc}}</span>
          </div>
        </el-col>
      </el-row>


    <div v-if="type ==='chart'" ref="chart" style="width: 100%;height:370px;"></div>
    <div v-if="type ==='display'" class="ul-list">
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
      :data="data"
      height="250"
      border
      style="width: 100%">
      <el-table-column
       type="index"></el-table-column>
      <el-table-column
        prop="info"
        label="商品信息"></el-table-column>
      <el-table-column
        prop="amount"
        label="销量"></el-table-column>
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
  created() {
    // console.log(this.data);
  },
  mounted() {
    if (this.$refs.chart) {
      this.drawCharts();
    }
    // this.$nextTick(() => this.drawCharts());
  },
  methods: {
    drawCharts() {
      const myChart = echarts.init(this.$refs.chart);
      myChart.setOption(this.data[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card__header {
  .clearfix {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  span:nth-child(2) {
    color: #666;
    font-size: 14px
  }
}
.el-card__body {
  .el-row {
    width: 100%;
    .el-col {
      .content {
        background: #eee;
        padding: 20px 0;
        span:nth-child(1) {
          font-size: 30px;
          font-weight: bold;
          line-height: 48px;
          display: block;
          text-align: center;
        }
        span:nth-child(2) {
          // font-size: 30px;
          display: block;
          text-align: center;
          line-height: 30px;
        }
      }
    }
  }
}
.ul-list {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul {
    border: 1px solid #eee;
    padding: 0;
    width: 100%;
    height: 40%;
    display: flex;
    flex-direction: row;
    li {
      list-style: none;

    }
    li:nth-child(1) {
      width: 25%;
      height: auto;
      background: rgb(232, 247, 232);
      text-align: center;
      line-height: 91px;
    }
    li:nth-child(2) {
      width: 75%;
      p {
        padding-left: 30px;
        line-height: 40px;
      }
       p:nth-child(1){
        border-bottom: 1px solid #eee;
      }
    }
  }
}
.el-table {
  .el-table_1_column_1,.el-table_1_column_3 {
    text-align: center;
  }
}
</style>
