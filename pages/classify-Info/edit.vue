<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="标题">
        <uni-easyinput placeholder="标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="star" label="收藏数">
        <uni-easyinput placeholder="收藏数" type="number" v-model="formData.star"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="cover" label="封面">
        <uni-file-picker file-mediatype="image" file-extname="jpg,png" return-type="object" v-model="formData.cover"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="png_list" label="照片数组">
        <uni-file-picker return-type="array" v-model="formData.png_list"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="summary" label="简介">
        <uni-easyinput placeholder="分列展示时的一句话" v-model="formData.summary"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="placeholder_right" label="右侧显示信息">
        <uni-easyinput placeholder="暂定可以放薪资" v-model="formData.placeholder_right"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="description" label="描述">
        <div id="descriptionEdit">
			<div v-html="formData.description"></div>
        </div>
      </uni-forms-item>
      <uni-forms-item name="body" label="正文">
        <div id="bodyEdit">
        	<div v-html="formData.body"></div>
        </div>
      </uni-forms-item>
      <uni-forms-item name="level" label="层级">
        <uni-easyinput placeholder="层级，0表示校级，1表示院级" type="number" v-model="formData.level"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="label" label="标签">
        <uni-easyinput placeholder="标签列表，多个标签用,分隔" v-model="formData.label"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="序号">
        <uni-easyinput placeholder="当前层级下的顺序，由小到大" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="状态">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="author" label="作者" required>
        <uni-data-picker v-model="formData.author" collection="uni-id-users" field="_id as value, mobile as text" trim="both"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="template" label="简历模板">
        <uni-data-picker v-model="formData.template" collection="template-resume" field="_id as value, _id as text" trim="both"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="categoriesType" label="分类类型" required>
        <uni-data-picker v-model="formData.categoriesType" collection="classify-categories-type" field="_id as value, title as text" trim="both"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="elementType" label="元素类型">
        <uni-data-picker v-model="formData.elementType" collection="classify-element-type" field="_id as value, title as text" trim="both"></uni-data-picker>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/classify-Info.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'classify-Info';
  
  	import E from 'wangeditor'
  	let descriptionEdit = null;
  	let bodyEdit = null;

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "title": "",
        "star": null,
        "cover": null,
        "png_list": [],
        "summary": "",
        "placeholder_right": "",
        "description": "",
        "body": "",
        "level": null,
        "label": "",
        "sort": 1000,
        "status": true,
        "author": "",
        "template": "",
        "categoriesType": "",
        "elementType": ""
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
		this.onDescriptionEdit()
		this.onBodyEdit()
    },
    methods: {
      			// 初始化富文本框
      			onDescriptionEdit() {
      				descriptionEdit = new E("#descriptionEdit");
      				descriptionEdit.config.zIndex = 0;
      				descriptionEdit.config.onblur = (newHtml) => {
      					this.formData.description = newHtml
      					console.log(newHtml)
      				}
      				const upload = (resultFiles, insertFn) => {
      					resultFiles.forEach(item => {
      						let path = URL.createObjectURL(item)
      						let name = item.name
      						uniCloud.uploadFile({
      							filePath: path,
      							cloudPath: name
      						}).then(res => {
      							uniCloud.getTempFileURL({
      								fileList: [res.fileID]
      							}).then(ress => {
      								insertFn(ress.fileList[0].tempFileURL)
      								console.log(ress.fileList[0].tempFileURL)
      							});
      						})
      					})
      				};
      				descriptionEdit.config.customUploadImg = upload;
      				descriptionEdit.config.customUploadVideo = upload;
      				descriptionEdit.create()
      			},
      			onBodyEdit() {
      				bodyEdit = new E("#bodyEdit");
      				bodyEdit.config.zIndex = 0;
      				bodyEdit.config.onblur = (newHtml) => {
      					this.formData.body = newHtml
      					console.log(newHtml)
      				}
      				const upload = (resultFiles, insertFn) => {
      					resultFiles.forEach(item => {
      						let path = URL.createObjectURL(item)
      						let name = item.name
      						uniCloud.uploadFile({
      							filePath: path,
      							cloudPath: name
      						}).then(res => {
      							uniCloud.getTempFileURL({
      								fileList: [res.fileID]
      							}).then(ress => {
      								insertFn(ress.fileList[0].tempFileURL)
      								console.log(ress.fileList[0].tempFileURL)
      							});
      						})
      					})
      				};
      				bodyEdit.config.customUploadImg = upload;
      				bodyEdit.config.customUploadVideo = upload;
      				bodyEdit.create()
      			},

      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
		  				// 用于避免没有失焦就提交的bug
		  				value.description = descriptionEdit.txt.html()
		  				value.body = bodyEdit.txt.html()
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("title,star,cover,png_list,summary,placeholder_right,description,body,level,label,sort,status,author,template,categoriesType,elementType").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
