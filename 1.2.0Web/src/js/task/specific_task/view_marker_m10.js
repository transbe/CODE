/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m10检测数据
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
            if (result.success == 1) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M10', "结果": "成功" });
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
                    if (data.plOnPotentialAnodeConnected != null) {
                        $("#plOnPotentialAnodeConnected").text(data.plOnPotentialAnodeConnected);
                    }
                    if (data.plOffPotentialAnodeDisconnected != null) {
                        $("#plOffPotentialAnodeDisconnected").text(data.plOffPotentialAnodeDisconnected);
                    }
                    if (data.potentialOfAnodeDisconnected != null) {
                        $("#potentialOfAnodeDisconnected").text(data.potentialOfAnodeDisconnected);
                    }
                    if (data.currentFromPlToAnode != null) {
                        $("#currentFromPlToAnode").text(data.currentFromPlToAnode);
                    }
                    if (data.currentFromPlToAnodeAfterConn != null) {
                        $("#currentFromPlToAnodeAfterConn").text(data.currentFromPlToAnodeAfterConn);
                    }
                    if (data.anodeGroundResistance != null) {
                        $("#anodeGroundResistance").text(data.anodeGroundResistance);
                    }
                    if (data.anodeWeight != null) {
                        $("#anodeWeight").text(data.anodeWeight);
                    }
                    if (data.anodeInstalationDate != null) {
                        $("#anodeInstalationDate").text(data.anodeInstalationDate);
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
        error: function (result) {

        }
    });
}