<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="标题" required>
        <uni-easyinput placeholder="首页模块标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pictureLink" label="图片链接" required>
        <uni-file-picker file-mediatype="image" return-type="object" v-model="formData.pictureLink"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="sort" label="序号">
        <uni-easyinput placeholder="按序号从小到大排序,例：1000" type="number" v-model="formData.sort"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="categoriesType" label="分类类型" required>
        <uni-data-picker v-model="formData.categoriesType" collection="home-categories" field="_id as value, title as text" trim="both"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="status" label="状态">
        <switch @change="binddata('status', $event.detail.value)" :checked="formData.status"></switch>
      </uni-forms-item>
      <uni-forms-item name="linkType" label="跳转类型">
        <uni-data-checkbox v-model="formData.linkType" :localdata="formOptions.linkType_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="linkPath" label="跳转路径">
        <uni-easyinput placeholder="例：/pages/index/index，跳转分类时，此为筛选参数" v-model="formData.linkPath" trim="both"></uni-easyinput>
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
  import { validator } from '../../js_sdk/validator/home-link.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'home-link';

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
        "pictureLink": null,
        "sort": null,
        "categoriesType": "",
        "status": true,
        "linkType": 0,
        "linkPath": ""
      }
      return {
        formData,
        formOptions: {
          "linkType_localdata": [
            {
              "text": "不跳转",
              "value": 0
            },
            {
              "text": "跳转到分类页面",
              "value": 1
            },
            {
              "text": "跳转到除分类页面的其他页面",
              "value": 2
            },
            {
              "text": "跳转其他小程序",
              "value": 3
            },
            {
              "text": "跳转公众号文章",
              "value": 4
            },
            {
              "text": "跳转视频号",
              "value": 5
            },
            {
              "text": "跳转http",
              "value": 6
            },
            {
              "text": "其它用途",
              "value": 7
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
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
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
