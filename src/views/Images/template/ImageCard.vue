<template>
<div class="image-card">
  <el-card
    :body-style="{ padding: '0px'}"
    style="flex-direction: column;display: flex;position:relative"
    :class="{isChecked:isChoosen}">
    <div class="img">
      <img :src="url" ref="image">
      <p>{{dialogForm.name}}</p>
    </div>
    <div style="padding: 14px;">
      <el-button-group style="">
        <el-button icon="el-icon-view" @click.stop.native="preview(url)"></el-button>
        <el-button icon="el-icon-edit" @click.stop.native="editImage(dialogForm)"></el-button>
        <el-button icon="el-icon-delete" @click.stop.native="delIamge"></el-button>
      </el-button-group>
    </div>
     <div class="tag" v-show="isChoosen" style="position:absolute">{{checkOrder}}</div>
  </el-card>
  <el-dialog
    title="修改图片"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="dialogForm" @submit.native.prevent>
      <el-form-item label="图片名称"><input type="text" v-model="dialogForm.name"></el-form-item>
      <el-form-item label="移动图片到">
        <el-select v-model="dialogForm.path" placeholder="请选择">
          <el-option
            v-for="item in albums"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAlbum(dialogForm)">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
// import Viewer from 'v-viewer';

export default {
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    albums: Array,
    index: Number,
    checkOrder: Number,
    isChoosen: Boolean,
  },
  data() {
    return {
      dialogVisible: false,
      name: this.imageName,
      url: this.imageUrl,
      dialogForm: {
        name: this.imageName,
        path: this.imageUrl.split('/')[1],
      },
    };
  },
  watch: {
    dialogForm(val) {
      console.log(val);
    },
  },
  methods: {
    // preview() {
    //   const viewer = new Viewer(this.$refs.image, {
    //     url: `${this.imageUrl}/big`,
    //   });
    // },
    editImage() {
      this.dialogVisible = true;
      // this.$emit('editImage', dialogForm);
    },
    delIamge() {
      this.$emit('delIamge');
    },
    submitAlbum(dialogForm) {
      this.name = dialogForm.name;
      this.url = `${this.imageUrl.split('/')[0]}/${dialogForm.path}/${this.dialogForm.name}`;
      this.dialogVisible = false;
      this.$emit('editImage', dialogForm, this.index);
    },
    // selected() {
    //   this.isChecked = !this.isChecked;
    // },
  },
};
</script>

<style lang="scss">
.isChecked {
  width: 100%;
 height: 100%;
  border: 1px red solid;
}
.image-card {
.el-card {
  width: 280px;
  .tag {
    width: 20px;
    height: 25px;
    background-color: rgb(221, 60, 60);
    color: #fff;
    text-align: center;
    line-height: 25px;
    top: 10px;
    right: 10px;
  }
  .el-card__body {
    flex-direction: column;
    display: flex;
    .img {
      width: 280px;
      height: 200px;
      position: relative;
      img {
        width: 100%;
        display: block;
      }
      p {
        height: 50px;
        width: 100%;
        line-height: 50px;
        margin: 0;
        font-size: 24px;
        color: #fff;
        background-color:rgba(102, 100, 100, 0.3);
        text-align: center;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
    .el-button-group {
      .el-button {
        width: 33%;
        i {
          color: #111;
        }
      }
    }
  }
}
}
.el-form-item__content {
  input {
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 70%;
  }
}
</style>
