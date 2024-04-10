import { defHttp } from "@/api/http";
export const apiDelDictionary= (params: any) => {
    return defHttp.post({
        url: "/menu/delete",
        params,
    }
    );
};
export const apiGetDictionaryList = (params: any) => {
    return defHttp.post({
        url: "/menu/list",
        params,
    }
    );
};
export const apiDelDictionaryItem= (params: any) => {
    return defHttp.post({
        url: "/menu/delete",
        params,
    }
    );
};
export const apiGetDictionaryItemList = (params: any) => {
    return defHttp.post({
        url: "/menu/list",
        params,
    }
    );
};