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
    redirect: '/crm',
    children: [{
      path: 'crm',
      name: 'Crm',
      component: () => import('@/views/personal/index'),
      meta: { title : '客户关系管理系统', icon: 'guide' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/personal',
    children: [{
      path: 'personal',
      name: 'Personal',
      component: () => import('@/views/personal/index'),
      meta: { title: '个人中心', icon: 'dashboard' }
    }]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'System',
    meta: { title: '系统设置', icon: 'international' },
    children: [
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理' }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index'),
        meta: { title: '权限管理' }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/system/department/index'),
        meta: { title: '部门管理' }
      },
      {
        path: 'employee',
        name: 'Employee',
        component: () => import('@/views/system/employee/index'),
        meta: { title: '员工管理' }
      },
      {
        path: 'dictionaryl',
        name: 'Dictionaryl',
        component: () => import('@/views/system/dictionary/list'),
        meta: { title: '字典列表' }
      },
      {
        path: 'dictionaryd',
        name: 'Dictionaryd',
        component: () => import('@/views/system/dictionary/details'),
        meta: { title: '字典明细' }
      },
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/table',
    name: 'Customer',
    meta: { title: '客户管理', icon: 'peoples' },
    children: [
      {
        path: 'potential',
        name: 'Potential',
        component: () => import('@/views/customer/potential'),
        meta: { title: '潜在客户管理' }
      },
      {
        path: 'official',
        name: 'Official',
        component: () => import('@/views/customer/official'),
        meta: { title: '正式客户管理' }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/customer/resource'),
        meta: { title: '客户资源池' }
      },
      {
        path: 'followHistory',
        name: 'FollowHistory',
        component: () => import('@/views/customer/followHistory'),
        meta: { title: '跟进历史' }
      },
      {
        path: 'handoverHistory',
        name: 'HandoverHistory',
        component: () => import('@/views/customer/handoverHistory'),
        meta: { title: '移交历史' }
      },
    ]
  },


  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计分析', icon: 'chart' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [


  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://gitee.com/charmsign/crm-front',
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
