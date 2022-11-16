import request from '@/utils/request'   //封装了axios
export default {    //写法，不用每次写方法都导出
    //分页条件查询字典列表
    list(pageNo, pageSize, dictQuery) {
        return request({
            url: `sysService/dictionary/conditionList/${pageNo}/${pageSize}`,
            method: 'post',
            data: dictQuery
        })
    },

    // 根据id查询
    getInfo(id) {
        return request({
            url: `sysService/dictionary/getInfoById/${id}`,
            method: 'get',
        })
    },
    //修改字典
    update(dictionaryForm) {
        return request({
            url: `sysService/dictionary/update`,
            method: 'post',
            data: dictionaryForm
        })
    },
//添加字典
    add(dictionaryForm) {
        return request({
            url: `sysService/dictionary/add`,
            method: 'post',
            data: dictionaryForm
        })
    },
    //根据id查询字典明细
    getDetail(id) { 
        return request({
            url: `sysService/dictionary/getDetail/${id}`,
            method: 'get'
        })
    },
        // ===============明细表======================
    // 查询字典明细
    detailList() {
        return request({
            url: `sysService/dictionary/detailList`,
            method: 'get'
        })
    },

    //添加字典明细
    addDetail(parentId,detailForm) { 
        return request({
            url: `sysService/dictionaryDetails/add/${parentId}`,
            method: 'post',
            data: detailForm
        })

    },
    //查询字典明细明细
    getInfoById(id) { 
        return request({
            url: `sysService/dictionaryDetails/getInfoById/${id}`,
            method: 'get'
        })
    },
    //修改字典明细明细
    updateDetail(detailForm) { 
        return request({
            url: `sysService/dictionaryDetails/update`,
            method: 'post',
            data: detailForm
        })
    }

}