<template>
  <div class="login_container">
    <div class="login_box">
      <!-- <div class="hearder"> -->
      <!-- <img src="https://www.nsu.edu.cn/img/logo-png.png" style="width:60px;height:60px"> -->
      <p class="title">物理实验教师端</p>
      <!-- </div> -->
      <el-form class="login_form">
          <!-- 用户名 -->
        <el-form-item >
          <el-input prefix-icon="el-icon-user-solid"  v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item >
          <el-input prefix-icon="el-icon-search" type="password"  v-model="form.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
data(){
  return{
    form:{
      username:"",
      password:""
    }
  }
},
methods:{
  login(){
    var that = this
    fetch('http://test.isekko.cn/api/user/login',{
        method:'post',
        body:JSON.stringify({
          username:this.form.username,
          password:this.form.password
        }),
        headers:{
            'Content-Type':'application/json',
        }
    }).then(function (data) {
        return data.json();
    }).then(function (data) {
        console.log(data);
        if(data.code==200){ 
          window.sessionStorage.setItem('token',data.data.token)
           that.$message.success('登录成功');
          that.$router.push('/home')
         
        }
        else{
        that.$message.error(data.msg);
        }
    })
    //  const {data:res}=await this.$http.post('/api/user/login',this.form)
    //  console.log(res);
    //  if(res.code==200){
    //     this.$router.push('/home')
    //  }
   
  }
}

}
</script>

<style>
/* .hearder{
  display: flex;
  justify-content: space-around;
  align-content: center;
} */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-form-item{
margin-bottom: 30px !important;

}
.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.login_box img {
    width: 50px;
    padding-left: 12px;
    padding-top: 12px;
}

.login_box .title {
    color: rgb(41, 41, 92);
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    
}

.btn {
    display: flex;
    justify-content: center;
}
</style>