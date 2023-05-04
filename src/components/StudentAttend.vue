<template>
<div>
  <div v-if="tag" >
    <div >暂无上课签到</div>
  </div>
  <el-form v-else :model="form" ref="form" label-width="150px" style="width: 50%">
    <el-form-item label="签到码"></el-form-item>
    <el-form-item>
      <el-button type="primary">签到</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: "StudentAttend",
  data(){
    return{
    tag:false
    }
  },
  methods:{

  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
