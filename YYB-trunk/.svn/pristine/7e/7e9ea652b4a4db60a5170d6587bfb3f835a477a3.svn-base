/**
 * @file
 * @author: zhangyi
 * @desc: 查看数据
 * @date：2017-05-12
 * @last modified by: zhangyi
 * @last modified time: 2017-06-12 20:37:39
 */

var token = lsObj.getLocalStorage('token');
var operateType; // view 查看操作 否则为 修改操作
var reportType = getParameter("reportType"); //报告类型
var reportId = getParameter("objectId"); //报告ID
var enterpriseId = ""; //企业ID
var returnInfo = ""; // 退回信息/补充信息

$(function () {
    changePageStyle("../../../src");
	//控制显隐
	$('.panel').on('click', '.panel-heading', function () {
		$(this).siblings('.panel-body').toggleClass('panel-body-close');
	});

	operateType = getParameter('operateType');
	if (operateType == "view") {
		//查看申请时隐藏相关审核申请的信息
		// $(".database").hide();
		$(".import-report").hide();
		$(".update-data").hide();
	}
	if (reportType == 2) {
		$("#treeName").html("阴保分段：");
        $('#verificationResult').html('<ol><li>阴保分段绘制完成；</li><li>申请报告中所选阴保分段中，每段阴保分段上恒电位仪M9检测数据完成率100%；</li><li>所选每段阴保分段上，如在ICCP系统上存在排流站，要求M10牺牲阳极数据完成率100%；</li><li>所选每段阴保分段上，M8绝缘接头检测数据整体覆盖率100%；</li><li>所选每段阴保分段上，全部测试桩中，要求已完成M3直流干扰检测和M6阴保有效性检测检测任务占全部测试桩的80%及以上。</li></ol>');		
	} else {
		$("#treeName").html("企业管线管理层级：");
        $('#verificationResult').html('<ul style="list-style:none;"><li>所选管线M3、M6检测的测试桩占全部测试桩80%以上。</li></ul>');
	}
	getHistory();
	getApplyData();
	// 展开历史信息
	$('.show-content').click(function () {
		$('.history-body').show();
	});

	// 收起历史信息
	$('.hide-content').click(function () {
		$('.history-body').hide();
	});
	//表格验证
	$('#opinionForm').bootstrapValidator({
		fields: {
			'opinion': {
				validators: {
					notEmpty: {},
					stringLength: {
						max: 1024
					}
				}
			}
		}
	});
});

/**
 * @desc 加载查看数据
 */
