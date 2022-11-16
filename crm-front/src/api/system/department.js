import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页查询部门列表
    list(pageNo, pageSize) {
        return request({
            url: `sysService/department/list/${pageNo}/${pageSize}`,
            method: 'get',
        })
    },
    //新增部门
    add(departmentForm) {
        return request({
            url: `sysService/department/add`,
            method: 'post',
            data: departmentForm
        })
    },
    //删除部门
    delete(id) {
        return request({
            url: `sysService/department/delete/${id}`,
            method: 'delete',
        })
    },
    // 根据id查询
    getInfoById(id) {
        return request({
            url: `sysService/department/getInfoById/${id}`,
            method: 'get',
        })
    },
    //修改部门
    update(departmentForm) { 
        return request({
            url: `sysService/department/update`,
            method: 'post',
            data: departmentForm
        }) 
    },
        //查询部门列表
    lists() {
        return request({
            url: `sysService/department/lists`,
            method: 'get',
            
        })
    }
}