/**
 * @file
 * @author  gaohui
 * @desc 查看m8检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:22:51
 */
var objectId = getParameter("id");  //获取检测数据ID
var taskId = "";                            //任务Id
var token = lsObj.getLocalStorage("token"); //获取token
var detectMethod = getParameter("detectMethod");    //获取检测方法
$(function () {
    changePageStyle("../../..");
    getPhoto();
    loadData(); //加载数据
    setAnalysisResult(objectId,taskId,detectMethod);
});

/**
 * @desc 加载数据
 */
function loadData() {
    var good =  getLanguageValue("good");
    var shorted = getLanguageValue("shorted");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '结果': '成功', '任务类型': 'M8' });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                taskId = data.taskId;
                if (data != null) {
                    $("#markerNumber").html(data.markerNumber);
                    $("#pipelineName").html(data.pipelineName);
                    // if(data.analysisResultVal == null){
                    //     $("#analysisResult").html("——");      
                    // }else{
                    //     $("#analysisResult").html(data.analysisResultVal);
                    // }

                    if(data.analysisResult == 1){
                        $("#analysisResult").html(good);      
                    }else if(data.analysisResult == 2){
                        $("#analysisResult").html(shorted);
                    }else{
                        $("#analysisResult").html("——"); 
                    }
                    $("#onPotentialOfAvg").html(data.onPotentialOfAvg);
                    $("#avOfPlAvg").html(data.avOfPlAvg);
                    $("#couponOfPlNonProtectSide").html(data.couponOfPlNonProtectSide);
                    $("#avOfPlNonProtectSide").html(data.avOfPlNonProtectSide);
                    $("#avOfPlNonProtectSide").html(data.avOfPlNonProtectSide);
                    $("#crossoverCurrent").html(data.crossoverCurrent);
                    $("#cannotDetectReason").html(data.cannotDetectReason);

                    $("#createTime").html(data.createTime);
                    $("#createUserName").html(data.createUserName);
                    $("#remark").html(data.remark);
                }
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '结果': '失败', '任务类型': 'M8' });
                    }
                } catch (error) {

                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}