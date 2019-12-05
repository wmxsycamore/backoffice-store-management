<template>
<!-- 首页 -->
  <div class="index">
    <!-- 数据统计 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,index) in statistics" :key="index" :class="'col-'+index">
        <el-card shadow="hover">
            <i :class="item.icon"></i>
          <div>
              <p>{{item.num}}</p>
              <p>{{item.desc}}</p>
            </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col class="el-col-flex" :span="12" style="height:473px">
        <!-- 店铺及商品提示 -->
        <el-layout :title="titleShop" :data="dataShop" :type="'row'"></el-layout>
        <!-- 交易提示 -->
        <el-layout :title="titleTride" :data="dataTride" :type="'row'"></el-layout>
      </el-col>
      <el-col :span="12">
        <!-- 订单总数统计 -->
        <el-layout :title="titleOrder" :data="dataOrder" :type="'chart'"></el-layout>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <!-- 销售情况统计 -->
        <el-layout :title="titlesales" :data="dataSales" :type="'display'"></el-layout>
        </el-col>
      <el-col :span="12">
        <!-- 单品销售排名 -->
        <el-layout :title="titleRank" :data="dataRank" :type="'table'"></el-layout>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import ElLayout from './templates/ElLayout';

export default {
  name: 'Index',
  components: {
    ElLayout,
  },
  data() {
    return {
      statistics: [
        {
          num: 120,
          desc: '关注人数（个）',
          icon: 'el-icon-user-solid',
        },
        {
          num: 110,
          desc: '订单数量（笔）',
          icon: 'el-icon-s-finance',
        },
        {
          num: 3323.77,
          desc: '今日订单总额（元）',
          icon: 'el-icon-s-order',
        },
        {
          num: 190,
          desc: '本月销量（单）',
          icon: 'el-icon-s-data',
        },
      ],
      type: '',
      titleShop: {
        left: '店铺及商品提示',
        right: '您需要关注的店铺信息以及待处理事项',
      },
      titleTride: {
        left: '交易提示',
        right: '您需要立即处理的交易订单',
      },
      titleOrder: {
        left: '订单总数统计',
        right: '订单数量',
      },
      titlesales: {
        left: '销售情况统计',
        right: '按周期统计商家店铺的订单量和订单金额',
      },
      titleRank: {
        left: '单品销售排名',
        right: '按周期统计商家店铺的订单量和订单金额',
      },
      dataShop: [
        { num: 64, desc: '出售中' },
        { num: 10, desc: '待回复' },
        { num: 0, desc: '库存预警' },
        { num: 3, desc: '仓库中' },
      ],
      dataTride: [
        { num: '0', desc: '待付款' },
        { num: '10', desc: '待收货' },
        { num: '0', desc: '已发货' },
        { num: '3', desc: '已收货' },
        { num: '3', desc: '退款中' },
        { num: '3', desc: '待售后' },
      ],
      dataOrder: [
        {
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              },
            },
          },
          legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {},
          //   },
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [220, 182, 191, 234, 290, 330, 310],
            },
            {
              name: '视频广告',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [150, 232, 201, 154, 190, 330, 410],
            },
            {
              name: '直接访问',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {} },
              data: [320, 332, 301, 334, 390, 330, 320],
            },
            {
              name: '搜索引擎',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                },
              },
              areaStyle: { normal: {} },
              data: [820, 932, 901, 934, 1290, 1330, 1320],
            },
          ],
        },
      ],
      dataSales: [
        { time: '昨日销量', num: 12, money: 12 },
        { time: '本月销量', num: 12, money: 12 },
      ],
      dataRank: [
        { info: '小天鹅（little swan）滚筒洗衣机', amount: 9 },
        { info: '话回公子男装裤子', amount: 9 },
        { info: '拉夏贝尔羽绒服长款', amount: 24 },
        { info: '空气加湿器 ins风', amount: 2 },
      ],
    };
  },
};
</script>

<style lang="scss" scope>
.index {
  padding: 20px
}
.el-card__body {
  display: flex;
  flex-direction: row;
  justify-content:  flex-start;
  align-items: center;
  i {
  color: #fff;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-right: 10px;
  }
  p{
    margin: 5px 0;
  }
}
@each $n,$color in (0,#409EFF),(1,#67C23A),(2,#F56C6C),(3,#E6A23C) {
  .col-#{$n} {
    .el-card__body {
      i {
        background: $color;
      }
    }
  }
}
.el-col-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
