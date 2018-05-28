/**
 * @file
 * @author  gaohui
 * @desc 查看m10检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:22
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
    var riskFree =  getLanguageValue("riskFree");
    var polarized = getLanguageValue("polarized");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == 1&&result.detectionData!=null) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M10', "结果": "成功" });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                taskId = data.taskId;
                if (!isNull(data)) {
                    $("#markerNumber").html(data.markerNumber);
                    $("#pipelineName").html(data.pipelineName);
                    // if(data.analysisResultVal == null){
                    //     $("#analysisResult").html("——");      
                    // }else{
                    //     $("#analysisResult").html(data.analysisResultVal);
                    // }

                    if(data.analysisResult == 1){
                        $("#analysisResult").html(riskFree);      
                    }else if(data.analysisResult == 2){
                        $("#analysisResult").html(polarized);
                    }else{
                        $("#analysisResult").html("——"); 
                    }
                    $("#plOnPotentialAnodeConnected").html(data.plOnPotentialAnodeConnected);
                    $("#plOffPotentialAnodeDisconnected").html(data.plOffPotentialAnodeDisconnected);
                    $("#potentialOfAnodeDisconnected").html(data.potentialOfAnodeDisconnected);
                    $("#currentFromPlToAnode").html(data.currentFromPlToAnode);
                    $("#currentFromPlToAnodeAfterConn").html(data.currentFromPlToAnodeAfterConn);
                    $("#anodeGroundResistance").html(data.anodeGroundResistance);
                    $("#anodeWeight").html(data.anodeWeight);
                    $("#anodeInstalationDate").html(data.anodeInstalationDate);
                    $("#cannotDetectReason").html(data.cannotDetectReason);
                    $("#createTime").html(data.createTime);
                    $("#createUserName").html(data.createUserName);
                    $("#remark").html(data.remark);
                    switch(data.anodeMaterial){ //材料
                        case "1":
                        $("#anodeMaterial").html("镁合金");
                        break;
                        case "2":
                        $("#anodeMaterial").html("锌合金");
                        break;
                        case "3":
                        $("#anodeMaterial").html("贵金属氧化物");
                        break;
                        case "4":
                        $("#anodeMaterial").html("高硅铸铁");
                        break;
                    }
                }
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M10', "结果": "失败" });
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