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

}