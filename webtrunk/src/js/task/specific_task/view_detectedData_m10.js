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
    var setUnitArr=["plOnPotentialAnodeConnected","plOffPotentialAnodeDisconnected","potentialOfAnodeDisconnected","currentFromPlToAnode","currentFromPlToAnodeAfterConn","sumanodeGroundResistance","anodeWeight"];


    changePageStyle("../../..");
    setUnit(setUnitArr);
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
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M10', "结果": "成功" });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                // console.log(data);
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
                    $("#offPotentialOfCouponAvg").html(data.offPotentialOfCouponAvg);//试片断电电位平均值
                    $("#currentFromPlToAnodeAfterConn").html(data.currentFromPlToAnodeAfterConn);
                    $("#sumCurrentFromPlToAnode").html(data.sumCurrentFromPlToAnode);
                    $("#sumAnodeGroundResistance").html(data.sumAnodeGroundResistance);
                    $("#anodeWeight").html(data.anodeWeight);
                    $("#anodeInstalationDate").html(data.anodeInstalationDate);

                    $("#cannotDetectReason").html(data.cannotDetectReason);
                    $("#createTime").html(data.detectTime);//修改创建时间为检测时间
                    $("#createUserName").html(data.createUserName);
                    $("#remark").html(data.remark);

                    var htmlText = "";
                    switch(data.anodeMaterial){ //材料
                       case "1":
                            htmlText = getLanguageValue("magnesium_alloy")
                            break;
                        case "2":
                            htmlText = getLanguageValue("zinc_alloy")
                            break;
                        case "3":
                        htmlText =  getLanguageValue("noble_metallic_oxide")
                            break;
                        case "4":
                            htmlText = getLanguageValue("tantiron")
                            break;
                        default:
                            htmlText = ""
                            break;
                    }
                  $("#anodeMaterial").html(htmlText);
                }
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M10', "结果": "失败" });
                    }
                } catch (error) {

                }
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}