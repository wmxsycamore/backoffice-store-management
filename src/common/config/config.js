// 配置菜单
export default {
  logo: 'UNI-ADMIN',
  navBar: {
    active: '0',
    list: [
      {
        name: '首页',
        subActive: 0,
        submenu: [
          {
            icon: 'el-icon-s-home',
            name: '后台首页',
            pathName: 'index',
          },
          {
            icon: 'el-icon-s-claim',
            name: '商品列表',
            pathName: 'shop_goods_list',
          },
          {
            icon: 'el-icon-picture',
            name: '图片管理',
            pathName: 'images',
          },
        ],
      },
      {
        name: '商品',
        subActive: 0,
        submenu: [
          {
            icon: 'el-icon-s-claim',
            name: '商品列表',
            pathName: 'shop_goods_list',
          },
        ],
      },
      {
        name: '订单',
        subActive: 0,
        submenu: [
          { pathName: 'shop_goods_list' },
        ],
      },
      {
        name: '会员',
        subActive: 0,
        submenu: [
          { pathName: 'shop_goods_list' },
        ],
      },
      {
        name: '设置',
        subActive: 0,
        submenu: [
          { pathName: 'shop_goods_list' },
        ],
      },

    ],
  },

};
