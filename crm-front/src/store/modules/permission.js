import { asyncRoutes, constantRoutes } from '@/router'
// import { getPermissionList } from '@/api/system/permission'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes: async function({ commit }, roles) {
    return new Promise(resolve => {
      // 定义变量，用来存放路由表
      let accessedRoutes
      if (roles.includes('admin')) {   //判断当前角色列表，是否包含admin，超级管理员，所有路由都可访问
        accessedRoutes = asyncRoutes || []    //返回自己的异步路由，路由表里 将其改造为从数据库获取（关键点）
      } else {
        //根据角色过滤
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })

    // 从后台请求所有的路由信息
    // let res =await getPermissionList()
    // let myasyncRoutes = res.data.list
    //   // 定义变量，用来存放路由表
    //   let accessedRoutes
    //   if (roles.includes('admin')) {   //判断当前角色列表，是否包含admin，超级管理员，所有路由都可访问
    //     accessedRoutes = myasyncRoutes || []    //返回自己的异步路由，路由表里 将其改造为从数据库获取（关键点）
    //   } else {
    //     //根据角色过滤
    //     accessedRoutes = filterAsyncRoutes(myasyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(myasyncRoutes)
  
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
