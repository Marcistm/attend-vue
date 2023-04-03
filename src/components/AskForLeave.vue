<template>
  <div>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="open">新增</el-button>
      </el-form-item>
    </el-form>
  <el-table :data="data">
    <el-table-column label="发起时间" prop="time"></el-table-column>
    <el-table-column label="理由" prop="reason"></el-table-column>
    <el-table-column label="开始时间" prop="start_time"></el-table-column>
    <el-table-column label="结束时间" prop="end_time"></el-table-column>
<el-table-column label="状态">
  <template slot-scope="scope">
    <span v-if="scope.row.condition===0">审核中</span>
    <span v-if="scope.row.condition===-1">拒绝</span>
    <span v-if="scope.row.condition===1">通过</span>
  </template>
</el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary">查看详情</el-button>
        <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        <el-button type="success" v-if="scope.row.condition===0" @click="update(scope.row.id)" :disabled="scope.row.condition!==0">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
<el-dialog :visible.sync="dialog">
  <el-form  :model="table" :rules="rules" ref="table">
    <el-form-item label="学号" >
      {{table.username}}
    </el-form-item>
    <el-form-item label="姓名" >
      {{table.name}}
    </el-form-item>
    <el-form-item label="理由" prop="reason">
      <el-input autosize v-model="table.reason"></el-input>
    </el-form-item>
    <el-form-item label="请假日期" prop="date" >
      <el-date-picker
          v-model="table.date"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="附件">
      <el-upload
          ref="upload"
          :auto-upload="false"
          multiple
          :action="'http://43.143.116.236:5001/ask_for_leave/add'"
          :file-list="fileList"
          :on-preview="previewFile"
          :on-change="handleChange"
          :on-remove="handleRemove"
          show-file-list
      >
        <el-button type="primary">选取</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>

</el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {MessageBox} from "element-ui";
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export default {
  name: "AskForLeave",
  data(){
    return{
      pickerOptions: {
        disabledDate(time) {
          // 获取今天的日期
          const today = new Date();
          // 将今天的时间设置为 00:00:00
          today.setHours(0, 0, 0, 0);
          // 禁用今天之前的所有日期
          return time.getTime() < today.getTime();
        },
      },

      dialog:false,
      table:{
        date:[],
        username:'',
        name:'',
        reason:'',
      },
      data:[],
      fileList:[],
      rules: {
        reason: [
          { required: true, message: '请填写理由', trigger: 'blur' }
        ],
        date: [
          { type: 'array', required: true, message: '请选择请假日期', trigger: 'change' }
        ]
      }
    }
  },
  methods:{
    update(id){
      let path='http://127.0.0.1:5001/ask_for_leave/preview'
      let parmas={
        id:id
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.fileList=[]
        this.dialog=true
        this.table.username=localStorage.getItem('username')
        this.table.name=localStorage.getItem('name')
        this.table.reason=res.data.data[0].reason
        this.table.date[0]=formatTime(res.data.data[0].start_time)
        this.table.date[1]=formatTime(res.data.data[0].end_time)
        res.data.data.forEach(item=>{
          let fileObj = {
            uid: Date.now(),
            name: item['file_name'],
            url: item['file_url']
          }
          this.fileList.push(fileObj)
        })
      })
    },
    handleDelete(id) {
      MessageBox.confirm('确定要删除该请假条吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击确定按钮，继续执行删除操作
        let path='http://127.0.0.1:5001/ask_for_leave/delete'
        let parmas={
          id:id
        }
        axios.post(path,parmas).then(res=>{
          if (res.data.code===200){
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
        // 用户点击取消按钮，不执行删除操作
      })
      this.get_data()
    },
    get_data(){
      let name='请假'
      this.$store.dispatch('getData', {name})
    },
    open(){
      if (this.data.length>0){
        this.$message.error('已经申请,不能再次申请')
        return
      }
      this.table.username=localStorage.getItem('username')
      this.table.name=localStorage.getItem('name')
      this.dialog=true
    },
    handleRemove(file, fileList) {
      this.fileList=fileList
    },
    handleChange(file, fileList) {
     this.fileList=fileList
    },
    submit() {
      if (this.data.length>0){
        this.$message.error('已经提交过一次请假,无法再次提交请假单')
        return
      }
      this.$refs['table'].validate((valid) => {
        if (valid){
          const formData = new FormData();
          for (let i = 0; i < this.fileList.length; i++) {
            formData.append('file', this.fileList[i].raw)
          }
          formData.append('username',this.table.username)
          formData.append('name',this.table.name)
          formData.append('reason',this.table.reason)
          formData.append('start_time',formatTime(this.table.date[0]))
          formData.append('end_time',formatTime(this.table.date[1]))
          axios.post('http://127.0.0.1:5001/ask_for_leave/add', formData)
              .then((res) => {
                if (res.data.code===200){
                  this.$message.success('提交成功')
                }else {
                  this.$message.error('提交失败')
                }
                this.dialog=false
                this.table.reason=''
                this.table.date=[]
                this.fileList=[]
                this.get_data()
                // todo: 处理响应结果
              })
              .catch((error) => {
                console.error(error);
              });
        }else{
          return false;
        }
     })
    },

    previewFile(file) {

      const url = URL.createObjectURL(file.raw);
      window.open(url);
    },

  },
  mounted() {
   this.get_data()

  },
  watch: {
    '$store.state.data': function(newVal) {
      this.data = newVal;
      this.data.forEach(item => {
        item['start_time'] = formatTime(item['start_time']);
        item['time'] = formatTime(item['time']);
        item['end_time'] = formatTime(item['end_time']);
      });
    }
  },

}
</script>

<style scoped>

</style>
