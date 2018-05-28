/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m4检测数据
 */
var objectId = getParameter("id");  //获取检测数据ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
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
                        zhuge.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                $("#markerNumber").html(data.markerNumber);
                $("#pipelineName").html(data.pipelineName);
                $("#analysisResult").html(data.analysisResultVal);

                //管道通电电位（mV）最大值 最小值 平均值
                $("#onPotentialOfMax").html(data.onPotentialOfMax);
                $("#onPotentialOfMin").html(data.onPotentialOfMin);
                $("#onPotentialOfAvg").html(data.onPotentialOfAvg);

                //管道断电电位(mV) 最大值 最小值 平均值
                $("#offPotentialOfMax").html(data.offPotentialOfMax);
                $("#offPotentialOfMin").html(data.offPotentialOfMin);
                $("#offPotentialOfAvg").html(data.offPotentialOfAvg);
                // 套管通电电位(mV) 
                $("#onPoteniallOfCasing").html(data.onPoteniallOfCasing);
                //套管断电电位(mV)
                $("#offPotenialOfCasing").html(data.offPotenialOfCasing);

                $("#cannotDetectReason").html(data.cannotDetectReason);
                $("#createTime").html(data.createTime);
                $("#createUserName").html(data.createUserName);
                $("#remark").html(data.remark);
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (error) {

                }
            }
        },
        error: function (result) {

        }
    });
}