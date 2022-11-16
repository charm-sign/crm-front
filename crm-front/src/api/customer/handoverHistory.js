import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页条件查询客户信息列表
    list(pageNo, pageSize, customerHandoverQuery) {
        return request({
            url: `custService/handover/list/${pageNo}/${pageSize}`,
            method: 'post',
            data: customerHandoverQuery
        })
    },
    //添加移交记录
    add(handoverForm) {
        return request({
            url: `custService/handover/add`,
            method: 'post',
            data: handoverForm
        })
    },
}