/**  
 * @file
 * @author: lujingrui
 * @desc: 恒电位仪选桩 单选（让pickList支持单选）
 * @date: 2017-03-03 
 * @last modified by: lujingrui 
 * @last modified time: 2017-06-12 09:30:24
 */

(function($) {

    $.fn.pickList = function(options) {

        var opts = this.opts = $.extend({}, $.fn.pickList.defaults, options);

        this.data = opts.data;

        var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key

        this.fill = function() {
            var option = '';

            $.each(this.data, function(key, val) {
                option += '<option pipeline-id = ' + val.pipelineId + ' data-id=' + val.id + '>' + val.text + '</option>';
            });
            this.find('.pickData').append(option);
        };

        //初始化选中列表
        this.fillListResult = function() {
            var option = '';

            $.each(this.data, function(key, val) {
                //     option += '<option data-id=' + val.id + '>' + val.text + '</option>';
                option += '<option pipeline-id = ' + val.pipelineId + ' data-id=' + val.id + ' onclick=queryId(' + val.id + ')>' + val.text + '</option>';
            });
            this.find('.pickListResult').append(option);
        };


        this.controll = function() {
            var pickThis = this;
            pickThis.find(".pickData").off('click');
            pickThis.find(".pickData").on('click', function() {
                var selectMarker = pickThis.find(".pickListResult option");
                var p = pickThis.find(".pickData option:selected");
                if (selectMarker.length > 0) {
                    selectMarker.each(function() {
                        if ($(this).attr("pipeline-id") == currentSelectPipelineId) {
                            $(this).clone().appendTo(pickThis.find(".pickData"));
                        }
                        $(this).remove();
                    });
                    // selectMarker.remove();
                }
                p.clone().appendTo(pickThis.find(".pickListResult"));
                p.remove();
                if(language == "en"){
                    $('#num').html(document.getElementById('pickData').options.length)
                    $('#num1').html(document.getElementById('pickListResult').options.length)
                }else{
                    $('#num').html((document.getElementById('pickData').options.length) + " 个")
                    $('#num1').html((document.getElementById('pickListResult').options.length) + " 个")
                }
                
            });
            pickThis.find(".pickListResult").off('click');
            pickThis.find(".pickListResult").on('click', function() {
                //  alert();
                var selectMarker = pickThis.find(".pickListResult option");
                var p = pickThis.find(".pickListResult option:selected");
                if (selectMarker.length > 0) {
                    p.remove();
                    p.each(function() {
                        if ($(this).attr("pipeline-id") == currentSelectPipelineId) {
                            $(this).clone().appendTo(pickThis.find(".pickData"));
                        }
                    });
                }
                if(language == "en"){
                     $('#num').html(document.getElementById('pickData').options.length)
                    $('#num1').html(document.getElementById('pickListResult').options.length)
                }else{
                     $('#num').html((document.getElementById('pickData').options.length) + " 个")
                    $('#num1').html((document.getElementById('pickListResult').options.length) + " 个")
                }
               
            });
        };

        this.getValues = function() {
            var objResult = [];
            this.find(".pickListResult option").each(function() {
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

        this.init = function() {
            var pickListHtml =
                "<div class='row'>" +
                "  <div class='col-sm-5' >" +
                "	 <select class='form-control pickListSelect pickData' id='pickData' size='10'></select>" +
                " </div>" +
                " <div class='col-sm-6' style='padding-right:75px'>" +
                "    <select class='form-control pickListSelect pickListResult' id='pickListResult' size='10'></select>" +
                " </div>" +
                "</div>";
            this.append(pickListHtml);
            this.fill();
            this.controll();
        };
        this.init();
        return this;
    };
}(jQuery));
