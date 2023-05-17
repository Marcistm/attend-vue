<template>
  <div>
  <el-form  :model="table" :rules="rules" ref="table" style="width: 60%">
    <el-form-item label="学号" >
      {{table.username}}
    </el-form-item>
    <el-form-item label="姓名" >
      {{table.name}}
    </el-form-item>
    <el-form-item label="理由" prop="reason">
      <el-input v-if="tag" autosize v-model="table.reason"></el-input>
      <span v-else>{{table.reason}}</span>
    </el-form-item>
    <el-form-item label="请假日期" prop="date" >
      <el-date-picker
          :disabled="!tag"
          v-model="table.date"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="附件">
<file-upload ref="files" type="请假" :original_id="id" :disabled="tag"></file-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="success" v-if="data.length===0" @click="submit">提交</el-button>
      <el-button type="success" v-if="tag&data.length!==0" @click="update">更新</el-button>
    </el-form-item>
  </el-form>
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

import FileUpload from "@/components/FileUpload";
export default {
  name: "AskForLeave",
  components: {FileUpload},
  props:{
    id:Number,
    see_data:Array
  },

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
      id:'',
      dialog:false,
      table:{
        date:[],
        username:'',
        name:'',
        reason:'',
      },
      data:[],
      tag:false,
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
    update(){
      let path='http://43.143.116.236:5001/ask_for_leave/update' // update path
      const formData = new FormData();
      formData.append('id',this.id)
      formData.append('reason',this.table.reason)
      formData.append('start_time',formatTime(this.table.date[0]))
      formData.append('end_time',formatTime(this.table.date[1]))
      let old_file=[]
      this.$refs.files.fileList.forEach(item=>{
        if (item.status==='success'){
          old_file.push(item.url)
        }else {
          formData.append('file',item.raw)
        }
      })
      formData.append('old_file',JSON.stringify(old_file))
      axios.post(path,formData).then(res=>{ // use post method to update data
        if (res.data.code===200){
          this.$message.success('更新成功')
          this.dialog=false
          this.get_data()
        }
      })
    },
    update_load(id,option){
      if (option==='update'){
        this.tag=true
      }else {
        this.tag=false
      }
      let path='http://43.143.116.236:5001/ask_for_leave/preview'
      let parmas={
        id:id
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.fileList=[]
        this.id=id
        this.dialog=true
        this.table.username=localStorage.getItem('username')
        this.table.name=localStorage.getItem('name')
        this.table.reason=res.data.data[0].reason
        this.table.date[0]=formatTime(res.data.data[0].start_time)
        this.table.date[1]=formatTime(res.data.data[0].end_time)
        res.data.data.forEach(item=>{
          let fileObj = {
            uid: Math.random(),
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
        let path='http://43.143.116.236:5001/ask_for_leave/delete'
        let parmas={
          id:id
        }
        axios.post(path,parmas).then(res=>{
          if (res.data.code===200){
            this.$message.success('删除成功')
            this.get_data()
          }
        })
        console.log(this.fileList)
      }).catch(() => {
        // 用户点击取消按钮，不执行删除操作
      })

    },
    get_data(){
      return new Promise((resolve, reject) => {
        let name = '请假'
        this.$store.dispatch('getData', {name})
      })
    },
    open(){
      if (this.data.length>0){
        this.$message.error('已经申请,不能再次申请')
        return
      }
      this.table.username=localStorage.getItem('username')
      this.table.name=localStorage.getItem('name')
      this.dialog=true
      this.tag=true
    },
    submit() {
      if (this.data.length>0){
        this.$message.error('已经提交过一次请假,无法再次提交请假单')
        return
      }
      this.$refs['table'].validate((valid) => {
        if (valid){
          const formData = new FormData();
          this.$refs.files.fileList.forEach(item=>{
              formData.append('file',item.raw)
          })
          formData.append('username',this.table.username)
          formData.append('name',this.table.name)
          formData.append('reason',this.table.reason)
          formData.append('start_time',formatTime(this.table.date[0]))
          formData.append('end_time',formatTime(this.table.date[1]))
          axios.post('http://43.143.116.236:5001/ask_for_leave/add', formData)
              .then((res) => {
                if (res.data.code===200){
                  this.$message.success('提交成功')
                }else {
                  this.$message.error('提交失败')
                }
                this.dialog=false
                this.table.reason=''
                this.table.date=[]
                this.get_data()
              })
              .catch((error) => {
                console.error(error);
              });
        }else{
          return false;
        }
     })
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
    },
    see_data: {
      handler: function(newVal) {
        this.table=newVal[0]
      },
      deep: true
    }
  },

}
</script>

<style scoped>

</style>
