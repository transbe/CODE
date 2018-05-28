/**  
 * @file
 * @author: gaohui
 * @desc: 试用用户日期设置
 * @date: 2017-05-04
 * @last modified by: gaohui 
 * @last modified time: 2017-06-12 09:26:17
 */
var enterpriseName = getParameter("enterpriseName");    //获取企业名称
var enpAdminName = getParameter("enpAdminName");    //获取管理员名称
var objectId = getParameter("objectId");    //获取企业id
var createTime = getParameter("createTime");    //获取注册时间
var token = lsObj.getLocalStorage('token'); //获取token
$(function() {
    $('#enterpriseName').html(decodeURI(enterpriseName));
    $('#createTime').html(createTime.split("%")[0]);
    $('#enpAdminName').html(decodeURI(enpAdminName));
    setDate();  //设置日期
})

/**
 * @desc 保存数据
 */
function save(){
    var parameter = { "expireTime":  $("#expireTime").val(),"enterpriseId":objectId,"appId":appId,"useType":"0"};
    var saveFlag = false;
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
                saveFlag = true;
            }else{
                parent.layer.alert(res.msg, {
                    title: "提示",
                    skin: 'self-alert'
                });
                saveFlag = false;
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    })
    return saveFlag;
}

/**
 * @desc 设置日期
 */
function setDate(){
    //时间插件
    $("#expireTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    });
    var numMouth = parseInt($("input[name='time']:checked").val()); //获取单选框的值
    var creatTime = $('#createTime').text();    
    $('#expireTime').val(addmulMonth(creatTime,numMouth));  //设置到期时间默认值
    var duration = setDuration(creatTime,$('#expireTime').val());   //计算时间间隔
    $('#duration').val(duration);
    $("input[name='time']").change(function(){  //改变单选框的值时触发该事件
        numMouth = parseInt($("input[name='time']:checked").val()); //获取单选框的值
        $('#expireTime').val(addmulMonth(creatTime,numMouth));  //设置到期时间默认值
        var duration = setDuration(creatTime,$('#expireTime').val());   //计算时间间隔
        $('#duration').val(duration);
    });
    $("#expireTime").change(function(){ //改变到期时间时触发该事件
        var changeTime = "";
        changeTime = addmulMonth(creatTime,numMouth);
        if(changeTime != $("#expireTime").val()){   //判断改变后的时间与到期时间是否一样
            $("input[name='time']").removeAttr('checked');
        }
       var duration = setDuration(creatTime,$('#expireTime').val())
       $('#duration').val(duration);
      
    });
    
    //时间插件
    $("#expireTime").datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        minView: "month",
        pickTime: false
    }).on("click", function() {
        $("#expireTime").datetimepicker("setStartDate",createTime.split("%")[0])
    });
}

//显示历史记录
$(".show-content").click(function(){
    $(".history-body").show();
});
//隐藏历史记录
$(".hide-content").click(function(){
    $(".history-body").hide();
});

