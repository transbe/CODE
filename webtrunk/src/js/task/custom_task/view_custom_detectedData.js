/**
 * @file
 * @author  gaohui
 * @desc 查看m2检测数据
 * @date  2017-03-02
 * @last modified by gaohui
 * @last modified time  2017-06-12 09:23:17
 */
var objectId = getParameter("id");    //获取检测数据ID
var templateId = getParameter('templateId');  
var taskId = "";      
var detectMethod = getParameter("detectMethod");  //获取检测方法
var token = lsObj.getLocalStorage('token'); //获取token
var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key

var detectionDataId = []; // 自定义模板检测项id数组
$(function () {
    changePageStyle("../../..");
   
    loadLayout(); // 加载自定义模板检测项
    getPhoto();
    setAnalysisResult(objectId,taskId,detectMethod);
});

/**
 * @desc 加载自定义模板检测项
 */
function loadLayout(){
    $.ajax({
        url: '/cloudlink-corrosionengineer/template/query?token=' + token +"&hasContent=1&isVisible=1&templateType=1&objectId=" + templateId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if(result.success == 1){
                // 分类
                var templateContent = JSON.parse(result.list[0].templateContent);
                var typeName = "";
                if(!isNull(templateContent)){
                    if(language == "en"){
                        typeName = "$.type"
                    }else{
                        typeName = "$.typename"
                    }
                    var dataList = Enumerable.From(templateContent).GroupBy(typeName,null,function(key,e){return {
                        typeName: key,
                        list:e.ToArray()
                    }}).ToArray();
                    for(var idx in dataList){
                        var trs = $('<tr class="items-tr">\
                                        <td colspan="4" class="tb-th-bg">'+ dataList[idx].typeName +'</td>\
                                    </tr>');
                        trs.insertBefore($("#insertThisBefore"));
                        var lists = dataList[idx].list,
                            itemsTr = $("<tr></tr>"),
                            count = 0;
                        for(var idx1 in lists){
                                count++;
                                var name = "";
                                if(language == "en"){
                                   name = (lists[idx1].en)?(lists[idx1].en + getUnit(lists[idx1].fieldName)):(lists[idx1].fieldName + getUnit(lists[idx1].fieldName))
                                }else{
                                   name = lists[idx1].ch + getUnit(lists[idx1].fieldName)
                                }
                                var fieldName = lists[idx1].fieldName;
                                switch (fieldName){
                                    case "propertyOfDrainageDevice":
                                        fieldName = "drainageVal";
                                        break;
                                    case "anodeMaterial":
                                        fieldName = "anodeMaterialVal";
                                        break;
                                }
                                var tds = $('<td class="middle tb-td-bg text-right td-width1">'+ name +'</td><td class="td-width1"><span id="'+ fieldName +'"></span></td>');
                                detectionDataId.push(fieldName);
                                tds.appendTo(itemsTr);
                                if(count==2){
                                    itemsTr.insertBefore($("#insertThisBefore"));
                                    count = 0;
                                    itemsTr = $("<tr></tr>");
                                }else if((count == 1) && (idx1 == lists.length-1)){
                                    itemsTr.insertBefore($("#insertThisBefore"));
                                    itemsTr.find("#"+fieldName).parent().attr("colspan","4");
                                    itemsTr = $("<tr></tr>");
                                }
                        }
                        var trs = $(' <tr class="tb-null-line">\
                                        <td colspan="4" class="tb-null-line"></td>\
                                    </tr>');
                        trs.insertBefore($("#insertThisBefore"));
                    }
                    loadData();
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
 * @desc 加载数据
 */
function loadData() {
    // console.log(detectionDataId);
    var riskFree =  getLanguageValue("riskFree");
    var high =  getLanguageValue("high");
    var low = getLanguageValue("low");
    $.ajax({
        url: '/cloudlink-corrosionengineer/task/getDetectionDataById?token=' + token + '&objectID=' + objectId,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if (result.success == "1"&&result.detectionData!=null) {
                var data = result.detectionData;
                taskId = data.taskId;
                // console.log(data);

                $("#markerNumber").html(data.markerNumber);
                $("#pipelineName").html(data.pipelineName);

                $("#cannotDetectReason").html(data.cannotDetectReason); //无法检测原因
                $("#createTime").html(data.detectTime);//修改创建时间为检测时间
                $("#createUserName").html(data.createUserName);
                $("#remark").html(data.remark);

                for(var tmp in detectionDataId){
                    if(detectionDataId[tmp] == "anodeMaterialVal"){
                        $("#anodeMaterialVal").html(getLanguageValue(data[detectionDataId[tmp]]));
                    }else if(detectionDataId[tmp] == "drainageVal"){
                         $("#drainageVal").html(getLanguageValue(data[detectionDataId[tmp]]));
                    }else{
                         $("#"+detectionDataId[tmp]).html(data[detectionDataId[tmp]]);
                    }
                }

                if(data.analysisResult == 1){
                    $("#analysisResult").html(riskFree); 
                }else if(data.analysisResult == 2){
                    $("#analysisResult").html(high);
                }else if(data.analysisResult == 3){
                    $("#analysisResult").html(low);
                }else{
                    $("#analysisResult").html("——"); 
                }
               
                try {
                    if (tjSwitch == 1) {
                        tjSdk.track('查看检测数据', { '任务类型': 'M' + detectMethod, "结果": "成功" });
                    }
                } catch (error) {

                }
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

