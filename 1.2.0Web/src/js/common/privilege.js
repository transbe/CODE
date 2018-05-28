 /**
  * @author: yangyuanzhu
  * @date: 2017年4月22日 14:56:40
  * @last modified by: 
  * @last modified time: 
  * @file:处理Url，在引用此js之前，必须引用html5-storage.js
  */
 function handleURL(url) {
     //从localstorage里拿到tempi值。判断是否为空 为空则不处理URL 不为空 则加上参数
     //var tmenpi = lsObj.getLocalStorage('tmenpi') + ""; //拿到值 
     var tmenpi = checkUrlHasParams();
     if (tmenpi.length == 0) {
         return url;
     } else {
         if (url.indexOf("?") > -1) {
             return url + "&tmenpi=" + tmenpi;
         } else {
             return url + "?tmenpi=" + tmenpi;
         }
     }
 }


 /*
  *阴保工程师与运营人员权限控制
  */

 $(function() {
     //var tmenpis = lsObj.getLocalStorage('tmenpi'); //拿到值 
     var tmenpi = checkUrlHasParams();
     // console.log(tmenpis.length);
     if (tmenpi.length == 0) {
         //  console.log("非运营人员");
         $(".add-operate,.delete-operate,.modify-operate,.edit-operate,.view-operate,.order-operate,.import-operate,.export-operate,.export-report-operate,.data-jeject-operate,.get-task-operate,.submit-operate,.application-operate,.cancel-applicate-operate,.audit-operate,.turn-over-operate,.create-operate,.invite-user-operate,.frozen-account-operate,.assign-experts-operate,.user-approve-operate,.task-static-operate").css({
             display: "inline-block"
         });
         //  .graph-operate,

         // 企业管理部分的导出
         $(".enterprise-export").css({
             display: "inline-block"
         });
     } else {
         //  console.log("运营人员");
         $(".view-operate,.graph-operate,.task-static-operate,.export-report-operate,.audit-operate").css({
             display: "inline-block"
         });

         //  $(".add-operate,.delete-operate,.modify-operate,.edit-operate,.order-operate,.import-operate,.export-operate,.data-jeject-operate,.get-task-operate,.submit-operate,.application-operate,.turn-over-operate,.create-operate,.invite-user-operate,.frozen-account-operate,.assign-experts-operate,.user-approve-operate,.enterprise-export").css({
         //      display: "none"
         //  });
     }
 });

 /* 
  *  判断是否有运营人员权限
  */

 function judgePrivilege() {
     //var tmenpis = lsObj.getLocalStorage('tmenpi') + ""; //拿到值 
     var tmenpi = checkUrlHasParams();
     if (tmenpi.length == 0) {
         // 非运营人员
         return false;
     } else {
         // 运营人员
         return true;
     }
 }

 function checkUrlHasParams() {
     //从Url里获得 tmenpi参数是否含有
     var url = window.top.document.URL;
     if (url.indexOf("?") > -1) {
         //含有参数

         //    console.log(url.indexOf("?"))
         var getval = url.split('?')[1];
         var tmenpi_arry = getval.split("&")[1];
         var tmenpi = tmenpi_arry.split("=")[1];
         // console.log(tmenpi)
         return tmenpi;
     } else {
         return "";
     }
 }

 /**
  * 获取菜单节点数据
  * @function
  * @return     {array}
  */

 //  function getMenuNodes() {
 //      console.log("aaaaa");

 //      var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
 //      var roleNameNum = parseInt(lsObj.getLocalStorage('params'));

 //      // 阴保工程师菜单
 //      var menuArr1 = [{
 //              id: 1,
 //              text: '首页',
 //              url: 'src/html/index/welcome.html',
 //              icon: 'fa fa-home'
 //          },
 //          {
 //              id: 2,
 //              text: '测试桩管理',
 //              url: 'src/html/marker/marker.html',
 //              icon: 'fa fa-anchor',
 //          }, {
 //              id: 5,
 //              text: '阴保分段',
 //              url: 'src/html/segment/segment.html',
 //              icon: 'fa fa-sitemap'
 //          },
 //          {
 //              id: 6,
 //              text: '任务管理',
 //              // icon: 'fa fa-tasks',
 //              icon: 'fa fa-file',
 //              childs: [
 //                  // {
 //                  //     id: 7,
 //                  //     text: '检测账号管理',
 //                  //     url: 'src/html/datacollection/datacollection.html',
 //                  // }, 
 //                  {
 //                      id: 8,
 //                      text: '全部任务',
 //                      url: 'src/html/task/all_task/all_task.html',
 //                  }, {
 //                      id: 9,
 //                      text: 'M1-常规检测',
 //                      //url: 'src/html/task/task_M1.html',
 //                      url: 'src/html/task/specific_task/query_task.html?method=1',
 //                  }, {
 //                      id: 10,
 //                      text: 'M2-交流干扰',
 //                      url: 'src/html/task/specific_task/query_task.html?method=2',
 //                  }, {
 //                      id: 11,
 //                      text: 'M3-直流干扰',
 //                      url: 'src/html/task/specific_task/query_task.html?method=3',
 //                  }, {
 //                      id: 12,
 //                      text: 'M4-套管检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=4',
 //                  }, {
 //                      id: 13,
 //                      text: 'M5-交叉平行',
 //                      url: 'src/html/task/specific_task/query_task.html?method=5',
 //                  }, {
 //                      id: 14,
 //                      text: 'M6-阴保有效性',
 //                      url: 'src/html/task/specific_task/query_task.html?method=6',
 //                  }, {
 //                      id: 15,
 //                      text: 'M7-专项监测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=7',
 //                  }, {
 //                      id: 16,
 //                      text: 'M8-绝缘检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=8',
 //                  }, {
 //                      id: 17,
 //                      text: 'M9-恒电位仪',
 //                      url: 'src/html/task/specific_task/query_task.html?method=9',
 //                  }, {
 //                      id: 18,
 //                      text: 'M10-地床检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=10',
 //                  }
 //              ]
 //          },
 //          {
 //              id: 19,
 //              text: '检测区划分',
 //              // icon: 'fa fa-tasks',
 //              icon: 'fa fa-server',
 //              url: 'src/html/detection_area/query_area.html'
 //          }, {
 //              id: 20,
 //              text: '数据分析',
 //              // icon: 'fa fa-tasks',
 //              icon: 'fa fa-pie-chart',
 //              childs: [{
 //                      id: 21,
 //                      text: '数据对齐',
 //                      url: 'src/html/data_analysis/data_alignment.html',
 //                  }, {
 //                      id: 22,
 //                      text: '阴保有效性报告',
 //                      url: 'src/html/data_analysis/report/query_application.html?reportActive=1',
 //                  }, {
 //                      id: 23,
 //                      text: '阴保完整性报告',
 //                      url: 'src/html/data_analysis/report/query_application.html?reportActive=2',
 //                  },

 //              ]
 //          }
 //      ];

 //      // 现场检测人员菜单
 //      var menuArr2 = [{
 //              id: 1,
 //              text: '首页',
 //              url: 'src/html/index/welcom_collect.html',
 //              icon: 'fa fa-home'
 //          },
 //          {
 //              id: 6,
 //              text: '任务管理',
 //              // icon: 'fa fa-tasks',
 //              icon: 'fa fa-file',
 //              childs: [
 //                  // {
 //                  //     id: 7,
 //                  //     text: '检测账号管理',
 //                  //     url: 'src/html/datacollection/datacollection.html',
 //                  // }, 
 //                  {
 //                      id: 8,
 //                      text: '全部任务',
 //                      url: 'src/html/task/all_task/all_task.html',
 //                  }, {
 //                      id: 9,
 //                      text: 'M1-常规检测',
 //                      //url: 'src/html/task/task_M1.html',
 //                      url: 'src/html/task/specific_task/query_task.html?method=1',
 //                  }, {
 //                      id: 10,
 //                      text: 'M2-交流干扰',
 //                      url: 'src/html/task/specific_task/query_task.html?method=2',
 //                  }, {
 //                      id: 11,
 //                      text: 'M3-直流干扰',
 //                      url: 'src/html/task/specific_task/query_task.html?method=3',
 //                  }, {
 //                      id: 12,
 //                      text: 'M4-套管检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=4',
 //                  }, {
 //                      id: 13,
 //                      text: 'M5-交叉平行',
 //                      url: 'src/html/task/specific_task/query_task.html?method=5',
 //                  }, {
 //                      id: 14,
 //                      text: 'M6-阴保有效性',
 //                      url: 'src/html/task/specific_task/query_task.html?method=6',
 //                  }, {
 //                      id: 15,
 //                      text: 'M7-专项监测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=7',
 //                  }, {
 //                      id: 16,
 //                      text: 'M8-绝缘检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=8',
 //                  }, {
 //                      id: 17,
 //                      text: 'M9-恒电位仪',
 //                      url: 'src/html/task/specific_task/query_task.html?method=9',
 //                  }, {
 //                      id: 18,
 //                      text: 'M10-地床检测',
 //                      url: 'src/html/task/specific_task/query_task.html?method=10',
 //                  }
 //              ]
 //          }
 //      ];

 //      // 企业管理人员菜单
 //      var enterpriseObj = {
 //          id: 24,
 //          text: '企业管理',
 //          // icon: 'fa fa-tasks',
 //          icon: 'fa fa-briefcase',
 //          childs: [{
 //                  id: 25,
 //                  text: '组织机构管理',
 //                  url: 'src/html/enterprise/organization_management.html',

 //              }, {
 //                  id: 26,
 //                  text: '人员管理',
 //                  url: 'src/html/enterprise/people_management.html',
 //              }, {
 //                  id: 27,
 //                  text: '企业认证',
 //                  url: 'src/html/enterprise/enterprise_certification.html',
 //              }, {
 //                  id: 28,
 //                  text: '系统管理员移交',
 //                  url: 'src/html/enterprise/administrator_transfer.html',
 //              },

 //          ]
 //      };

 //      // 判断是否是管理员，是管理员加上企业管理模块
 //      if (userBo.isSysadmin == 1) {
 //          menuArr1.push(enterpriseObj);
 //      }

 //      // 判断角色加载菜单
 //      // 只判断现场检查人员与其他人员的区别
 //      if (roleNameNum == 2) {
 //          return menuArr2;
 //      } else {
 //          return menuArr1;
 //      }
 //  }