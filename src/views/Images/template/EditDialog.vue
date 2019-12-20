<template>
   <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="dialogForm" @submit.native.prevent ref="dialogForm">
        <el-form-item
          label="相册名称"
          prop="name"
          :rules="[
            { required: true, message: '相册名称不能为空'},]">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="相册排序"
          prop="rank"
          :rules="[
            { required: true, message: '排序不能为空'},
            { type: 'number',  message: '排序必须为数字'}]">
          <el-input-number v-model.number="dialogForm.rank" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAlbum(dialogForm)">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: 'EditDailog',
  props: {
    title: String,
    modelForm: Object,
    visible: Boolean,
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogForm: {
        name: this.modelForm.name,
        rank: this.modelForm.rank,
      },
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.dialogVisible = v;
      }
    },
    dialogVisible(v) {
      this.$emit('update:visible', v);
    },
  },
  methods: {
    submitAlbum(dialogForm) {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.$message('修改成功');
          this.dialogVisible = false;
          // 不能在子组件中修改有父组件传过来的值
          // this.name = modelForm.name;
          // this.rank = modelForm.rank;
          // 向接口提交数据，同时给父组件发送事件（刷新相册边栏），没有接口，只需要把表单数据发送给父组件
          this.$emit('editAlbums', dialogForm);
          return true;
        }
        return false;
      });
    },
    handleChange() {},
  },
};
</script>

<style>

</style>
