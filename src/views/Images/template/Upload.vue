<template>
<div>
  <el-dialog
    :visible.sync="dialogVisible"
    width="30%">
    <el-upload
      ref="uploadDemo"
      v-bind="uploadFileParams">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    visible: Boolean,
  },
  watch: {
    visible(v) {
      if (v) {
        this.dialogVisible = v;
      }
    },
    // 解决dialog在第一关闭后无法再次出现的问题，这里主要是让父组件的visible和子组件的visible同步
    dialogVisible(v) {
      this.$emit('update:visible', v);
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      uploadFileParams: {
        action: '/api/posts',
        accept: '.jpg,.png',
        multiple: true,
        data: {},
        name: 'file',
        fileList: [],
        drag: true,
        autoUpload: false,
        onChange: this.uploadOnChangeHandle.bind(this),
      },
    };
  },
  methods: {
    uploadOnChangeHandle(file, fileList) {
      console.log(1);
      console.log(file);
      console.log(fileList);
      if (!file.response) {
        console.log(2);
      }
      if (file.response) {
        console.log(3);
        this.$message({
          message: '上传成功',
          type: 'success',
        });
      } else if (file.status === 'fail') {
        console.log(4);
        this.$message({
          message: '请求失败,请稍后重试',
          type: 'error',
          center: true,
        });
      }
    },
    submit() {
      this.dialogVisible = false;
      this.$refs.uploadDemo.submit();
    },
  },
};
</script>

<style lang="scss">
.el-upload {
  display: block;
  .el-upload-dragger {
    width: 100%;
  }
}
</style>
