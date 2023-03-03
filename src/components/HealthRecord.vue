<template>
  <div>

  <el-form :inline="true">
    <el-form-item>
      <el-button type="primary" @click="tag=true">修改</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
<el-table :data="table"
          :span-method="span"
          :header-cell-style="{textAlign: 'center', borderColor: 'black',fontSize:'18px',fontWeight:'bold',color: 'black'}"
          :cell-style="{textAlign: 'center', borderColor: 'black',fontSize:'16px',fontWeight:'bold',color:'black'}"
>
  <el-table-column prop="item1"></el-table-column>
  <el-table-column >
    <template slot-scope="scope">
      <el-select v-if="tag&&scope.$index===2" v-model="scope.row.item2" placeholder="请选择"  >
        <el-option
            v-for="item in Options"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <span v-else>{{scope.row.item2}}</span>
    </template>
  </el-table-column>
  <el-table-column >
    <template slot-scope="scope">
      <el-input v-if="tag&[4,5].includes(scope.$index)" v-model="scope.row.item3"></el-input>
      <span v-else>{{scope.row.item3}}</span>
    </template>
  </el-table-column>
  <el-table-column >
    <template slot-scope="scope">
      <el-input v-if="tag&[2,3].includes(scope.$index)" v-model="scope.row.item4"></el-input>
      <span v-else>{{scope.row.item4}}</span>
    </template>
  </el-table-column>
  <el-table-column prop="item5"></el-table-column>
  <el-table-column prop="item6"></el-table-column>
  <el-table-column >
    <template slot-scope="scope">
      <el-input v-if="tag&[2,3].includes(scope.$index)" v-model="scope.row.item7"></el-input>
      <span v-else>{{scope.row.item7}}</span>
    </template>
  </el-table-column>
  <el-table-column prop="item8"></el-table-column>
</el-table>
  </div>
</template>

<script>
export default {
  name: "HealthRecord",
  mounted() {

  },
  data(){
    return{
      Options:['已婚','未婚'],
      tag:false,
      table:[
        {item1:'姓名',item2:'',item3:'性别',item4:'',item5:'出生日期',item6:'',item7:'籍贯',item8:''},
        {item1:'联系电话',item2:'',item3:'学院',item4:'',item5:'班级',item6:'',item7:'民族',item8:''},
        {item1:'婚姻状况',item2:'',item3:'身份证号',item4:'',item5:'',item6:'家庭地址',item7:'',item8:''},
        {item1:'血型',item2:'',item3:'遗传病史',item4:'',item5:'',item6:'药物过敏史',item7:'',item8:''},
        {item1:'既往病史',item2:'常见疾病',item3:'',item4:'',item5:'',item6:'',item7:'',item8:''},
        {item1:'',item2:'其他',item3:'',item4:'',item5:'',item6:'',item7:'',item8:''},
      ]
    }
  },methods:{
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
      console.log(1)
    }
  }
}
</script>

<style scoped>
/deep/ .el-table__header {
  display: none;
}
</style>
