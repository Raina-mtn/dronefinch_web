import {defHttp} from "@/api/http";
export const apiGetLog = (params: object) => {
    return defHttp.post({
        url: '/system/access-log',
        params,
    });
};