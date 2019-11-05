# 如何修改商家信息

解压缩zip 文件。Windows 用户使用Notepad，Mac用户使用Textedit 打开商家的 `.json` 文件（或者使用您常用的其它text editor，如Sublime 或 VSCode）。

原始信息如下：

```json
{
  "realm": "gourmet",
  "category": [
    "asia",
    "chinese",
    "boba",
    "western",
    "fastfood",
    "hotpot",
    "bbq",
    "dimsum"
  ],
  "tag": [
    [
      "中國菜",
      "壽司店"
    ],
    [
      "chinese",
      "sushi"
    ]
  ],
  "description": [
    "",
    ""
  ],
  "name": [
    "Apple Green Bistro",
    "Apple Green Bistro"
  ],
  "location": {
    "type": "Point",
    "coordinates": [
      -122.01564,
      37.33603
    ]
  },
  "address": {
    "street": "10885 N Wolfe Rd",
    "city": "Cupertino",
    "state": "CA",
    "zipCode": "95014"
  },
  "tel": "+1 408-725-8008",
  "thumbnail": "https://s3-media3.fl.yelpcdn.com/bphoto/CILiJeVwnl0qPDyZ5UkGaQ/o.jpg",
  "gallery": [
    "https://s3-media3.fl.yelpcdn.com/bphoto/CILiJeVwnl0qPDyZ5UkGaQ/o.jpg",
    "https://s3-media1.fl.yelpcdn.com/bphoto/-3dSTkUyJ2GiuK_zdHgqPg/o.jpg",
    "https://s3-media4.fl.yelpcdn.com/bphoto/peYl5_H-uLgBuEgAV8oA0g/o.jpg"
  ],
  "rating": 3.5,
  "reference": "8foIRh7g_lmMMzWFsdvBnA",
  "region": "Cupertino"
}
```

1. 找到 “category”，并根据商家特征选择合适的分类，然后删除不需要的分类。比如奶茶店就只留下“asia”和“boba”选项。**注意**：最后一个category后不可以有逗号！

   - ```
     # 错误！！！
     "category": [
         "asia",
         "chinese",
     ],

     # 正确
     "category": [
         "asia",
         "chinese"
     ],
     ```

2. 根据需求添加中英文"description"， 比如：

   - ```
     "description": [
         "暖心迷你小火锅，奶茶", 
         "Comfort Mini Hotpot, Milk Tea"
     ],
     ```

3. 根据需求添加中英文商家名称（“name”），比如：

   - ```
     "name" : [ 
         "味鼎小火锅", 
         "Tasty Pot"
     ],
     ```

4. 保存文件



修改后的文件类似于：

```json
{
  "realm": "gourmet",
  "category": [
    "asia",
    "chinese"
  ],
  "tag": [
    [
      "中國菜",
      "壽司店"
    ],
    [
      "chinese",
      "sushi"
    ]
  ],
  "description": [
    "好吃的寿司",
    "Good sushi place"
  ],
  "name": [
    "绿苹果寿司店",
    "Apple Green Bistro"
  ],
  "location": {
    "type": "Point",
    "coordinates": [
      -122.01564,
      37.33603
    ]
  },
  "address": {
    "street": "10885 N Wolfe Rd",
    "city": "Cupertino",
    "state": "CA",
    "zipCode": "95014"
  },
  "tel": "+1 408-725-8008",
  "thumbnail": "https://s3-media3.fl.yelpcdn.com/bphoto/CILiJeVwnl0qPDyZ5UkGaQ/o.jpg",
  "gallery": [
    "https://s3-media3.fl.yelpcdn.com/bphoto/CILiJeVwnl0qPDyZ5UkGaQ/o.jpg",
    "https://s3-media1.fl.yelpcdn.com/bphoto/-3dSTkUyJ2GiuK_zdHgqPg/o.jpg",
    "https://s3-media4.fl.yelpcdn.com/bphoto/peYl5_H-uLgBuEgAV8oA0g/o.jpg"
  ],
  "rating": 3.5,
  "reference": "8foIRh7g_lmMMzWFsdvBnA",
  "region": "Cupertino"
}
```

