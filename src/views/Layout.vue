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
             <i class="el-icon-user-solid" style="color: #fff"></i>
              <span>用户名称</span>
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
            :default-active="slideMenuActive"
            @select="slideSelect"
            style="height:100%">
            <el-menu-item :index="index | numToString" v-for="(item,index) in slideMenu" :key="index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主布局 -->
        <el-main style="background:#eee;padding-bottom:60px;position:relative">
          <div class="bread" v-if="bran.length > 0">
            <!-- 面包屑导航 -->
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="(item,index) in bran" :key="index"  :to="{ path: item.path }">
                {{item.title}}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
          <el-backtop target=".el-main" :bottom="100">
          </el-backtop>
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
      bran: [],
    };
  },
  created() {
    this.navBar = this.$conf.navBar;
    // 获取面包屑导航
    this.getRouterBran();
    // 初始化选中菜单
    this.initNavBar();
  },
  watch: {
    $route() {
      // console.log(to);
      // console.log(from);
      // 本地存储
      localStorage.setItem('navActive', JSON.stringify({
        top: this.navBar.active,
        left: this.slideMenuActive,
      }));
      this.getRouterBran();
    },
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
    handleSelect(key) {
      if (key === '6-1') {
        return console.log('修改成功');
      }
      if (key === '6-2') {
        return console.log('退出成功');
      }
      this.navBar.active = key;
      // 默认跳转到当前激活的那一个
      this.slideMenuActive = '0';
      if (this.slideMenu.length > 0) {
        this.$router.push({ name: this.slideMenu[this.slideMenuActive].pathName });
      }
      return '';
    },
    slideSelect(key) {
      this.slideMenuActive = key;
      // 跳转指定页面
      this.$router.push({ name: this.slideMenu[key].pathName });
      // console.log(this.slideMenu[key]);
    },
    getRouterBran() {
      // console.log(this.$route);
      const b = this.$route.matched.filter(v => v.name);
      // 首页不需要出现在面包屑导航里
      const arr = [];
      b.forEach(v => {
        if (v.name === 'index' || v.name === 'layout') return;
        arr.push({
          name: v.name,
          path: v.path,
          title: v.meta.title,
        });
      });
      if (arr.length > 0) {
        arr.unshift({
          name: 'index', path: '/index', title: '后台首页',
        });
      }
      this.bran = arr;
      // console.log(this.$route.matched);
      // console.log(arr);
    },
    initNavBar() {
      let r = localStorage.getItem('navActive');
      if (r) {
        r = JSON.parse(r);
        // console.log(r);
        this.navBar.active = r.top;
        this.slideMenuActive = r.left;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
      background: #fff;
      position: sticky;
      top: 0;
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
.el-submenu__title {
.el-avatar {
  img {
    display: block;
    width: 20px;
  }
}
}
</style>
