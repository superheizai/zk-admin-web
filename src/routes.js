import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import zks from './views/zookeeper/Zks.vue'


let routes = [
        {
            path: '/login',
            component: Login,
            name: '',
            hidden: true
        },
        {
            path: '/404',
            component: NotFound,
            name: '',
            hidden: true
        },
        //{ path: '/main', component: Main },
        {
            path: '/',
            component: Home,
            name: 'ZooKeeper',
            iconCls: 'el-icon-message',//图标样式class
            children: [

                {path: '/zklist', component: zks, name: 'zookeeper集群'},

            ]
        },
        {
            path: '*',
            hidden:
                true,
            redirect:
                {
                    path: '/404'
                }
        }
    ]
;

export default routes;