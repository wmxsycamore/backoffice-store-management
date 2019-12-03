<template>
<!-- 首页 -->
  <div class="index">
    <!-- 数据统计 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,index) in statistics" :key="index" :class="'col-'+index">
        <el-card shadow="hover">
            <i :class="item.icon"></i>
          <div>
              <p>{{statisticData[item.tag]}}</p>
              <p>{{item.name}}</p>
            </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      statistics: [
        {
          tag: 'people',
          name: '关注人数（个）',
          icon: 'el-icon-user-solid',
        },
        {
          tag: 'order',
          name: '订单数量（笔）',
          icon: 'el-icon-s-finance',
        },
        {
          tag: 'money',
          name: '今日订单总额（元）',
          icon: 'el-icon-s-order',
        },
        {
          tag: 'sales',
          name: '本月销量（单）',
          icon: 'el-icon-s-data',
        },
      ],
      statisticData: {
        people: 30, order: 120, money: 4138.80, sales: 100,
      },
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
</style>
