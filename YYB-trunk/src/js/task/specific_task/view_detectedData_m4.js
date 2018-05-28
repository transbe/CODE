/**
 * @file
 * @author  gaohui
 * @desc 查看m4检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:05
 */
var objectId = getParameter("id");  //获取检测数据ID
var taskId = "";  //任务ID
var detectMethod = getParameter("detectMethod");    //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
    var setUnitArr=["onPotentialOfMax","onPotentialOfMin","onPotentialOfAvg","offPotentialOfMax","offPotentialOfMin","offPotentialOfAvg","onPoteniallOfCasingMax","onPoteniallOfCasingMin","onPoteniallOfCasing","offPotenialOfCasingMax","offPotenialOfCasingMin","offPotenialOfCasing"];


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
    var circuit = getLanguageValue("circuit");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (zhugeSwitch == 1) {
                        zhuge.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                taskId = data.taskId;
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
                    $("#analysisResult").html(circuit);
                }else{
                    $("#analysisResult").html("——"); 
                }
                console.log(data);
                //管道通电电位（mV）最大值 最小值 平均值
                $("#onPotentialOfMax").html(data.onPotentialOfMax);
                $("#onPotentialOfMin").html(data.onPotentialOfMin);
                $("#onPotentialOfAvg").html(data.onPotentialOfAvg);

                //管道断电电位(mV) 最大值 最小值 平均值
                $("#offPotentialOfMax").html(data.offPotentialOfMax);
                $("#offPotentialOfMin").html(data.offPotentialOfMin);
                $("#offPotentialOfAvg").html(data.offPotentialOfAvg);

                // 套管通电电位(mV) 
                $("#onPoteniallOfCasingMax").html(data.onPoteniallOfCasingMax);
                $("#onPoteniallOfCasingMin").html(data.onPoteniallOfCasingMin);
                $("#onPoteniallOfCasingAvg").html(data.onPoteniallOfCasing);


                //套管断电电位(mV)
                $("#offPotenialOfCasingMax").html(data.offPotenialOfCasingMax);
                $("#offPotenialOfCasingMin").html(data.offPotenialOfCasingMin);
                $("#offPotenialOfCasingAvg").html(data.offPotenialOfCasing);
                

                $("#cannotDetectReason").html(data.cannotDetectReason);
                $("#createTime").html(data.detectTime);//修改创建时间为检测时间
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
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                 title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
}

// function setAnalysisResult(){
//      $('#analysisResult').editable({
//         type: "select",              //编辑框的类型。支持text|textarea|select|date|checklist等
//         source: [{ value: 0, text: "——" }, { value: 1, text: "正常" }, {value:2,text:"已搭接"}],
//         title: "分析结果",           //编辑框的标题
//         disabled: false,           //是否禁用编辑
//         //emptytext: "——",       //空值的默认文本
//         mode: "popup",            //编辑框的模式：支持popup和inline两种模式，默认是popup
//         ajaxOptions: {
//             type: 'post',
//             contentType: "application/json; charset=utf-8",
//             dataType: 'json'
//         },
//         url:function(params){
//             var data = {
//                 "objectID":objectId,
//                 "taskID":taskId,
//                 "result":params.value
//             }
//             return  $.ajax({
//                 url: "/cloudlink-corrosionengineer/task/setAnalysisResult?token="+token,
//                 contentType: "application/json; charset=utf-8",
//                 type: "post",
//                 data: JSON.stringify(data),
//                 dataType: 'JSON',
//                 success: function (res) {
//                     if (res.success == 1) {
//                         parent.layer.msg("编辑成功", {
//                             time: MSG_DISPLAY_TIME,
//                             skin: "self-msg"
//                         });
//                     }else{
//                         parent.layer.alert(res.msg, {
//                             title: "提示",
//                             skin: 'self-alert'
//                         });
//                     }
//                 },
//                 error: function(XMLHttpRequest, textStatus, errorThrown) {
//                     parent.layer.alert(NET_ERROR_MSG, {
//                         title: "提示",
//                         skin: 'self-alert'
//                     });
//                 }
//             }); 
//         }
//     });
// }