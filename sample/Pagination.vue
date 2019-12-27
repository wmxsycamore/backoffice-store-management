<template>
    <div class="pagination">
        <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page.sync='currentPage'
                :page-sizes='sizes'
                :page-size='size || sizes[0]'
                :layout='layout'
                :total='total'>
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: 'Pagination',
        data() {
            return {
                model: {},
                currentPage: this.page
            }
        },
        props: {
            // 数据总数
            total: {
                type: Number,
                required: true
            },
            // 当前页码
            page: {
                type: Number,
                required: true
            },
            // 当前分页规格
            size: {
                type: Number
            },
            // 分页规格选择
            sizes: {
                type: Array,
                default: () => [10, 20, 30]
            },
            // 分页布局
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            },
            // 返回当前页码的key
            pageKey: {
                type: String,
                required: true
            },
            // 返回当前分页规格的key
            sizeKey: {
                type: String,
                required: true
            }
            // @change: 分页组件变化时回调,返回分页page,size参数
        },
        watch: {
            page: {
                handler(value) {
                    this.currentPage = value;
                }
            }
        },
        created() {
            this.model[this.pageKey] = this.page;
            this.model[this.sizeKey] = this.size || this.sizes[0];
        },
        methods: {
            // 分页规格变化时,如果带动页码变化,会触发一次currentChange
            sizeChange(value) {
                this.model[this.sizeKey] = value;
                this.currentChange(1);
            },
            // 当前页码变化
            currentChange(value) {
                this.model[this.pageKey] = value;
                this.$emit('update:page', value);
                this.$emit('change', this.model);
            }
        }
    }
</script>
<style>
    .pagination {
        position: relative;
        margin: 20px 24px;
        text-align: right;
    }
</style>