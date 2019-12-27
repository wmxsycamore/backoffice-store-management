<template>
<div>
<!-- 相册管理 -->
   <el-container>
    <el-header>
      <div class="left">
        <el-select v-model="value" placeholder="请选择图片排序方式">
          <el-option
            v-for="item in searchForm.orderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入相册名称" v-model="searchForm.keyword" class="input-with-select">
        </el-input>
        <el-button type="success" size="medium">搜索</el-button>
      </div>
      <div class="right">
        <el-button type="success" size="medium" @click="addVisible=true">创建相册</el-button>
        <el-button type="warning" size="medium">上传图片</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" style="position: absolute;top:60px;left:0;bottom:60px">
        <!-- 相册侧栏 -->
        <template v-for="(item,index) in albumList">
          <album-aside
            :name="item.name"
            :num="item.num"
            :key="item.num"
            :rank="index"
            @click.native="selectAblum(item,index)"
            @albumDelete="albumDelete(index)"
            @reloadAlbums="reloadAlbums"></album-aside>
        </template>
      </el-aside>
      <el-main class="main1" style="">
        <!-- 图片缩略图展示 -->
        <template v-for="(item, index) in imageList" ref="imageList">
          <image-card
            :albums='albums'
            :imageUrl="item.imageUrl"
            :key="item.id"
            :index="index"
            :imageName="item.imageName"
            @delIamge="deleteIamge(index)"
            @editImage="editImage"></image-card>
        </template>
      </el-main>
    </el-container>
    <el-footer>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 40, 60]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.imageList.length"></el-pagination>
    </el-footer>
  </el-container>

  <edit-dialog
    :title="title"
    :visible.sync='addVisible'
    :modelForm="{name:'',rank:1}"
    @editAlbums="handleAdd"></edit-dialog>
  </div>


</template>

<script>
import AlbumAside from './template/AlbumAside';
import ImageCard from './template/ImageCard';
import EditDialog from './template/EditDialog';

export default {
  data() {
    return {
      value: '',
      searchForm: {
        orderOptions: [],
        keyword: '',
      },
      albumList: [],
      imageList: [],
      selectedAblum: 0,
      albums: [],
      title: '创建相册',
      addVisible: false,
      currentPage: 1,
    };
  },
  components: { AlbumAside, ImageCard, EditDialog },
  created() {
    this.initAlbum();
  },
  mounted() {

  },
  watch: {
    selectedAblum(val) {
      this.imageList = this.albumList[val].images;
    },
  },
  methods: {
    selectAblum(item, index) {
      if (item) {
        this.imageList = this.albumList[index].images;
        this.selectedAblum = index;
      }
      this.imageList = this.albumList[0].images;
    },
    initAlbum() {
      for (let i = 1; i < 30; i++) {
        this.albumList.push({ name: `相册${i}`, num: i * 20, images: [] });
        for (let j = 0; j < this.albumList[i - 1].num; j++) {
          this.albumList[i - 1].images.push({ id: `${i}${j}`, imageUrl: `images/相册${i}/图片${j}`, imageName: `图片${j}` });
        }
      }
      this.imageList = this.albumList[0].images;
      this.albums = this.albumList.map(item => item.name);
    },
    albumDelete(index) {
      this.albumList.splice(index, 1);
    },
    reloadAlbums(data, data2) {
      const editedAblum = { name: data.name, num: this.albumList[data2].num };
      this.albumList.splice(data2, 1);
      this.albumList.splice(data.rank - 1, 0, editedAblum);
    },
    handleAdd(data) {
      const editedAblum = { name: data.name, num: 0 };
      this.albumList.splice(data.rank - 1, 0, editedAblum);
    },
    deleteIamge(index) {
      this.albumList[this.selectedAblum].images.splice(index, 1);
      this.albumList[this.selectedAblum].num -= 1;
    },
    editImage(data1, data2) {
      console.log(this.albumList[this.selectedAblum].name);
      if (data1.path !== this.albumList[this.selectedAblum].name) {
        const index = this.albumList.findIndex(item => item.name === data1.path);
        this.albumList[index].images.push({ imageUrl: `images/相册${index}/${data1.name}`, imageName: data1.name });
        this.albumList[index].num += 1;
        this.albumList[this.selectedAblum].images.splice(data2, 1);
        this.albumList[this.selectedAblum].num -= 1;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
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
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(241, 229, 229);
}
 .left,.right {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center
}
.left {
  width: 60%;
  .el-select {
    width: 25%;
  }
  .el-input {
    width: 50%;
  }
  .el-button {
    width: 10%;
  }
}
.el-aside {
  padding: 15px;
  background: #fff;
  .album-list {
    margin-bottom: 20px;
  }
}
.main1 {
  position: absolute;
  left: 200px;top:60px;
  right:0;bottom:60px;
  display: flex;
  flex-wrap:wrap;
  justify-content:space-between;
  &:after {
    content: "";
    width:282px;
  }
  .image-card {
    margin-bottom: 20px;
  }
}
</style>
