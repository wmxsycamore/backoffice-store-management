/**
 * 规则：
 * 一、例如：index/index，以index结尾的，path和name默认去除index
 * 二、例如：shop/list，默认生成name为shop_list(如果结尾为index,例如shop/index则是shop)
 * 三、填写后不会自动生成
 */
const routes = [

  {
    // redirect:重定向，在layout路径下都会默认先进入index页面
    redirect: { name: 'index' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../../views/Layout.vue'),
    component: 'Layout',
    children: [
      {
        // path: '/index',
        // name: 'index',
        // component: () => import('../../views/Index/index.vue'),
        meta: { title: '后台首页' },
        component: 'Index/index',
      },
      {
        meta: { title: '商品列表' },
        component: 'Shop/Goods/List',
      },
    ],
  },
  {
    // path: '/login',
    // name: 'login',
    // component: () => import(/* webpackChunkName: "about" */ '../../views/Login/index.vue'),
    meta: { title: '登录页面' },
    component: 'Login/index',
  },
  // path: '*',输入的地址（路由）不对时（不存在），默认跳转的页面。
  {
    path: '*',
    redirect: { name: 'index' },
  },
];

// 去除index
function getValue(str) {
  const index = str.lastIndexOf('/');
  const val = str.substring(index + 1, str.length);
  if (val === 'index') {
    return str.substring(index, -1);
  }
  return str;
}
// 自动生成路由
function createRoute(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (!arr[i].component) return;
    // 去除index
    const val = getValue(arr[i].component.toLowerCase());
    arr[i].name = arr[i].name || val.replace(/\//g, '_');
    // 生成name
    // 生成path
    arr[i].path = arr[i].path || `/${val}`;
    // 自动生成component
    const componentFun = import(`../../views/${arr[i].component}.vue`);
    arr[i].component = () => componentFun;
    if (arr[i].children && arr[i].children.length > 0) {
      createRoute(arr[i].children);
    }
  }
}
// 获取路由信息方法l
const getRoutes = () => {
  // 生成路由详细信息
  createRoute(routes);
  return routes;
};

export default getRoutes();
