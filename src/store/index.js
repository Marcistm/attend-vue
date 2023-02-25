import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/modules/user";
import permission from "@/store/modules/permission";
import axios from "axios";

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
        table:[
            {role:0,item:[{name:'首页',id:'1'},{name:'请假',id:"2"},{name:'离校申请',id:'3'},{name:'返校申请',id:'4'},{name:'健康档案',id:'5'}, {name:'每日健康申报',id:'6'},{name:'核酸记录',id:'7'}]},
            {role:1,item:[{name:'首页',id:'8'},{name:'考勤统计',id:'9'},{name:'申请审批',id:'10'},{name:'发起考勤',id:'11'},{name:'通知管理',id:'12'}]},
            {role:2,item:[{name:'首页',id:'13'},{name:'审批项目管理',id:'14'},{name:'通知管理',id:'15'},{name:'公告管理',id:'16'},{name:'学生用户管理',id:'17'},{name:'教师用户管理',id:'18'}]},
        ],
        tableData:[
            {name:'请假',table:'ask_for_leave',column:[{label:'发起时间',name:'time'},{label:'当前状态',name:'condition'}]},
            {name:'学生用户管理',table:'student',column:[{label:'用户名',name:'username'},{label:'姓名',name:'name'},{label:'班级',name:'class'}]},
            {name:'通知管理',table:'notice',column:[{label:'时间',name:'time'},{label:'内容',name:'text'}]},
            {name:'教师用户管理',table:'teacher',column:[{label:'用户名',name:'username'},{label:'姓名',name:'name'}]},
            {name:'公告管理',table:'board',column:[{label:'时间',name:'time'},{label:'内容',name:'text'}]},
        ],
        data:[]

    },
    actions:{

            getData(context, payload) {
                let t = context.state.filter({ name: payload.name }, context.state.tableData)
                let sql = 'select a.'
                sql = sql + t[0].column.map(function (t) { return t.name; }).join(',a.');
                sql = sql + ' from ' + t[0].table + ' a'
                let path='http://43.143.116.236:5001/get/data'
                axios.get(path, { params: { sql: sql } }).then(res => {
                    context.commit('SET_TABLE_DATA', res.data.data)
                })
            }

    },
        // modules,
    modules: {
        user,
        permission
    },
    getters:{
        roles: state => state.user.roles,
        token: state => state.user.token,
    },
    mutations: {
        SET_TABLE_DATA(state, tableData) {
            state.data = tableData
        }
    }

})

export default store
