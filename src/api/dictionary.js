/**
|--------------------------------------------------
| 数据字典接口
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 获取数字字典信息 - judgeCurrentUserOrgLevelSpecialType
|
| 使用场景:
|   |— app模块 @/common/app.js
|
| 传参:   无
|--------------------------------------------------
*/
export async function fetchAllDictionaryMap() {
    const mapCfg = await request({
        url: 'dictionary/getDesignatedDics',
        method: 'POST',
        data: []
    })
    return mapCfg.mappingCfg
}

