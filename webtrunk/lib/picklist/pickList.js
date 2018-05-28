(function ($) {

   $.fn.pickList = function (options) {
      var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
      var opts = this.opts = $.extend({}, $.fn.pickList.defaults, options);
	  
	  this.data = opts.data;

      this.fill = function () {
         var option = '';

         $.each(this.data, function (key, val) {
            option += '<option num = '+ val.orderNumber +' hasData = '+val.hasData+' pipeline-id = '+val.pipelineId+' data-id=' + val.id + '>' + val.text + '</option>';
         });
         this.find('.pickData').append(option);
      };

      //初始化选中列表
      this.fillListResult = function () {
         var option = '';

         $.each(this.data, function (key, val) {
        //     option += '<option data-id=' + val.id + '>' + val.text + '</option>';
            option += '<option  num = '+ val.orderNumber +' hasData = '+val.hasData+ ' pipeline-id = '+val.pipelineId+' data-id=' + val.id + ' onclick=queryId(' + val.id + ')>' + val.text + '</option>';
         });
         this.find('.pickListResult').append(option);
      };


      this.controll = function () {
         var pickThis = this;

         pickThis.find(".pAdd").on('click', function () {
            var p = pickThis.find(".pickData option:selected");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
            // $('#num').html((document.getElementById('pickData').options.length)+" 个")
            // $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
            if(language == "en"){
                $('#num').html((document.getElementById('pickData').options.length))
                $('#num1').html((document.getElementById('pickListResult').options.length))
            }else{
                $('#num').html((document.getElementById('pickData').options.length)+" ")
                $('#num1').html((document.getElementById('pickListResult').options.length)+" ")
            }
         });

         pickThis.find(".pAddAll").on('click', function () {
            var p = pickThis.find(".pickData option");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
            // $('#num').html((document.getElementById('pickData').options.length)+" 个")
            // $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
            if(language == "en"){
                $('#num').html((document.getElementById('pickData').options.length))
                $('#num1').html((document.getElementById('pickListResult').options.length))
            }else{
                $('#num').html((document.getElementById('pickData').options.length)+" ")
                $('#num1').html((document.getElementById('pickListResult').options.length)+" ")
            }
         });
         pickThis.find(".pRemove").off('click');
         pickThis.find(".pRemove").on('click', function () {
            var p = pickThis.find(".pickListResult option:selected");
            var str="";
            p.each(function () { 
                    if($(this).attr("hasData") == "true"){
                            // console.log($(this).attr("hasData"));
                        str += ","+this.text
                    }else{
                        if($(this).attr("pipeline-id")==currentSelectPipelineId){
                            $(this).clone().appendTo(pickThis.find(".pickData"));
                            $(this).remove();
                        }else{
                            $(this).remove();
                        }
                    }
            });
            if(str.length > 0){
                layer.confirm(str.slice(1)+"有测试数据不能移除", {
                   btn: ['确定'], //按钮
                   skin: 'self'
               });
            }
            var pickData = document.getElementById("pickData"); //获取id 是pickData的对象
            var ops = pickData.getElementsByTagName("option");  //获取标签是option 的对象集合
            var arrOps = Array.prototype.slice.call(ops, 0);    //让ops转换成一个数组对象，让ops具有slice()方法
            arrOps.sort(function (a, b) {
                return a.attributes["num"].value - b.attributes["num"].value;
            });
            pickData.options.length = 0;    //清空pickData下所有的options
            arrOps.map(function (op) {
                pickData.appendChild(op);   //在pickData子节点下的最后一个节点添加
            });
           
            $('#num').html((document.getElementById('pickData').options.length)+" ")
            $('#num1').html((document.getElementById('pickListResult').options.length)+" ")
         });

         pickThis.find(".pRemoveAll").off('click');
         pickThis.find(".pRemoveAll").on('click', function () {
            var p = pickThis.find(".pickListResult option");
           // p.clone().appendTo(pickThis.find(".pickData"));
           var str= ""
            p.each(function () {
                    if($(this).attr("hasData") == "true"){
                        str += "," + this.text;
                    } else if($(this).attr("pipeline-id")==currentSelectPipelineId){
                        $(this).clone().appendTo(pickThis.find(".pickData"));
                        $(this).remove();
                }else{
                        $(this).remove();
                }
            });
            if(str.length > 0){
                layer.confirm(str.slice(1)+getLanguageValue("hasDataNoDelete"), {
                   btn: [getLanguageValue("yes")], //按钮
                   skin: 'self'
               });
            }

            var pickData = document.getElementById("pickData"); //获取id 是pickData的对象
            var ops = pickData.getElementsByTagName("option");  //获取标签是option 的对象集合
            var arrOps = Array.prototype.slice.call(ops, 0);    //让ops转换成一个数组对象，让ops具有slice()方法
            arrOps.sort(function (a, b) {
                return a.attributes["num"].value - b.attributes["num"].value;
            });
            pickData.options.length = 0;    //清空pickData下所有的options
            arrOps.map(function (op) {
                pickData.appendChild(op);   //在pickData子节点下的最后一个节点添加
            });
            // $('#num').html((document.getElementById('pickData').options.length)+" 个")
            // $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
            if(language == "en"){
                $('#num').html((document.getElementById('pickData').options.length))
                $('#num1').html((document.getElementById('pickListResult').options.length))
            }else{
                $('#num').html((document.getElementById('pickData').options.length)+" ")
                $('#num1').html((document.getElementById('pickListResult').options.length)+" ")
                }
         });
      };

      this.getValues = function () {
         var objResult = [];
         this.find(".pickListResult option").each(function () {
            objResult.push({
               id: $(this).data('id'),
               text: this.text
            });
         });
         return objResult;
      };
	  
        this.setData = function(data) {
                this.data = data;
                this.find('.pickData').html('');
                //this.find('.pickListResult').html('');
                this.fill();
                this.controll();
        };
        //初始化pickListResult（lixiaolong）
        this.setResultData = function(data) {
                this.data = data;
                this.find('.pickListResult').html('');
                //this.find('.pickListResult').html('');
                this.fillListResult();
                this.controll();
        };

      this.init = function () {
         var pickListHtml =

                " <div class='col-sm-7 bootstro' data-bootstro-placement='right' data-bootstro-title='任务向导' data-bootstro-content='选择测试桩'>"+
                "   <div class = 'col-sm-6'>"+
                "       <label for='pipeName' class='CP-i18n' key='companyHierarchy'>"+ getLanguageValue("companyHierarchy") +"</label>"+
                "       <div id='treeview' class='treeview'></div>"+
                "   </div>"+
                "   <div class='col-sm-6' >" +
                "	    <label  for='unselected' class='CP-i18n' key='containPipeline'>"+ getLanguageValue("containPipeline") +" <span id = 'num'>0 </span></label>"+
                "       <select class='form-control pickListSelect pickData' id='pickData' multiple></select>" +
                "   </div>"+
                " </div>" +
                " <div class='col-sm-1 pickListButtons pickListLenght' style='text-align: center;padding-top: 85px;'>" +
                "  <div><button  class='pAddAll btn btn-primary btn-sm'>" + opts.addAll + "</button></div>" +
                "	<div><button  class='pAdd btn btn-primary btn-sm'>" + opts.add + "</button></div>" +
                "	<div><button  class='pRemove btn btn-primary btn-sm'>" + opts.remove + "</button></div>" +
                "	<div><button  class='pRemoveAll btn btn-primary btn-sm' >" + opts.removeAll + "</button></div>" +
                " </div>" +
                " <div class='form-group col-sm-4 pick-right-style bootstro'  data-bootstro-placement='left' data-bootstro-title='任务向导' data-bootstro-content='选择测试桩结果' style = 'margin-top:0'>" +
                "  <label  for='unselected' class='CP-i18n' key='selectMarker'>"+ getLanguageValue("selectMarker") +" <span id = 'num1'>0 </span></label>"+
                "  <select class=' form-control pickListSelect pickListResult' id='pickListResult' name='pickListResult'       multiple></select>" +
                 "</div>";
         var pickListHtmlEN =

                " <div class='col-sm-7 bootstro' data-bootstro-placement='right' data-bootstro-title='Guideline' data-bootstro-content='Select Test Point'>"+
                "   <div class = 'col-sm-6'>"+
                "       <label for='pipeName' class='CP-i18n' key='companyHierarchy'>"+ getLanguageValue("companyHierarchy") +"</label>"+
                "       <div id='treeview' class='treeview'></div>"+
                "   </div>"+
                "   <div class='col-sm-6' >" +
                "	    <label  for='unselected' class='CP-i18n' key='containPipeline'>"+ getLanguageValue("containPipeline") +" <span id = 'num'>0 </span></label>"+
                "       <select class='form-control pickListSelect pickData' id='pickData' multiple></select>" +
                "   </div>"+
                " </div>" +
                " <div class='col-sm-1 pickListButtons pickListLenght' style='text-align: center;padding-top: 85px;'>" +
                "  <div><button  class='pAddAll btn btn-primary btn-sm'>" + opts.addAll + "</button></div>" +
                "	<div><button  class='pAdd btn btn-primary btn-sm'>" + opts.add + "</button></div>" +
                "	<div><button  class='pRemove btn btn-primary btn-sm'>" + opts.remove + "</button></div>" +
                "	<div><button  class='pRemoveAll btn btn-primary btn-sm' >" + opts.removeAll + "</button></div>" +
                " </div>" +
                " <div class='form-group col-sm-4 pick-right-style bootstro'  data-bootstro-placement='left' data-bootstro-title='Guideline' data-bootstro-content='Selected Test Points' style = 'margin-top:0'>" +
                "  <label  for='unselected' class='CP-i18n' key='selectMarker'>"+ getLanguageValue("selectMarker") +" <span id = 'num1'>0 </span></label>"+
                "  <select class=' form-control pickListSelect pickListResult' id='pickListResult' name='pickListResult'       multiple></select>" +
                 "</div>";
        var var_Language = lsObj.getLocalStorage("i18nLanguage");
        if(var_Language=="en"){
            this.append(pickListHtmlEN);
        }else{
             this.append(pickListHtml);
        }
        //  this.append(pickListHtml);
         this.fill();
         this.controll();
      };

      this.init();
      return this;
   };

   $.fn.pickList.defaults = {
      add: '>',
      remove: '<',
      addAll: '>>',
      removeAll: '<<'
   };


}(jQuery));

// function queryId(){
//         alert(123);
// }