/**
 * @file
 * @author: gaohui
 * @desc:新增测试桩
 * @date: 2017-03-02
 * @last modified by: lujingrui
 * @last modified time: 2017-06-12 10:29:22
 */

var pipelineId = getParameter("pipelineId"); //获取选中的管线ID
var pipelineName = decodeURI(getParameter("pipelinenameForTable")); //获取选中的管线名称
var token = lsObj.getLocalStorage("token"); //获取token
var user = JSON.parse(lsObj.getLocalStorage("userBo")); //获取user
var enterpriseId = user.enterpriseId; //公司名称id

var markerList = [];//维修范围测试桩id列表
$(document).ready(function () {
    changePageStyle("../..");
    var objectId = getParameter("objectId");
    if(objectId!=null&&objectId!=""&&objectId!=undefined){
        initPage(objectId);
    }
    // $('#pipelineName').val(pipelineName)
    // loadSelectData();
});

/**
 * @desc 表单校验
 */
$('#addForm').bootstrapValidator({
    fields: {
        repairTheme: {
            validators: {
                notEmpty: {},
                stringLength: {
                    max: 50
                },
            }
        },
        markerZone: {
            validators: {
                notEmpty: {},
                stringLength: {
                    max: 50
                },
            }
        },
        repairType: {
            validators: {
                notEmpty: {},
                stringLength: {
                    max: 50
                },
            }
        }
    }
});
/**
 * @desc 保存数据(新增或修改)
 */
function saveData() {
    var isValidForm = $('#addForm').data('bootstrapValidator');
    isValidForm.validate();
    //获取提交数据
    var objectId = $("#objectId").val(); 
    var belongPipelineId = $("#belongPipelineId").val(); 
    var repairTheme = $("#repairTheme").val(); 
    var markerZone = $("#markerZone").val(); 
    var equipmentType = $("#equipmentType").val(); 
    var riskType = $("#riskType").val(); 
    var repairType = $("#repairType").val(); 
    var emergencyLevel = $("#emergencyLevel").val(); 
    var repairUser = $("#repairUser").val(); 
    var repairUserContact = $("#repairUserContact").val(); 
    var repairDescription = $("#repairDescription").val();
    var parameters = { 
        "objectId": objectId, 
        "belongPipelineId":belongPipelineId,
        "pipelineName": pipelineName, 
        "markerList": markerList, 
        "markerZone": markerZone, 
        "repairTheme": repairTheme, 
        "equipmentType": equipmentType, 
        "riskType": riskType, 
        "emergencyLevel": emergencyLevel,
        "repairType": repairType,
        "repairUser": repairUser, 
        "repairUserContact": repairUserContact, 
        "repairDescription": repairDescription,
        "remark": ""
    };
    var data = JSON.stringify(parameters);
    var url = "";
    if(objectId!=null&&objectId!=""&&objectId!=undefined){  //修改
        url = '/cloudlink-corrosionengineer/equipment/update?token=' + lsObj.getLocalStorage('token');
    }else{                                                  //新增         
        url = '/cloudlink-corrosionengineer/equipment/add?token=' + lsObj.getLocalStorage('token');
    }
    if (isValidForm.isValid()) {
        var result = false; //返回是否添加成功
        $.ajax({
            url: url,
            dataType: "json",
            method: 'post',
            contentType: "application/json; charset=utf-8",
            async: false,
            data: data,
            success: function (res) {
                if (res.success == 1) {
                    parent.layer.msg("保存成功", {
                        time: MSG_DISPLAY_TIME,
                        skin: "self-msg"
                    });
                    result = true;
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('新增维修记录', {
                                '结果': '成功'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                } else {
                    parent.layer.alert(res.msg, {
                        title: "提示",
                        skin: 'self-alert'
                    });
                    result = false;
                    try {
                        if (tjSwitch == 1) {
                            tjSdk.track('新增维修记录', {
                                '结果': '失败'
                            });
                        }
                    } catch (err) {
                        //在此处理错误
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { // 请求失败
                // 服务器异常提示信息 或者断网提示信息 总之是数据未请求到数据的提示
                layer.alert(NET_ERROR_MSG, {
                    title: "提示",
                    skin: 'self-alert'
                });
            }
        });
        return result;
    } else {
        return false
    }
}
/**
 * @desc 初始化页面（如果objectId不为空则为修改页面，打开页面后首先根据objectId初始化页面数据）
 */
function initPage(objectId){
    var url = handleURL("/cloudlink-corrosionengineer/equipment/query?token="+token+"&objectId="+objectId+"&enterpriseId="+enterpriseId);
    $.ajax({
		// url:"/cloudlink-corrosionengineer/equipment/query?token="+token+"&objectId="+objectId+"&enterpriseId="+enterpriseId,
		url:url,
		contentType: "application/json; charset=utf-8",
		dataType:"json",
		method:"get",
		success:function(result){
			if(result.success==1){
				var data=result.rows[0];
                $("#objectId").val(data.objectId);
                $("#belongPipelineId").val(data.belongPipelineId);
                $("#pipelineName").val(data.pipelineName);
                markerList  = data.markerList;
				$("#markerZone").val(data.markerZone);
				$("#repairTheme").val(data.repairTheme);
				$("#equipmentType").val(data.equipmentType);
				$("#riskType").val(data.riskType);
                $("#emergencyLevel").selectpicker("val", data.emergencyLevel);
                $("#repairType").selectpicker("val", data.repairType);
				$("#repairUser").val(data.repairUser);
				$("#repairUserContact").val(data.repairUserContact);
				$('#positionDescription').val(data.positionDescription);
				$('#repairDescription').val(data.repairDescription);
			}else{
				layer.msg("加载用户信息失败，请重试",{skin:"self"});
			}
		}
	 });
}
/**
 * @desc 选择维修范围
 */
function selectMarkerZone(){
    var index = parent.layer.open({
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        title: "选择维修范围",
        skin: 'self-iframe',
        area: ['1000px', "600px"],
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var addPage = layero.find('iframe')[0].contentWindow;
            var repairParames = addPage.repairParames;
            if(repairParames!=null){
                $("#markerZone").val(repairParames.markerZone);
                $("#equipmentType").val(repairParames.equipmentType);
                $("#belongPipelineId").val(repairParames.belongPipelineId);
                $("#pipelineName").val(repairParames.pipelineName);
                $("#riskType").val(repairParames.riskType);
                $("#positionDescription").val(repairParames.positionDescription);
                markerList = [];
                if(typeof repairParames.markerList == "string"){
                    markerList.push(repairParames.markerList);
                }else{
                    markerList = repairParames.markerList;
                }
            }
            parent.layer.close(index);
        },
        btn2: function (index, layero) {},
        end: function (index, layero) {
            // $("#addData").attr('disabled', false);
        },
        content: 'src/html/repair/select_repair_region.html?'
    });
}
