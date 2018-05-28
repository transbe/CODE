/**
 * @file
 * @author: lixiaolong
 * @desc:新增测试桩
 * @date: 2017-03-02
 * @last modified by: 
 * @last modified time: 2017-08-30
 */
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id
var objectId = getParameter("objectId"); //获取url路径中的值
var oldTemplateName = "";
var i18nLanguage = lsObj.getLocalStorage('i18nLanguage');
var Required = getLanguageValue("Required");
var NotRequired =  getLanguageValue("NotRequired");
// var dynamicDivStr = "";
var dynamicDivStr = "";
function setWidth(){
    $("#fieldZoom").width($("#addTempalte").width()-200);
}
$(document).ready(function () {
    $("#fieldZoom").width($("#addTempalte").width()-200);
    if(window.screen.width>1366){
        dynamicDivStr = "col-lg-4";
        // $("#templateNameLabel").removeClass("col-sm-3").addClass("col-lg-2");
        // $("#itmes_title").removeClass("col-sm-3").addClass("col-lg-2");
        // $("#fieldZoom").removeClass("col-sm-9").addClass("col-lg-10");
    }else{
        dynamicDivStr = "col-sm-6";
        // $("#templateNameLabel").removeClass("col-lg-2").addClass("col-sm-3");
        // $("#itmes_title").removeClass("col-lg-2").addClass("col-sm-3");
        // $("#fieldZoom").removeClass("col-lg-10").addClass("col-sm-9");
    }
    var leftHeight =  Number($(".left").height());
    var panelHeadingHeight =  Number($(".panel-heading").height());
    var resultDivHeiget = leftHeight - panelHeadingHeight - 50;
    // $("#resultDiv").height(resultDivHeiget);
    $(".panel-body").height(resultDivHeiget);
    changePageStyle("../..");
    queryAllField();
    if (!isNull(objectId)) {
        queryTemplateById(objectId);
    }
});
//获取全部字段
function queryAllField(){
    $.ajax({
        url: '/cloudlink-corrosionengineer/template/queryAllField?token=' + token,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if(result.success == 1){
                renderPage(result.allField);
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
//渲染页面（左侧条目）
function renderPage(result){
    var itmes_title_child = "";
    var dynamicHtml = "";
    for(var i=0;i<result.length;i++){
        var typeName = i18nLanguage !="zh"?result[i].type:result[i].typeName;
        if(result[i].fieldList.length>0){
            if(i == 0){
                itmes_title_child = itmes_title_child + '<div class="itmes_title itmes_title_click" name="'+result[i].type+'">'+typeName+'<span class="glyphicon glyphicon glyphicon-menu-right arrow arrow-color"></span></div>';
            }else{
                itmes_title_child = itmes_title_child + '<div class="itmes_title" name="'+result[i].type+'">'+typeName+'<span class="glyphicon glyphicon glyphicon-menu-right arrow"></span></div>';
            }
            renderItmes(result[i].fieldList);
        }
    }
    $("#itmes_title").append(itmes_title_child);
}
//渲染页面（数据字段）
function renderItmes(data){
    var dynamicDIV = '';
    for(var i=0;i<data.length;i++){
        var ch = i18nLanguage !="zh"?data[i].en:data[i].ch;
        if(data[i].type == "Potential"){
            if(data[i].isView == 0){
                dynamicDIV = dynamicDIV + 
                        '<div class="form-group '+dynamicDivStr+' hidden" name="'+data[i].type+'" style="display:none">'+
                            '<div class="row">'+
                                '<label class="col-sm-6">'+
                                    '<input type="checkbox" id="'+data[i].fieldName+'" name ="'+data[i].fieldName+'" data-field-id="'+data[i].id+'" data-bind="'+data[i].bind+'" data-field-name="'+data[i].fieldName+'" data-ch="'+data[i].ch+'" data-en="'+data[i].en+'" data-index='+data[i].index+' data-type='+data[i].type+' data-is-view='+data[i].isView+' data-required='+data[i].required+' data-typeName='+data[i].typeName+' data-default-unit='+data[i].defaultUnit+' data-view-unit='+data[i].viewUnit+' value="0" onclick="selectcheck(this)"><p class="fieldNameSpan">'+
                                    ch+'<span class="not-empty-mark not-empty-mark1" name="'+data[i].fieldName+'">*</span></p>'+
                                '</label>'+
                                '<div class="col-lg-2 col-sm-3 tag" onclick="setNoEmpty(this)">'+NotRequired+'</div>'+
                            '</div>'+
                        '</div>';
            }else{
                dynamicDIV = dynamicDIV + 
                            '<div class="form-group '+dynamicDivStr+'" name="'+data[i].type+'">'+
                                '<div class="row">'+
                                    '<label class="col-sm-6">'+
                                        '<input type="checkbox" id="'+data[i].fieldName+'" name ="'+data[i].fieldName+'" data-field-id="'+data[i].id+'" data-bind="'+data[i].bind+'" data-field-name="'+data[i].fieldName+'" data-ch="'+data[i].ch+'" data-en="'+data[i].en+'" data-index='+data[i].index+' data-type='+data[i].type+' data-is-view='+data[i].isView+' data-required='+data[i].required+' data-typeName='+data[i].typeName+' data-default-unit='+data[i].defaultUnit+' data-view-unit='+data[i].viewUnit+' value="0" onclick="selectcheck(this)"><p class="fieldNameSpan">'+
                                        ch+'</span><span class="not-empty-mark not-empty-mark1" name="'+data[i].fieldName+'">*</span></p>'+
                                    '</label>'+
                                    '<div class="col-lg-2 col-sm-3 tag" onclick="setNoEmpty(this)">'+NotRequired+'</div>'+
                                '</div>'+
                            '</div>';
            }
        }else{
            if(data[i].isView == 0){
                dynamicDIV = dynamicDIV + 
                        '<div class="form-group '+dynamicDivStr+' hidden" name="'+data[i].type+'" style="display:none">'+
                            '<div class="row">'+
                                '<label class="col-sm-6">'+
                                    '<input type="checkbox" id="'+data[i].fieldName+'" name ="'+data[i].fieldName+'" data-field-id="'+data[i].id+'" data-bind="'+data[i].bind+'" data-field-name="'+data[i].fieldName+'" data-ch="'+data[i].ch+'" data-en="'+data[i].en+'" data-index='+data[i].index+' data-type='+data[i].type+' data-is-view='+data[i].isView+' data-required='+data[i].required+' data-typename='+data[i].typeName+' data-default-unit='+data[i].defaultUnit+' data-view-unit='+data[i].viewUnit+' value="0" onclick="selectcheck(this)"><p class="fieldNameSpan">'+
                                    ch+'<span class="not-empty-mark not-empty-mark1" name="'+data[i].fieldName+'">*</span></p>'+
                                '</label>'+
                                '<div class="col-lg-2 col-sm-3 tag" onclick="setNoEmpty(this)">'+NotRequired+'</div>'+
                            '</div>'+
                        '</div>';
            }else{
                dynamicDIV = dynamicDIV + 
                        '<div class="form-group '+dynamicDivStr+'" name="'+data[i].type+'" style="display:none">'+
                            '<div class="row">'+
                                '<label class="col-sm-6">'+
                                    '<input type="checkbox" id="'+data[i].fieldName+'" name ="'+data[i].fieldName+'" data-field-id="'+data[i].id+'" data-bind="'+data[i].bind+'" data-field-name="'+data[i].fieldName+'" data-ch="'+data[i].ch+'" data-en="'+data[i].en+'" data-index='+data[i].index+' data-type='+data[i].type+' data-is-view='+data[i].isView+' data-required='+data[i].required+' data-typename='+data[i].typeName+' data-default-unit='+data[i].defaultUnit+' data-view-unit='+data[i].viewUnit+' value="0" onclick="selectcheck(this)"><p class="fieldNameSpan">'+
                                    ch+'<span class="not-empty-mark not-empty-mark1" name="'+data[i].fieldName+'">*</span></p>'+
                                '</label>'+
                                '<div class="col-lg-2 col-sm-3 tag" onclick="setNoEmpty(this)">'+NotRequired+'</div>'+
                            '</div>'+
                        '</div>';
            }
        }
    }
    $(".itmes_body").prepend(dynamicDIV);
    if(i18nLanguage!="zh"){
        $(".tag").width(65);
    }
}
//设置字段必填属性
function setNoEmpty(obj){
    var inputEle = $(obj).prev().find("input")[0];
    var id =  $(obj).prev().find("input")[0].id;
    if(inputEle.dataset.bind!=""){
        var bindstr = inputEle.dataset.bind;
        var bindArr = bindstr.split(",");
        for(var i=0;i<bindArr.length;i++){
            var elementId = $("input[data-field-id='"+bindArr[i]+"']")[0].id
            if($("#"+elementId).parent().next().text() == $(obj).text()){
                setNoEmpty($("#"+elementId).parent().next());
            }
        }
    }
    if($(obj).text() == NotRequired){
        $(obj).text(Required);
        $(obj).prev().find("input")[0].dataset.required = 1;
        $("span[name='"+id+"']").css("display","inline");
    }else{
        // if($("#selectedResult").find("td[data-field-name='"+id+"']").length<2){
        // }
        $(obj).text(NotRequired);
        $(obj).prev().find("input")[0].dataset.required = 0;
        $("span[name='"+id+"']").css("display","none");
    }
    
}
//点击字段前的复选框
function selectcheck(obj){
    if(obj.value == 0){
        obj.value = 1;
        appendHtml(obj);    
    }else{
        obj.value = 0;
        var element = $(obj).parent().next();
        removeHtml(obj);
    }
}
function appendHtml(obj){
    if(obj.dataset.bind == ""){
        appendNode1(obj);
    }else{
        appendNode2(obj);
    }
}
function removeHtml(obj){
    if(obj.dataset.bind == ""){
        removeNode1(obj);
    }else{
        removeNode2(obj,true);
    }
}
//将选择的字段添加到结果集展示列表
function appendNode1(obj){
    var typename = i18nLanguage !="zh"?obj.dataset.type:obj.dataset.typename;
    var ch = i18nLanguage !="zh"?obj.dataset.en:obj.dataset.ch
    var htmlStr = '<tr name="'+obj.dataset.type+'">'+
                        '<td rowspan="2" class="middle tb-td-bg td-width1" name="'+obj.dataset.type+'">'+typename+'</td>'+
                    '</tr>';
    var element = $("#selectedResult").find("td[name='"+obj.dataset.type+"']");
    if(element.length !=0){
        var rowspan = Number($(element).attr("rowspan"))+1;
        $(element).attr({ rowspan: rowspan});
        htmlStr = "";
        htmlStr = htmlStr+
                        '<tr>'+
                            '<td colspan="2" class="tb-td-bg td-width1" name="'+obj.id+'" data-field-name="'+obj.id+'">'+ch+'<span class="not-empty-mark not-empty-mark1" name="'+obj.id+'">*</span></td>'+
                        '</tr>';
        $(element).parent().after(htmlStr);
    }else{
        htmlStr = htmlStr+
                        '<tr>'+
                            '<td colspan="2" class="tb-td-bg td-width1" name="'+obj.id+'" data-field-name="'+obj.id+'">'+ch+'<span class="not-empty-mark not-empty-mark1" name="'+obj.id+'">*</span></td>'+
                        '</tr>';
        $("#selectedResult").append(htmlStr);
    }
    if(obj.dataset.required == 1){
        $("span[name='"+obj.id+"']").css("display","inline");
    }
}
function appendNode2(obj){
    $(obj)[0].checked=true;
    // $(obj)[0].value = 1;

    var bindstr = obj.dataset.bind;
    var bindArr = bindstr.split(",");
    var rowspanSecond = bindArr.length + 1;
    var rowspanFirst = rowspanSecond + 1;
    var htmlStrThird = "";
    for(var i = 0;i<bindArr.length;i++){
        var element1 = $("input[data-field-id='"+bindArr[i]+"']");
        var dataset = $(element1)[0].dataset;
        /*修改自定义关联字段显示问题*/
        if($(element1)[0].value==1&&dataset.bind==""&&dataset.fieldName!="couponArea"){
            var element2 = $("#selectedResult").find("td[data-field-name='"+dataset.fieldName+"']");
            $(element2).remove();
            var spanNum = Number($("#selectedResult").find("td[name='"+dataset.type+"']").attr("rowspan"))-1;
            $("#selectedResult").find("td[name='"+dataset.type+"']").attr({ rowspan: spanNum});
        }
        /*修改自定义关联字段显示问题*/
        $(element1)[0].value = 1;
        htmlStrThird = htmlStrThird + 
                    '<tr>'+
                        '<td class="td-width1 third" name="'+obj.dataset.fieldName+'" data-field-name="'+dataset.fieldName+'" data-parent-bind="'+obj.dataset.fieldId+'">'+(i18nLanguage !="zh"?dataset.en:dataset.ch)+'<span class="not-empty-mark not-empty-mark1" name="'+$(element1)[0].id+'">*</span></td>'+
                    '</tr>'
    }
    var htmlStr = '<tr name="'+obj.dataset.type+'">'+
                        '<td rowspan='+rowspanFirst+' class="middle tb-td-bg td-width1" name="'+obj.dataset.type+'">'+(i18nLanguage !="zh"?obj.dataset.type:obj.dataset.typename)+'</td>'+
                    '</tr>'
    var element = $("#selectedResult").find("td[name='"+obj.dataset.type+"']");
    if(element.length !=0){
        var rowspan = Number($(element).attr("rowspan"))+rowspanSecond;
        $(element).attr({ rowspan: rowspan});
        htmlStr = '<tr>'+
                        '<td rowspan='+rowspanSecond+' class="tb-td-bg td-width1" name="'+obj.id+'">'+(i18nLanguage !="zh"?obj.dataset.en:obj.dataset.ch)+'<span class="not-empty-mark not-empty-mark1" name="'+obj.id+'">*</span></td>'+
                    '</tr>'+ htmlStrThird;
        $(element).parent().after(htmlStr);
    }else{
        htmlStr = htmlStr+'<tr>'+
                        '<td rowspan='+rowspanSecond+' class="tb-td-bg td-width1" name="'+obj.id+'">'+(i18nLanguage !="zh"?obj.dataset.en:obj.dataset.ch)+'<span class="not-empty-mark not-empty-mark1" name="'+obj.id+'">*</span></td>'+
                    '</tr>'+ htmlStrThird;
        $("#selectedResult").append(htmlStr);
    }
    if(obj.dataset.required == 1){
        $("span[name='"+obj.id+"']").css("display","inline");
    }
    //循环迭代关联字段
    for(var i = 0;i<bindArr.length;i++){
        var element1 = $("input[data-field-id='"+bindArr[i]+"']");
        var bind = $(element1)[0].dataset.bind;
        if(bind!=""&&!$(element1)[0].checked){//有子关联字段且还未添加到结果集
            appendNode2($(element1)[0]);
        }else{
            $(element1)[0].checked = true;
        }
    }    
}
//将字段从结果集展示列表中移除
function removeNode1(obj){
    var element = $("#selectedResult").find("td[name='"+obj.dataset.type+"']");
    var elementNode = $("#selectedResult").find("td[data-field-name='"+obj.id+"']");
    for(var i=0;i<elementNode.length;i++){
        if(!$(elementNode[i]).hasClass("third")){
            $(elementNode[i]).parent().remove();
            var rowspan = Number($(element).attr("rowspan"));
            if(rowspan > 2){
                rowspan--;
                $(element).attr({ rowspan: rowspan});
            }else{
                $(element).parent().remove();
            }
        }else{
            obj.value=1;
            obj.checked=true;
        }
    }
}
//将字段从结果集展示列表中移除(flag：是否删除子关联节点)
function removeNode2(obj,flag){
    //删除父关联节点
    var elementThirdNode = $("#selectedResult").find(".third[data-field-name='"+obj.id+"']");
    if(elementThirdNode.length>0){
        var parentBind = $(elementThirdNode)[0].dataset.parentBind;    //父级绑定字段
        var inputEle = $("input[data-field-id='"+parentBind+"']");
        inputEle[0].value = 0;
        inputEle[0].checked = false;
        removeNode2(inputEle[0],false);
    }
    //删除本身节点
    var bindstr = obj.dataset.bind;
    var bindArr = bindstr.split(",");
    var length = bindArr.length;
    var element = $("#selectedResult").find("td[name='"+obj.dataset.type+"']");
    var elementNode = $("#selectedResult").find("td[name='"+obj.id+"']");
    $(elementNode).parent().remove();
    var rowspan = Number($(element).attr("rowspan"));
    if(rowspan > 4){
        rowspan = rowspan-length-1;
        $(element).attr({ rowspan: rowspan});
    }else{
        $(element).parent().remove();
    }
    //删除子关联节点
    if(flag){
        for(var i = 0;i<length;i++){
            var element1 = $("input[data-field-id='"+bindArr[i]+"']");
            var dataset = $(element1)[0].dataset;
            if(!$("#selectedResult").find("td[data-field-name='"+$(element1)[0].id+"']").length>0){
                $(element1)[0].checked=false;
                $(element1)[0].value = 0;
            }
            if(dataset.bind!=""){
                removeNode2($(element1)[0],true);
            }
        }
    }
}
//获取页面所有选中的CheckBox
function getchecked(){
    var arr = $("input[value='1']");
    var templateContentArr = [];
    if(arr.length>0){
        for(var i=0;i<arr.length;i++){
            templateContentArr.unshift(arr[i].dataset);
        }
    }
    return templateContentArr;
}
/**
 * @desc 表单校验
 */
$('#addTempalte').bootstrapValidator({
    fields: {
        templateName: {
            validators: {
                notEmpty: {},
            }
        }
    }
});
/**
 * @desc 根据业务数据Id查询数据
 */
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
                var data = res.list[0];
                var templateContentArr = JSON.parse(data.templateContent);
                oldTemplateName = data.templateName
                $("#templateName").val(data.templateName);
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
        var elementId = "#"+templateContentArr[i].fieldName;
        if(templateContentArr[i].isView==1){
            $(elementId)[0].checked=true;    
            $(elementId)[0].value = 1;
            if(!$(elementId).hasClass("hidden")){
                appendHtml($(elementId)[0]);
            }
        }
        if(templateContentArr[i].required == "1"){
            try{
                $(elementId)[0].dataset.required = 1;
                $("#selectedResult").find("td[name='"+templateContentArr[i].fieldName+"']").children().css("display","inline")
                $(elementId).next().find("span").css("display","inline");
                $(elementId).parent().next().text(Required);
            }catch(e){
                alert(e);
            }
        }
    }
}
/**
 * @desc 表单提交
 */
function saveData() {
    var result = false;
    var check = $('#addTempalte').data('bootstrapValidator');
    check.validate();
    if (check.isValid()) {
        var templateContentArr = getchecked(); 
        if(templateContentArr.length == 0){
            parent.layer.alert(getLanguageValue("selectTip"), {
                title: getLanguageValue("tip_title"),
                skin: 'self-alert'
            });
            return;
        }
        var url = "/cloudlink-corrosionengineer/template/add?token=" + token;
        var parameter = {
            "templateContent": JSON.stringify(templateContentArr),
            "templateType": "1",
            "isVisible": "1"
        };
        if (!isNull(objectId)) {
            parameter.objectId = objectId;
            if(oldTemplateName != $("#templateName").val()){
                parameter.templateName = $("#templateName").val();
            }
            url = "/cloudlink-corrosionengineer/template/update?token=" + token;
        }else{
            parameter.templateName = $("#templateName").val();
        }
        $.ajax({
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "post",
            async: false,
            data: JSON.stringify(parameter),
            success: function (res) {
                if (res.success == 1) {
                    //诸葛IO
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增任务模板', {
                                // '任务类型': 'M' + detectMethod,
                                "结果": "成功"
                            });
                        }
                    } catch (err) {

                    }

                    parent.layer.msg("成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    parent.layer.msg(getLanguageValue("saveSuccess"), {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });

                    result = true;
                } else {
                    try {
                        if (zhugeSwitch == 1) {
                            zhuge.track('新增任务模板', {
                                // '任务类型': 'M' + detectMethod,
                                "结果": "失败"
                            });
                        }
                    } catch (err) {

                    }
                    parent.layer.alert(res.msg, {
                        title: getLanguageValue("tip_title"),
                        skin: 'self-alert'
                    });
                    result = false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                parent.layer.alert(NET_ERROR_MSG, {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert'
                });
                result = false;
            }
        });
        return result;
    } else {
        return false
    }

}
//点击左侧条目时触发事件
$("#itmes_title").delegate("div","click",function(){
    var name = $(this).attr("name");
    $(this).addClass("itmes_title_click");
    $(this).siblings().removeClass("itmes_title_click");
    $(this).children().addClass("arrow-color");
    $(this).siblings().children().removeClass("arrow-color");
    $(".itmes_body div[name='"+name+"']").show();
    $(".itmes_body").children("div[name!='"+name+"']").hide();
    $(".description").css({position: "relative"});
    if($(".itmes_body").height()>360){
        $(".description").css({position: "relative"});
    }else{
        $(".description").css({position: "absolute"});
    }
});

// 阻止浏览器默认事件：点击enter键自动提交
$("#addTempalte").keydown(function(e) {
    if (event.keyCode == "13") { //keyCode=13是回车键
        if ( e && e.preventDefault ){ 
            e.preventDefault(); 
        //IE中阻止函数器默认动作的方式 
        }else{
            window.event.returnValue = false; 
        }
    }
});