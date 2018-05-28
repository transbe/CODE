/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m3检测数据
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
                //电位检测
                //试片通电电位(mV)  最大值 最小值 平均值
                $("#onPotentialOfCouponMax").html(data.onPotentialOfCouponMax);
                $("#onPotentialOfCouponMin").html(data.onPotentialOfCouponMin);
                $("#onPotentialOfCouponAvg").html(data.onPotentialOfCouponAvg);
                //试片断电电位 平均值
                $("#offPotentialOfCouponAvg").html(data.offPotentialOfCouponAvg);
                //电流密度检测 阴保电流（μA） 最大值 最小值 平均值
                $("#couponToPlCpCurrentMax").html(data.couponToPlCpCurrentMax);
                $("#couponToPlCpCurrentMin").html(data.couponToPlCpCurrentMin);
                $("#couponToPlCpCurrentAvg").html(data.couponToPlCpCurrentAvg);

                //电流密度检测 阴保电流密度（A/m²）   最大值 最小值 平均值 试片面积（cm²）
                $("#cpCurrentDensityMax").html(data.cpCurrentDensityMax);
                $("#cpCurrentDensityMin").html(data.cpCurrentDensityMin);
                $("#cpCurrentDensityAvg").html(data.cpCurrentDensityAvg);
                $("#couponArea").html(data.couponArea);

                //土壤电阻率   测试间距(m) 电阻值(Ω) 土壤电阻率(Ω.n)
                $("#soilResistivitySpace").html(data.soilResistivitySpace);
                $("#soilResistivityResistance").html(data.soilResistivityResistance);
                $("#soilResistivity").html(data.soilResistivity);


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