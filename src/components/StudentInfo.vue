<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box-title">
        基本信息填写
      </div>
      <div class="login-box-from">
        <el-table :data="table"
                  :span-method="span"
                  :header-cell-style="{textAlign: 'center', borderColor: 'black',fontSize:'18px',fontWeight:'bold',color: 'black'}"
                  :cell-style="{textAlign: 'center', borderColor: 'black',fontSize:'16px',fontWeight:'bold',color:'black'}"
        >
          <el-table-column prop="item1"></el-table-column>
          <el-table-column >
            <template slot-scope="scope">
              <el-select v-if="scope.$index===2" v-model="scope.row.item2" placeholder="请选择"  >
                <el-option
                    v-for="item in Options"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
              <el-select v-if="scope.$index===3" v-model="scope.row.item2" placeholder="请选择"  >
                <el-option
                    v-for="item in blood"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
              <el-input v-if="scope.$index===1" v-model="scope.row.item2"></el-input>
              <span v-if="[0,4,5].includes(scope.$index)">{{scope.row.item2}}</span>
            </template>
          </el-table-column>
          <el-table-column >
            <template slot-scope="scope">
              <el-input v-if="[4,5].includes(scope.$index)" v-model="scope.row.item3"></el-input>
              <span v-else>{{scope.row.item3}}</span>
            </template>
          </el-table-column>
          <el-table-column >
            <template slot-scope="scope">
              <el-select v-if="scope.$index===0" v-model="scope.row.item4">
                <el-option v-for="i in sex" :label="i" :key="i" :value="i"></el-option>
              </el-select>
              <el-select v-if="scope.$index===1" v-model="scope.row.item4">
                <el-option v-for="i in college" :label="i" :key="i" :value="i"></el-option>
              </el-select>
              <el-input v-if="[2,3].includes(scope.$index)" v-model="scope.row.item4"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="item5"></el-table-column>
          <el-table-column prop="item6">
            <template slot-scope="scope">
              <el-date-picker v-if="scope.$index===0" v-model="scope.row.item6"></el-date-picker>
              <el-select v-if="scope.$index===1" v-model="scope.row.item6">
                <el-option v-for="i in class_options" :label="i.class" :key="i.class" :value="i.class"></el-option>
              </el-select>
              <span v-if="[2,3].includes(scope.$index)">{{scope.row.item6}}</span>
            </template>
          </el-table-column>
          <el-table-column >
            <template slot-scope="scope">
              <el-input v-if="[2,3].includes(scope.$index)" v-model="scope.row.item7"></el-input>
              <span v-else>{{scope.row.item7}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="item8">
            <template slot-scope="scope">
              <el-input v-if="[0,1].includes(scope.$index)" v-model="scope.row.item8"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 5px" @click="save">提交</el-button>
      </div>

    </div>

  </div>

</template>

<script>
import axios from "axios";
import {getUser, getUserName} from "@/utils/auth";

export default {
  name: "StudentInfo",
  data(){
    return{
      blood:['A','B','AB','O'],
      class_options:[],
      college:['金融贸易学院','管理学院','国际学院','传媒与设计艺术学院','信息学院'],
      sex:['男','女'],
      Options:['已婚','未婚'],
      table:[
        {item1:'姓名',item2:'',item3:'性别',item4:'',item5:'出生日期',item6:'',item7:'籍贯',item8:''},
        {item1:'联系电话',item2:'',item3:'学院',item4:'',item5:'班级',item6:'',item7:'民族',item8:''},
        {item1:'婚姻状况',item2:'',item3:'身份证号',item4:'',item5:'',item6:'家庭地址',item7:'',item8:''},
        {item1:'血型',item2:'',item3:'遗传病史',item4:'',item5:'',item6:'药物过敏史',item7:'',item8:''},
        {item1:'既往病史',item2:'常见疾病',item3:'',item4:'',item5:'',item6:'',item7:'',item8:''},
        {item1:'',item2:'其他',item3:'',item4:'',item5:'',item6:'',item7:'',item8:''},
      ]
    }
  },

  mounted() {
    this.table[0].item2=getUserName()
    this.getClass()
  },
  methods:{
    getClass(){
      let path='http://127.0.0.1:5001/class/get'
      axios.get(path).then(res=>{
        this.class_options=res.data.data
      })
    },
    span({row, column, rowIndex, columnIndex}){
      if ([2,3].includes(rowIndex)){
        if ([3,6].includes(columnIndex)){
          return{
            rowspan: 1,
            colspan: 2
          }
        }
        if ([4,7].includes(columnIndex)){
          return{
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex===0){
        if (rowIndex==4){
          return{
            rowspan: 2,
            colspan: 1
          }
        }
        if (rowIndex===5){
          return{
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if ([4,5].includes(rowIndex)){
        if (columnIndex>1){
          if (columnIndex===2){
            return {
              rowspan: 1,
              colspan: 6
            }
          }else {
            return{
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

    },
    save(){
      let path='http://127.0.0.1:5001/student_info/submit'
      let params={}
      params['username']=localStorage.getItem('username')
      params['name']=this.table[0].item2
      params['sex']=this.table[0].item4
      params['class']=this.table[1].item6
      params['birthday']=this.table[0].item6
      params['native_place']=this.table[0].item8
      params['telephone']=this.table[1].item2
      params['college']=this.table[1].item4
      params['nation']=this.table[1].item8
      params['identity_num']=this.table[2].item4
      params['blood']=this.table[3].item2
      params['is_marriage']=this.table[2].item2
      params['address']=this.table[2].item7
      params['genetic_history']=this.table[3].item4
      params['drug_allergy_history']=this.table[3].item7
      params['common_disease']=this.table[4].item3
      params['else_disease']=this.table[5].item3
      axios.post(path,params).then(res=>{
        if(res.data.code===200){
          this.$message.success('提交成功')
          this.$router.push({
            path: this.$route.query.redirect || '/home'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../public/background.png") no-repeat;
  background-size: 100% 100%;
}
.login-box{
  width: 1200px;
  /* height: 287px; */
  background: hsla(0,0%,100%,.3);
  border-radius: 5px;
  box-shadow: 0 0 2px #f7f7f7;
  border: 1px solid #f7f7f7;
}
.login-box-title{
  line-height: 50px;
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}
.login-box-from{
  width: 100%;
  height: auto;
  padding: 30px;
  box-sizing: border-box;
}
</style>
