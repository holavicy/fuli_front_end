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
      { path: '/orderConfig', title: '订单维护', roles: ['admin'] }
    ]
  },
  {
    title: '统计中心',
    icon: 'th-list',
    children: [
      { path: '/goodsStockReport', title: '商品库存报表', roles: ['admin'] },
      { path: '/goodsStockInDetailReport', title: '商品入库明细报表', roles: ['admin'] },
      { path: '/goodsStockOutDetailReport', title: '商品出库明细报表', roles: ['admin'] },
      { path: '/giftRecord', title: '礼包领取明细报表', roles: ['admin'] },
      { path: '/giftSum', title: '礼包领取汇总报表', roles: ['admin'] },
      { path: '/staffSummary', title: '一般生日礼包人员统计报表', roles: ['admin'] },
      { path: '/zBirthStaffSummary', title: '整生日人员统计报表', roles: ['admin'] }
    ],
    roles: ['admin']
  }
]

export const menuHeader = supplementPath(menu)

export const menuAside = supplementPath(menu)
