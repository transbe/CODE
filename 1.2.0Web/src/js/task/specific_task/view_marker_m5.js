/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-04-13 20:23:33
 * @file:查看m5检测数据
 */
var objectId = getParameter("id");    //获取检测数据ID
var detectMethod = getParameter("detectMethod");  //获取检测方法
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
                } catch (err) {

                }

                var data = result.detectionData;
                $("#markerNumber").text(data.markerNumber);//测试桩号
                $("#pipelineName").text(data.pipelineName);  //所属管线
                $("#analysisResult").text(data.analysisResultVal); //分析结果
                //恒电位仪
                $("#plPotentialRecitifierOn").text(data.plPotentialRecitifierOn);   //自己恒电位仪开启自己管道电位（mV）
                $("#plPotentialRecitifierOff").text(data.plPotentialRecitifierOff); //自己恒电位仪关闭自己管道电位（mV）
                $("#forPlPotentialRecitifierOn").text(data.forPlPotentialRecitifierOn);  //自己恒电位仪开启外部管道电位（mV）          
                $("#forPlPotentialRecitifierOff").text(data.forPlPotentialRecitifierOff);   //自己恒电位仪关闭外部管道电位（mV）

                $("#plPotentialForRecitifierOn").text(data.plPotentialForRecitifierOn); //外部恒电位仪开启自己管道电位（mV）
                $("#plPotentialForRecitifierOff").text(data.plPotentialForRecitifierOff);   //外部恒电位仪关闭自己管道电位（mV）
                $("#forPlPotentialForRecitifierOn").text(data.forPlPotentialForRecitifierOn);   //外部恒电位仪开启外部管道电位（mV）
                $("#forPlPotentialForRecitifierOff").text(data.forPlPotentialForRecitifierOff); //外部恒电位仪关闭外部管道电位（mV）

                $("#soilResistivitySpace").text(data.soilResistivitySpace); //测试间距(m)
                $("#soilResistivityResistance").text(data.soilResistivityResistance);   //电阻值(Ω)
                $("#soilResistivity").text(data.soilResistivity);   //土壤电阻率(Ω.n)

                $("#cannotDetectReason").text(data.cannotDetectReason); //无法检测原因
                $("#createTime").text(data.createTime);
                $("#createUserName").text(data.createUserName);

                $("#remark").text(data.remark);
            } else {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (err) {

                }
            }
        },
        error: function (result) {

        }
    });
}