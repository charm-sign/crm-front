import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //查询员工列表
    conditionList(pageNo, pageSize, employeeQuery) {
        return request({
            url: `sysService/employee/conditionList/${pageNo}/${pageSize}`,
            method: 'post',
            data: employeeQuery
        })
    },
    //删除员工
    delete(id) {
        return request({
            url: `sysService/employee/delete/${id}`,
            method: 'delete',

        })
    },
    //添加员工
    add(employeeForm, roleIds) {
        return request({
            url: `sysService/employee/add?${roleIds}`,
            method: 'post',
            data: employeeForm


        })
    },
    //根据id获取员工信息
    getInfoById(employeeId) {
        return request({
            url: `sysService/employee/getInfoById/${employeeId}`,
            method: 'get',
        })
    },
    //修改员工
    update(employeeForm, roleIds) {
        return request({
            url: `sysService/employee/update?${roleIds}`,
            method: 'post',
            data: employeeForm
        })
    },
    //批量删除选中的记录
    deletedBatch(multipleSelection) {
        return request({
            url: `sysService/employee/deletedBatch?${multipleSelection}`,
            method: 'post',

        })
    },
    //此方法不可用
    exportExcel(multipleSelection) {
        return request({
            url: `sysService/employee/exportExcel?${multipleSelection}`,
            method: 'get',
             headers: {
                Accept: "application/json, text/plain, */*, application/octet-stream",
                "Content-Type": "application/json;charset=UTF-8"
            },
            responseType: 'arraybuffer',

        })
    },
    //导入文件
    uploadExcel(file) { 
        return request({
            url: `sysService/employee/uploadExcel`,
            method: 'post',
           data:file
        })
    },
    //查询所有客户
    getEmployee() {
        return request({
            url: `sysService/employee/getEmployee`,
            method: 'get',
            
        })
    },
}