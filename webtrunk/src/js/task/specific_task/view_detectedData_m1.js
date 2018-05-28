/**
 * @file
 * @author  gaohui
 * @desc 查看m1检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:26
 */
var objectId = getParameter("id");    //获取检测数据ID
var detectMethod = getParameter("detectMethod");  //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
    var setUnitArr=["onPotentialOfMin","avOfPlMin","onPotentialOfAvg","avOfPlAvg","avOfPlAvg","soilResistivity","soilResistivitySpace","soilResistivityResistance"];


    changePageStyle("../../..");
    setUnit(setUnitArr);
    getPhoto();
    loadData(); //加载数据
});

/**
 * @desc 加载数据
 */
function loadData() {
    var riskFree = getLanguageValue("riskFree");
    var High = getLanguageValue("High");
    var Low = getLanguageValue("Low");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                var analysisResultVal = "";
                if(data.analysisResult == 1){
                    analysisResultVal = riskFree;
                }else if(data.analysisResult == 2){
                    analysisResultVal = High;
                }else if(data.analysisResult == 3){
                    analysisResultVal = Low;
                }else{

                }

                $("#markerNumber").html(data.markerNumber);
                $("#pipelineName").html(data.pipelineName);
                
                //输出电流
                $("#analysisResult").html(analysisResultVal);
                $("#onPotentialOfMax").html(data.onPotentialOfMax);
                $("#avOfPlMax").html(data.avOfPlMax);

                $("#analysisResultUnit").html(getUnit("analysisResult"));
                $("#onPotentialOfMaxUnit").html(getUnit("onPotentialOfMax")); 
                $("#avOfPlMaxUnit").html(getUnit("avOfPlMax")); 

                //输出电压
                $("#onPotentialOfMin").html(data.onPotentialOfMin);
                $("#avOfPlMin").html(data.avOfPlMin);
                $("#onPotentialOfAvg").html(data.onPotentialOfAvg);

                // 回路电阻
                $("#avOfPlAvg").html(data.avOfPlAvg);
                $("#cannotDetectReason").html(data.cannotDetectReason);
                $("#createUserName").html(data.createUserName);

               


                // console.log(data);
                var soilResistivity = data.soilResistivity?data.soilResistivity:0,
                    soilResistivitySpace = data.soilResistivitySpace?data.soilResistivitySpace:0,
                    soilResistivityResistance = data.soilResistivityResistance?data.soilResistivityResistance:0;

                $("#soilResistivitySpace").html(soilResistivitySpace); //测试间距
                $("#soilResistivityResistance").html(soilResistivityResistance);   //电阻值
                $("#soilResistivity").html(soilResistivity);   //土壤电阻率


                $("#remark").html(data.remark);

                $("#createTime").html(data.detectTime);//修改创建时间为检测时间
                $("#createUserName").html(data.createUserName);
                $("#remark").html(data.remark);
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "失败" });
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


/**
 * @desc 设置单位
 */
function setUnit(arr){
    if(arr.length>0){
        for(var i in arr){
            console.log(arr[i]);
        }
    }
}