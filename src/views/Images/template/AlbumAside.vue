<template>
  <div class="album-list" ref="album">
    <span>{{name}}</span>
    <el-dropdown trigger="click">
      <span>
        {{num}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.stop.native=" dialogVisible = true">修改</el-dropdown-item>
        <el-dropdown-item @click.stop.native="albumDel">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <edit-dialog
      :title="title"
      :visible.sync='dialogVisible'
      :modelForm="modelForm"
      @editAlbums="handleEdit"></edit-dialog>
  </div>
</template>

<script>
import EditDialog from './EditDialog';

export default {
  name: 'AlbumAside',
  props: {
    name: String,
    num: Number,
    rank: Number,
  },
  components: { EditDialog },
  data() {
    return {
      title: '修改相册',
      dialogVisible: false,
      modelForm: {
        name: this.name,
        rank: this.rank,
      },
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.dialogVisible = v;
      }
    },
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
    handleEdit(data) {
      this.$emit('reloadAlbums', data, this.rank);
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
