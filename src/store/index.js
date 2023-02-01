import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/modules/user";

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//     // set './app.js' => 'app'
//     const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//     const value = modulesFiles(modulePath)
//     modules[moduleName] = value.default
//     return modules
// }, {})


const store = new Vuex.Store({
    state:{
        filter(condition,data){
            return data.filter( item => {
                return Object.keys( condition ).every( key => {
                    return String( item[ key ] ).toLowerCase().includes(
                        String( condition[ key ] ).trim().toLowerCase() )
                } )
            } )},
        table:[{role:0,item:[{name:'首页',id:'1'},{name:'请假',id:"2"},{name:'离校申请',id:'3'},{name:'返校申请',id:'4'},{name:'健康档案',id:'5'},
                {name:'每日健康申报',id:'6'},{name:'核酸记录',id:'7'}]},
            {role:1,item:[{name:'首页',id:'1'},{name:'考勤统计',id:'2'},{name:'申请审批',id:'3'},{name:'发起考勤',id:'4'}]},
            {role:2,item:[{name:'首页',id:'1'},{name:'审批项目管理',id:'2'},{name:'通知管理',id:'3'},{name:'公告管理',id:'4'},{name:'用户导入',id:'5'}]},
        ],
        tableData:[
            {name:'请假',table:'ask_for_leave',column:[{label:'发起时间',name:'time'},{label:'当前状态',name:'condition'}]}
        ]

    },
        // modules,
    modules: {
        user,
    },
    getters:{
        roles: state => state.user.roles,
    }
})

export default store
