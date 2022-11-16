import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页查询权限列表
    list(pageNo, pageSize) {
        return request({
            url: `sysService/permission/list/${pageNo}/${pageSize}`,
            method: 'get',
        })
    },
   //删除权限
    delete(id) {
        return request({
            url: `sysService/permission/delete/${id}`,
            method: 'delete',
        })
    },
    //查询权限列表
    getPermissionList() {
        return request({
            url: `sysService/permission/getPermissionList`,
            method: 'get',
        })
    },
    
}