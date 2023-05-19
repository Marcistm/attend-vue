import Vue from 'vue'
import Vuex from 'vuex'
import user from "@/store/modules/user";
import permission from "@/store/modules/permission";
import axios from "axios";

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
 formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
},
        dialog:false,
        filter(condition,data){
            return data.filter( item => {
                return Object.keys( condition ).every( key => {
                    return String( item[ key ] ).toLowerCase().includes(
                        String( condition[ key ] ).trim().toLowerCase() )
                } )
            } )},
        table:[
            {role:0,item:[{name:'首页',id:'1'},{name:'请假',id:"2"},{name:'离校申请',id:'3'},{name:'返校申请',id:'4'},{name:'健康档案',id:'5'}, {name:'每日健康申报',id:'6'},{name:'上课签到',id:'19'},{name:'我的通知',id:'20'}]},
            {role:1,item:[{name:'首页',id:'8'},{name:'考勤统计',id:'9'},{name:'申请审批',id:'10'},{name:'考勤管理',id:'11'},{name:'通知管理',id:'12'}]},
            {role:2,item:[{name:'首页',id:'13'},{name:'通知管理',id:'15'},{name:'公告管理',id:'16'},{name:'用户管理',id:'17'},{name:'班级管理',id:'18'}]},
        ],
        tableData:[
            {name:'考勤管理',table: 'course',column:[{label:'id',name:'id',show:false},{label:'课程',name:'course',show:true},{label:'班级',name:'class',show:true}] },
            {name:'离校申请',table:'process',column:[{label:'发起时间',name:'time',show:true},{label:'当前状态',name:'condition',show:true},{label:'类型',name:'type',show:false},{label:'id',name:'id',show:false}]},
            {name:'返校申请',table:'process',column:[{label:'发起时间',name:'time',show:true},{label:'当前状态',name:'condition',show:true},{label:'id',name:'id',show:false}]},
            {name:'请假',table:'ask_for_leave',column:[{label:'发起时间',name:'time',show:true},{label:'当前状态',name:'condition',show:true},{label:'id',name:'id',show:false},{label:'理由',name:'reason',show:true},{label:'开始时间',name:'start_time'},{label:'结束时间',name:'end_time'}]},
            {name:'用户管理',table:'user_table',column:[{label:'id',name:'id',show:false},{label:'用户名',name:'username',show:true},{label:'姓名',name:'name',show:true},{label:'身份',name:'privilege',show:true}]},
            {name:'通知管理',table:'notice',column:[{label:'id',name:'id',show:false},{label:'时间',name:'time',show:true},{label:'内容',name:'text',show:true},{label:'课程',name:'course',show:true},{label:'发布人',name:'author',show:true}]},
            {name:'我的通知',table:'notice',column:[{label:'id',name:'id',show:false},{label:'时间',name:'time',show:true},{label:'内容',name:'text',show:true},{label:'发布人',name:'author',show:true}]},
            {name:'公告管理',table:'board',column:[{label:'id',name:'id',show:false},{label:'时间',name:'time',show:true},{label:'标题',name:'title',show:true},{label:'发布人',name:'author',show:true}]},
            {name:'审批项目管理',table:'item',column:[{label:'项目名称',name:'item'},{label:'使用状态',name:'condition'}]},
            {name:'申请审批',table:'ask_judge',column:[{label:'项目名称',name:'name'},{label: '发起人',name:'student'},{label:'发起时间',name:'time'}]},
            {name: '班级管理',table: 'class',column: [{label: 'id',name:'id',show:false},{label: '班级',name:'class',show:true},{label:'班主任',name:'name',show:true}]},
        ],
        data:[],
        stu_info:{}
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
