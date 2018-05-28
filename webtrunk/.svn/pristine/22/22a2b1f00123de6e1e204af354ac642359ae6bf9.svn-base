(function ($) {

    $.fn.pickList = function (options) {

        var opts = this.opts = $.extend({}, $.fn.pickList.defaults, options);

        this.data = opts.data;

        this.fill = function () {
            var option = '';

            $.each(this.data, function (key, val) {
                option += '<li pipeline-id = ' + val.pipelineId + ' data-id=' + val.id + '>' + val.text + '</li>';
            });
            this.find('.pickData').append(option);
        };

        //初始化选中列表
        this.fillListResult = function () {
            var option = '';

            $.each(this.data, function (key, val) {
                //     option += '<li data-id=' + val.id + '>' + val.text + '</li>';
                option += '<li  pipeline-id = ' + val.pipelineId + ' data-id=' + val.id + '>' + val.text + '</li>';
            });
            this.find('.pickListResult').append(option);
        };


        this.controll = function () {
            var pickThis = this;

            pickThis.find(".pAdd").on('click', function () {
                var p = pickThis.find(".pickData li.ui-selected");
                p.removeClass("ui-selected");
                p.clone().appendTo(pickThis.find(".pickListResult"));
                p.addClass("uncheck");
                $('#num').html($('#pickData li').length + " 个")
                $('#num1').html($('.pickListResult li').length + " 个")
                $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
                $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
                changeBtnStatus();
            });

            pickThis.find(".pAddAll").on('click', function () {
                var p = pickThis.find(".pickData li:not(.uncheck)");
                p.removeClass("ui-selected");
                p.clone().appendTo(pickThis.find(".pickListResult"));
                p.addClass("uncheck");
                // p.remove();
                $('#num').html($('#pickData li').length + " 个")
                $('#num1').html($('.pickListResult li').length + " 个")
                $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
                $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
                changeBtnStatus();
            });
            pickThis.find(".pRemove").off('click');
            pickThis.find(".pRemove").on('click', function () {
                var p = pickThis.find(".pickListResult li.ui-selected");
                markerDataList
                var str = "";
                p.each(function () {
                    for(var i= 0;i<markerDataList.length;i++){
                        if($(this).attr("data-id") == markerDataList[i].id){
                            $("#pickData li[data-id='"+markerDataList[i].id+"']").removeClass("uncheck");
                            break;
                        }
                    }
                    $(this).remove();
                });

                $('#num').html($('#pickData li').length + " 个")
                $('#num1').html($('.pickListResult li').length + " 个")
                $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
                $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
                changeBtnStatus();
            });

            pickThis.find(".pRemoveAll").off('click');
            pickThis.find(".pRemoveAll").on('click', function () {
                var p = pickThis.find(".pickListResult li");
                 p.each(function () {
                    for(var i= 0;i<markerDataList.length;i++){
                        if($(this).data('id') == markerDataList[i].id){
                            $("#pickData li[data-id='"+markerDataList[i].id+"']").removeClass("uncheck");
                            break;
                        }
                    }
                    $(this).remove();
                });

                $('#num').html($('#pickData li').length + " 个")
                $('#num1').html($('.pickListResult li').length + " 个")
                $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
                $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
                changeBtnStatus();
            });
        };

        this.getValues = function () {
            var objResult = [];
            this.find(".pickListResult li").each(function () {
                objResult.push({
                    id: $(this).data('id'),
                    text: this.text
                });
            });
            return objResult;
        };

        this.setData = function (data) {
            this.data = data;
            this.find('.pickData').html('');
            //this.find('.pickListResult').html('');
            this.fill();
            this.controll();
        };
        //初始化pickListResult（lixiaolong）
        this.setResultData = function (data) {
            this.data = data;
            this.find('.pickListResult').html('');
            //this.find('.pickListResult').html('');
            this.fillListResult();
            this.controll();
        };

        this.init = function () {
            var pickListHtml =
                "<div class='row'>" +
                "  <div class='col-sm-5' >" +
                "	 <ul class='form-control pickListSelect pickData' id='pickData' multiple></ul>" +
                " </div>" +
                " <div class='col-sm-1 pickListButtons pickListLenght' style='padding-top: 50px;padding-left:1.6%;'>" +
                "      <button  class='pAddAll btn btn-primary btn-sm'>" + opts.addAll + "</button>" +
                "	<button  class='pAdd btn btn-primary btn-sm'>" + opts.add + "</button>" +
                "	<button  class='pRemove btn btn-primary btn-sm'>" + opts.remove + "</button>" +
                "	<button  class='pRemoveAll btn btn-primary btn-sm' >" + opts.removeAll + "</button>" +
                " </div>" +
                " <div class='col-sm-6 pick-right-style'  style = 'margin-top:0'>" +
                "    <ul class=' form-control pickListSelect pickListResult ' id='sortable' name='pickListResult' multiple></ul>" +
                " </div>" +
                "</div>";
            this.append(pickListHtml);
            this.fill();
            this.controll();
            $("#sortable").sortable({
                update: function( event, ui ) {
                        $(".middle-pic .first").html($( "#sortable" ).find("li:first-child").html());
                        $(".middle-pic .last").html($( "#sortable" ).find("li:last-child").html());
                }
            });
            $("#pickData").selectable({
                cancel: ".uncheck",
                filter:"li:not(.uncheck)"
            });
            $("#sortable").on("click", "li", function (event) {
                var index = $(this).index();
                var firstIndex = $("#sortable li.ui-selected").index();
                var startIndex = index-0>firstIndex-0?firstIndex:index;
                var endIndex = index-0>firstIndex-0?index:firstIndex;
                if(event.shiftKey && firstIndex != -1){
                    $("#sortable li").each(function(index){
                        if(index >= startIndex && index <= endIndex){
                            $(this).addClass("ui-selected");
                        }
                    });
                }else{
                    if(!event.ctrlKey){
                        $("#sortable li").removeClass("ui-selected");
                        $(this).toggleClass("ui-selected");
                    }else{
                        $(this).toggleClass("ui-selected");
                    }
                }
                changeBtnStatus();
            })
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
