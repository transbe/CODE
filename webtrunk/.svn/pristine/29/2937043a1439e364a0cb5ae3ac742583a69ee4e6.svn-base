/**
 * @file
 * @author: lizz
 * @desc:自定义单位
 * @date: 2017-11-12 13:07:38
 * @last modified by: lizz
 * @last modified time: 2017-11-12 13:07:45
 */

var token = lsObj.getLocalStorage("token"); //获取token
var language = lsObj.getLocalStorage('i18nLanguage');
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id

$(function(){
    changePageStyle("../.."); // 切换主题
    setHeight(); // 设置高度
    $(window).bind("resize", setHeight);

    getSupportTransField(); // 获取支持的单位转换

    $("#setUnitBtn").on("click",function(){
        setEnpUnit();
    });

    $(".item-title").click(function() {
        switch (this.id) {
            case "item_1":
                $("#container_1").slideToggle("normal");
                break;
            case "item_2":
                $("#container_2").slideToggle("normal");
                break;
            case "item_3":
                $("#container_3").slideToggle("normal");
                break;
            default:
                break;
        }
    });

    // 为修改默认设置的项目添加class
    $("#supportTransField").on("click",'input',function(){
        var defaultUnit = $(this).attr("data-defaultUnit"),
            viewUnit = $(this).val();
        if(defaultUnit != viewUnit){
            console.log("!!!!!!")
            $(this).addClass("change-default");
            $(this).parent(".item-body-title").parent(".container").last().find(".support-items").addClass("update-items")
        }else{
            console.log("====")
            $(this).removeClass("change-default");
            $(this).parent(".item-body-title").parent(".container").last().find(".support-items").removeClass("update-items")
        }
    })
})

/**
 * @desc 设置tab切换内容的高度
 */
function setHeight(){
    var winH = $(window).height();
    $(".container-box").height(winH-15);
}


/**
 * @desc 获取支持的单位转换
 */
function getSupportTransField(){
     $.ajax({
        type: "get",
        url: handleURL('/cloudlink-corrosionengineer//userInfo/getSupportTransField?token='+token),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if(res.success ==1){
                var allField = res.allField;
                if(allField.length>0){
                    $("#item_1_body").empty();
                    for(var tmp in allField){
                        var tmpObj = allField[tmp],
                            showFieldName = tmpObj.ch; // 要显示的名字
                        if(language == "en"){
                            showFieldName = tmpObj.en?tmpObj.en:tmpObj.fieldName
                        };
                        var tmpHtml = '<div class="col-xs-6 col-sm-4  col-md-3 support-items" id="'+ tmpObj.id +'" data-ch="'+ tmpObj.ch +'"  data-en="'+ tmpObj.en +'" data-defaultUnit="'+ tmpObj.defaultUnit +'" data-fieldName="'+ tmpObj.fieldName +'">'+ showFieldName + '</div>';
                        $("#item_1_body").append(tmpHtml);
                        var inputs = $("#container_1").find("input");
                        if(inputs.length>0){
                            for(var i = 0 ; i < inputs.length; i++){
                                if($(inputs[i]).val() == allField[0].defaultUnit){
                                    $(inputs[i]).prop("checked","checked");
                                }
                                $(inputs[i]).attr("data-defaultUnit",allField[0].defaultUnit);
                            }
                        }
                    }
                    queryEnpUnit();
                }else{
                    $("#item_1_body").empty();
                    $("#item_1_body").append('<h4 class="no-data-show">暂时没有可以自定义单位的数据</h4>');
                }
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
 * @desc 查询企业的单位设置
 */
function queryEnpUnit(){
   $.ajax({
        type: "get",
        url: handleURL('/cloudlink-corrosionengineer/userInfo/queryEnpUnit?token='+token+"&enterpriseId="+enterpriseId),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if(res.success ==1){
                if(!isNull(res.unit)){
                    var setEnpUnit = JSON.parse(res.unit.content);
                    if(setEnpUnit.length>0){
                        var checkInput = $("#container_1").find("input");
                        if(checkInput.length>0){
                            for(var j = 0 ; j < checkInput.length; j++){
                                if($(checkInput[j]).val() == setEnpUnit[0].viewUnit){
                                    $(checkInput[j]).prop("checked","checked");
                                    if($(checkInput[j]).attr("data-defaultUnit") != setEnpUnit[0].viewUnit){
                                       $("#item_1_body").find(".support-items").addClass("update-items");
                                    }
                                }
                            }
                        }
                    }
                }
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
 * @desc 企业的单位设置
 */
function setEnpUnit(){
   var _data = {
       "enterpriseId":enterpriseId,
       "content":JSON.stringify(getRnpUndateUnit())
   }
   $.ajax({
        type: "post",
        url: handleURL('/cloudlink-corrosionengineer/userInfo/updateEnpUnit?token=' + token),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(_data),
        success: function (res) {
            if(res.success == 1){
                parent.layer.alert(getLanguageValue("update_success"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert',
                    yes:function(){
                        updateDefaultUnit(_data.content);
                    }
                });
            }else{
                parent.layer.alert(getLanguageValue("update_fail"), {
                    title: getLanguageValue("tip_title"),
                    skin: 'self-alert',
                    yes:function(){
                        location.reload();
                        parent.layer.closeAll();
                    }
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
 * @desc 获取企业修改的单位
 */
function getRnpUndateUnit(){
    var updateArr = []; // 修改的单位
    var updateItems = $("#supportTransField").find(".update-items");
    for(var i = 0; i < updateItems.length; i++){
        var arrItems = {
            ch:$(updateItems[i]).attr("data-ch"),
            defaultUnit:$(updateItems[i]).attr("data-defaultUnit"),
            en:$(updateItems[i]).attr("data-en"),
            fieldName:$(updateItems[i]).attr("data-fieldName"),
            id:$(updateItems[i]).attr("id"),
            viewUnit:$("#supportTransField").find("input:checked").val()
        };
        updateArr.push(arrItems);
    }
    return updateArr;
}


/**
 * @desc 获取全部字段
 * @param 
 */
function queryAllField(){
    var defaultUnit = [];
    $.ajax({
        url: '/cloudlink-corrosionengineer/template/queryAllField?token=' + token,
        dataType: 'json',
        type: 'get',
        async:false,
        success: function (result) {
            if(result.success == 1){
                var  allField = result.allField;
                for(var tep in allField){
                    var typeItems = allField[tep];
                    for(var tep1 in typeItems.fieldList){
                        var items = typeItems.fieldList[tep1];
                        var itemsObj = {
                            fieldName:items.fieldName,
                            defaultUnit:items.defaultUnit
                        }
                        defaultUnit.push(itemsObj);
                    }
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
    return  defaultUnit;
}


/**
 * @desc 修改默认单位
 * @param 
 */
function updateDefaultUnit(updateArr){
    var defaultUnitArr = queryAllField();
    var updateArr = JSON.parse(updateArr);
    if(updateArr.length>0){
        for(var idx in updateArr){
            for(var idx1 in defaultUnitArr){
                if(defaultUnitArr[idx1].fieldName == updateArr[idx].fieldName){
                    defaultUnitArr[idx1].defaultUnit = updateArr[idx].viewUnit
                }
            }
        }
    }
    lsObj.setLocalStorage('defaultUnitArr', JSON.stringify(defaultUnitArr));
    location.reload();
    parent.layer.closeAll();
}






       