/**
 * @file
 * @author  gaohui
 * @desc 查看m2检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:17
 */
var objectId = getParameter("id");    //获取检测数据ID
var detectMethod = getParameter("detectMethod");  //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
$(function () {
    var setUnitArr=["avOfPlMax","onPotentialOfCouponMax","offPotentialOfCouponAvg","avOfPlMin","onPotentialOfCouponMin","avOfPlAvg","onPotentialOfCouponAvg","couponArea","plToCouponAcMax","couponToPlDcMax","plToCouponAcMin","couponToPlDcMin","plToCouponAcAvg","couponToPlDcAvg","couponAcDensityMax","couponDcDensityMax","couponAcDensityMin","couponDcDensityMin","couponAcDensityAvg","couponDcDensityAvg","soilResistivitySpace","soilResistivityResistance","soilResistivity","selfCorrisionPotential"];


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
                $("#analysisResult").html(analysisResultVal);
                //输出电流

                $("#avOfPlMax").html(data.avOfPlMax);   //交流电压最大值
                $("#onPotentialOfCouponMax").html(data.onPotentialOfCouponMax); //试片通电电位最大值
               
                //输出电压
                $("#offPotentialOfCouponAvg").html(data.offPotentialOfCouponAvg);   //试片断电电位平均值
                $("#avOfPlMin").html(data.avOfPlMin);   //交流电压最小值
                $("#onPotentialOfCouponMin").html(data.onPotentialOfCouponMin); //试片通电电位最小值

                // 回路电阻
                $("#avOfPlAvg").html(data.avOfPlAvg);   //交流电压平均值
                $("#onPotentialOfCouponAvg").html(data.onPotentialOfCouponAvg); //试片通电电位平均值
                $("#couponArea").html(data.couponArea);//杂散电流试片面积
 
                // 阳极
                $("#plToCouponAcMax").html(data.plToCouponAcMax);   //交流电流最大值
                $("#couponToPlDcMax").html(data.couponToPlDcMax);   //直流电流最大值
                $("#plToCouponAcMin").html(data.plToCouponAcMin);   //交流电流最小值
                $("#couponToPlDcMin").html(data.couponToPlDcMin);   //直流电流最小值
                $("#plToCouponAcAvg").html(data.plToCouponAcAvg);   //交流电流平均值


                // 汇流
                $("#couponToPlDcAvg").html(data.couponToPlDcAvg);   //直流电流平均值
                $("#couponAcDensityMax").html(data.couponAcDensityMax); //交流电流密度最大值
                $("#couponDcDensityMax").html(data.couponDcDensityMax); //直流电流密度最大值

                $("#ratioOfCouponDcAc").html(data.ratioOfCouponDcAc);   //交直流密度比平均值
                $("#couponAcDensityMin").html(data.couponAcDensityMin); //交流电流密度最小值
                // 交流电流密度最小值
                $("#couponDcDensityMin").html(data.couponDcDensityMin); //直流电流密度最小值
                $("#couponAcDensityAvg").html(data.couponAcDensityAvg); //交流电流密度平均值
                $("#couponDcDensityAvg").html(data.couponDcDensityAvg); //直流电流密度平均值


                $("#soilResistivitySpace").html(data.soilResistivitySpace); //测试间距
                $("#soilResistivityResistance").html(data.soilResistivityResistance);   //电阻值
                $("#soilResistivity").html(data.soilResistivity);   //土壤电阻率
                
                $("#cannotDetectReason").html(data.cannotDetectReason); //无法检测原因

                $("#selfCorrisionPotential").html(data.selfCorrisionPotential); //自腐蚀电位
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


