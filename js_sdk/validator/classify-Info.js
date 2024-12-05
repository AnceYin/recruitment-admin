// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "标题",
    "label": "标题"
  },
  "star": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "收藏数",
    "label": "收藏数"
  },
  "cover": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "封面",
    "label": "封面"
  },
  "png_list": {
    "rules": [
      {
        "format": "array"
      },
      {
        "arrayType": "file"
      }
    ],
    "title": "照片数组",
    "label": "照片数组"
  },
  "summary": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "简介",
    "label": "简介"
  },
  "placeholder_right": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "右侧显示信息",
    "label": "右侧显示信息"
  },
  "description": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "描述",
    "label": "描述"
  },
  "body": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "正文",
    "label": "正文"
  },
  "level": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "层级",
    "label": "层级"
  },
  "label": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "标签",
    "label": "标签"
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "序号",
    "defaultValue": 1000,
    "label": "序号"
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
  "author": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "作者",
    "label": "作者"
  },
  "template": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "简历模板",
    "label": "简历模板"
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
  "elementType": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "元素类型",
    "label": "元素类型"
  }
}

const enumConverter = {}

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
