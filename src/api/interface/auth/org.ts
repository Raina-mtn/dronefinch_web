import {defHttp} from "@/api/http";
// orgtree
export const apiGetOrgTree = (params?: any) => {
    return defHttp.post({
            url: "/sps/v1/organization/tree",
            params,
        }
    );
};

export const apiGetOrgList = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/organization/list",
            params,
        }
    );
};

export const apiDelOrg = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/organization/delete",
            params,
        }
    );
};

export const apiCreateOrg = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/organization/create",
            params,
        }
    );
};

export const apiUpdateOrg = (params: any) => {
    return defHttp.post({
            url: "/sps/v1/organization/update",
            params,
        }
    );
};