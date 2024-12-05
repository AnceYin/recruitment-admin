<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title"></view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
        <button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length" @click="delTable">批量删除</button>
        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" :collection="collectionList" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'title')" sortable @sort-change="sortChange($event, 'title')">标题</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'star')" sortable @sort-change="sortChange($event, 'star')">收藏数</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'cover')">封面</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'png_list')">照片数组</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'summary')" sortable @sort-change="sortChange($event, 'summary')">简介</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'placeholder_right')" sortable @sort-change="sortChange($event, 'placeholder_right')">右侧显示信息</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'description')" sortable @sort-change="sortChange($event, 'description')">描述</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'body')" sortable @sort-change="sortChange($event, 'body')">正文</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'level')" sortable @sort-change="sortChange($event, 'level')">层级</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'label')" sortable @sort-change="sortChange($event, 'label')">标签</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'sort')" sortable @sort-change="sortChange($event, 'sort')">序号</uni-th>
            <uni-th align="center" sortable @sort-change="sortChange($event, 'status')">状态</uni-th>
            <uni-th align="center">作者</uni-th>
            <uni-th align="center">简历模板</uni-th>
            <uni-th align="center">分类类型</uni-th>
            <uni-th align="center">元素类型</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item.title}}</uni-td>
            <uni-td align="center">{{item.star}}</uni-td>
            <uni-td align="center">
              <uni-file-picker v-if="item.cover && item.cover.fileType == 'image'" :value="item.cover" :file-mediatype="item.cover && item.cover.fileType" return-type="object" :imageStyles="imageStyles" readonly></uni-file-picker>
              <uni-link v-else :href="item.cover && item.cover.url" :text="item.cover && item.cover.url"></uni-link>
            </uni-td>
            <uni-td align="center">
              <template v-for="(file, j) in item.png_list">
                <uni-file-picker v-if="file.fileType == 'image'" :value="file" :file-mediatype="file.fileType" :imageStyles="imageStyles" readonly></uni-file-picker>
                <uni-link v-else :href="file.url" :text="file.url"></uni-link>
              </template>
            </uni-td>
            <uni-td align="center">{{item.summary}}</uni-td>
            <uni-td align="center">{{item.placeholder_right}}</uni-td>
            <uni-td align="center">{{item.description}}</uni-td>
            <uni-td align="center">{{item.body}}</uni-td>
            <uni-td align="center">{{item.level}}</uni-td>
            <uni-td align="center">{{item.label}}</uni-td>
            <uni-td align="center">{{item.sort}}</uni-td>
            <uni-td align="center">{{item.status == true ? '✅' : '❌'}}</uni-td>
            <uni-td align="center">{{item.author && item.author[0] && item.author[0].text}}</uni-td>
            <uni-td align="center">{{item.template && item.template[0] && item.template[0].text}}</uni-td>
            <uni-td align="center">{{item.categoriesType && item.categoriesType[0] && item.categoriesType[0].text}}</uni-td>
            <uni-td align="center">{{item.elementType && item.elementType[0] && item.elementType[0].text}}</uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/classify-Info.js';

  const db = uniCloud.database()
  // 表查询配置
  const dbOrderBy = '' // 排序字段
  const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
  // 分页配置
  const pageSize = 20
  const pageCurrent = 1

  const orderByMapping = {
    "ascending": "asc",
    "descending": "desc"
  }

  export default {
    data() {
      return {
        collectionList: [ db.collection('classify-Info').field('title,star,cover,png_list,summary,placeholder_right,description,body,level,label,sort,status,author,template,categoriesType,elementType').getTemp(),db.collection('uni-id-users').field('_id, nickname as text').getTemp(),db.collection('template-resume').field('_id, _id as text').getTemp(),db.collection('classify-categories-type').field('_id, title as text').getTemp(),db.collection('classify-element-type').field('_id, title as text').getTemp() ],
        query: '',
        where: '',
        orderby: dbOrderBy,
        orderByFieldName: "",
        selectedIndexs: [],
        options: {
          pageSize,
          pageCurrent,
          filterData: {},
          ...enumConverter
        },
        imageStyles: {
          width: 64,
          height: 64
        },
        exportExcel: {
          "filename": "classify-Info.xls",
          "type": "xls",
          "fields": {
            "标题": "title",
            "收藏数": "star",
            "封面": "cover",
            "照片数组": "png_list",
            "简介": "summary",
            "右侧显示信息": "placeholder_right",
            "描述": "description",
            "正文": "body",
            "层级": "level",
            "标签": "label",
            "序号": "sort",
            "状态": "status",
            "作者": "author",
            "简历模板": "template",
            "分类类型": "categoriesType",
            "元素类型": "elementType"
          }
        },
        exportExcelData: []
      }
    },
    onLoad() {
      this._filter = {}
    },
    onReady() {
      this.$refs.udb.loadData()
    },
    methods: {
      onqueryload(data) {
        this.exportExcelData = data
      },
      getWhere() {
        const query = this.query.trim()
        if (!query) {
          return ''
        }
        const queryRe = new RegExp(query, 'i')
        return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
      },
      search() {
        const newWhere = this.getWhere()
        this.where = newWhere
        this.$nextTick(() => {
          this.loadData()
        })
      },
      loadData(clear = true) {
        this.$refs.udb.loadData({
          clear
        })
      },
      onPageChanged(e) {
        this.selectedIndexs.length = 0
        this.$refs.table.clearSelection()
        this.$refs.udb.loadData({
          current: e.current
        })
      },
      navigateTo(url, clear) {
        // clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
        uni.navigateTo({
          url,
          events: {
            refreshData: () => {
              this.loadData(clear)
            }
          }
        })
      },
      // 多选处理
      selectedItems() {
        var dataList = this.$refs.udb.dataList
        return this.selectedIndexs.map(i => dataList[i]._id)
      },
      // 批量删除
      delTable() {
        this.$refs.udb.remove(this.selectedItems(), {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      // 多选
      selectionChange(e) {
        this.selectedIndexs = e.detail.index
      },
      confirmDelete(id) {
        this.$refs.udb.remove(id, {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      sortChange(e, name) {
        this.orderByFieldName = name;
        if (e.order) {
          this.orderby = name + ' ' + orderByMapping[e.order]
        } else {
          this.orderby = ''
        }
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      },
      filterChange(e, name) {
        this._filter[name] = {
          type: e.filterType,
          value: e.filter
        }
        let newWhere = filterToWhere(this._filter, db.command)
        if (Object.keys(newWhere).length) {
          this.where = newWhere
        } else {
          this.where = ''
        }
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      }
    }
  }
</script>

<style>
</style>