function getApplyData() {
	$.ajax({
		url: '/cloudlink-corrosionengineer/report/getById?token=' + token,
		type: 'get',
		dataType: 'json',
		data: {
			"objectId": reportId,
			"reportType": reportType
		},
		success: function (successResult) {
			if (successResult.success == 1) {
				var data = successResult.rows;
				if (data != null) {
					enterpriseId = data.enterpriseId;
					$("#reportName").html(data.reportName);
					$("#expertName").html(data.expertName);
					$("#enterpriseName").html(data.enterpriseName);
					$("#year").html(data.year);
					if (data.reportType == 1) {
						$("#reportType").html('阴保有效性报告');
					} else {
						$("#reportType").html('阴保完整性报告');
					}
					$("#applyUserName").html(data.applyUserName);
					$("#applyStatus").html(convertApplyStatus(data.applyStatus));
					if (data.applyTime != null) {
						$("#applyTime").html(data.applyTime.split(".")[0]);
					}
					if (returnInfo != null && returnInfo != "") {
						$("#reason").show();
						$("#reasonText").val(returnInfo);
					}
					var pipeArr = data.pipe;
					if (pipeArr.length > 0) {
						getTree(reportType, pipeArr);
					}
				}
			} else {
				layer.alert('加载数据出错！', {
					title: '提示',
					skin: 'self-alert'
				});
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			layer.alert(NET_ERROR_MSG, {
				title: '提示',
				skin: 'self-alert'
			});
		}
	});
}

/**
 * @desc 获取企业管线/阴保分段树数据
 * @param {string} reportType
 * @param {array} pipeArr	管线数组
 */
function getTree(reportType, pipeArr) {
	if (reportType == 1) {
		$('#pipe').jstree({
				core: {
					multiple: false,
					animation: 0,
					check_callback: true,
					themes: {
						dots: false
					},
					//强制将节点文本转换为纯文本，默认为false
					force_text: true,
					data: pipeArr
				},
				sort: function (a, b) {
					return this.get_node(a).original.orderNumber - 0 > this.get_node(b).original.orderNumber - 0 ? 1 : -1;
				},
				types: {
					"pipeline-folder": {
						icon: 'folder-icon'
					},
					"pipeline": {
						icon: 'pipeline-icon',
						valid_children: []
					}
				},
				plugins: ["types", "sort"]
			})
			.on('loaded.jstree', function (e, data) {
				var inst = data.instance;
				//默认展开全部节点 
				inst.open_all();
			});
	} else {
		$.jstree.defaults.core.themes.dots = false;
		$('#pipe').jstree({
				core: {
					multiple: false,
					animation: 0,
					check_callback: true,
					force_text: true,
					data: pipeArr
				},
				types: {
					default: {
						icon: 'folder-icon'
					},
					file: {
						icon: 'segment-icon',
						valid_children: []
					},
					chart: {
						icon: 'chart-icon',
						valid_children: []
					},
					publish: {
						icon: 'publish-icon',
						valid_children: []
					}
				},
				plugins: ["types", "sort"]
			})
			.on('loaded.jstree', function (e, data) {
				var inst = data.instance;
				//默认展开全部节点 
				inst.open_all();
			});
	}
}

/**
 * @desc 提交报告
 * 		 先调用微服务存储，返回filedId
 * @returns {boolean} true 成功 false 失败
 */
function saveReport() {
	var result = false;
	var fileName = $("#reportFile").val();
	if (fileName.length < 1) {
		parent.layer.alert("请上传PDF文件", {
			title: '提示',
			skin: 'self-alert'
		});
		return result;
	} else {
		var fileArr = fileName.split(".");
		if (fileArr[fileArr.length - 1] != "pdf") {
			parent.layer.alert("请上传PDF文件", {
				title: '提示',
				skin: 'self-alert'
			});
			return result;
		}

	}
	var bootstrapValidator = $("#opinionForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if (bootstrapValidator.isValid()) {
		var fileId = uploadFile();
		if (isNull(fileId) == false) {
			$.ajax({
				url: '/cloudlink-corrosionengineer/report/audit?token=' + token,
				type: 'post',
				async: false,
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({
					"reportId": reportId,
					"action": 3,
					"fileId": fileId,
					'opinion': $("#opinion").val(),
					"reportType": reportType
				}),
				success: function (successResult) {
					if (successResult.success == 1) {
						parent.layer.msg('提交成功！', {
							time: MSG_DISPLAY_TIME, //按钮
							skin: 'self-msg'
						});
						result = true;
					} else {
						parent.layer.alert(successResult.msg, {
							title: '提示',
							skin: 'self-alert'
						});
						result = false;
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					parent.layer.alert(NET_ERROR_MSG, {
						title: '提示',
						skin: 'self-alert'
					});
					result = false;
				}
			});
		}
	} else {
		parent.layer.alert('请填写必填项！', {
			title: '提示',
			skin: 'self-alert'
		});
		result = false;
	}
	return result;
}

/**
 * @desc 附件上传 （只能上传pdf文件）
 */
function uploadFile() {
	var fileId = "";
	var formData = new FormData($("#importForm")[0]);
	$.ajax({
		url: '/cloudlink-core-file/attachment/save?businessId=' + reportId + '&bizType=doc',
		type: 'post',
		async: false,
		contentType: false,
		processData: false,
		data: formData,
		success: function (successResult) {
			if (successResult.success == 1) {
				fileId = successResult.rows[0].fileId;
			} else {
				parent.layer.alert('提交失败！', {
					title: '提示',
					skin: 'self-alert'
				});
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			parent.layer.alert(NET_ERROR_MSG, {
				title: "提示",
				skin: 'self-alert'
			});
		}
	});
	return fileId;
}

/**
 * @desc 退回申请
 * @returns {boolean} true 成功 false 失败
 */
function returnApplication() {
	var result = false;
	var bootstrapValidator = $("#opinionForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if (bootstrapValidator.isValid()) {
		$.ajax({
			url: '/cloudlink-corrosionengineer/report/audit?token=' + token,
			type: 'post',
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			async: false,
			data: JSON.stringify({
				"reportId": reportId,
				"action": 1,
				"opinion": $("#opinion").val(),
				"reportType": reportType
			}),
			success: function (successResult) {
				if (successResult.success == 1) {
					parent.layer.msg('退回成功！', {
						time: MSG_DISPLAY_TIME,
						skin: 'self-msg'
					});
					result = true;
				} else {
					parent.layer.alert('退回失败！', {
						title: '提示',
						skin: 'self-alert'
					});
					result = false;
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				parent.layer.alert(NET_ERROR_MSG, {
					title: '提示',
					skin: 'self-alert'
				});
				result = false;
			}
		});
	} else {
		parent.layer.alert('请填写必填项！', {
			title: '提示',
			skin: 'self-alert'
		});
		result = false;
	}
	return result;
}

/**
 * @desc 获取历史信息
 */
function getHistory() {
	$.ajax({
		url: '/cloudlink-corrosionengineer/report/getAuditHistory?token=' + token,
		type: 'get',
		dataType: 'json',
		data: {
			"reportId": reportId,
			"havaFile": false
		},
		success: function (successResult) {
			if (successResult.success == 1) {
				var data = successResult.rows;
				if (data.length > 0) {
					returnInfo = data[0].opinion;
					var li_str = "";
					for (var i = 0; i < data.length; i++) {
						if (data[i].operateTime != null) {
							li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
							var roleName = getOperatorRole(data[i].action);
							if (data[i].action == '1') {
								li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>退回申请</span></div></li>';
								continue;
							}
							if (data[i].action == '4') {
								li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>退回报告</span></div></li>';
								continue;
							}
							li_str += '<div><span>' + data[i].operateTime + '</span><span>' + roleName + '</span><span>' + data[i].operatorName + '</span><span>' + convertApplyStatus(data[i].action) + '</span></div></li>';
						}
					}
				}
				$(".history-body").html(li_str);
			} else {
				layer.alert('加载数据出错！', {
					title: '提示',
					skin: 'self-alert'
				});
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			layer.alert(NET_ERROR_MSG, {
				title: '提示',
				skin: 'self-alert'
			});
		}
	});
}

/**
 * @desc 导出数据
 */
function exportData() {
	uncheck("exportData");
	if (reportType == 1) {
		layer.alert('暂不支持阴保有效性报告导出数据！', {
			title: '提示',
			skin: 'self-alert'
		});
		return;
	}
	var url = '/cloudlink-corrosionengineer/report/downloadData?objectId=' + reportId + "&token=" + token;
	$("#exportIframe").attr('src', url);
}

/**
 * @desc 进入企业
 */
function changeURL() {
	openWindowURL(enterpriseId);
}

/**
 * @desc 查看补充数据
 */
function viewData() {
	uncheck('viewData');
	parent.layer.open({
		type: 2,
		title: '补充数据',
		skin: 'self-iframe',
		area: ['950px', '600px'],
		btn: ['关闭'],
		content: 'src/html/expert_report_audit/report_list.html?objectId=' + reportId + "&reportType=" + reportType
	});
}