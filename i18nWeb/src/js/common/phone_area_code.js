/** 
 * @file
 * @author  lizhenzhen
 * @desc  手机区号input输入框封装
 * @date  2017-09-26 09:13:37
 * @last modified by lizhenzhen
 * @last modified time  2017-09-26 09:13:52
 */

(function($){
    "use strict";

      $.fn.loadPhoneArea = function(opt){
         var id = opt.inputId,
            classArr = opt.classArr,
            placeholder = opt.placeholder;
         var that = this;

         var loadPhoneLayout = {
            init:function(){
                $(that).addClass("phone-input");
                var selectCode = '<div class="select-cpt">\
                                    <div class="select-head"><span id="phoneNo">+86</span><div class="arrow"></div></div>\
                                    <div class="select-body" id="selectBody"></div>\
                                </div>';
                var inputCode =  '<input class="input select-phone-head " type="text" placeholder="'+ placeholder +'">';
                $(that).append(selectCode);
                $(that).append(inputCode);
                if(!this.isNull(classArr)){
                    for(var i =0; i < classArr.length; i++){
                        $(".select-phone-head").addClass(classArr[i]);
                    }
                }
                if(!this.isNull(id)){
                    $(".select-phone-head").attr("id",id);
                }
                this.loadPhoneAreaCode();
            },
            loadPhoneAreaCode:function(){
              
                var language = opt.language || "zh";
                var self = this;
                $.ajax({
                    type: "GET",
                    url: "/cloudlink-corrosionengineer/common/getNationCode?language="+language,
                    contentType: "application/json",
                    dataType: "json",
                    success: function(data) {
                        if(data.success == 1){
                            var list = data.list;
                            var items = "";
                            $("#selectBody").empty();
                            for(var i = 0; i < list.length; i++){
                                items+=('<div class="option" data-no="' + list[i].code +'" title="'+ list[i].zone +'"><span>+' + list[i].code +'</span>' + list[i].zone +'</div>')
                            }
                            $("#selectBody").append(items);
                            self.bindPhoneEvent();
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest);
                        console.log(textStatus);
                        console.log(errorThrown);
                        // layer.alert(NET_ERROR_MSG, {
                        //     title: getLanguageValue("tip"),
                        //     skin: 'self-alert'
                        // });
                    }
                });
            },
            bindPhoneEvent:function(){
                // 手机号码前缀选择框的显示与隐藏
                $(".select-cpt").on("click",".select-head",function(){
                    $(".select-cpt .select-body").toggleClass("show");
                })

                // 选择手机号码前缀
                $(".select-body").on("click",".option",function(){
                    $(this).addClass("active");
                    $(this).siblings().removeClass("active");
                    var phoneNo = $(this).attr("data-no");
                    $("#phoneNo").html("+"+phoneNo);
                    $(".select-body").removeClass("show");
                })
            },
            isNull:function(param) {
              if (param == "" || param == null || param == undefined) {
                  return true;
              } else {
                  return false;
              }
            }
         }
         return loadPhoneLayout.init();
      }
     
})(jQuery);
