<template>
  <section class="image-table">
    <page-block>
      <search v-bind="search" @startSearch="startSearch" @resetSearch="resetSearch">
        <template slot="inputBox">
          <el-col :sm="12" :md="12" :lg="8" :xl="6">
            <label>相关任务</label>
            <el-input v-model="taskId" placeholder="请输入" size="small"></el-input>
          </el-col>
        </template>
        <template slot="genDateRange">
          <el-col :sm="12" :md="12" :lg="8" :xl="6">
            <label>生成时间</label>
            <el-date-picker
              v-model="genDateRange"
              type="datetimerange"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-col>
        </template>
        <template slot="radioBox">
          <el-col :sm="24" :md="18" :lg="12">
            <label>应用平台</label>
            <el-radio-group v-model="platformId" class="searchRadio">
              <el-radio label="">全部平台</el-radio>
              <el-radio v-for="(platform, index) in platforms" :key="index" :label="platform.value">{{platform.label}}</el-radio>
            </el-radio-group>
          </el-col>
        </template>
      </search>
      <el-row>
        <el-col :sm="24" :md="24" :lg="24">
          <div class="toggleStyle">
            视图方式
            <el-radio-group v-model="viewStyle" @change="changeRadio">
              <el-radio :label="0">列表视图</el-radio>
              <el-radio :label="1">网格视图</el-radio>
            </el-radio-group>
            <div v-if="viewStyle==1" class="pictureItem">
              图片分类
              <el-radio-group v-model="pictureStyle" @change="changePic">
                <el-radio :label="0">商品信息</el-radio>
                <el-radio :label="1">图片用途</el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-col>
      </el-row>
    </page-block>
    <page-block>
      <batch-toolbar v-if="batch" :batch="batch" showLabel="true" :selection="selection"></batch-toolbar>
      <div class="table-box" v-if="viewStyle==0">
        <tabulation
          ref="tabulation"
          v-bind="tabulation"
          :showLabel="true"
          @selection="selectionChange"
          @sort="setSort"
          @tableKey="tableKey"
        >
          <template slot-scope="{ row }" slot="storage">
            <template v-if="['mp4', 'mov', 'avi'].includes(row.format.toLowerCase())">
              <div class="video-img" style="cursor: pointer;" @click="openNewTab(row.storageUrl)">
                <i class="el-icon-video-play"></i>
              </div>
            </template>
            <template v-else>
              <img :src="formatImg(row.storageUrl)" />
            </template>
          </template>
        </tabulation>
        <pagination v-bind="pagination" :page.sync="pagination.page" @change="paginationChange"></pagination>
      </div>
      <div class="grid-box" v-if="viewStyle==1">
        <div class="grid-container" style="border-top: 1px solid #ccc;" v-if="pictureStyle==0">
          <div class="leftWrapper">
            <asidemenu
              v-bind="asidemenu"
              @checkedKeys="checkedKeys"
              :defaultChecked="defaultChecked"
            ></asidemenu>
            <pagination v-bind="smallPage" :page.sync="smallPage.page" @change="smallPageChange"></pagination>
          </div>
          <div class="line"></div>
          <div class="rightWrapper">
            <gridbox
              v-bind="gridding"
              :selections="selection"
              @changeToggle="changeToggle"
              @selection="selectionImg"
              @goDetail="goDetail"
            ></gridbox>
          </div>
        </div>
        <!-- 图片用途视图 -->
        <div class="grid-container" style="border-top: 1px solid #ccc;" v-if="pictureStyle==1">
          <div class="leftWrapper" style="flex: 1;">
            <pic-aside v-bind="asidemenu" @handleMenu="handleMenu"></pic-aside>
          </div>
          <div class="line"></div>
          <div class="rightWrapper">
            <pagination v-bind="gridPage" :page.sync="gridPage.page" @change="gridPageChange"></pagination>
            <pic-grid
              v-bind="picgridding"
              :selections="selection"
              @changeToggle="picChangeToggle"
              @selection="selectionImg"
              @goDetail="goDetail"
            ></pic-grid>
          </div>
        </div>
      </div>
    </page-block>
    <picture-detail
      v-if="detailVisible"
      :visible.sync="detailVisible"
      :info="Imginfo"
      @close="val => detailVisible = val"
      @deletePic="deletePic"
      @checkPic="checkPic"
      @replacePic="replacePic"
    ></picture-detail>

    <batch-upload
      v-if="uploadVisible"
      :visible.sync="uploadVisible"
      @updateVisible="val=>uploadVisible=val"
      @successUpload="successUpload"
    ></batch-upload>
  </section>
