# 观迹 | WatchLog

## 项目描述

一个自部署的记录个人观影记录的项目。

## 项目栈

- Nuxt JS 4
- Tailwind CSS V4 shadcn-vue
- SQLite better-sqlite3
- pnpm
- docker cli 部署

## 要求

1. 前端提供单页应用和和Widget打包形式
2. 项目名称中文观迹 英文 watchlog
3. Widget供Hugo Astro等静态博客嵌入，不影响嵌入博客的样式，能自适应
4. 目前先使用豆瓣API获取数据，TMDB后续再接入，因此目前的设计需要保留扩展能力
5. 使用最佳实践提供结构
6. 使用MCP context7阅读必要文档（只需要阅读必要的，不要全部获取）
7. 个人部署项目，追求轻量高效，不要沉重的测试过程
8. 前端设计需要使用 frontend-design 技能来设计
9. 豆瓣图片有防盗链，但是在图片前加入比如：`https://image.baidu.com/search/down?url=` 前端可以正确获取，因此可以通过设置自定义代理的方式（你可以选择合适的，我只是建议）
10. 提供详细的环境变量和文档
11. 不需要复杂的测试

## 豆瓣数据获取

### 端点

`https://frodo.douban.com/api/v2/user/[userid]/interests?type=movie&status=done&start=1&count=20&apiKey=0ac44ae016490db2204ce0a042db2916`

这是一个可用的端点，其中 `interests?`后参数 type 写死movie

status 可以是doing done mark

start 和count是起始和数量

API 需要环境变量定义

### headers

```
            "Host": frodo.douban.com,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001023) NetType/WIFI Language/zh_CN",
            "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/99/page-frame.html",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
```

其中 referer 中 page-frame前的数字可能会变化

### 数据返回

下面是返回的数据格式，你可以参考，将必要的数据格式化后存储到SQLite数据库，不要全部数据，只留前端展示必要的

```json
{
  "count": 1,
  "start": 1,
  "total": 880,
  "filters": [
    {
      "tags": [
        {
          "name": "全部",
          "key": "全部"
        },
        {
          "name": "2026",
          "key": "2026"
        },
        {
          "name": "2025",
          "key": "2025"
        },
        {
          "name": "2024",
          "key": "2024"
        },
        {
          "name": "2023",
          "key": "2023"
        },
        {
          "name": "2022",
          "key": "2022"
        },
        {
          "name": "2020年代",
          "key": "2020年代"
        },
        {
          "name": "2010年代",
          "key": "2010年代"
        },
        {
          "name": "2000年代",
          "key": "2000年代"
        },
        {
          "name": "90年代",
          "key": "90年代"
        },
        {
          "name": "80年代",
          "key": "80年代"
        },
        {
          "name": "70年代",
          "key": "70年代"
        },
        {
          "name": "60年代",
          "key": "60年代"
        },
        {
          "name": "更早",
          "key": "更早"
        }
      ],
      "type": "year",
      "title": "年代"
    },
    {
      "tags": [
        {
          "name": "全部",
          "key": ""
        },
        {
          "name": "电影",
          "key": "movie"
        },
        {
          "name": "电视",
          "key": "tv"
        }
      ],
      "type": "subtype",
      "title": "形式"
    }
  ],
  "interests": [
    {
      "comment": "",
      "rating": {
        "count": 1,
        "max": 5,
        "star_count": 4.0,
        "value": 4
      },
      "sharing_text": "我的评分：★★★★ https://www.douban.com/doubanapp/dispatch/movie/35712804 来自@豆瓣App",
      "sharing_url": "https://www.douban.com/doubanapp/dispatch?uri=/subject/35712804/interest/4496137804",
      "tags": [],
      "charts": [],
      "is_editable": false,
      "platforms": [],
      "vote_count": 0,
      "create_time": "2026-01-28 19:51:19",
      "status": "done",
      "id": 4496137804,
      "is_private": false,
      "subject": {
        "rating": {
          "count": 307074,
          "max": 10,
          "star_count": 4.5,
          "value": 8.8
        },
        "controversy_reason": "",
        "pubdate": [
          "2023-11-22(韩国)"
        ],
        "pic": {
          "large": "https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg",
          "normal": "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2905141611.jpg"
        },
        "honor_infos": [
          {
            "kind": "movie",
            "uri": "douban://douban.com/subject_collection/ECBQ7RNSA?type=rank&category=movie&rank_type=year",
            "rank": 3,
            "title": "豆瓣2024评分最高外语电影"
          }
        ],
        "is_show": false,
        "vendor_icons": [],
        "year": "2023",
        "card_subtitle": "2023 / 韩国 / 剧情 / 金性洙 / 黄政民 郑雨盛",
        "id": "35712804",
        "genres": [
          "剧情"
        ],
        "title": "首尔之春",
        "is_released": true,
        "actors": [
          {
            "name": "黄政民"
          },
          {
            "name": "郑雨盛"
          },
          {
            "name": "李星民"
          },
          {
            "name": "朴解浚"
          },
          {
            "name": "金成畇"
          },
          {
            "name": "朴勋"
          },
          {
            "name": "安世镐"
          },
          {
            "name": "郑栋焕"
          },
          {
            "name": "金义城"
          },
          {
            "name": "徐光载"
          }
        ],
        "color_scheme": {
          "is_dark": true,
          "primary_color_light": "726253",
          "_base_color": [
            0.08045977011494258,
            0.27619047619047615,
            0.8235294117647058
          ],
          "secondary_color": "f9f7f4",
          "_avg_color": [
            0.06439393939393939,
            0.43137254901960786,
            0.4
          ],
          "primary_color_dark": "4c4137"
        },
        "type": "movie",
        "has_linewatch": false,
        "vendor_desc": "",
        "cover_url": "https://img2.doubanio.com/view/photo/m_ratio_poster/public/p2905141611.jpg",
        "sharing_url": "https://www.douban.com/doubanapp/dispatch/movie/35712804",
        "url": "https://movie.douban.com/subject/35712804/",
        "release_date": null,
        "uri": "douban://douban.com/movie/35712804",
        "subtype": "movie",
        "directors": [
          {
            "name": "金性洙"
          }
        ],
        "album_no_interact": false,
        "article_intros": [],
        "null_rating_reason": ""
      }
    }
  ]
}
```

