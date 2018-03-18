import Mock from 'mockjs';

const LoginUsers = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: '../../../assets/user.jpg',
        name: '管理员'
    }
];

const Users = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}


const Trees = [{
    name: "t1", leaf: true, data: 123
}, {
    name: "t2", data: "ljg"
}, {
    name: "t3", data: "douyanshan"
}]

const Rows = [{
    id: '1',
    code: '0001',
    name: '测试数据1',
    status: '启用',
    remark: '测试数据测试数据',
    _checked: true
}, {
    id: '2',
    code: '0002',
    name: '测试数据2',
    status: '启用',
    load: true,
    remark: '测试数据测试数据',
    children: [{
        id: '01',
        code: '00001',
        name: '测试数据01',
        status: '启用',
        remark: '测试数据测试数据',
    }, {
        id: '02',
        code: '00002',
        name: '测试数据02',
        status: '启用',
        remark: '测试数据测试数据',
    }]
}, {
    id: '3',
    code: '0003',
    name: '测试数据3',
    status: '启用',
    load: false,
    remark: '测试数据测试数据',
    children: [{
        id: '05',
        code: '00001',
        name: '测试数据01',
        status: '启用',
        remark: '测试数据测试数据',
    }, {
        id: '06',
        code: '00002',
        name: '测试数据02',
        status: '启用',
        remark: '测试数据测试数据',
    }]
}, {
    id: '4',
    code: '0004',
    name: '测试数据4',
    status: '启用',
    remark: '测试数据测试数据'
}];


export {LoginUsers, Users, Rows, Trees};

