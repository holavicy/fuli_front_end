import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('pages/index')
      },
      // 商品维护页面
      {
        path: 'goodsConfig',
        name: 'goodsConfig',
        meta: {
          title: '商品维护',
          auth: true
        },
        component: _import('pages/goods/goodsConfig')
      },
      // 礼包维护页面
      {
        path: 'giftBagConfig',
        name: 'giftBagConfig',
        meta: {
          title: '礼包维护',
          auth: true
        },
        component: _import('pages/giftBag/giftBagConfig')
      },
      // 选择礼包页面
      {
        path: 'giftBag',
        name: 'giftBag',
        meta: {
          title: '礼包列表',
          auth: true
        },
        component: _import('pages/giftBag/giftBag')
      },
      // 订单列表（员工）
      {
        path: 'orderList',
        name: 'orderList',
        meta: {
          title: '我的订单',
          auth: true
        },
        component: _import('pages/order/orderList')
      },
      {
        path: 'othersOrderList',
        name: 'othersOrderList',
        meta: {
          title: '代领订单',
          auth: true
        },
        component: _import('pages/order/othersOrderList')
      },
      // 订单列表（管理员）
      {
        path: 'orderConfig',
        name: 'orderConfig',
        meta: {
          title: '订单维护',
          auth: true
        },
        component: _import('pages/order/orderConfig')
      },
      // 商品库存报表
      {
        path: 'goodsStockReport',
        name: 'goodsStockReport',
        meta: {
          title: '商品库存报表',
          auth: true
        },
        component: _import('pages/chat/goods')
      },
      // 商品入库明细报表
      {
        path: 'goodsStockInDetailReport',
        name: 'goodsStockInDetailReport',
        meta: {
          title: '商品入库明细报表',
          auth: true
        },
        component: _import('pages/chat/goodsStockIn')
      },
      // 商品出库明细报表
      {
        path: 'goodsStockOutDetailReport',
        name: 'goodsStockOutDetailReport',
        meta: {
          title: '商品出库明细报表',
          auth: true
        },
        component: _import('pages/chat/goodsStockOut')
      },
      // 礼包领取明细报表
      {
        path: 'giftRecord',
        name: 'giftRecord',
        meta: {
          title: '礼包领取明细报表',
          auth: true
        },
        component: _import('pages/chat/gift')
      },
       // 礼包领取汇总报表
       {
        path: 'giftSum',
        name: 'giftSum',
        meta: {
          title: '礼包领取汇总报表',
          auth: true
        },
        component: _import('pages/chat/giftSum')
      },
      // 一般生日礼包人员统计报表
      {
        path: 'staffSummary',
        name: 'staffSummary',
        meta: {
          title: '一般生日礼包人员统计报表',
          auth: true
        },
        component: _import('pages/chat/staff')
      },
      // 整生日人员统计报表
      {
        path: 'zBirthStaffSummary',
        name: 'zBirthStaffSummary',
        meta: {
          title: '整生日人员统计报表',
          auth: true
        },
        component: _import('pages/chat/zBirthStaff')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
