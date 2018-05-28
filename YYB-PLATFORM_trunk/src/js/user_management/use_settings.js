/**  
 * @file
 * @author: gaohui
 * @desc: 协议用户设置
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */
var objectId = getParameter("objectId");    //获取企业ID
var enterpriseName = decodeURI(getParameter("enterpriseName")); //获取企业名称
var token = lsObj.getLocalStorage('token'); //获取token
$(function(){
    $("#enterpriseName").html(enterpriseName)   //显示企业名称
    setDate();
})

/**
 * @desc 设置企业用户类型
 */
function setEnpAppInfo(){
    var parameter = {"enterpriseId":objectId,"useType":"1","appId":appId}
    var result = false;
    $.ajax({
        url:'/cloudlink-core-framework/enterprise/setEnpAppInfo?token='+token,
        method:'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        data:JSON.stringify(parameter),
        success:function(res){
            if(res.success == 1){
                    parent.layer.msg("设置成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                result = true;
            }else{
                parent.layer.alert(res.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
                result = false;
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
    

    return result;
}

/**
 * @desc 保存数据
 */
function save(){
    var check = $('#userSettingForm').data('bootstrapValidator');   //表单校验
    check.validate();
    //保存数据
    if (check.isValid()) {  //判断表单校验是否成功
        var formData = new FormData($("#userSettingForm")[0]);
        var fileId = ""; 
        var result = false; 
        $.ajax({
            url:'/cloudlink-core-file/attachment/save?businessId='+objectId+'&bizType='+ "protocolFile",
            method:'post',
            data:formData,
            async: false,  
            contentType: false,  
            processData: false,
            success:function(res){
                if(res.success == 1){
                    fileId = res.rows[0].fileId
                    var parameter = { "expireTime":  $("#expireTime").val(), "effectiveTime": $("#effectiveTime").val(),"enterpriseId":objectId,"appId":"90748268-321e-11e7-b075-001a4a1601c6","useType":"1","protocolId":fileId,"operator":$("#operator").val(),"signDate":$("#signDate").val()}
                    $.ajax({
                        url:'/cloudlink-core-framework/enterprise/protocol/add?token='+token,
                        method:'post',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: false,
                        data:JSON.stringify(parameter),
                        success:function(res){
                            if(res.success == 1){
                                result = setEnpAppInfo();
                            }else{
                                parent.layer.alert(res.msg, {
                                    title: "提示",
                                    skin: 'self-alert'
                                });
                                result = false;
                            }
                        },
                        error:function(XMLHttpRequest, textStatus, errorThrown){
                            parent.layer.alert(NET_ERROR_MSG, {
                                title: "提示",
                                skin: 'self-alert'
                            });
                        }
                    })
                }else{
                    parent.layer.alert(res.msg, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            },error:function(XMLHttpRequest, textStatus, errorThrown){
                parent.layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
        return result;
    }else{
        parent.layer.msg("表单验证失败！", {
            time: MSG_DISPLAY_TIME,
            skin: "self-msg"
        });
        return false
    }
}

/**
 * @desc 设置默认日期
 */
function setDate(){
    var date = new Date();  //获取系统时间
    var year = date.getFullYear();
    var month = date.getMonth()+1+"";
    var days = date.getDate()+"";
    if(month.length == 1){
        month = "0"+month
    }
    if(days.length == 1){
        days = "0"+days
    }
    var dd = year+"-"+month+"-"+days;
    $("#effectiveTime").val(dd);
    //时间插件
    $("#effectiveTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on('hide',function(e) {  
        $('#userSettingForm').data('bootstrapValidator')  
            .updateStatus('effectiveTime', 'NOT_VALIDATED',null)  
            .validateField('effectiveTime');  
    });
    $("#expireTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on('hide',function(e) {  
        $('#userSettingForm').data('bootstrapValidator')  
            .updateStatus('expireTime', 'NOT_VALIDATED',null)  
            .validateField('expireTime');  
    });
    $("#signDate").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on('hide',function(e) {  
        $('#userSettingForm').data('bootstrapValidator')  
            .updateStatus('signDate', 'NOT_VALIDATED',null)  
            .validateField('signDate');  
    });
    //改变协议开始时间时触发事件
    $("#effectiveTime").change(function(){
        var changeTime = addmulMonth($("#effectiveTime").val(),($("input[name='year']:checked").val())*12); //获取单选框的值
        if(changeTime != $("#expireTime").val()){   //改变后的日期与协议结束日期不同
            $("input[name='year']").removeAttr('checked');  //取消单选框选中
            var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());   //设置时长
            $('#duration').val(duration);
        }
    });
    //改变协议结束时间时触发事件
    $("#expireTime").change(function(){
        var changeTime = addmulMonth($("#effectiveTime").val(),($("input[name='year']:checked").val())*12); //获取单选框的值
        if(changeTime != $("#expireTime").val()){   //改变后的日期与协议结束日期不同
            $("input[name='year']").removeAttr('checked');  //取消单选框选中
            var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());  //设置时长
            $('#duration').val(duration);
        }
    });
    //改变单选框时触发事件
    $("input[name='year']").change(function(){
        $("#expireTime").val(addmulMonth($("#effectiveTime").val(),$("input[name='year']:checked").val()*12)); //获取单选框的值
        var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());  //设置时长
        $('#duration').val(duration);
        $('#userSettingForm').data('bootstrapValidator')  
            .updateStatus('expireTime', 'NOT_VALIDATED',null)  
            .validateField('expireTime');   //重新校验过期时间
    });
     //点击签约日期时触发
    $("#signDate").on("click", function(){
        if($(document).scrollTop() < 160){  //获取滚动条距离顶部位置距离小于160时
            window.scrollTo(0,160); //滚动到指定位置
        }
    });
}

//校验开始结束时间
$("#effectiveTime").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: 'month',
    autoclose: true,
    // startDate:new Date()
}).on("click", function() {
    $("#effectiveTime").datetimepicker("setEndDate", $("#expireTime").val())
});
$("#expireTime").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: 'month',
    autoclose: true,
    // startDate:new Date()
}).on("click", function() {
    $("#expireTime").datetimepicker("setStartDate", $("#effectiveTime").val())
});

//表单校验
$("#userSettingForm").bootstrapValidator({
    fields: {
        file:{
            validators:{
                fileName:{

                }
            }
        },
        effectiveTime:{
            validators:{
                notEmpty:{
                }
            }
        },
        expireTime: {
            validators:{
                notEmpty:{
                }
            }
        },
        signDate: {
            validators:{
                notEmpty:{
                }
            }
        },
        operator:{
            validators: {
                stringLength: {
                    max: 6
                },
            }
        }
    }
});
