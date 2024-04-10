import {defHttp} from "@/api/http";
// role
export const apiGetRoleList = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/role/list",
            params,
        }
    );
};

export const apiUpdateRole = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/role/update",
            params,
        }
    );
};

export const apiDelRole = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/role/delete",
            params,
        }
    );
};

export const apiCreateRole = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/role/create",
            params,
        }
    );
};
export const apiAssignRole = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/role/assign",
            params,
        }
    );
};