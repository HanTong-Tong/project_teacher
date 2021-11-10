<template>
  <div class="container">
    <el-container class="home-container">
      <el-header>
        <div class="header">
          <img src="https://www.nsu.edu.cn/img/logo.png" alt="" >
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu background-color="#40424b" :default-active="$route.path" router>
            <el-menu-item index="/result">
              <i class="el-icon-document"></i>
              <span slot="title">成绩导出</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style>
.container {
  height: 100%;
}

.home-container {
  height: 100%;
}

.el-header {
    height: 100%;
    background-color:#6A89FF;
}

.header {
  display: flex;
  align-items: center;
  
}

.header img {
    width: 180px;
}

.header span {
  margin-left: 15px;
  line-height: 60px;
  font-size: 24px;
  font-weight: 700;
}

.el-aside {
  background-color:#555555;
;
}

.el-aside .el-menu {
  border-right: none;
}

.el-menu-item span {
    color: #fff;
    font-size: 18px;
}

.el-main {
  background-color: #eaedf1;
}

</style>