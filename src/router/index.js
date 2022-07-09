import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    name: '用户',
    component: Layout,
    meta: { title: '用户', icon: 'form' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/group',
    component: Layout,
    name: '谷仓',
    meta: { title: '谷仓', icon: 'form' },
    children: [
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '谷仓管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/support',
    component: Layout,
    name: '支持',
    meta: { title: '支持', icon: 'form' },
    children: [
      {
        path: 'work',
        name: 'Work',
        component: () => import('@/views/support/work/index'),
        meta: { title: '作品管理', icon: 'form' }
        // children: [
        //   {
        //     path: 'createWork',
        //     name: 'CreateWork',
        //     component: () => import('@/views/support/work/createWork/index'),
        //     meta: { title: '新建作品', icon: 'plus' }
        //   }
        // ]
      },
      {
        path: 'sensitive-word',
        name: 'SensitiveWord',
        component: () => import('@/views/support/sensitive-word/index'),
        meta: { title: '敏感词管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/content',
    component: Layout,
    name: '内容',
    meta: { title: '内容', icon: 'form' },
    children: [
      {
        path: 'initial',
        name: 'Initial',
        component: () => import('@/views/content/initial/index'),
        meta: { title: '启动管理', icon: 'form' }
      },
      {
        path: 'ad',
        name: 'AD',
        component: () => import('@/views/content/ad/index'),
        meta: { title: '广告管理', icon: 'form' }
      },
      {
        path: 'picture',
        name: 'Picture',
        component: () => import('@/views/content/picture/index'),
        meta: { title: '轮播图管理', icon: 'form' }
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/content/file/index'),
        meta: { title: '文件管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/version',
    component: Layout,
    name: '版本',
    meta: { title: '版本', icon: 'form' },
    children: [
      {
        path: 'version',
        name: 'Version',
        component: () => import('@/views/version/index'),
        meta: { title: '版本管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/table',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
      roles: ['admin']
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
