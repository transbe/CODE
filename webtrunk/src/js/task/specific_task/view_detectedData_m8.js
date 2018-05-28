/**
 * @file
 * @author  gaohui
 * @desc 查看m8检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:22:51
 */
var objectId = getParameter("id");  //获取检测数据ID
var taskId = "";                            //任务Id
var token = lsObj.getLocalStorage("token"); //获取token
var detectMethod = getParameter("detectMethod");    //获取检测方法
$(function () {
    var setUnitArr=["onPotentialOfMax","onPotentialOfMin","onPotentialOfAvg","offPotentialOfMax","offPotentialOfMin","offPotentialOfAvg","couponOfPlNonProtectSideMax","couponOfPlNonProtectSideMin","couponOfPlNonProtectSide","offPotentialOfPlNonProtectSideMax","offPotentialOfPlNonProtectSideMin","offPotentialOfPlNonProtectSideAvg","avOfPlAvg","plOffAcPotentialSsdDisconnectedMax","avOfPlNonProtectSide","crossoverCurrent"];


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
    var good =  getLanguageValue("good");
    var shorted = getLanguageValue("shorted");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '结果': '成功', '任务类型': 'M8' });
                    }
                } catch (error) {

                }
                var data = result.detectionData;
                taskId = data.taskId;
                if (data != null) {
                    $("#markerNumber").html(data.markerNumber);
                    $("#pipelineName").html(data.pipelineName);
                    // if(data.analysisResultVal == null){
                    //     $("#analysisResult").html("——");      
                    // }else{
                    //     $("#analysisResult").html(data.analysisResultVal);
                    // }

                    if(data.analysisResult == 1){
                        $("#analysisResult").html(good);      
                    }else if(data.analysisResult == 2){
                        $("#analysisResult").html(shorted);
                    }else{
                        $("#analysisResult").html("——"); 
                    }
                    // $("#onPotentialOfAvg").html(data.onPotentialOfAvg);
                    // $("#avOfPlAvg").html(data.avOfPlAvg);
                    // $("#couponOfPlNonProtectSide").html(data.couponOfPlNonProtectSide);
                    // $("#avOfPlNonProtectSide").html(data.avOfPlNonProtectSide);
                    // $("#avOfPlNonProtectSide").html(data.avOfPlNonProtectSide);
                    // $("#crossoverCurrent").html(data.crossoverCurrent);

                    // 站外通电电位
                    $("#onPotentialOfMax").html(data.onPotentialOfMax);
                    $("#onPotentialOfMin").html(data.onPotentialOfMin);
                    $("#onPotentialOfAvg").html(data.onPotentialOfAvg);

                    // 站外管道断电电位
                    $("#offPotentialOfMax").html(data.offPotentialOfMax);
                    $("#offPotentialOfMin").html(data.offPotentialOfMin);
                    $("#offPotentialOfAvg").html(data.offPotentialOfAvg);

                    // 站内通电电位
                    $("#couponOfPlNonProtectSideMax").html(data.couponOfPlNonProtectSideMax);
                    $("#couponOfPlNonProtectSideMin").html(data.couponOfPlNonProtectSideMin);
                    $("#couponOfPlNonProtectSide").html(data.couponOfPlNonProtectSide);

                    // 站内断电电位
                    $("#offPotentialOfPlNonProtectSideMax").html(data.offPotentialOfPlNonProtectSideMax);
                    $("#offPotentialOfPlNonProtectSideMin").html(data.offPotentialOfPlNonProtectSideMin);
                    $("#offPotentialOfPlNonProtectSideAvg").html(data.offPotentialOfPlNonProtectSideAvg);


                    // 其它
                    $("#avOfPlAvg").html(data.avOfPlAvg);
                    $("#plOffAcPotentialSsdDisconnectedMax").html(data.plOffAcPotentialSsdDisconnectedMax);
                    $("#avOfPlNonProtectSide").html(data.avOfPlNonProtectSide);
                    $("#crossoverCurrent").html(data.crossoverCurrent);

                    // 通用
                    $("#cannotDetectReason").html(data.cannotDetectReason);
                    $("#createTime").html(data.detectTime);//修改创建时间为检测时间
                    $("#createUserName").html(data.createUserName);
                    $("#remark").html(data.remark);
                }
            } else {
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '结果': '失败', '任务类型': 'M8' });
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