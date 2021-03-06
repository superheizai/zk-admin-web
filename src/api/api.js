import axios from 'axios';


var normalAxios = axios.create();


let base = '';
let backend = process.env.BACKEEND;
// let backend = 'http://127.0.0.1:8080';
// let backend = 'http://10.9.20.161:8080';

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {params: params});
};

export const getUserListPage = params => {
    return axios.get(`${base}/user/listpage`, {params: params});
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {params: params});
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params});
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {params: params});
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, {params: params});
};

export const firstRows = params => {
    return axios.get(`${base}/firstRows`, {params: params});
};


export const secondRows = params => {
    return axios.get(`${base}/secondRows`, {params: params});
};


export const trees = params => {
    return normalAxios.get(`${backend}/api/zk/cluster/${params.name}`, {params: params});
};


export const addZk = params => {
    return normalAxios.post(`${backend}/api/zks/createZk`, params);
};
export const updateZk = params => {
    return normalAxios.post(`${backend}/api/zks/updateZk`, params);
};
export const deleteZk = params => {
    return normalAxios.post(`${backend}/api/zks/deleteZk`, params);

};
export const listZks = params => {
    return normalAxios.get(`${backend}/api/zks`, {params: params});
};

export const addZkNode = params => {
    return normalAxios.post(`${backend}/api/zks/createZkNode`, params);
};
export const updateZkNode = params => {
    return normalAxios.post(`${backend}/api/zks/updateZkNode`, params);
};
export const deleteZkNode = params => {
    return normalAxios.post(`${backend}/api/zks/deleteZkNode`, params);

};