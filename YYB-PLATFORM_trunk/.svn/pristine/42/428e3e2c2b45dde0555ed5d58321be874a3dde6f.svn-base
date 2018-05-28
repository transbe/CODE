(function ($) {

   $.fn.pickList = function (options) {

      var opts = this.opts = $.extend({}, $.fn.pickList.defaults, options);
	  
	  this.data = opts.data;

      this.fill = function () {
         var option = '';

         $.each(this.data, function (key, val) {
            option += '<option hasData = '+val.hasData+' pipeline-id = '+val.pipelineId+' data-id=' + val.id + '>' + val.text + '</option>';
         });
         this.find('.pickData').append(option);
      };

      //初始化选中列表
      this.fillListResult = function () {
         var option = '';

         $.each(this.data, function (key, val) {
        //     option += '<option data-id=' + val.id + '>' + val.text + '</option>';
            option += '<option hasData = '+val.hasData+ ' pipeline-id = '+val.pipelineId+' data-id=' + val.id + ' onclick=queryId(' + val.id + ')>' + val.text + '</option>';
         });
         this.find('.pickListResult').append(option);
      };


      this.controll = function () {
         var pickThis = this;

         pickThis.find(".pAdd").on('click', function () {
            var p = pickThis.find(".pickData option:selected");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
            $('#num').html((document.getElementById('pickData').options.length)+" 个")
            $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
         });

         pickThis.find(".pAddAll").on('click', function () {
            var p = pickThis.find(".pickData option");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
            $('#num').html((document.getElementById('pickData').options.length)+" 个")
            $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
         });
         pickThis.find(".pRemove").off('click');
         pickThis.find(".pRemove").on('click', function () {
            var p = pickThis.find(".pickListResult option:selected");
            var str="";
            p.each(function () { 
                    if($(this).attr("hasData") == "true"){
                            console.log($(this).attr("hasData"));
                        str += ","+this.text
                    }else{
                        if($(this).attr("pipeline-id")==currentSelectPipelineId){
                                $(this).clone().appendTo(pickThis.find(".pickData"));
                                // $(this).clone().prependTo(pickThis.find(".pickData"));
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
        //     p.clone().appendTo(pickThis.find(".pickData"));
           
            $('#num').html((document.getElementById('pickData').options.length)+" 个")
            $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
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
                        // $(this).clone().appendTo(pickThis.find(".pickData"));
                        $(this).clone().prependTo(pickThis.find(".pickData"));
                        $(this).remove();
                }else{
                        $(this).remove();
                }
            });
            if(str.length > 0){
                layer.confirm(str.slice(1)+"有测试数据不能移除", {
                   btn: ['确定'], //按钮
                   skin: 'self'
               });
            }
            $('#num').html((document.getElementById('pickData').options.length)+" 个")
            $('#num1').html((document.getElementById('pickListResult').options.length)+" 个")
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
                //  "<div class='row'>" +
                //  "  <div class='col-sm-5' style='padding:0 30px 0 0'>" +
                //  "	 <select class='form-control pickListSelect pickData' multiple></select>" +
                //  " </div>" +
                //  " <div class='col-sm-2 pickListButtons' style='width:70px;text-align: center;padding-top: 50px;'>" +
                //  "      <button  class='pAddAll btn btn-primary btn-sm'>" + opts.addAll + "</button>" +
                //  "	<button  class='pAdd btn btn-primary btn-sm'>" + opts.add + "</button>" +
                //  "	<button  class='pRemove btn btn-primary btn-sm'>" + opts.remove + "</button>" +
                //  "	<button  class='pRemoveAll btn btn-primary btn-sm' style=' margin-right: 4px;'>" + opts.removeAll + "</button>" +
                //  " </div>" +
                //  " <div class='col-sm-5' style='padding:0 30px 0 0'>" +
                //  "    <select class='form-control pickListSelect pickListResult' multiple></select>" +
                //  " </div>" +
                //  "</div>";

                 "<div class='row'>" +
                 "  <div class='col-sm-5' >" +
                 "	 <select class='form-control pickListSelect pickData' id='pickData' multiple></select>" +
                 " </div>" +
                 " <div class='col-sm-1 pickListButtons' style='text-align: center;padding-top: 50px;'>" +
                 "      <div><button  class='pAddAll btn btn-primary btn-sm'>" + opts.addAll + "</button></div>" +
                 "	<div><button  class='pAdd btn btn-primary btn-sm'>" + opts.add + "</button></div>" +
                 "	<div><button  class='pRemove btn btn-primary btn-sm'>" + opts.remove + "</button></div>" +
                 "	<div><button  class='pRemoveAll btn btn-primary btn-sm' >" + opts.removeAll + "</button></div>" +
                 " </div>" +
                 " <div class='col-sm-6 pick-right-style' >" +
                 "    <select class='form-control pickListSelect pickListResult' id='pickListResult' multiple></select>" +
                 " </div>" +
                 "</div>";
         this.append(pickListHtml);
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