/**
 * @file
 * @author: lixiaolong
 * @desc:查看任务模板
 * @date: 2017-03-02
 * @last modified by: 
 * @last modified time: 2017-08-30
 */
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
var objectId = getParameter("objectId"); //获取url路径中的值
// var oldTemplateName = "";
$(document).ready(function () {
    changePageStyle("../..");
    if (!isNull(objectId)) {
        queryTemplateById(objectId);
    }
});
/**
 * @desc 根据业务数据Id查询数据
 */
var result = [];
function queryTemplateById(objectId){
    var url = handleURL('/cloudlink-corrosionengineer/template/query?');
    var parameter = {
        "objectId": objectId,
        "token": token
    };
     $.ajax({
        type: "get",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: parameter,
        dataType: "json",
        success: function (res) {
            if (res.success == 1) {
                result = [];
                var data = res.list[0];
                var templateContentArr = JSON.parse(data.templateContent);
                var dataList = Enumerable.From(templateContentArr).GroupBy("$.typename",null,function(key,e){return {
                    typeName: key,
                    list:e.ToArray()
                }}).ToArray()
                result = templateContentArr;
                $("#templateName").html(data.templateName);
                renderPageByTemplate(templateContentArr);
            } else {
                parent.layer.alert(res.msg, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            parent.layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
        }
    });
} 
/**
 * @desc 根据模板渲染页面
 */
function renderPageByTemplate(templateContentArr){
    for(var i = 0;i<templateContentArr.length;i++){
        if(templateContentArr[i].isView == 1){
            appendHtml(templateContentArr[i]);
        }
    }
}
function appendHtml(obj){
    if(obj.bind == ""){
        appendNode1(obj);
    }else{
        appendNode2(obj);
    }
}
//将选择的字段添加到结果集展示列表
function appendNode1(obj){
    /*修改自定义关联字段显示问题*/
    var elementExist = $("#selectedResult").find("td[data-field-name='"+obj.fieldName+"']");
    if(elementExist.length>0){
        return;
    }
    /*修改自定义关联字段显示问题*/
    var htmlStr = '<tr name="'+obj.type+'">'+
                        '<td rowspan="2" class="middle tb-td-bg td-width1" name="'+obj.type+'">'+obj.typename+'</td>'+
                    '</tr>';
    var element = $("#selectedResult").find("td[name='"+obj.type+"']");
    if(element.length !=0){
        var rowspan = Number($(element).attr("rowspan"))+1;
        $(element).attr({ rowspan: rowspan});
        htmlStr = "";
    }
    htmlStr = htmlStr+
                    '<tr>'+
                        '<td colspan="2" class="tb-td-bg td-width1" data-field-name="'+obj.fieldName+'">'+obj.ch+'<span class="not-empty-mark not-empty-mark1" name="'+obj.fieldName+'">*</span></td>'+
                    '</tr>';
    $("#selectedResult").append(htmlStr);
    if(obj.required == 1){
        $("span[name='"+obj.fieldName+"']").css("display","inline-block");
    }
}
function appendNode2(obj){
    var bindstr = obj.bind;
    var bindArr = bindstr.split(",");
    var rowspanSecond = bindArr.length + 1;
    var rowspanFirst = rowspanSecond + 1;
    var htmlStrThird = "";
    for(var i = 0;i<bindArr.length;i++){
        var datasetArr = Enumerable.From(result).Where("x=>x.fieldId=='" + bindArr[i] + "'").ToArray();
        var dataset = datasetArr[0];
        var htmlStrThirdAdd = "";
        /*修改自定义关联字段显示问题*/
        var elementExist = $("#selectedResult").find("td[data-field-name='"+dataset.fieldName+"']");
        if(elementExist.length>0&&elementExist.bind==""&&dataset.fieldName!="couponArea"){
            var element2 = $("#selectedResult").find("td[data-field-name='"+dataset.fieldName+"']");
            $(element2).remove();
            var spanNum = Number($("#selectedResult").find("td[name='"+dataset.type+"']").attr("rowspan"))-1;
            $("#selectedResult").find("td[name='"+dataset.type+"']").attr({ rowspan: spanNum});
        }
        /*修改自定义关联字段显示问题*/
        if(dataset.required == 1){
            htmlStrThirdAdd = '<tr>'+
                                '<td class="td-width1 third" name="'+obj.fieldName+'" data-field-name="'+dataset.fieldName+'" data-parent-bind="'+obj.fieldId+'">'+dataset.ch+'<span class="not-empty-mark">*</span></td>'+
                            '</tr>';
        }else{
            htmlStrThirdAdd = '<tr>'+
                                '<td class="td-width1 third" name="'+obj.fieldName+'" data-field-name="'+dataset.fieldName+'" data-parent-bind="'+obj.fieldId+'">'+dataset.ch+'<span class="not-empty-mark not-empty-mark1">*</span></td>'+
                            '</tr>';
        }
        htmlStrThird = htmlStrThird + htmlStrThirdAdd;
    }
    var htmlStr = '<tr name="'+obj.type+'">'+
                        '<td rowspan='+rowspanFirst+' class="middle tb-td-bg td-width1" name="'+obj.type+'">'+obj.typename+'</td>'+
                    '</tr>'
    var element = $("#selectedResult").find("td[name='"+obj.type+"']");
    if(element.length !=0){
        var rowspan = Number($(element).attr("rowspan"))+rowspanSecond;
        $(element).attr({ rowspan: rowspan});
        htmlStr = '<tr>'+
                        '<td rowspan='+rowspanSecond+' class="tb-td-bg td-width1" name="'+obj.fieldName+'">'+obj.ch+'<span class="not-empty-mark not-empty-mark1" name="'+obj.fieldName+'">*</span></td>'+
                    '</tr>'+ htmlStrThird;
    }else{
        htmlStr = htmlStr+'<tr>'+
                        '<td rowspan='+rowspanSecond+' class="tb-td-bg td-width1" name="'+obj.fieldName+'">'+obj.ch+'<span class="not-empty-mark not-empty-mark1" name="'+obj.fieldName+'">*</span></td>'+
                    '</tr>'+ htmlStrThird;
    }
    $("#selectedResult").append(htmlStr);
    if(obj.required == 1){
        $("span[name='"+obj.fieldName+"']").css("display","inline-block");
    }
    //循环迭代关联字段
    // for(var i = 0;i<bindArr.length;i++){
    //     var element1 = Enumerable.From(result).Where("x=>x.fieldId=='" + bindArr[i] + "'").ToArray();
    //     var element1 = $("input[data-field-id='"+bindArr[i]+"']");
    //     var bind = $(element1)[0].dataset.bind;
    //     var bind = element1.bind;
    //     if(bind!=""&&$(element1)[0].value==0){//有子关联字段且还未添加到结果集
    //         appendNode2($(element1)[0]);
    //     }else{
    //         continue;
    //     }
    // }    
}