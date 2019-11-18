const routes = [
  {
    path: '/layout',
    name: 'layout',
    // redirect:重定向，在layout路径下都会默认先进入index页面
    redirect: { name: 'index' },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../../views/Layout.vue'),
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('../../views/Index/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../../views/Login/index.vue'),
  },
  // path: '*',输入的地址（路由）不对时（不存在），默认跳转的页面。
  {
    path: '*',
    redirect: { name: 'index' },
  },
];

export default routes;
