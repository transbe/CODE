/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m8检测数据
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
                        zhuge.track('查看检测数据', { '结果': '成功', '任务类型': 'M8' });
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
                    if (data.onPotentialOfAvg != null) {
                        $("#onPotentialOfAvg").text(data.onPotentialOfAvg);
                    }
                    if (data.avOfPlAvg != null) {
                        $("#avOfPlAvg").text(data.avOfPlAvg);
                    }
                    if (data.couponOfPlNonProtectSide != null) {
                        $("#couponOfPlNonProtectSide").text(data.couponOfPlNonProtectSide);
                    }
                    if (data.avOfPlNonProtectSide != null) {
                        $("#avOfPlNonProtectSide").text(data.avOfPlNonProtectSide);
                    }
                    if (data.avOfPlNonProtectSide != null) {
                        $("#avOfPlNonProtectSide").text(data.avOfPlNonProtectSide);
                    }
                    if (data.crossoverCurrent != null) {
                        $("#crossoverCurrent").text(data.crossoverCurrent);
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
                        zhuge.track('查看检测数据', { '结果': '失败', '任务类型': 'M8' });
                    }
                } catch (error) {

                }
            }
        },
        error: function (result) {
            console.log("error");
        }
    });
}