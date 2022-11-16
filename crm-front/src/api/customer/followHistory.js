import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页条件查询客户信息列表
    list(pageNo, pageSize,customerHistoryQuery) {
        return request({
            url: `custService/history/list/${pageNo}/${pageSize}`,
            method: 'post',
            data: customerHistoryQuery
        })
    },
    //添加跟进历史
    add(followUpForm) {
        return request({
            url: `custService/history/add`,
            method: 'post',
            data: followUpForm
        })
    },
    //根据id查询跟进历史的明细
    getDetailById(id) {
        return request({
            url: `custService/history/getDetailById/${id}`,
            method: 'get',
            
        })
    }, 
    //修改跟进历史
    update(followUpForm) {
        return request({
            url: `custService/history/update`,
            method: 'post',
            data: followUpForm

        })
    },
}