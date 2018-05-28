/**
 * @file
 * @author  gaohui
 * @desc 查看m9检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:22:47
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
    var runNormal =  getLanguageValue("runNormal");
    var runAbormal = getLanguageValue("runAbormal");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '结果': '成功', '任务类型': 'M9' });
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
                        $("#analysisResult").html(runNormal);      
                    }else if(data.analysisResult == 2){
                        $("#analysisResult").html(runAbormal);
                    }else{
                        $("#analysisResult").html("——"); 
                    }
                    //输出电流
                    $("#outputCurrentOfRecitifierMax").html(data.outputCurrentOfRecitifierMax);
                    $("#outputCurrentOfRecitifierMin").html(data.outputCurrentOfRecitifierMin);
                    $("#outputCurrentOfRecitifierAvg").html(data.outputCurrentOfRecitifierAvg);
                    //输出电压
                    $("#outputVoltageOfRecitifierMax").html(data.outputVoltageOfRecitifierMax);
                    $("#outputVoltageOfRecitifierMin").html(data.outputVoltageOfRecitifierMin);
                    $("#outputVoltageOfRecitifierAvg").html(data.outputVoltageOfRecitifierAvg);
                    // 回路电阻
                    $("#cpLoopResistance").html(data.cpLoopResistance);
                    $("#setupPotentialOfRecitifier").html(data.setupPotentialOfRecitifier);
                    $("#setupOffPotentialOfRecitifier").html(data.setupOffPotentialOfRecitifier);
                    // 阳极
                    $("#onPotentialOnAnodeAvg").html(data.onPotentialOnAnodeAvg);
                    $("#offPotentialOnAnodeAvg").html(data.offPotentialOnAnodeAvg);
                    $("#apparentResistanceOfGroundbed").html(data.apparentResistanceOfGroundbed);
                    $("#ratioOfRdRc").html(data.ratioOfRdRc);

                    // 汇流
                    $("#onPotentialOnPipeConnectionAvg").html(data.onPotentialOnPipeConnectionAvg);
                    $("#offPotentialOnPipeConnectionAvg").html(data.offPotentialOnPipeConnectionAvg);
                    $("#apparentResistanceOfPl").html(data.apparentResistanceOfPl);
                    $("#cannotDetectReason").html(data.cannotDetectReason);
                    $("#createTime").html(data.createTime);
                    $("#createUserName").html(data.createUserName);
                    $("#remark").html(data.remark);
                }
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '结果': '失败', '任务类型': 'M9' });
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