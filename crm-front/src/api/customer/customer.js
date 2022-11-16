import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页条件查询客户信息列表
    list(pageNo, pageSize,customerQuery) {
        return request({
            url: `custService/customer/list/${pageNo}/${pageSize}`,
            method: 'post',
            data:customerQuery
        })
    },
    //添加客户
    add(customerForm) { 
        return request({
            url: `custService/customer/add`,
            method: 'post',
            data: customerForm,
            
        })  
    },
    //查询客户信息
    getInfoById(id) { 
        return request({
            url: `custService/customer/getInfoById/${id}`,
            method: 'get',
          
            
        })  
    },
    //修改客户
    update(customerForm) {
        return request({
            url: `custService/customer/update`,
            method: 'post',
            data: customerForm,

        })
    },
    //统计分析
    statistical(pageNo,pageSize,queryForm) {
        return request({
            url: `sysService/statistical/statistical/${pageNo}/${pageSize}`,
            method: 'post',
            data: queryForm,

        })
    },
    //查询所有的客户，按状态分组，且返回当前账号信息
    getAllCustomerStatus() {
        return request({
            url: `sysService/statistical/getAllCustomerStatus`,
            method: 'get'
        })
    },
    //查询当前用户负责的客户
    getCustById() {
        return request({
            url: `custService/customer/getCustById`,
            method: 'get'
        })
    },
    
}