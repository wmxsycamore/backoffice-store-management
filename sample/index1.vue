<template>
  <section class="shot-manage">
    <div class="page-title">
      <span class="title-text">拍摄明细管理</span>
    </div>
    <!-- 搜索条件 -->
    <div class="page-block">
      <r-search ref="search" v-model="search" v-bind="searchConf" @reset="resetSearch" @search="startSearch"></r-search>
    </div>
    <div class="page-block shot-list" :style="{ 'height': clientHeight}">
      <!-- 批量操作 -->
      <header class="batch-bar">
        <div class="batch-bar-left">
          <el-button type="primary" @click="dialogVisible=true">导入商品清单</el-button>
          <el-dropdown split-button plain @command="handleCommand" class="time-dropdown">
            节点确认
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in timePointData"
                :key="index"
                :command="item">
                {{item.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button plain @click="batchUploadVisible=true">批量上传图片</el-button>
          <el-button plain @click="batchOperationHandle('remove')">批量删除</el-button>
        </div>
        <div class="batch-bar-right">
          <el-popover
          placement="bottom-end"
          :visible-arrow="false"
          width="627"
          trigger="click">
            <div class="options" slot="reference">
              <i class="rossfont iconsetting"></i>
              <span>配置列</span>
            </div>
            <div class="options-content" style="padding: 12px;">
              <div class="options__content">
                <el-row>
                  <template v-for="(item, index) in attrConfigList">
                    <el-col :span="8" style="margin-bottom: 20px;" :key="index">
                      <el-checkbox v-model="item.selected" :disabled="item.disabled">{{ item.label }}</el-checkbox>
                    </el-col>
                  </template>
                </el-row>
              </div>
              <footer align="right">
                <el-button class="ued" size="mini" @click="resetOptionHandle">重置</el-button>
                <el-button class="ued" type="primary" size="mini" @click="applyOptionHandle">应用</el-button>
              </footer>
            </div>
          </el-popover>
          <span @click="batchOperationHandle('export')">
            <i class="iconfont icon-daochu"></i>导出商品信息
          </span>
        </div>
      </header>
      <!-- 拍摄图列表 -->
      <div class="shot-list-content">
        <el-table
          ref="shotTable"
          :data="list" width="100%" height="100%" fit
          header-row-class-name="costom-table-header"
          row-class-name="costom-table-row"
          cell-class-name="costom-table-cell"
          align="center"
          @selection-change="selectionHandle">
          <el-table-column
            fixed="left"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed="left"
            label="缩略图"
            width="80">
            <template v-slot="{ row }">
              <img v-if="row.storageUrl" class="thumb-pic" :src="row.storageUrl | resize" alt="">
              <div v-else class="thumb-pic thumb-emty">
                <span></span>
              </div>
            </template>
          </el-table-column>
          <template v-for="(col, index) in columns">
            <el-table-column :key="index" v-bind="col">
              <template v-slot="{ row }">
                <template v-if="col.options">
                  {{ row[col.prop] | findAndGet(col.options, 'value', 'label') | placeholder('/') }}
                </template>
                <template v-else-if="col.prop === 'createdBy'">
                  {{ row[col.prop].name || '/' }}
                </template>
                <template v-else-if="col.formate === 'datetime'">
                  {{ row[col.prop] | dateformat('YYYY-MM-DD HH:mm:ss') | placeholder('/') }}
                </template>
                <template v-else-if="col.formate === 'date'">
                  {{ row[col.prop] | dateformat | placeholder('/') }}
                </template>
                <template v-else>
                  {{ row[col.prop] | placeholder('/') }}
                </template>
                <span
                  v-if="col.editable"
                  class="cell-btn cell-edit-btn"
                  @click="editHandle(col, row)">
                  <i class="iconfont icon-bianjix"></i>
                </span>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="singleUploadHandle(row)">上传</el-button>
              <el-button type="text" size="small" @click="toDetail(row)">查看</el-button>
              <el-button type="text" size="small" @click="removeHandle(row._id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <empty v-if="list.length === 0">暂无任何商品</empty>
      </div>
      <div style="padding: 20px 20px;">
        <r-pagination ref="pageination"
          v-bind="pageination"
          @size-change="v => pageination=['pageSize', v]"
          @current-change="v => pageination=['currentPage', v]"
          @loader="queryList"></r-pagination>
      </div>
    </div>

    <!--导入商品清单-->
    <import-product
      v-if="dialogVisible"
      :opDomain="search.opDomain"
      :visible.sync="dialogVisible">
    </import-product>
    <!--节点确认-->
    <time-modify
      :visible.sync="timeDialogVisible"
      :title="confirmTitle"
      v-bind="timeOptions"
      @reload="reload">
    </time-modify>
    <!-- 批量上传 dialog -->
    <batch-upload
      v-if="batchUploadVisible"
      :visible.sync="batchUploadVisible"
      :op-domain="search.opDomain"
      @reload="batchUploadHandle"></batch-upload>
    <!-- 属性编辑 -->
    <edit-attr-dialog
    :visible.sync="editAttrVisible"
    :item="attrOption"
    @reload="reload"></edit-attr-dialog>
    <!-- 单个上传 -->
    <upload-img
      v-if="singleUploadVisible"
      :visible.sync="singleUploadVisible"
      :info="prevAsset"
      :categories="categoriesInfo.categories"
      @updateVisible="val=>singleUploadVisible=val"
      @successUpload="reload"
    ></upload-img>
  </section>
</template>

<script>

import { removeShot } from '@/api/shotDetailsManage';
import { getCategoriesForAssets } from '@/api/orgImgManage';
import { setStorage, getStorage } from '@/assets/js/storage';
import ImportProduct from './templates/ImportProduct.vue';
import TimeModify from './templates/TimeModify.vue';
import BatchUpload from '../OriginPics/templates/BatchUpload.vue';
import EditAttrDialog from './templates/EditAttrDialog.vue';
import uploadImg from '../OriginPics/templates/UploadImg.vue';
import attrSource from './attrs';
import { mapState, mapGetters, mapActions } from 'vuex';

const clone = obj => JSON.parse(JSON.stringify(obj));

export default {
  name: 'ShotManagement',
  components: {
    ImportProduct,
    TimeModify,
    BatchUpload,
    EditAttrDialog,
    uploadImg,
  },
  data() {
    const optionKey = 'DESIGN/SHOTLISTOPTIONS';
    return {
      optionKey,
      timePointData:
        [
          { label: '样衣到货确认', value: 'sampleReceivedTime' },
          { label: '产品图拍摄时间确认', value: 'productShotTime' },
          { label: '模特图拍摄时间确认', value: 'modelShotTime' },
        ],
      confirmTitle: '',
      dialogVisible: false,
      batchUploadVisible: false,
      timeDialogVisible: false,
      timeOptions: {},
      clone,
      attrSource,
      attrs: getStorage(optionKey) || clone(attrSource),
      attrConfigListMode: attrSource,
      attrConfigList: getStorage(optionKey) || clone(attrSource),
      selection: [],
      editAttrVisible: false,
      attrOption: {},
      singleUploadVisible: false,
      prevAsset: {},
      categoriesInfo: null,
    };
  },
  computed: {
    ...mapState('ShotMng', [
      'list',
    ]),
    ...mapGetters('User', [
      'opDomainOptions',
    ]),
    clientHeight() {
      return `${document.body.clientHeight - 56 - 16 - 24 - 10}px`;
    },
    columns() {
      return this.attrs.filter(i => i.selected);
    },
    search: {
      get() {
        return this.$store.state.ShotMng.search;
      },
      set(v) {
        this.updateSearchParams(v);
      },
    },
    pageination: {
      get() {
        return this.$store.state.ShotMng.pageination;
      },
      set(v) {
        this.updatePageinationParams({ [v[0]]: v[1] });
      },
    },
    timeTypeLabel() {
      const timeRangeType = this.search.timeRangeType;
      if (timeRangeType) {
        return this.attrs.find(i => i.prop === timeRangeType).label;
      }
      return '时间范围';
    },
    searchConf() {
      const timeTypeList = [
        { label: '按样衣发货时间', value: 'sampleDeliveredTimeDate' },
        { label: '按样衣到货时间', value: 'sampleReceivedTime' },
        { label: '按产品图拍摄时间', value: 'productShotTime' },
        { label: '按模特图拍摄时间', value: 'modelShotTime' },
        { label: '按产品图上传时间', value: 'productUploadedTime' },
        { label: '按模特图上传时间', value: 'modelUploadedTime' },
        { label: '按样衣最新发货时间', value: 'sampleDeliveredTimeUpdated' },
        { label: '按产品图最新上传时间', value: 'productUploadedTimeUpdated' },
        { label: '按模特图最新上传时间', value: 'modelUploadedTimeUpdated' },
      ];
      return {
        items: [
          {
            type: 'select',
            key: 'opDomain',
            formItem: {
              label: '运营组',
            },
            component: {
              clearable: false,
              options: this.opDomainOptions,
            },
          },
          {
            type: 'input',
            key: 'artNo',
            formItem: {
              label: '货号',
            },
          },
          {
            type: 'input',
            key: 'colorNo',
            formItem: {
              label: '色号',
            },
          },
          {
            type: 'input',
            key: 'sku',
            formItem: {
              label: 'SKU',
            },
          },
          {
            type: 'input',
            key: 'barCode',
            formItem: {
              label: '条形码',
            },
          },
          {
            type: 'select',
            key: 'timeRangeType',
            formItem: {
              label: '按时间',
            },
            component: {
              options: timeTypeList,
            },
          },
          {
            type: 'date',
            key: 'timeRange',
            formItem: {
              label: this.timeTypeLabel,
            },
            component: {
              type: 'daterange',
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyy/MM/dd HH:mm:ss',
              defaultTime: ['00:00:00', '23:59:59'],
              // pickerOptions: this.timeOptions(),
            },
          },
          {
            type: 'select',
            key: 'reShoot',
            formItem: {
              label: '是否重拍',
            },
            component: {
              clearable: false,
              options: [
                { label: '首次', value: 'false' },
                { label: '重拍', value: 'true' },
                { label: '全部', value: 'all' },
              ],
            },
          },
          {
            type: 'input',
            key: 'last_modified_by',
            formItem: {
              label: '操作人',
            },
          },
          // {
          //   type: 'input',
          //   key: 'task_code',
          //   formItem: {
          //     label: '任务号',
          //   },
          // },
        ],
      };
    },
  },
  methods: {
    ...mapActions('ShotMng', [
      'updateSearchParams',
      'updatePageinationParams',
      'queryList',
      'exportExcel',
      'toFirstPage',
    ]),
    resetSearch(values) {
      this.updateSearchParams(values);
    },
    startSearch() {
      // 重置页码
      this.toFirstPage();
      this.reload();
    },
    reload() {
      // 重置选择框
      this.$refs.shotTable.clearSelection();
      // 触发查询
      this.queryList();
    },
    batchUploadHandle(opDomain) {
      this.$refs.search.resetHandle();
      this.search.opDomain = opDomain;
      this.startSearch();
    },
    selectionHandle(val) {
      this.selection = val;
    },
    resetOptionHandle() {
      this.attrConfigList = this.clone(this.attrConfigListMode);
    },
    applyOptionHandle() {
      this.$refs.shotTable.doLayout();
      this.attrs = this.clone(this.attrConfigList);
      setStorage(this.optionKey, this.attrs, 24 * 60 * 7);
    },
    editHandle(col, row) {
      const value = row[col.prop];
      this.attrOption = {
        ...col,
        id: row._id,
        value,
      };
      this.editAttrVisible = true;
    },
    async batchOperationHandle(type) {
      if (!this.selection.length) {
        this.$message({
          message: '至少选择一条数据!',
          type: 'error',
        });
        return;
      }
      switch (type) {
        case 'confirm': {
          break;
        }
        case 'remove': {
          this.$confirm('您确定要删除这些信息吗，删除商品信息并不会删除对应图片。', '提示', {
            type: 'warning',
          }).then(async () => {
            try {
              await removeShot(this.selection.map(({ _id }) => _id).join(','));
              this.$message({
                message: '删除成功!',
                type: 'success',
                center: true,
              });
            } finally {
              this.queryList();
            }
          }).catch(() => {});
          break;
        }
        case 'export': {
          const titles = this.columns.map(i => i.prop).join(',');
          const additional = this.selection.map(({ _id, modelImageCount, productImageCount }) => ({ _id, modelImageCount, productImageCount }));
          const ids = this.selection.map(({ _id }) => _id).join(',');
          await this.exportExcel({ titles, additional, ids });
          // 重置选择框
          this.$refs.shotTable.clearSelection();
          break;
        }
        default: break;
      }
    },
    async singleUploadHandle({ artNo, colorNo, opDomain }) {
      if (!this.categoriesInfo || this.categoriesInfo.opDomain !== opDomain) {
        const categories = await getCategoriesForAssets({ opDomain }) || [];
        this.categoriesInfo = {
          opDomain,
          categories,
        };
      }
      const opDomainObj = this.opDomainOptions.find(i => i.value === opDomain);
      this.prevAsset = {
        artNo,
        colorNo,
        opDomainCode: opDomain,
        assets: [{
          artNo,
          colorNo,
          opDomains: [{ code: opDomain, name: opDomainObj.label }],
          tasks: [''],
        }],
      };
      this.singleUploadVisible = true;
    },
    toDetail({ artNo, colorNo, opDomain }) {
      const opDomainObj = this.opDomainOptions.find(i => i.value === opDomain);
      this.$router.push({
        path: '/image-preprocess/orgin-image/sub-list',
        query: {
          opDomainName: opDomainObj.label,
          opDomainCode: opDomain,
          artNo: encodeURIComponent(artNo),
          colorNo: encodeURIComponent(JSON.stringify(colorNo ? [colorNo] : [])),
        },
      });
    },
    async removeHandle(id) {
      try {
        await removeShot(id);
        this.$message({
          message: '删除成功!',
          type: 'success',
          center: true,
        });
        this.queryList();
      } catch (error) {
        console.error(error);
      }
    },
    handleCommand(commend) {
      if (!this.selection.length) {
        this.$message({
          message: '至少选择一条数据!',
          type: 'error',
        });
        return;
      }
      this.timeDialogVisible = true;
      this.confirmTitle = commend.label;
      const selectedList = this.selection;
      const selectedItem = selectedList.map(item => item._id).join(',');
      this.timeOptions = {
        id: selectedItem,
        ...commend,
      };
    },
  },
  filters: {
    resize(url) {
      return url ? `${url}${url.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,limit_0,m_pad,w_100,h_100` : '';
    },
  },
};
</script>

<style lang="scss" src="./index.scss" scoped>
</style>
