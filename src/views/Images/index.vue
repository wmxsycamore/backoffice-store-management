<template>
<div>
<!-- 相册管理 -->
   <el-container>
    <el-header>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
      </el-input>
      <el-button type="success">搜索</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px" style="position: absolute;top:60px;left:0;bottom:60px">
        <div style="height:1000px"></div>
      </el-aside>
      <el-main  style="position: absolute;top:60px;right:0;bottom:60px">
        <div style="height:1000px"></div>
      </el-main>
    </el-container>
    <el-footer>Footer</el-footer>
  </el-container>
</div>


</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
      value: '',
    };
  },
};
</script>

<style scoped lang="scss">
.el-container.is-vertical {
  position: absolute;
  left:0;
  top: 55px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  }
.el-header, .el-footer {
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

.el-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .el-select {
    width: 25%;
  }
  .el-input {
    width: 50%;
  }
  .el-button {
    width: 10%;
    height: 40px;
    margin-left: 10px;
  }
}
</style>
