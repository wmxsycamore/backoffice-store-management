<template>
<el-card :body-style="{ padding: '0px' }">
      <div class="img">
        <img :src="imageUrl" class="image">
        <p>{{imageName}}</p>
      </div>
      <div style="padding: 14px;">
        <el-button-group>
          <el-button icon="el-icon-view" @click="hideImage"></el-button>
          <el-button icon="el-icon-edit" @click="editImage"></el-button>
          <el-button icon="el-icon-delete" @click="delIamge"></el-button>
        </el-button-group>
      </div>
    </el-card>

</template>

<script>
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
  },
  data() {
    return {

    };
  },
};
</script>

<style>

</style>
