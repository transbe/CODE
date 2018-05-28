/**  
 * @file
 * @author: gaohui
 * @desc: 签约
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */
var objectId = getParameter("objectId");    //获取企业ID
var enterpriseName = decodeURI(getParameter("enterpriseName")); //获取企业名称
var token = lsObj.getLocalStorage('token'); //获取token
$(function(){
    $('#enterpriseName').html(enterpriseName);
    setDate();  //设置时间
    getHistory();   //获取历史记录
})

/**
 * @desc 保存数据
 * @method save
 */
var fileId = "";    //定义一个文件ID变量
function save(){
    var check = $('#signForm').data('bootstrapValidator');  //表单校验
    check.validate();

    if (check.isValid()) {  //判断表单是否验证通过
        var saveFlag = false;
    
        var formData = new FormData($("#signForm")[0]);
        if(($("input[type='file']").val() != "")){
            $.ajax({
                url:'/cloudlink-core-file/attachment/save?businessId='+objectId+'&bizType='+ "protocolFile",
                method:'post',
                data:formData,
                async: false,  
                contentType: false,  
                processData: false,
                success:function(result){
                    if(result.success == 1){
                        fileId = result.rows[0].fileId
                        saveFlag = saveData(fileId);
                    }else{
                        parent.layer.alert(result.msg, {
                            title: "提示",
                            skin: 'self-alert'
                        });
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    parent.layer.alert(NET_ERROR_MSG, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                }
            });
            return saveFlag;
        }else{
            saveFlag = saveData(fileId);
        }
        return saveFlag;
    }else {
        parent.layer.msg("表单验证失败！", {
            time: MSG_DISPLAY_TIME,
            skin: "self-msg"
        });
        return false;
    }
}

/**
 * @desc 设置默认时间
 * @method setDate
 */
function setDate(){
    var date = new Date();  //获取系统日期
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
    $("#effectiveTime").val(dd);   //默认设置协议起始日期是系统日期
    $("#signDate").val(dd); //默认设置签约日期是系统日期
    var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());   //计算时长
    $('#duration').val(duration);   //设置时长
    $("#quickSelect").css('display','');    //隐藏快速选择日期的单选框
    $("#enterpriseName").html(enterpriseName)   //显示企业名称
    //时间插件
    $("#effectiveTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on("click", function() {
        $("#effectiveTime").datetimepicker("setEndDate", $("#expireTime").val());
    }).on('hide',function(e) {  
        $('#signForm').data('bootstrapValidator')  
            .updateStatus('effectiveTime', 'NOT_VALIDATED',null)  
            .validateField('effectiveTime');  
    }); 

    $("#expireTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on("click", function() {
        $("#expireTime").datetimepicker("setStartDate", $("#effectiveTime").val());
    }).on('hide',function(e) {  
        $('#signForm').data('bootstrapValidator')  
            .updateStatus('expireTime', 'NOT_VALIDATED',null)  
            .validateField('expireTime');  
    }); 

    $("#signDate").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on('hide',function(e) {  
        $('#signForm').data('bootstrapValidator')  
            .updateStatus('signDate', 'NOT_VALIDATED',null)  
            .validateField('signDate');  
    });  
    //改变协议起始时间时触发
    $("#effectiveTime").change(function(){
        var changeTime = addmulMonth($("#effectiveTime").val(),($("input[name='year']:checked").val())*12); //计算改变后的日期
        if(changeTime != $("#expireTime").val()){   //改变后的日期不等于到期日期值
            $("input[name='year']").removeAttr('checked');  //取消单选框选中
            var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());   //计算时长
            $('#duration').val(duration);
        }
    });
    //改变协议起始结束
    $("#expireTime").change(function(){
        var changeTime = addmulMonth($("#effectiveTime").val(),($("input[name='year']:checked").val())*12); //计算改变后的日期
        if(changeTime != $("#expireTime").val()){   //改变后的日期不等于到期日期值
            $("input[name='year']").removeAttr('checked');  //取消单选框选中
            var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());   //计算时长
            $('#duration').val(duration);
        }
    });
    //改变单选框
    $("input[name='year']").change(function(){
        $("#expireTime").val(addmulMonth($("#effectiveTime").val(),$("input[name='year']:checked").val()*12)); //计算改变后的日期
        var duration = setDuration($("#effectiveTime").val(),$('#expireTime').val());   //计算时长
        $('#duration').val(duration);
        $('#signForm').data('bootstrapValidator')  
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

/**
 * @desc 获取签约历史记录
 * @method getHistory
 */
function getHistory(){
    $.ajax({
        url:'/cloudlink-core-framework/enterprise/protocol/getListByEnterprise?token='+token+'&enterpriseId='+objectId,
        method:'get',
        dataType: 'json',
        success:function(result){
            if(result.success == 1){
                var data = result.rows;
                var li_str="";
                for(var i=0;i<data.length;i++){
                    li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
                    li_str +=  '<div><span>'+data[i].signDate+'</span>签约时长 '+data[i].duration+' <span>'+data[i].effectiveTime+'</span>- <span>'+data[i].expireTime+'</span><span>'+data[i].operator+'</span></div></li>';
                }
                $(".history-body").html(li_str);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }

    })
}

//显示历史记录
$(".show-content").click(function(){
    $(".history-body").show();
});
//隐藏历史记录
$(".hide-content").click(function(){
    $(".history-body").hide();
});

//表单校验
$('#signForm').bootstrapValidator({
    fields: {
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
        },
        remark:{
            // enabled: false,
            validators: {
                stringLength: {
                    max: 100
                },
            }
        }
    }
});

/**
 * @desc 保存数据
 * @method saveData
 * @param {string} fileId 文件ID
 */
function saveData(fileId){
    var saveDataFlag = false;
    var parameter = { "expireTime":  $("#expireTime").val(), "effectiveTime": $("#effectiveTime").val(),"enterpriseId":objectId,"appId":appId,"useType":"1","protocolId":fileId,"operator":$("#operator").val(),"signDate":$("#signDate").val(),"remark":$("#remark").val(),"duration":$('#duration').val()}
    $.ajax({
        url:'/cloudlink-core-framework/enterprise/protocol/add?token='+token,
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
                saveDataFlag = true;
            }else{
                parent.layer.alert(res.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
                saveDataFlag = false;
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
    return saveDataFlag
}