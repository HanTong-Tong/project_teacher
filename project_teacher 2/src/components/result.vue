<template>
  <div>
    <el-card
      class="box-card"
      v-loading="loading"
      element-loading-text="正在导出中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="block">
        <div class="nav">
          <el-cascader
            v-model="form.student_year"
            :options="optionss"
            placeholder="请选择年级"
          ></el-cascader>
          <el-select
            v-model="form.student_class"
            placeholder="请选择班级"
            
          >
            <el-option
              v-for="item in options2"
              :key="item.class"
              :label="item.class"
              :value="item.class"
            >
            </el-option>
          </el-select>
          <el-cascader
            v-model="form.experiment_name"
            :options="options1"
            placeholder="请选择实验名称"
          ></el-cascader>
          <el-button type="primary" @click="chaxun()" class="btn">
            查询
          </el-button>
          <el-button type="primary" @click="excel()" class="btns">
            导出Excel
          </el-button>
        </div>
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          style="width: 100%"
          border
          stripe
          class="tablr"
        >
          <el-table-column prop="student_class" label="班级"> </el-table-column>
          <el-table-column prop="student_num" label="学号"> </el-table-column>
          <el-table-column prop="student_name" label="姓名"> </el-table-column>
          <el-table-column
            prop="experiment_name"
            label="实验"
          ></el-table-column>
          <el-table-column
            prop="grade"
            label="分数"
            width="60"
            align="center"
          ></el-table-column>

          <el-table-column prop="postate" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                v-if="scope.row.postate == '1'"
                @click="dialog(scope.row.id)"
              >
                批阅
              </el-button>
              <el-tag
                type="success"
                v-if="scope.row.postate == '0' && scope.row.state == 2"
              >
                已批阅
              </el-tag>
              <el-tag
                type="success"
                v-if="scope.row.postate == '2' && scope.row.state == 2"
              >
                已批阅
              </el-tag>
              <el-tag type="danger" v-if="scope.row.state == 1">未完成</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="daochu(scope.row.id)"
                v-if="scope.row.state == 2"
              >
                导出
              </el-button>
              <el-tag type="danger" v-if="scope.row.state == 1">未完成</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>

        <el-dialog title="审批" :visible.sync="dialogVisible" width="600px">
          <div class="toutou">
            <div class="photo">
              <p v-if="this.form.p1 && this.form.p2">表头测量数据截图</p>
              <p v-if="this.form.p1 && this.form.p2 == ''">X-曲线：</p>
              <img :src="this.form.p1" class="photos" />
            </div>

            <el-input
              placeholder="请输入分数"
              class="mark_input"
              v-model="form.fraction_p1"
            ></el-input>

            <div v-if="this.form.p2 != ''" class="tupian2">
              <div class="photo1">
                <p>实验电路设计截图</p>
                <img :src="this.form.p2" class="photos" />
              </div>

              <el-input
                placeholder="请输入分数"
                class="mark_input"
                v-model="form.fraction_p2"
              ></el-input>
            </div>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogs">取 消</el-button>
            <el-button type="primary" @click="dialogs1">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false,
      student_id: "",
      //  idNedd:faflse,
      tutu: false,
      form: {
        fraction_p1: "",
        fraction_p2: "",
        p1: "",
        p2: "",
        student_num: "",
        student_year: "",
        student_class: "",
        experiment_name: "",
      },
      // 班级
      options2: [
        // {
        //   value: "信工一班",
        //   label: "信工一班",
        // },
        // {
        //   value: "信工二班",
        //   label: "信工二班",
        // },
        // {
        //   value: "信工三班",
        //   label: "信工三班",
        // },
      ],
      optionss: [
        // {
        //   value: "2019级",
        //   label: "2019级",
        // },
        {
          value: "2020级",
          label: "2020级",
        },
        //   {
        //     value: "2021级",
        //     label: "2021级",
        //   },
      ],
      options1: [
        // {  不要的
        //   value: "劈尖测细丝实验",
        //   label: "劈尖测细丝实验",
        // },
        {
          value: "电表改装设计实验",
          label: "电表改装设计实验",
        },
        {
          value: "万用表改装设计实验",
          label: "万用表改装设计实验",
        },
        {
          value: "箱式直流电桥测量电阻",
          label: "箱式直流电桥测量电阻",
        },
        {
          value: "大学物理实验一报告",
          label: "大学物理实验一报告",
        },
        {
          value: "单摆法测重力加速度",
          label: "单摆法测重力加速度",
        },
        // {  不要
        //   value: "牛顿环法测曲率半径",
        //   label: "牛顿环法测曲率半径",
        // },
        {
          value: "欧姆表的改装设计",
          label: "欧姆表的改装设计",
        },
        {
          value: "自组式直流电桥测量电阻值",
          label: "自组式直流电桥测量电阻值",
        },
        {
          value: "示波器的调整与使用",
          label: "示波器的调整与使用",
        },
        {
          value: "霍尔效应测量磁感应强度",
          label: "霍尔效应测量磁感应强度",
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getClass();
  },
  methods: {
    // 得到班级
    async getClass() {
      const { data: res } = await this.$http.get("/api/menu/getclass");
      this.options2 = res.data;
      // console.log(res.data);
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    renderHeader(h) {
      return (
        <div>
          <el-button
            type="primary"
            size="mini"
            on-click={() => this.exportExcel()}
          >
            批量导出已完成实验
          </el-button>
        </div>
      );
    },
    // 批量导出
    async exportExcel() {
      this.loading = true;
      this.$message.success(
        "正在批量下载，请勿操作页面（此过程耗时大约两分钟）"
      );
      const mark = this.tableData.length;
      const arrID = [];
      var fileUrl = {};
      for (let i = 0; i < mark; i++) {
        if (this.tableData[i].postate == 2 && this.tableData[i].state == 2) {
          if (this.form.experiment_name == "欧姆表的改装设计") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment6/pdf6?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "霍尔效应测量磁感应强度") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment9/pdf9?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          }
        } else if (this.tableData[i].postate == 1) {
          this.$message.error("请先批阅再导出！");
          return;
        } else if (
          this.tableData[i].postate == 0 &&
          this.tableData[i].state == 2
        ) {
          if (this.form.experiment_name == "劈尖测细丝实验") {
            fileUrl = {
              fileUrl:
                "http://120.55.71.155/api/experiment/pdf?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "电表改装设计实验") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment10/pdf10?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          }
          if (this.form.experiment_name == "箱式直流电桥测量电阻") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/bridge/pdf?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "大学物理实验一报告") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment1/pdf1?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "单摆法测重力加速度") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/pendulum/pdf3?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          }
          // else if (this.form.experiment_name == "牛顿环法测曲率半径") {
          //   fileUrl = {
          //     fileUrl:
          //       "http://120.55.71.155/api/experiment4/pdf4?student_id=" +
          //       this.tableData[i].id,
          //     renameFileName:
          //       this.tableData[i].student_class +
          //       "-" +
          //       this.tableData[i].student_name +
          //       "-" +
          //       this.tableData[i].experiment_name +
          //       ".pdf",
          //   };
          //   arrID.push(fileUrl);
          // }
          else if (this.form.experiment_name == "自组式直流电桥测量电阻值") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/bridge1/pdf5?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "示波器的调整与使用") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment14/pdf14?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          } else if (this.form.experiment_name == "万用表改装设计实验") {
            fileUrl = {
              fileUrl:
                "http://180.76.111.200/api/experiment11/pdf11?student_id=" +
                this.tableData[i].id,
              renameFileName:
                this.tableData[i].student_class +
                "-" +
                this.tableData[i].student_name +
                "-" +
                this.tableData[i].experiment_name +
                ".pdf",
            };
            arrID.push(fileUrl);
          }
        }
      }
      this.filesToRar(arrID, "file");
      setTimeout(() => {
        this.arrID = "";
      }, 2000);
    },
    // 查询
    async chaxun() {
      var that = this;
      const { data: res } = await this.$http.get(
        "/api/admin/home?student_year=" +
          this.form.student_year +
          "&&student_class=" +
          this.form.student_class +
          "&&experiment_name=" +
          this.form.experiment_name
      );
      // console.log(res);
      if (res.code == 200) {
        this.$message.success("查询成功");
        that.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 批阅
    async dialog(id) {
      this.dialogVisible = true;
      this.student_id = id;
      if (this.form.experiment_name == "霍尔效应测量磁感应强度") {
        const { data: res } = await this.$http.get(
          "api/experiment9/returnphoto?student_id=" + id
        );
        // console.log(res);
        if (res.code == 200) {
          this.form.p1 = res.data[0].tu;
          // this.form.p2 = res.data.p2;
        }
      }
      console.log(id);

      if (this.form.experiment_name == "欧姆表的改装设计") {
        const { data: res } = await this.$http.post(
          "/api/experiment6/completion6out",
          { student_id: id }
        );
        // console.log(res);
        if (res.code == 200) {
          this.form.p1 = res.data.p1;
          this.form.p2 = res.data.p2;
          // console.log(this.form.p1);
          // console.log(this.form.p2);
        }
        if (res.code == 100) {
          this.dialogVisible = false;
          this.$message.error("查询失败");
        }
      }
    },
    dialogs() {
      this.dialogVisible = false;
    },
    // 提交分数
    async dialogs1() {
      if (this.form.experiment_name == "欧姆表的改装设计") {
        console.log(123);
        if (
          this.form.fraction_p1 != "" &&
          this.form.fraction_p1 >= 0 &&
          this.form.fraction_p1 <= 5 &&
          this.form.fraction_p2 != "" &&
          this.form.fraction_p2 >= 0 &&
          this.form.fraction_p2 <= 5
        ) {
          console.log(456);
          console.log(this.form.fraction_p1);
          console.log(this.form.fraction_p2);
          const { data: res } = await this.$http.post(
            "/api/experiment6/completion6photo?student_id=" +
              this.student_id +
              "&&fraction_p1=" +
              this.form.fraction_p1 +
              "&&fraction_p2=" +
              this.form.fraction_p2
          );
          if (res.code == 200) {
            console.log(res);
            this.chaxun();
          }
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请输入分数",
          });
        }
      }
      if (this.form.experiment_name == "霍尔效应测量磁感应强度") {
        if (
          this.form.fraction_p1 != "" &&
          this.form.fraction_p1 >= 0 &&
          this.form.fraction_p1 <= 20
        ) {
          const { data: res } = await this.$http.post(
            "/api/experiment9/scorephoto?student_id=" +
              this.student_id +
              "&&fraction=" +
              this.form.fraction_p1
            // +
            // "&&fraction_p2=" +
            // this.form.fraction_p2
          );
          if (res.code == 200) {
            this.chaxun();
          }
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "请输入分数",
          });
        }
      }
    },
    // 导出pdf
    async daochu(id) {
      this.student_id = id;
      if (this.form.experiment_name == "欧姆表的改装设计") {
        window.location.href =
          "http://180.76.111.200/api/experiment6/pdf6?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "劈尖测细丝实验") {
        window.location.href =
          "http://180.76.111.200/api/experiment/pdf?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "电表改装设计实验") {
        window.location.href =
          "http://180.76.111.200/api/experiment10/pdf10?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "万用表改装设计实验") {
        window.location.href =
          "http://180.76.111.200/api/experiment11/pdf11?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "箱式直流电桥测量电阻") {
        window.location.href =
          "http://180.76.111.200/api/bridge/pdf?student_id=" + this.student_id;
      } else if (this.form.experiment_name == "大学物理实验一报告") {
        window.location.href =
          "http://180.76.111.200/api/experiment1/pdf1?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "单摆法测重力加速度") {
        window.location.href =
          "http://180.76.111.200/api/pendulum/pdf3?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "牛顿环法测曲率半径") {
        window.location.href =
          "http://180.76.111.200/api/experiment4/pdf4?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "欧姆表的改装设计") {
        window.location.href =
          "http://180.76.111.200/api/experiment6/pdf6?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "自组式直流电桥测量电阻值") {
        window.location.href =
          "http://180.76.111.200/api/bridge1/pdf5?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "示波器的调整与使用") {
        window.location.href =
          "http://180.76.111.200/api/experiment14/pdf14?student_id=" +
          this.student_id;
      } else if (this.form.experiment_name == "霍尔效应测量磁感应强度") {
        window.location.href =
          "http://180.76.111.200/api/experiment9/pdf9?student_id=" +
          this.student_id;
      }
    },
    //文件打包
    // async filesToRar(arrImages, filename) {
    //   let _this = this;
    //   let zip = new JSZip();
    //   let cache = {};
    //   let promises = [];
    //   _this.title = "正在加载压缩文件";
    //   for (let item of arrImages) {
    //     var promise = _this.getImgArrayBuffer(item.fileUrl).then((data) => {
    //       // 下载文件, 并存成ArrayBuffer对象(blob)
    //       zip.file(item.renameFileName, data, { binary: true }); // 逐个添加文件
    //       cache[item.renameFileName] = data;
    //     });
    //     promises.push(promise);
    //   }
    //   Promise.all(promises)
    //     .then(() => {
    //       zip.generateAsync({ type: "blob" }).then((content) => {
    //         _this.title = "正在压缩";
    //         // 生成二进制流
    //         FileSaver.saveAs(content, filename); // 利用file-saver保存文件 自定义文件名
    //         _this.title = "压缩完成";
    //       });
    //     })
    //     .catch((res) => {
    //       _this.$message.error("文件压缩失败");
    //     });
    // },
    //获取文件blob
    // getImgArrayBuffer(url) {
    //   let _this = this;
    //   return new Promise((resolve, reject) => {
    //     //通过请求获取文件blob格式
    //     let xmlhttp = new XMLHttpRequest();
    //     xmlhttp.open("GET", url, true);
    //     xmlhttp.responseType = "blob";
    //     xmlhttp.onload = function () {
    //       if (this.status == 200) {
    //         resolve(this.response);
    //       } else {
    //         reject(this.status);
    //       }
    //     };
    //     xmlhttp.send();
    //   });
    // },
    // 导出Excel

    //文件打包
    async filesToRar(arrImages, filename) {
      let _this = this;
      let zip = new JSZip();
      let cache = {};
      let promises = [];
      for (let item of arrImages) {
        var promise = _this.getImgArrayBuffer(item.fileUrl).then((data) => {
          // 下载文件, 并存成ArrayBuffer对象(blob)
          if (data !== 0) {
            zip.file(item.renameFileName, data, { binary: true }); // 逐个添加文件
            cache[item.renameFileName] = data;
          }
        });
        promises.push(promise);
      }
      Promise.all(promises)
        .then(() => {
          zip.generateAsync({ type: "blob" }).then((content) => {
            // 生成二进制流
            FileSaver.saveAs(content, filename); // 利用file-saver保存文件 自定义文件名
            _this.$message.success("压缩完成");
            _this.loading = false;
          });
        })
        .catch((res) => {
          _this.$message.error("文件压缩失败");
        });
    },
    //获取文件blob
    async getImgArrayBuffer(url) {
      try {
        const res = await axios({ url, responseType: "blob" });
        if (res.status == 200) {
          return res.data;
        }
      } catch (err) {
        console.log(url);
        return 0;
      }
    },

    async excel() {
      window.open(
        "http://180.76.111.200/api/excel/put?student_class=" +
          this.form.student_class
      );
    },
  },
};
</script>

