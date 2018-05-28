/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m9检测数据
 */
var objectId = getParameter("id");  //获取检测数据ID
var token = lsObj.getLocalStorage("token"); //获取token
var detectMethod = getParameter("detectMethod");    //获取检测方法
$(function () {
    getPhoto();
    loadData(); //加载数据
});

/**
 * @desc 加载数据
 * @method loadData
 */
function loadData() {
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1") {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '结果': '成功', '任务类型': 'M9' });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                if (data != null) {

                    if (data.markerNumber != null) {
                        $("#markerNumber").text(data.markerNumber);
                    }
                    if (data.pipelineName != null) {
                        $("#pipelineName").text(data.pipelineName);
                    }
                    //输出电流
                    if (data.outputCurrentOfRecitifierMax != null) {
                        $("#outputCurrentOfRecitifierMax").text(data.outputCurrentOfRecitifierMax);
                    }
                    if (data.outputCurrentOfRecitifierMin != null) {
                        $("#outputCurrentOfRecitifierMin").text(data.outputCurrentOfRecitifierMin);
                    }
                    if (data.outputCurrentOfRecitifierAvg != null) {
                        $("#outputCurrentOfRecitifierAvg").text(data.outputCurrentOfRecitifierAvg);
                    }
                    //输出电压
                    if (data.outputVoltageOfRecitifierMax != null) {
                        $("#outputVoltageOfRecitifierMax").text(data.outputVoltageOfRecitifierMax);
                    }
                    if (data.outputVoltageOfRecitifierMin != null) {
                        $("#outputVoltageOfRecitifierMin").text(data.outputVoltageOfRecitifierMin);
                    }
                    if (data.outputVoltageOfRecitifierAvg != null) {
                        $("#outputVoltageOfRecitifierAvg").text(data.outputVoltageOfRecitifierAvg);
                    }
                    // 回路电阻
                    if (data.cpLoopResistance != null) {
                        $("#cpLoopResistance").text(data.cpLoopResistance);
                    }
                    if (data.setupPotentialOfRecitifier != null) {
                        $("#setupPotentialOfRecitifier").text(data.setupPotentialOfRecitifier);
                    }
                    if (data.setupOffPotentialOfRecitifier != null) {
                        $("#setupOffPotentialOfRecitifier").text(data.setupOffPotentialOfRecitifier);
                    }
                    // 阳极
                    if (data.onPotentialOnAnodeAvg != null) {
                        $("#onPotentialOnAnodeAvg").text(data.onPotentialOnAnodeAvg);
                    }
                    if (data.offPotentialOnAnodeAvg != null) {
                        $("#offPotentialOnAnodeAvg").text(data.offPotentialOnAnodeAvg);
                    }
                    if (data.apparentResistanceOfGroundbed != null) {
                        $("#apparentResistanceOfGroundbed").text(data.apparentResistanceOfGroundbed);
                    }
                    if (data.onPotentialOnAnodeAvg != null) {
                        $("#ratioOfRdRc").text(data.ratioOfRdRc);
                    }

                    // 汇流
                    if (data.onPotentialOnPipeConnectionAvg != null) {
                        $("#onPotentialOnPipeConnectionAvg").text(data.onPotentialOnPipeConnectionAvg);
                    }
                    if (data.offPotentialOnPipeConnectionAvg != null) {
                        $("#offPotentialOnPipeConnectionAvg").text(data.offPotentialOnPipeConnectionAvg);
                    }
                    if (data.offPotentialOnPipeConnectionAvg != null) {
                        $("#apparentResistanceOfPl").text(data.apparentResistanceOfPl);
                    }
                    if (data.cannotDetectReason != null) {
                        $("#cannotDetectReason").text(data.cannotDetectReason);
                    }
                    if (data.createTime != null) {
                        $("#createTime").html(data.createTime);
                    }
                    if (data.createUserName != null) {
                        $("#createUserName").text(data.createUserName);
                    }
                    if (data.remark != null) {
                        $("#remark").text(data.remark);
                    }
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
        error: function (result) {

        }
    });
}