var xxwsWindowObj=function(){var t={tip:"请输入提示",name_title:"提示",name_cancel:"取消",name_confirm:"确定",isCancelBtnShow:!1,callBack:null},n="xxws_alert_",a=0,i=null,l=function(arguments){if(arguments.length>0){if($.isPlainObject(arguments[0]))return $.extend(!0,{},t,arguments[0]);if("[object String]"===Object.prototype.toString.call(arguments[0])){var n={tip:arguments[0]};return"[object Function]"===Object.prototype.toString.call(arguments[1])&&(n.callBack=arguments[1]),"[object Boolean]"===Object.prototype.toString.call(arguments[2])&&(n.isCancelBtnShow=arguments[2]),$.extend(!0,{},t,n)}}return $.extend(!0,{},t)},e=function(t){var l=['<div class="modal fade  bs-example-modal-sm" id="'+n+ ++a+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">','<div class="modal-dialog modal-sm" role="document">','<div class="modal-content">','<div class="modal-header" style="padding:6px 15px;">','<h4 class="name_title modal-title" id="myModalLabel">',t.name_title,"</h4>","</div>",'<div class="modal-body">','<div class=" tip modal_tip" style="min-height : 60px">',t.tip,"</div>","</div>",'<div class="modal-footer" style="padding:6px 15px;">','<button type="button" class="isCancelBtnShow name_cancel btn btn-default btn_close" data-dismiss="modal" style="visibility:hidden;margin-right: 10px">',t.name_cancel,"</button>",'<button type="button" class="name_confirm btn btn-primary btn_confirm" data-dismiss="modal">',t.name_confirm,"</button>","</div>","</div>","</div>","</div>"].join("");this.$html=$(l),$(document.body).append(this.$html),i=$("#"+n+a),t.isCancelBtnShow===!0&&i.find(".name_cancel").css("visibility","visible"),i.find(".btn_confirm")[0].onclick=function(){if("function"==typeof t.callBack)return t.callBack()}};return{xxwsAlert:function(){e(l(arguments)),i.modal({backdrop:"static",keyboard:!1})}}}();