<style scoped>
.nav {
  background-color: #f0f0f0;
  height: 60px;
  min-width: 700px;
  /* line-height: 80px; */
  /* text-align: center; */
  border-radius: 15px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-content: center;
}
.el-cascader,
.el-select {
  /* display: flex;
    justify-content: space-around;
    align-content: center; */
  margin-top: 10px;
  width: 300px;
}
.block {
  width: 100%;
}
.tablr ::v-deep .el-table__body tr:hover > td {
  background-color: rgb(236, 236, 236) !important;
}
.header {
  /* float: right; */
  width: 400px;
  min-width: 300px;
}
.box-card {
  min-width: 800px;
}
.btn {
  margin-top: 10px;
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: center;
}
.btns {
  margin-top: 10px;
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
}
/* .toutou{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px ;
} */
.photo {
  /* overflow: auto; */
  width: 80%;
  margin: 0 auto;
  height: 300px;
}
.photo1 {
  /* overflow: auto; */
  width: 80%;
  margin: 0 auto;
  margin-top: 94px;
  height: 300px;
}
.photos {
  /* overflow: auto; */
  width: 100%;
  height: 100%;
}
.tupian2 {
  margin-top: 30px;
}
.el-dialog .mark_input {
  width: 80%;
  height: 40px;
  margin-top: 43px;
  /* margin-bottom: 20px; */
  position: absolute;
  left: 10%;
  right: 10%;
}
.dialog-footer {
  width: 80%;
  margin: 15px auto;
  display: flex;
  justify-content: space-between;
  margin-top: 80px !important;
}
.nopiyue {
  display: none;
}
.piyue {
  display: block;
}
p {
  font-size: 15px;
}
</style>