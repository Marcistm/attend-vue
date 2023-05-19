<template>
  <el-form style="width:60%" :model="form">
    <el-form-item label="班级名称">
      <el-input v-model="form.class"></el-input>
    </el-form-item>
    <el-form-item label="班主任">
      <el-select v-model="form.name">
        <el-option v-for="i in teacher" :label="i.name" :value="i.name" :key="i.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button v-if="id!==''" type="success" @click="update">更新</el-button>
      <el-button v-else type="primary" @click="submit">提交</el-button>

    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  name: "ClassManage",
  props:{
    see_data:Array,
    id:String
  },
  data(){
    return{
      form:{
        class:'',
        name:''
      },
      tag:false,
      teacher:[]
    }
  },
  methods:{
    getTeacher(){
      let path='http://43.143.116.236:5001/teacher/get'
      axios.get(path).then(res=>{
        this.teacher=res.data.data
      })
    },
    submit(){
      let path='http://43.143.116.236:5001/class/submit'
      axios.post(path,this.form).then(res=>{
        if (res.data.code===200){
          this.$store.state.dialog=false
          this.$message.success('操作成功')
          this.$emit('search');
        }
      })
    },
    update(){
      let path='http://43.143.116.236:5001/class/update'
      this.form['id']=this.id
      axios.post(path,this.form).then(res=>{
        if (res.data.code===200){
          this.$store.state.dialog=false
          this.$message.success('操作成功')
          this.$emit('search');
        }
      })
    }
  },

  mounted() {
    this.getTeacher()
    if (this.see_data.length){
      this.form=this.see_data[0]
    }
  }
}
</script>

<style scoped>

</style>
