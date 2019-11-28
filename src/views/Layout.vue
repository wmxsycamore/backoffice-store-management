<template>
  <div>
    <el-container>
      <el-header>
        <a href="#" style="font-size:24px;font-weight:bold;">UNI-ADMIN</a>
        <el-menu
         :default-active="navBarIndex"
         class="el-menu-demo"
         mode="horizontal"
         @select="handleSelect"
         background-color="#545c64"
         text-color="#fff"
         active-text-color="#ffd04b">
         <el-menu-item index="1">首页</el-menu-item>
         <el-menu-item index="2">商品</el-menu-item>
         <el-menu-item index="3">订单</el-menu-item>
         <el-menu-item index="4">会员</el-menu-item>
         <el-menu-item index="5">设置</el-menu-item>
         <el-submenu index="6">
           <template slot="title">
             <el-avatar shape="circle" size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
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
          <ul>
            <li v-for="i in 100" :key="i">{{i}}</li>
          </ul>
        </el-aside>
        <!-- 主布局 -->
        <el-main><ul>
            <li v-for="i in 100" :key="i">{{i}}</li>
          </ul></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


export default {
  name: 'Layout',
  components: {
  },
  data() {
    return {
      navBarIndex: '1',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
    padding-bottom: 60px;
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
    width: 10%;
  }
}
</style>
