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
        <el-button v-if="choosenImagesList.length" type="warning" size="small" @click="unChoose">取消选中</el-button>
        <el-button v-if="choosenImagesList.length" type="danger" size="small" @click="batchDel">批量删除</el-button>
        <el-button type="success" size="medium" @click="addVisible=true">创建相册</el-button>
        <el-button type="warning" size="medium" @click="uploadVisible=true">上传图片</el-button>
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
            :checkOrder="item.checkOrder"
            :isChoosen="item.isChoosen"
            @delIamge="deleteIamge(index)"
            @editImage="editImage"
            @click.native="selectedIamge(item)"></image-card>
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
        :total="totalNum"></el-pagination>
    </el-footer>
  </el-container>

  <edit-dialog
    :title="title"
    :visible.sync='addVisible'
    :modelForm="{name:'',rank:1}"
    @editAlbums="handleAdd"></edit-dialog>
  <Upload :visible.sync='uploadVisible'></Upload>
  </div>


</template>

<script>
import AlbumAside from './template/AlbumAside';
import ImageCard from './template/ImageCard';
import EditDialog from './template/EditDialog';
import Upload from './template/Upload';

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
      uploadVisible: false,
      currentPage: 1,
      currentPageSize: 20,
      totalNum: 20,
      choosenImagesList: [],
    };
  },
  components: {
    AlbumAside, ImageCard, EditDialog, Upload,
  },
  created() {
    // mock相册数据
    for (let i = 1; i < 30; i++) {
      this.albumList.push({ name: `相册${i}`, num: i * 20, images: [] });
      for (let j = 0; j < this.albumList[i - 1].num; j++) {
        this.albumList[i - 1].images.push({
          id: `${i}${j}`,
          imageUrl: `images/相册${i}/图片${j}`,
          imageName: `图片${j}`,
          isChoosen: false,
          checkOrder: 0,
        });
      }
    }
    this.albums = this.albumList.map(item => item.name);
    this.imageList = this.albumList[0].images.slice(0, this.currentPageSize);
  },
  mounted() {

  },
  watch: {
    selectedAblum(val) {
      this.totalNum = this.albumList[val].images.length;
      this.imageList = this.albumList[val].images.slice(0, this.currentPageSize);
    },
    imageList() {
      this.albumList[this.selectedAblum].num = this.imageList.length;
    },
  },
  methods: {
    selectAblum(item, index) {
      if (item) {
        // this.imageList = this.albumList[index].images;
        this.selectedAblum = index;
        this.initAlbum(20, 1);
      }
      this.imageList = this.albumList[0].images;
    },
    // 根据页面规格和当前页面获取数据
    initAlbum(size, page) {
      this.imageList = this.albumList[this.selectedAblum].images.slice(size * (page - 1), size * page);
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
      this.imageList.splice(index, 1);
      this.albumList[this.selectedAblum].num -= 1;
      if (this.albumList[this.selectedAblum].num <= 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '当前相册没有图片',
        });
        this.albumList[this.selectedAblum].num = 0;
      }
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
    selectedIamge(item) {
      // 之前未选中
      if (!item.isChoosen) {
        // 添加数组
        this.choosenImagesList.push({ id: item.id, url: item.url });
        // 改变顺序
        item.checkOrder = this.choosenImagesList.length;
        // 修改状态
        item.isChoosen = true;
        // 取消选中
      } else if (item.isChoosen) {
        // 找到索引，删除
        const i = this.choosenImagesList.findIndex(v => v.id === item.id);
        if (i === -1) return;
        // 重新计算序号，如果取消的是最后一个不用重新计算编号，但是如果取消的是中间选中的，需要重新计算编号
        const length = this.choosenImagesList.length;
        // 取消选中中间的图片
        if (i + 1 < length) {
          for (let j = i; j < length; j++) {
            const no = this.imageList.findIndex(v => v.id === this.choosenImagesList[j].id);
            if (no !== -1) {
              this.imageList[no].checkOrder -= 1;
            }
          }
        }
        // 删除
        this.choosenImagesList.splice(i, 1);
        // 改变状态
        item.isChoosen = false;
      }
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      // console.log(`每页 ${val} 条`);
      this.initAlbum(val, 1);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.initAlbum(this.currentPageSize, val);
    },
    unChoose() {
      this.imageList.forEach(img => {
        const i = this.choosenImagesList.findIndex(item => item.id === img.id);
        if (i > -1) {
          img.isChoosen = false;
          img.checkOrder = 0;
          this.choosenImagesList.splice(i, 1);
        }
      });
    },
    batchDel() {
      if (this.choosenImagesList.length == 0) {
        this.$message.error('没有选中任何图片');
      }
      this.$confirm('此操作将永久删除选中图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.imageList = this.imageList.filter(img => !this.choosenImagesList.some(c => c.id === img.id));
        this.choosenImagesList = [];
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
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
