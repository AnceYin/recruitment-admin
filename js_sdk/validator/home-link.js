// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "标题",
    "label": "标题"
  },
  "pictureLink": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "file"
      }
    ],
    "title": "图片链接",
    "label": "图片链接"
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "序号",
    "label": "序号"
  },
  "categoriesType": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "分类类型",
    "label": "分类类型"
  },
  "status": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "状态",
    "defaultValue": true,
    "label": "状态"
  },
  "linkType": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "title": "跳转类型",
    "defaultValue": 0,
    "label": "跳转类型"
  },
  "linkPath": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "跳转路径",
    "label": "跳转路径"
  }
}

const enumConverter = {
  "linkType_valuetotext": {
    "0": "不跳转",
    "1": "跳转到分类页面",
    "2": "跳转到除分类页面的其他页面",
    "3": "跳转其他小程序",
    "4": "跳转公众号文章",
    "5": "跳转视频号",
    "6": "跳转http",
    "7": "其它用途"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
