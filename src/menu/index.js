import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

const menu = [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '礼包中心',
    icon: 'gift',
    children: [
      { path: '/giftBag', title: '礼包列表' },
      { path: '/giftBagConfig', title: '礼包维护', roles: ['admin'] },
      { path: '/goodsConfig', title: '商品维护', roles: ['admin'] }
    ]
  },
  {
    title: '订单中心',
    icon: 'th-list',
    children: [
      { path: '/orderList', title: '我的订单' },
      { path: '/othersOrderList', title: '代领订单' },
      { path: '/orderConfig', title: '订单列表', roles: ['admin'] }
    ]
  },
  {
    title: '统计中心',
    icon: 'th-list',
    children: [
      { path: '/staffSummary', title: '员工领取情况', roles: ['admin'] }
    ],
    roles: ['admin']
  }
]

export const menuHeader = supplementPath(menu)

export const menuAside = supplementPath(menu)