</template>

<script>
import {
  // getImageList,
  goCheck,
  gobatchDelete,
  getAsideList,
  // getSource,
  downloadPictures,
  // getGriddingList,
  getTwoAsideList,
  // getClassifyAssets,
  // getOpDomains,
} from '@/api/imageProcessing';
import { getGenImgSourceDict, getPlatforms, getDict } from '@/api/common';
import moment from 'moment';
import { mapState } from 'vuex';
import { goPost } from '@/api/axios';
import imgSource from '@/config/imgSource';
import gridbox from './Tmpl/GridBox.vue';
import asidemenu from './Tmpl/AsideMenu.vue';
import PicAside from './Tmpl/PicAside.vue';
import PictureDetail from './Tmpl/PictureDetail.vue';
import PicGrid from './Tmpl/PicGridBox.vue';
import BatchUpload from './Tmpl/BatchUpload.vue';

export default {
  name: 'ImageManageTable',
  components: {
    gridbox,
    asidemenu,
    PictureDetail,
    PicAside,
    PicGrid,
    BatchUpload,
  },
  data() {
    return {
      model: {
        search: {},
        page: { pageSize: 20, currentPage: 1 },
        pageSmall: { pageSize: 20, currentPage: 1 },
        gridPage: { pageSize: 2, currentPage: 1 },
        sort: {},
      },
      successNum: 12,
      failNum: 20,
      updateNum: 2,
      platformId: '',
      defaultProps: {
        children: 'showColorNo',
        label: 'id',
      },
      nodekey: 'id',
      uploadVisible: false, // 批量上传弹窗
      viewStyle: 0, // 试图方式
      pictureStyle: 0,
      selection: [], // 批量选择
      defaultChecked: [], // 左侧菜单默认勾选
      defaultCheckPic: [], // 图片用途左侧菜单默认勾选
      checkedArtNo: [], // 初始状态默认传给图片试图的参数
      detailVisible: false,
      Imginfo: {}, // 图片详情
      taskId: '',
      downloadUrl: '',
      genDateRange: [],
      useageList: [],
      platforms: [],
      batch: [
        {
          mode: 'button',
          label: '批量审核',
          callback: this.batchCheck,
        },
        {
          mode: 'button',
          label: '批量下载',
          callback: this.batchDownload,
        },
        {
          mode: 'button',
          label: '批量删除',
          callback: this.batchDelete,
        },
        {
          mode: 'button',
          label: '批量上传',
          callback: this.batchUpload,
        },
      ],
      asidemenu: {
        menuList: [],
        picMenuList: [],
        defaultActive: '',
      },
      gridding: {
        dataList: [],
        activeName: [],
      },
      picgridding: {
        dataList: [],
        activeName: [],
      },
      sourceList: [],
      tabulation: {
        id: 'ImageTable',
        data: [],
        keys: [
          {
            type: 'custom',
            label: '缩略图',
            slotName: 'storage',
            align: 'center',
          },
          { key: 'artNo', label: '货号', toggle: true },
          { key: 'colorNo', label: '色号', toggle: true },
          {
            key: 'platforms',
            label: '平台',
            toggle: true,
            sort: true,
          },
          { key: 'assetUsage', label: '用途', toggle: true },
          { key: 'sortNo', label: '序号', toggle: true },
          { key: 'source', label: '图片来源', toggle: true },
          { key: 'taskId', label: '相关任务', toggle: true },
          { key: 'fileName', label: '图片名称', toggle: false },
          {
            key: 'createdAt',
            label: '生成时间',
            sort: true,
            toggle: false,
          },
          { key: 'format', label: '格式', toggle: false },
          { key: 'width', label: '图片宽', toggle: false },
          { key: 'height', label: '图片高', toggle: false },
          { key: 'size', label: '大小', toggle: false },
          {
            key: 'status',
            type: 'costom',
            label: '状态',
            slotName: 'pregennum',
            toggle: false,
          },
        ],
        handle: [
          {
            mode: 'button',
            label: '查看详情',
            type: 'text',
            callback: this.picctureDetail,
          },
          {
            mode: 'button',
            label: '删除',
            type: 'text',
            callback: this.deleteDate,
          },
        ],
      },
      pagination: {
        total: 0,
        page: 1,
        pageKey: 'currentPage',
        sizeKey: 'pageSize',
        sizes: [20, 50, 100, 500],
      },
      smallPage: {
        total: 0,
        page: 1,
        layout: 'total, prev, pager, next',
        pageKey: 'currentPage',
        sizeKey: 'pageSize',
        sizes: [20, 50, 100, 500],
      },
      gridPage: {
        total: 0,
        page: 1,
        layout: 'total, prev, pager, next',
        pageKey: 'currentPage',
        sizeKey: 'pageSize',
        sizes: [2, 5, 10],
      },
      checkedKeyList: [],
      usageList: [],
    };
  },
  computed: {
    ...mapState('User', {
      opDomainList: state => state.opDomainList,
      opDomain: 'opDomain',
    }),
    search() {
      const usageList = this.usageList;
      const sourceList = this.sourceList;
      const opDomainList = this.opDomainList.map(i => ({ value: i.code, label: i.name }));
      return {
        data: [
          {
            type: 'select',
            key: 'source',
            label: '图片来源',
            options: sourceList,
          },
          {
            type: 'select',
            key: 'opDomainCode',
            label: '运营组',
            options: opDomainList,
          },
          {
            type: 'custom',
            slotName: 'inputBox',
            label: '相关任务',
          },
          {
            type: 'multipleInput',
            key: 'artNos',
            label: '货号',
          },
          {
            type: 'textareaInput',
            key: 'colorNos',
            label: '色号',
          },
          {
            type: 'input',
            key: 'imageName',
            label: '图片名称',
          },
          {
            type: 'select',
            key: 'usage',
            label: '图片用途',
            options: usageList,
          },
          {
            type: 'custom',
            slotName: 'genDateRange',
            label: '生成时间',
          },
          { type: 'custom', label: '应用平台', slotName: 'radioBox' },
        ],
      };
    },
  },
  created() {
    this.getUsages();
    this.getSource();
    this.getPlatforms();
    this.setDefaultTime();
    if (this.$route.query.taskNo) {
      this.taskId = this.$route.query.taskNo;
      this.genDateRange = [];
      this.loadTable(true);
    }
    // this.getMenuList();
    // this.getTwoAsideList();
    this.tableKey();
  },
  mounted() {
  },
  methods: {
    async getUsages() {
      const res = await getDict('usage') || [];
      this.usageList = res.map(i => ({ label: i.name, value: i.name }));
    },
    // 获取平台
    async getPlatforms() {
      const res = await getPlatforms() || [];
      this.platforms = res.map(i => ({ label: i.desc, value: i.code }));
    },
    // 获取资源列表
    async getSource() {
      const res = await getGenImgSourceDict() || [];
      this.sourceList = res.sort((a, b) => a.order - b.order).map(i => ({ label: i.name, value: i.code }));
    },
    openNewTab(src) {
      const url = `${process.env.VUE_APP_DOMAIN}/video-panel?src=${encodeURIComponent(src)}`;
      window.open(url);
    },
    formatImg(url) {
      return `${url}${url.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,limit_0,m_pad,w_100,h_100`;
    },
    // 设置默认查询时间
    setDefaultTime() {
      this.genDateRange = [moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm'), moment().endOf('day').format('YYYY-MM-DD HH:mm')];
    },
    tableKey() {
      const changeJaon = JSON.parse(localStorage.getItem('ImageTableKeys'));
      if (changeJaon) {
        for (var p in changeJaon) {
          // 遍历json对象的每个key/value对,p为key
          this.tabulation.keys.map(res => {
            if (res.key == p) {
              res.toggle = changeJaon[p];
            }
          });
        }
      }
    },
    // 获取列表数据
    loadTable(show) {
      const { pageSize, currentPage } = this.model.page;
      const {
        source,
        artNos,
        colorNos,
        opDomainCode,
        imageName,
        usage,
      } = this.model.search;
      const generatedAfter = this.genDateRange ? this.genDateRange[0] : undefined;
      const generatedBefore = this.genDateRange ? this.genDateRange[1] : undefined;
      const { sortProperties, sort } = this.model.sort;
      goPost(
        '/dam/query/asset/assets',
        {
          pageInfo: {
            pageNo: currentPage,
            pageSize,
          },
          param: {
            generatedAfter,
            generatedBefore,
            source,
            colorNos,
            artNos: artNos ? artNos.split(',') : undefined,
            opDomainCode,
            sortProperties,
            sort,
            imageName,
            taskId: this.taskId,
            platform: this.platformId,
            classify: usage,
          },
        },
        { showLoading: show },
      ).then(res => {
        const list = res.mediaAssets;
        list.map(val => {
          val.platforms = val.platforms.map(i => {
            const platform = this.platforms.find(p => p.value === i);
            if (platform) {
              return platform.label;
            }
            return '其他';
          }).join(',');
          val.source = imgSource(val.source);
          val.status = val.status === 'UNCHECKED' ? '未审核' : '已审核';
          val.width = val.dimension.x;
          val.height = val.dimension.y;
          val.assetUsage = val.assetUsage.join('');
          val.createdAt = this.moment(val.createdAt).format('YYYY-MM-DD HH:mm:ss');
          val.taskId = val.tasks ? val.tasks[0] : '';
        });
        this.tabulation.data = list;
        this.pagination.total = res.pageInfo.totalCount;
      });
    },

    // 获取网格视图asidemenus
    getMenuList() {
      this.defaultChecked = [];
      this.asidemenu.menuList = [];
      const { pageSize, currentPage } = this.model.pageSmall;
      const {
        source,
        artNos,
        colorNos,
        opDomainCode,
        imageName,
        usage,
      } = this.model.search;
      const generatedAfter = this.genDateRange ? this.genDateRange[0] : undefined;
      const generatedBefore = this.genDateRange ? this.genDateRange[1] : undefined;
      const { sortProperties, sort } = this.model.sort;
      getAsideList({
        pageInfo: {
          pageNo: currentPage,
          pageSize,
        },
        param: {
          generatedAfter,
          generatedBefore,
          source,
          colorNos,
          opDomainCode,
          artNos: artNos ? artNos.split(',') : undefined,
          sortProperties,
          sort,
          imageName,
          taskId: this.taskId,
          platform: this.platformId,
          classify: usage,
        },
      }).then(res => {
        let menuList = [];
        // 处理数据 ，将colorNo数组转换成json数组
        res.artNoAndColorNos.forEach(val => {
          if (val.showColorNo && val.showColorNo.length > 0) {
            menuList = val.showColorNo;
            val.showColorNo = [];
            menuList.forEach(item => {
              val.showColorNo.push({
                id: item,
              });
            });
          }
        });
        if (res.artNoAndColorNos.length > 0) {
          this.asidemenu.menuList = res.artNoAndColorNos;
          if (
            this.asidemenu.menuList[0].showColorNo &&
            this.asidemenu.menuList[0].showColorNo.length > 0
          ) {
            this.defaultChecked.push(this.asidemenu.menuList[0].showColorNo[0].id);
          } else {
            this.defaultChecked.push(this.asidemenu.menuList[0].id);
          }
        } else {
          this.asidemenu.menuList = [];
        }

        this.smallPage.total = res.pageInfo.totalCount;
      });
    },
    getTwoAsideList() {
      this.defaultChecked = [];
      this.asidemenu.picMenuList = [];
      const {
        source,
        artNos,
        colorNos,
        opDomainCode,
        imageName,
        usage,
      } = this.model.search;
      const generatedAfter = this.genDateRange ? this.genDateRange[0] : undefined;
      const generatedBefore = this.genDateRange ? this.genDateRange[1] : undefined;
      const { sortProperties, sort } = this.model.sort;
      getTwoAsideList({
        param: {
          generatedAfter,
          generatedBefore,
          source,
          colorNos,
          opDomainCode,
          artNos,
          sortProperties,
          sort,
          imageName,
          taskId: this.taskId,
          platform: this.platformId,
          classify: usage,
        },
      }).then(res => {
        this.asidemenu.picMenuList = res || [];
        this.asidemenu.defaultActive = res[0].name || null;
        // let menuList = [];
        // // //处理数据 ，将colorNo数组转换成json数组
        // res.forEach(val => {
        //   if (val.childUsage && val.childUsage.length > 0) {
        //     menuList = val.childUsage;
        //     val.childUsage = [];
        //     menuList.forEach(item => {
        //       val.childUsage.push({
        //         parentUsage: item,
        //       });
        //     });
        //   }
        // });

        // if (res.length > 0) {
        //   this.asidemenu.picMenuList = res;
        //   if (
        //     this.asidemenu.picMenuList[0].childUsage &&
        //     this.asidemenu.picMenuList[0].childUsage.length > 0
        //   ) {
        //     this.asidemenu.defaultActive = this.asidemenu.picMenuList[0].childUsage[0].parentUsage;
        //   } else {
        //     this.asidemenu.defaultActive = this.asidemenu.picMenuList[0].parentUsage;
        //   }
        // } else {
        //   this.asidemenu.picMenuList = [];
        // }
      });
    },
    handleMenu(val) {
      this.gridPage.page = 1;
      this.model.gridPage[this.gridPage.pageKey] = 1;
      this.asidemenu.defaultActive = val;
      this.menuToGridding(true);
    },
    // 按照图片用途获取网格视图
    // 获取网格图片列表
    menuToGridding(loading) {
      const {
        source,
        artNos,
        imageName,
        colorNos,
        opDomainCode,
        usage,
      } = this.model.search;
      const generatedAfter = this.genDateRange ? this.genDateRange[0] : undefined;
      const generatedBefore = this.genDateRange ? this.genDateRange[1] : undefined;
      const { pageSize, currentPage } = this.model.gridPage;
      goPost(
        '/dam/query/assetGridView/getUsageAssets',
        {
          usage: this.asidemenu.defaultActive,
          pageInfo: {
            pageNo: currentPage,
            pageSize,
          },
          param: {
            generatedAfter,
            generatedBefore,
            source,
            artNos: artNos ? artNos.split(',') : undefined,
            colorNos,
            imageName,
            opDomainCode,
            taskId: this.taskId,
            platform: this.platformId,
            classify: usage,
          },
        },
        { showLoading: loading },
      ).then(res => {
        res.mappedResults.map(item => {
          item.showColorNo = item.showColorNo.join('');
          const imageList = item.assets;
          imageList.map(val => {
            val.platforms = val.platforms.map(i => {
              const platform = this.platforms.find(p => p.value === i);
              if (platform) {
                return platform.label;
              }
              return '其他';
            }).join(',');
            val.storageUrl = `${val.storageUrl}${val.storageUrl.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,limit_0,m_pad,w_200,h_200`;
          });
        });
        this.picgridding.dataList = res.mappedResults;
        this.picgridding.dataList.forEach((item, index) => {
          this.picgridding.activeName.push(index);
        });
        this.gridPage.total = res.pageParam.totalCount;
        this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
        this.selection = [];
      });
    },
    checkedKeys(val) {
      this.checkedArtNo = val;
      this.getGriddingList(true);
    },
    // 获取网格图片列表
    getGriddingList(loaing) {
      let no = [];
      this.gridding.activeName = [];
      if (this.asidemenu.menuList.length > 0) {
        no = this.checkedArtNo;
      } else {
        no = [];
      }
      const {
        source,
        imageName,
        opDomainCode,
        usage,
      } = this.model.search;
      const generatedAfter = this.genDateRange ? this.genDateRange[0] : undefined;
      const generatedBefore = this.genDateRange ? this.genDateRange[1] : undefined;
      goPost(
        '/dam/query/assetGridView/getAssets',
        {
          no,
          param: {
            generatedAfter,
            generatedBefore,
            source,
            imageName,
            opDomainCode,
            taskId: this.taskId,
            platform: this.platformId,
            classify: usage,
          },
        },
        { showLoading: loaing },
      ).then(res => {
        res.map(item => {
          const imageList = item.assets;
          imageList.map(val => {
            val.platforms = val.platforms.map(i => {
              const platform = this.platforms.find(p => p.value === i);
              if (platform) {
                return platform.label;
              }
              return '其他';
            }).join(',');
            val.storageUrl = `${val.storageUrl}${val.storageUrl.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,limit_0,m_pad,w_200,h_200`;
          });
        });
        this.gridding.dataList = res;
        this.gridding.dataList.forEach((item, index) => {
          this.gridding.activeName.push(index);
        });
        this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
        this.selection = [];
      });
    },
    changeToggle(val) {
      if (!val) {
        this.gridding.activeName = [];
      } else {
        this.gridding.dataList.forEach((item, index) => {
          this.gridding.activeName.push(index);
        });
      }
    },
    picChangeToggle(val) {
      if (!val) {
        this.picgridding.activeName = [];
      } else {
        this.picgridding.dataList.forEach((item, index) => {
          this.picgridding.activeName.push(index);
        });
      }
    },
    changePic() {
      this.smallPage.page = 1;
      this.model.pageSmall[this.smallPage.pageKey] = 1;
      this.gridPage.page = 1;
      this.model.gridPage[this.gridPage.pageKey] = 1;
      if (this.pictureStyle === 1) {
        this.menuToGridding(true);
      }
    },
    // 改变视图方式 清空selection
    changeRadio() {
      this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
      this.selection = [];
      this.pagination.page = 1;
      this.model.page[this.pagination.pageKey] = 1;
      this.smallPage.page = 1;
      this.model.pageSmall[this.smallPage.pageKey] = 1;
      this.model.sort = {};
      this.loadTable(true);
      this.getMenuList();
      this.getGriddingList(true);
      this.getTwoAsideList();
      this.menuToGridding(true);
    },
    // 网格视图查看详情
    goDetail(val) {
      this.detailVisible = true;
      this.Imginfo = val;
    },
    // 网格视图下选择图片数
    selectionImg(val) {
      this.selection = val;
    },
    // 搜索功能
    startSearch(data) {
      const {
        colorNos,
        artNos,
        imageName,
      } = data;
      if (!this.taskId
      && (!artNos || artNos.length === 0)
      && !colorNos
      && !imageName
      && !this.genDateRange) {
        this.$message('相关任务，货号，色号，图片名称和生成时间至少填写一项');
      } else if (artNos && artNos.split(',').length > 1
        && colorNos && colorNos.length > 1) {
        this.$message('货号和色号不能同时输入多个');
      } else {
        this.model.search = data;
        this.pagination.page = 1;
        this.model.page[this.pagination.pageKey] = 1;
        this.smallPage.page = 1;
        this.model.pageSmall[this.smallPage.pageKey] = 1;
        this.gridPage.page = 1;
        this.model.gridPage[this.gridPage.pageKey] = 1;
        this.loadTable(true);
        this.getMenuList();
        this.getGriddingList(true);
        this.getTwoAsideList();
        this.menuToGridding(true);
      }
    },
    // 重置
    resetSearch() {
      this.platformId = '';
      this.taskId = '';
      this.model.search = {};
      this.pagination.page = 1;
      this.model.page[this.pagination.pageKey] = 1;
      this.smallPage.page = 1;
      this.model.pageSmall[this.smallPage.pageKey] = 1;
      this.gridPage.page = 1;
      this.model.gridPage[this.gridPage.pageKey] = 1;
      // this.loadTable(false);
      // this.getMenuList();
      // this.getGriddingList(true);
      // this.getTwoAsideList();
      // this.menuToGridding(true);
      this.setDefaultTime();
    },
    // 分页功能
    paginationChange(data) {
      this.model.page = data;
      this.loadTable(true);
    },
    // 网格视图分页功能
    smallPageChange(data) {
      this.model.pageSmall = data;
      this.getMenuList();
    },
    gridPageChange(data) {
      this.model.gridPage = data;
      this.menuToGridding(true);
    },
    setSort(data) {
      if (data.order) {
        let direction = '';
        if (data.order === 'descending') {
          direction = 'DESC';
        } else {
          direction = 'ASC';
        }
        this.model.sort = {
          direction,
          sortBy: new Array(data.prop),
        };
      } else {
        this.model.sort = {};
      }
      this.loadTable(false);
    },
    // 列表视图选中
    selectionChange(data) {
      this.selection = data;
    },
    // 列表视图查看详情
    picctureDetail(row) {
      this.detailVisible = true;
      this.Imginfo = row;
    },
    // 删除单条数据
    deleteDate(row) {
      const ids = [];
      ids.push(row.id);
      const data = {
        assetsIds: ids,
      };
      this.$confirm('是否确定删除当前图片？删除后该图片无法恢复！', '提示', {
        type: 'warning',
      })
        .then(() => {
          gobatchDelete(data).then(res => {
            this.$message({
              message: '删除成功!',
              type: 'success',
              center: true,
            });
            this.loadTable(true);
          });
        })
        .catch(() => false);
    },
    // 批量检查
    batchCheck() {
      if (this.selection.length > 0) {
        const ids = [];
        for (const item of this.selection) {
          ids.push(item.id);
        }
        const data = {
          assetsIds: ids,
        };
        goCheck(data).then(res => {
          this.$message({
            message: '批量审核成功!',
            type: 'success',
            center: true,
          });
          if (this.viewStyle === 0) {
            this.loadTable(true);
          } else if (this.pictureStyle === 0) {
            this.getMenuList();
            this.getGriddingList(true);
          } else if (this.pictureStyle === 1) {
            this.getTwoAsideList();
            this.menuToGridding(true);
          }
          this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
          this.selection = [];
        });
      } else {
        this.$message({
          message: '至少选择一条数据',
          type: 'error',
          center: true,
        });
      }
    },
    // 批量下载
    batchDownload() {
      if (this.selection.length > 0) {
        const ids = [];
        for (const item of this.selection) {
          ids.push(item.id);
        }
        downloadPictures(ids).then(res => {
          window.location.href = res;
          this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
          this.selection = [];
        });
      } else {
        this.$message({
          message: '至少选择一条数据',
          type: 'error',
          center: true,
        });
      }
    },
    // 图片详情 删除
    deletePic() {
      this.detailVisible = false;
      this.detailVisible = false;
      if (this.viewStyle === 0) {
        this.loadTable(false);
      } else if (this.viewStyle === 1 && this.pictureStyle === 0) {
        this.getMenuList();
        this.getGriddingList(true);
      } else {
        this.getTwoAsideList();
        this.menuToGridding(true);
      }
    },
    // 图片详情 检查
    checkPic() {
      this.detailVisible = false;
      if (this.viewStyle === 0) {
        this.loadTable(false);
      } else if (this.viewStyle === 1 && this.pictureStyle === 0) {
        this.getMenuList();
        this.getGriddingList(true);
      } else {
        this.getTwoAsideList();
        this.menuToGridding(true);
      }
    },
    // 图片详情 替换生成图
    replacePic() {
      if (this.viewStyle === 0) {
        this.loadTable(false);
      } else if (this.viewStyle === 1 && this.pictureStyle === 0) {
        this.getGriddingList(false);
      } else {
        this.menuToGridding(false);
      }
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        const ids = [];
        for (const item of this.selection) {
          ids.push(item.id);
        }
        const data = {
          assetsIds: ids,
        };
        this.$confirm('确定批量删除选中数据?', '提示', {
          type: 'warning',
        })
          .then(() => {
            gobatchDelete(data).then(res => {
              this.$message({
                message: '删除成功!',
                type: 'success',
                center: true,
              });
              if (this.viewStyle === 0) {
                this.loadTable(false);
              } else if (this.viewStyle === 1 && this.pictureStyle === 0) {
                this.getMenuList();
                this.getGriddingList(true);
              } else {
                this.getTwoAsideList();
                this.menuToGridding(true);
              }
              this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
              this.selection = [];
            });
          })
          .catch(() => false);
      } else {
        this.$message({
          message: '至少选择一条数据',
          type: 'error',
          center: true,
        });
      }
    },
    // 批量上传
    batchUpload() {
      this.uploadVisible = true;
    },
    closeUpload(val) {
      this.uploadVisible = val;
    },
    successUpload(val) {
      this.uploadVisible = false;
      if (this.viewStyle === 0) {
        this.loadTable(false);
      } else if (this.viewStyle === 1 && this.pictureStyle === 0) {
        this.getMenuList();
        this.getGriddingList(true);
      } else {
        this.getTwoAsideList();
        this.menuToGridding(true);
      }
      this.$refs.tabulation && this.$refs.tabulation.$refs.ImageTable.clearSelection();
      this.selection = [];
      if (val.addNum) {
        const notify = this.$notify({
          title: '图片上传完成',
          dangerouslyUseHTMLString: true,
          message: `新增数量：${val.addNum}，替换数量：${
            val.updateNum
          }，失败数量：${val.failNum}，点击此处可下载失败明细`,
          duration: 5000,
          onClick: () => {
            window.location.href = val.resultUrl ? val.resultUrl : '';
            notify.close();
          },
        });
      }
    },
  },
};
</script>

<style lang='scss' src='./index.scss' scoped></style>
