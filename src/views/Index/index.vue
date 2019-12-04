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
      <el-col class="el-col-flex" :span="12" style="height:370px;">
        <el-card>
          <div slot="header" class="clearfix">
              <span>店铺及商品提示</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height:370px">
          <div slot="header" class="clearfix">
              <span>卡片名称</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-layout :title="titleShop" :data="dataShop" :type='row'></el-layout>
    <el-layout :title="titleTride" :data="dataTride" :type='row'></el-layout>
    <el-layout :title="titleOrder" :data="dataOrder" :type='chart'></el-layout>
    <el-layout :title="titlesales" :data="dataSales" :type='display'></el-layout>
    <el-layout :title="titleRank" :data="dataRank" :type='table'></el-layout>
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
      dataList: [
        {
          num: '',
          desc: '',
        },
      ],
      titleShop: {
        left: '',
        right: '',
      },
      titleTride: {
        left: '',
        right: '',
      },
      titleOrder: {
        left: '',
        right: '',
      },
      titlesales: {
        left: '',
        right: '',
      },
      titleRank: {
        left: '',
        right: '',
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
        {},
      ],
      datasales: [
        { time: '昨日销量', num: 12, money: 12 },
        { time: '本月销量', num: 12, money: 12 },
      ],
      dataRank: [
        {},
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
