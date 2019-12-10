<template>
  <div class="album-list" ref="album">
    <span>{{name}}</span>
    <el-dropdown>
      <span>
        {{num}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.stop.native="albumEdit">修改</el-dropdown-item>
        <el-dropdown-item @click.stop.native="albumDel">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="创建相册"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="modelRorm">
        <el-form-item label="相册名称">
          <el-input v-model="modelRorm.name"></el-input>
        </el-form-item>
        <el-form-item label="相册排序">
          <el-input-number v-model="modelRorm.num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AlbumAside',
  props: {
    name: {
      type: String,
      required: true,
    },
    num: Number,
  },
  data() {
    return {
      dialogVisible: false,
      modelRorm: {
        name: '',
        num: 1,
      },
    };
  },
  methods: {
    albumDel() {
      this.$confirm('此操作将永久删除该相册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.$emit('albumDelete');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    albumEdit() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.album-list {
  display: flex;
  font-display: row;
  justify-content: space-between;
  line-height: 40px;
  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
  .el-dropdown {
    width: 70px;
    span {
      padding: 6px;
      background: #efefef;
      border-radius: 6px;
    }

  }
}
</style>
