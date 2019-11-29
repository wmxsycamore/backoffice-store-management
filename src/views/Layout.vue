<template>
  <div>
    <el-container>
      <el-header>
        <a href="#" style="font-size:24px;font-weight:bold;">{{$conf.logo}}</a>
        <el-menu
         :default-active="navBar.active"
         class="el-menu-demo"
         mode="horizontal"
         @select="handleSelect"
         background-color="#545c64"
         text-color="#fff"
         active-text-color="#ffd04b">
         <el-menu-item :index="index | numToString" v-for="(item,index) in navBar.list" :key="index">{{item.name}}</el-menu-item>
         <el-submenu index="6" style="width:160px">
           <template slot="title">
             <el-avatar shape="circle" :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
             用户名称
            </template>
           <el-menu-item index="6-1">修改</el-menu-item>
           <el-menu-item index="6-2">退出</el-menu-item>
         </el-submenu>
        </el-menu>
      </el-header>
      <el-container class="container">
        <!-- 侧边布局 -->
        <el-aside width="200px">
          <el-menu
            default-active="0"
            @select="slideSelect"
            style="height:100%">
            <el-menu-item :index="index | numToString" v-for="(item,index) in slideMenu" :key="index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>

          </el-menu>
        </el-aside>
        <!-- 主布局 -->
        <el-main>
          <div class="bread">
            <!-- 面包屑导航 -->
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import common from '@/common/mixins/common';

export default {
  name: 'Layout',
  components: {
  },
  mixins: [common],
  data() {
    return {
      navBar: [],
    };
  },
  created() {
    this.navBar = this.$conf.navBar;
    // 获取面包屑导航
    this.getRouterBran();
  },
  computed: {
    slideMenuActive: {
      get() {
        return this.navBar.list[this.navBar.active].subActive || '0';
      },
      set(val) {
        // console.log(val);
        this.navBar.list[this.navBar.active].subActive = val;
      },
    },
    slideMenu() {
      return this.navBar.list[this.navBar.active].submenu || [];
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      this.navBar.active = key;
    },
    slideSelect(key, keyPath) {
      this.slideMenuActive = key;
    },
    getRouterBran() {
      const b = this.$route.matched.filter(v => v.name);
      const arr = [];
      b.forEach((v, k) => {
        if (v.name === 'index' || v.name === 'layout') {
          arr.push({
            name: v.name,
            path: v.path,
          });
        }
      });

      console.log(this.$route.matched);
    },
  },
};
</script>

<style lang="scss" scope>
.el-container.is-vertical {
  position: absolute;
  left:0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  .container {
    height: 100%;
  }
  .el-main {
    padding: 0;
    .bread {
      border-bottom: 1px solid #eee;
      padding: 20px;
    }
  }
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(84, 92, 100);
  a {
    font-size: 28px;
    font-weight: bold;
    text-decoration: none;
    color: #fff;
    line-height: 60px;
  }
}
.el-avatar {
  img {
    width: 15%;
  }
}
</style>
