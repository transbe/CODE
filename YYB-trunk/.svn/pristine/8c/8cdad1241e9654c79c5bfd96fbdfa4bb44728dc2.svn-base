 /**
  * @file
  * @author yangyuanzhu
  * @desc 处理Url，在引用此js之前，必须引用html5-storage.js
  * @date 2017-04-22 14:56:40
  * @last modified by  lizhenzhen
  * @last modified time 2017-06-14 14:18:43
  */

 /**
  * @desc 从localstorage里拿到tempi值
  * @param {String} url  
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

 /**
  * @desc 阴保工程师与运营人员权限控制
  */
 $(function() {
     //var tmenpis = lsObj.getLocalStorage('tmenpi'); //拿到值 
     var tmenpi = checkUrlHasParams();
     if (tmenpi.length == 0) {
         //  console.log("非运营人员");
         $(".add-operate,.delete-operate,.modify-operate,.edit-operate,.view-operate,.order-operate,.import-operate,.export-operate,.export-report-operate,.data-jeject-operate,.get-task-operate,.submit-operate,.application-operate,.cancel-applicate-operate,.audit-operate,.turn-over-operate,.create-operate,.invite-user-operate,.frozen-account-operate,.assign-experts-operate,.user-approve-operate,.task-static-operate").css({
             display: "inline-block"
         });

         // 企业管理部分的导出
         $(".enterprise-export").css({
             display: "inline-block"
         });
     } else {
         //  console.log("运营人员");
         $(".view-operate,.graph-operate,.task-static-operate,.export-report-operate,.audit-operate").css({
             display: "inline-block"
         });
     }
 });


 /**
  * @desc 判断是否有运营人员权限
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

 /**
  * @desc 检查url是否有参数
  */
 function checkUrlHasParams() {
     //从Url里获得 tmenpi参数是否含有
     var url = window.top.document.URL;
     if (url.indexOf("?") > -1) {
         //含有参数
         //    console.log(url.indexOf("?"))
         var getval = url.split('?')[1];
         var tmenpi_arry = getval.split("&")[1];
         var tmenpi = tmenpi_arry.split("=")[1];
         return tmenpi;
     } else {
         return "";
     }
 }