 /**
  * @Author: liangyuanyuan
  * @Date: 2017-3-22
  * @Last Modified by: lizhenzhen
  * @Last Modified time: 2017-5-22
  * @func 门户帮助中心意见反馈
  */

 var numIndex = null;
 var uuid = "";
 var nImgHasBeenSendSuccess = 0;

 $(".help_nav ul li").each(function(e) {
     $(this).click(function() {
         selectIndex(e);
     });
 });
 /*tab切换*/
 function selectIndex(e) {
     //  console.log(e);
     $(".help_nav ul li").eq(e).attr("class", "selected").siblings("li").attr('class', '');
     $(".tab_main div.change").eq(e).show().siblings("div").hide();
 }
 /*删除图片*/
 function closeImg(e) {
     $(e).closest(".feedback_images").remove();
 }

 /*获取参数*/
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }
 /*初始化页面*/
 $(function() {
     numIndex = GetQueryString("num");
     if (numIndex != null) {
         selectIndex(numIndex);
     };
     /*上传图片*/
     $(".addImg").click(function() {
         var imgNum = $(".feedback_img_list").find(".feedback_images").length;
         if (imgNum <= 2) {
             $(".upload_picture").trigger("click");
         } else {
             alert("最多上传三张图片");
         }
     });


     //根据滚动条判断右下角的图片显示或隐藏
     $(window).scroll(function() {
         var scrollTop = $(window).scrollTop();
         if (scrollTop > 1024) {
             $('.to_top').css({
                 display: 'block'
             })
         } else {
             $('.to_top').css({
                 display: 'none'
             })
         }
     });
 });
 // 输入字数限制
 function lookNum(e) {
     var len = $(e).val().trim().length;
     if (len > 200) {
         $(e).val($(e).val().substring(0, 199));
         $(e).next("span").show().text("*最多200字")
     } else {
         $(e).next("span").hide();
     }
 }
 /*判断建议图片提交*/
 function onSubmit() {
     uuid = creatuuid();
     var textArea = $(".feedback_area").find("textarea").val().trim();
     var contactWay = $(".feedback_way").find("input").val().trim();
     if (textArea.length < 10) {
         $(".feedback_area").find("span").show().text("*不到10个字哦，再写点吧");
         return false;
     } else {
         var imgNum = $(".feedback_img_list").find(".feedback_images").length;
         if (imgNum > 0) {
             for (var i = 0; i < $('.feedback_img_list .feedback_images').length; i++) {
                 var picid = $('.feedback_img_file').find('input').eq(i).attr('id');
                 $.ajaxFileUpload({
                     url: "/cloudlink-core-file/attachment/save?businessId=" + uuid + "&bizType=pic_suggestions",
                     /*这是处理文件上传的servlet*/
                     secureuri: false,
                     fileElementId: picid, //上传input的id
                     dataType: "json",
                     type: "POST",
                     async: false,
                     success: function(data, status) {
                         var statu = data.success;
                         if (statu == 1) {
                             nImgHasBeenSendSuccess++;
                             if (nImgHasBeenSendSuccess == $('.feedback_img_list .feedback_images').length) {
                                 postAdvise(textArea, contactWay, uuid);
                             }
                         } else {
                             alert("当前网络不稳定");
                         }
                     },
                     error: function(data) {
                         console.log(data)
                     }
                 });

             }
         } else {
             postAdvise(textArea, contactWay, uuid);
         }
         //建议的提交
         console.log({
             'description': textArea, //填写的建议
             'feedbackType': "pic", //建议类型
             'contact': contactWay, //联系方式
             'objectId': uuid //插入的主键id
         });
     }
 }

 function postAdvise(textArea, contactWay, uuid) {
     $.ajax({ /*http://192.168.50.235:9901*/
         url: "/cloudlink-corrosionengineer/feedback/addAdvice",
         type: "POST",
         contentType: "application/json",
         async: false,
         data: JSON.stringify({
             'description': textArea, //填写的建议
             'feedbackType': "pic", //建议类型
             'contact': contactWay, //联系方式
             'objectId':uuid
         }),
         success: function(data) {
             //  console.log(data);
             if (data.success == 1) {
                 $(".feedback_main").hide();
                 $(".feedback_success").show();
             } else {
                 alert("当前网络不稳定");
             }
         }
     });
 }
 //uuid
 function creatuuid() {
     var s = [];
     var hexDigits = "0123456789abcdef";
     for (var i = 0; i < 36; i++) {
         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
     }
     s[14] = "4";
     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
     s[8] = s[13] = s[18] = s[23] = "-";
     var uuid = s.join("");
     return uuid;
 }