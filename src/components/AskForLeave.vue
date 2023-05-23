<template>
  <div>
  <el-form  :model="table"  ref="table" style="width: 60%">
    <el-form-item label="学号" >
      {{table.username}}
    </el-form-item>
    <el-form-item label="姓名" >
      {{table.name}}
    </el-form-item>
    <el-form-item label="理由" prop="reason">
      <el-input v-if="!tag"  autosize v-model="table.reason"></el-input>
      <span v-else>{{table.reason}}</span>
    </el-form-item>
    <el-form-item label="请假日期" prop="date" >
      <el-date-picker
          :disabled="tag"
          v-model="table.date"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="附件">
<file-upload ref="files" type="请假" :original_id="id" :disabled="!tag"></file-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="success" v-if="!tag" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import axios from "axios";
import {MessageBox} from "element-ui";


import FileUpload from "@/components/FileUpload";
import {getUser, getUserName} from "@/utils/auth";
export default {
  name: "AskForLeave",
  components: {FileUpload},
  props:{
    id:String,
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
    }
  },
  methods:{
    update(){
      let path='http://43.143.116.236:5001/ask_for_leave/update' // update path
      const formData = new FormData();
      formData.append('id',this.id)
      formData.append('reason',this.table.reason)
      formData.append('start_time',this.$store.state.formatTime(this.table.date[0]))
      formData.append('end_time',this.$store.state.formatTime(this.table.date[1]))
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
          this.$emit('search')
          this.$store.state.dialog=false
        }
      })
    },
    submit() {
          const formData = new FormData();
          this.$refs.files.fileList.forEach(item=>{
              formData.append('file',item.raw)
          })
          formData.append('username',this.table.username)
          formData.append('name',this.table.name)
          formData.append('reason',this.table.reason)
          formData.append('start_time',this.$store.state.formatTime(this.table.date[0]))
          formData.append('end_time',this.$store.state.formatTime(this.table.date[1]))
          axios.post('http://43.143.116.236:5001/ask_for_leave/add', formData)
              .then((res) => {
                if (res.data.code===200){
                  this.$message.success('提交成功')
                  this.$store.state.dialog=false
                  this.$emit('search');
                }else {
                  this.$message.error('提交失败')
                }
                this.table.reason=''
                this.table.date=[]
              })
              .catch((error) => {
                console.error(error);
              });
    },
  },
  mounted() {
    this.table.name=getUserName()
    this.table.username=getUser()
    if (this.see_data.length){
      this.tag=true
      this.table.date.push(this.see_data[0].start_time)
      this.table.date.push(this.see_data[0].end_time)
      this.table.reason=this.see_data[0].reason
    }else {
      this.tag=false
    }
  },
  watch: {
    see_data: {
      handler: function(newVal) {
        if (newVal.length){
          this.table.date.push(newVal[0].start_time)
          this.table.date.push(newVal[0].end_time)
          this.table.reason=newVal[0].reason
          this.tag=true
        }
        else {
          this.table={
            date:[],
            username:getUser(),
            name:getUserName(),
            reason:'',
          }
          this.tag=false
          this.$refs.files.fileList=[]
        }

      },
      deep: true
    }
  }


}
</script>

<style scoped>

</style>
