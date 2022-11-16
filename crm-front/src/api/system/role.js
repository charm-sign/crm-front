import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页查询角色列表
    list(pageNo, pageSize) {
        return request({
            url: `sysService/role/list/${pageNo}/${pageSize}`,
            method: 'get',
        })
    },
    //新增角色
    add(roleForm, permissionIds) {
        return request({
            url: `sysService/role/add?${permissionIds}`,
            method: 'post',
            data: roleForm


        })
    },
    //删除角色
    delete(id) {
        return request({
            url: `sysService/role/delete/${id}`,
            method: 'delete',
        })
    },
    // 根据id获取角色信息
    getInfoById(id) {
        return request({
            url: `sysService/role/getInfoById/${id}`,
            method: 'get',
        })
    },
    //修改角色
    update(roleForm, permissionIds) {
        return request({
            url: `sysService/role/update?${permissionIds}`,
            method: 'post',
            data: roleForm
        })
    },

    // 查询角色列表
    getRoleList() {
        return request({
            url: `sysService/role/getRoleList`,
            method: 'get',
        })
    },
}