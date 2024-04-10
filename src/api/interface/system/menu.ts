import { defHttp } from "@/api/http";
export const apiDelMenu = (params: any) => {
    return defHttp.post({
        url: "/menu/delete",
        params,
    }
    );
};
export const apiGetMenuList = (params: any) => {
    return defHttp.post({
        url: "/menu/list",
        params,
    }
    );
};