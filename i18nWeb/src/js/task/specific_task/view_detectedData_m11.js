/**
 * @file
 * @author  gaohui
 * @desc 查看m2检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:17
 */
var objectId = getParameter("id");    //获取检测数据ID
var taskId = "";      
var detectMethod = getParameter("detectMethod");  //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
    changePageStyle("../../..");
    getPhoto();
    loadData(); //加载数据
    setAnalysisResult(objectId,taskId,detectMethod);
});

/**
 * @desc 加载数据
 */
function loadData() {
    // var riskFree =  getLanguageValue("riskFree");
    // var high =  getLanguageValue("high");
    // var low = getLanguageValue("low");
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
                // if(data.analysisResult == 1){
                //     $("#analysisResult").html(riskFree);      
                // }else if(data.analysisResult == 2){
                //     $("#analysisResult").html(high);
                // }else if(data.analysisResult == 3){
                //     $("#analysisResult").html(low);
                // }else{
                //     $("#analysisResult").html("——"); 
                // }
                //通电电位
                $("#onPotentialOfMax").html(data.onPotentialOfMax);   //通电电位
                $("#onPotentialOfMin").html(data.onPotentialOfMin); 
                $("#onPotentialOfAvg").html(data.onPotentialOfAvg); 
                //交流电压
                $("#avOfPlMax").html(data.avOfPlMax);   
                $("#avOfPlMin").html(data.avOfPlMin);   
                $("#avOfPlAvg").html(data.avOfPlAvg); 

                $("#plOffPotentialAnodeDisconnectedMax").html(data.plOffPotentialAnodeDisconnectedMax);   //断开阳极管道电位（mV）
                $("#plOffPotentialAnodeDisconnectedMin").html(data.plOffPotentialAnodeDisconnectedMin);   //断开阳极管道电位（mV）
                $("#plOffPotentialAnodeDisconnected").html(data.plOffPotentialAnodeDisconnected);   //断开阳极管道电位（mV）
                $("#offPotentialOfCouponMax").html(data.offPotentialOfCouponMax);                   //试片断电电位（mV）
                $("#offPotentialOfCouponMin").html(data.offPotentialOfCouponMin);                   //试片断电电位（mV）
                $("#offPotentialOfCouponAvg").html(data.offPotentialOfCouponAvg);                   //试片断电电位（mV）
                $("#selfCorrisionPotential").html(data.selfCorrisionPotential);                     //自腐蚀电位（mV）
                // 电流密度检测(交流电流（mA）)
                $("#plToCouponAcMax").html(data.plToCouponAcMax);   
                $("#plToCouponAcMin").html(data.plToCouponAcMin); 
                $("#plToCouponAcAvg").html(data.plToCouponAcAvg);
                // 电流密度检测(直流电流（mA）)
                $("#couponToPlDcMax").html(data.couponToPlDcMax);   
                $("#couponToPlDcMin").html(data.couponToPlDcMin); 
                $("#couponToPlDcAvg").html(data.couponToPlDcAvg);
                // 电流密度检测(交流电流密度)
                $("#couponAcDensityMax").html(data.couponAcDensityMax);   
                $("#couponAcDensityMin").html(data.couponAcDensityMin); 
                $("#couponAcDensityAvg").html(data.couponAcDensityAvg);
                // 电流密度检测(直流电流密度)
                $("#couponDcDensityMax").html(data.couponDcDensityMax);   
                $("#couponDcDensityMin").html(data.couponDcDensityMin); 
                $("#couponDcDensityAvg").html(data.couponDcDensityAvg);
                //试片面积（cm^2）
                $("#couponArea").html(data.couponArea);
                // 阳极
                $("#plToCouponAcMax").html(data.plToCouponAcMax);   //交流电流最大值
                $("#couponToPlDcMax").html(data.couponToPlDcMax);   //直流电流最大值
                $("#plToCouponAcMin").html(data.plToCouponAcMin);   //交流电流最小值
                $("#couponToPlDcMin").html(data.couponToPlDcMin);   //直流电流最小值
                $("#plToCouponAcAvg").html(data.plToCouponAcAvg);   //交流电流平均值
                // 牺牲阳极性能
                $("#potentialOfAnodeDisconnected").html(data.potentialOfAnodeDisconnected);   //单支开路电位
                $("#currentFromPlToAnode").html(data.currentFromPlToAnode); //单支输出电流
                $("#sumCurrentFromPlToAnode").html(data.sumCurrentFromPlToAnode); //总输出电流
                $("#anodeGroundResistance").html(data.anodeGroundResistance); //接地电阻
                // 土壤电阻率检测
                $("#soilResistivitySpace").html(data.soilResistivitySpace); //测试间距
                $("#soilResistivityResistance").html(data.soilResistivityResistance);   //电阻值
                $("#soilResistivity").html(data.soilResistivity);   //土壤电阻率
                //牺牲阳极属性
                $("#anodeWeight").html(data.anodeWeight); //重量（kg）
                // 断开阳极交流电压
                $("#avOfPlAnodeDisconnectedMax").html(data.avOfPlAnodeDisconnectedMax);   
                $("#avOfPlAnodeDisconnectedMin").html(data.avOfPlAnodeDisconnectedMin); 
                $("#avOfPlAnodeDisconnectedAvg").html(data.avOfPlAnodeDisconnectedAvg);
                // 排流器直流漏流量
                $("#leakageCurrentMax").html(data.leakageCurrentMax);   
                $("#leakageCurrentMin").html(data.leakageCurrentMin); 
                $("#leakageCurrentAvg").html(data.leakageCurrentAvg);
                // 断开阳极交流电压
                $("#acDrainageMax").html(data.acDrainageMax);   
                $("#acDrainageMin").html(data.acDrainageMin); 
                $("#acDrainageAvg").html(data.acDrainageAvg);

                $("#phOfSoil").html(data.phOfSoil);
                $("#propertyOfDrainageDevice").html(data.drainageVal);
                $("#anodeInstalationDate").html(data.anodeInstalationDate);   //安装日期
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

                $("#cannotDetectReason").html(data.cannotDetectReason); //无法检测原因
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
        error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
}

