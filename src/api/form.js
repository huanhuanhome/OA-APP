/**
|--------------------------------------------------
|  form表单相关
|--------------------------------------------------
*/

import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 上传附件 - uploadFileAtt
|
| 使用场景:
|   |— 外出,请假,出差
|
| 传参:   无
|--------------------------------------------------
*/
export function uploadFileAtt(data) {
    return request({
        url: 'form/uploadFileAtt',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}
