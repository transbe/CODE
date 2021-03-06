/**
 * @file
 * @author  gaohui
 * @desc 查看m5检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:01
 */
var objectId = getParameter("id");    //获取检测数据ID
var detectMethod = getParameter("detectMethod");  //获取检测方法
var taskId = "";                            //任务Id
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
   var setUnitArr=["plPotentialRecitifierOn","plPotentialRecitifierOff","forPlPotentialRecitifierOn","forPlPotentialRecitifierOff","plPotentialForRecitifierOn","plPotentialForRecitifierOff","forPlPotentialForRecitifierOn","forPlPotentialForRecitifierOff","soilResistivitySpace","soilResistivityResistance","soilResistivity"];


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
    var interfered =  getLanguageValue("interfered");
    var InterferenceFree = getLanguageValue("InterferenceFree");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (err) {

                }

                var data = result.detectionData;
                taskId = data.taskId;
                $("#markerNumber").html(data.markerNumber);//测试桩号
                $("#pipelineName").html(data.pipelineName);  //所属管线
                // if(data.analysisResultVal == null){
                //     $("#analysisResult").html("——");      
                // }else{
                //     $("#analysisResult").html(data.analysisResultVal);
                // }

                if(data.analysisResult == 1){
                    $("#analysisResult").html(interfered);      
                }else if(data.analysisResult == 2){
                    $("#analysisResult").html(InterferenceFree);
                }else{
                    $("#analysisResult").html("——"); 
                }
                //恒电位仪
                $("#plPotentialRecitifierOn").html(data.plPotentialRecitifierOn);   //自己恒电位仪开启自己管道电位（mV）
                $("#plPotentialRecitifierOff").html(data.plPotentialRecitifierOff); //自己恒电位仪关闭自己管道电位（mV）
                $("#forPlPotentialRecitifierOn").html(data.forPlPotentialRecitifierOn);  //自己恒电位仪开启外部管道电位（mV）          
                $("#forPlPotentialRecitifierOff").html(data.forPlPotentialRecitifierOff);   //自己恒电位仪关闭外部管道电位（mV）

                $("#plPotentialForRecitifierOn").html(data.plPotentialForRecitifierOn); //外部恒电位仪开启自己管道电位（mV）
                $("#plPotentialForRecitifierOff").html(data.plPotentialForRecitifierOff);   //外部恒电位仪关闭自己管道电位（mV）
                $("#forPlPotentialForRecitifierOn").html(data.forPlPotentialForRecitifierOn);   //外部恒电位仪开启外部管道电位（mV）
                $("#forPlPotentialForRecitifierOff").html(data.forPlPotentialForRecitifierOff); //外部恒电位仪关闭外部管道电位（mV）

                $("#soilResistivitySpace").html(data.soilResistivitySpace); //测试间距(m)
                $("#soilResistivityResistance").html(data.soilResistivityResistance);   //电阻值(Ω)
                $("#soilResistivity").html(data.soilResistivity);   //土壤电阻率(Ω.n)

                $("#cannotDetectReason").html(data.cannotDetectReason); //无法检测原因
                $("#createTime").html(data.detectTime);//修改创建时间为检测时间
                $("#createUserName").html(data.createUserName);

                $("#remark").html(data.remark);
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
                    }
                } catch (err) {

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