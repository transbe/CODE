/**
 * @author: zhangyi
 * @date：2017/5/12
 * @last modified by: zhangyi
 * @last modified time:
 * @file: 查看数据
 */

var token = lsObj.getLocalStorage('token');
var operateType; // view 查看操作 否则为 修改操作
var reportType = getParameter("reportType"); //报告类型
var reportId = getParameter("objectId"); //报告ID
var enterpriseId = ""; //企业ID
var returnInfo = ""; // 退回信息/补充信息

$(function () {
	//控制显隐
	$('.panel').on('click', '.panel-heading', function () {
		$(this).siblings('.panel-body').toggleClass('panel-body-close');
	});

	operateType = getParameter('operateType');
	if (operateType == "view") {
		//查看申请时隐藏相关审核申请的信息
		$(".database").hide();
		$(".import-report").hide();
		$(".update-data").hide();
	}
	if (reportType == 2) {
		$("#treeName").html("阴保分段：");
	} else {
		$("#treeName").html("企业管线管理层级：");
	}
	getHistory();
	getData();
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
					notEmpty: {}
				}
			}
		}
	});
});

/**
 * @desc 加载查看数据
 * @method getData
 */
function getData() {
	$.ajax({
		url: '/cloudlink-corrosionengineer/report/getById?token=' + token,
		type: 'get',
		dataType: 'json',
		data: {
			"objectId": reportId,
			"reportType": reportType
		},
		success: function (result) {
			if (result.success == 1) {
				var data = result.rows;
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
				layer.confirm('加载数据失败！', {
					title: ['提示'],
					btn: ['确定'],
					skin: 'self'
				});
			}
		},
		error: function (result) {
			layer.confirm('加载数据失败！', {
				title: ['提示'],
				btn: ['确定'],
				skin: 'self'
			});
		}
	});
}

/**
 * @desc 获取企业管线/阴保分段树数据
 * @method getTree
 * @param {*String} reportType
 * @param {*Array} pipeArr	管线数组
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
						icon: 'file-icon',
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
						icon: 'segment-file-icon',
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
				plugins: ["types", "state", "sort"]
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
 * @method saveApplication
 * @returns {boolean} true 成功 false 失败
 */
function saveReport() {
	var flag = false;
	var fileName = $("#reportFile").val();
	if (fileName.length < 1) {
		parent.layer.confirm("请上传PDF文件", {
			title: ['提示'],
			btn: ['确定'],
			skin: 'self'
		});
		return ;
	} else {
		var fileArr = fileName.split(".");
		if (fileArr[fileArr.length - 1] != "pdf") {
			parent.layer.confirm("请上传PDF文件", {
				title: ['提示'],
				btn: ['确定'],
				skin: 'self'
			});
			return;
		}

	}
	var bootstrapValidator = $("#opinionForm").data('bootstrapValidator');
	bootstrapValidator.validate();
	if (bootstrapValidator.isValid()) {
		var fileId = uploadFile();
		if (fileId != "" && fileId != null && fileId != undefined) {
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
				success: function (result) {
					if (result.success == 1) {
						parent.layer.msg('提交成功！', {
							time: MSG_DISPLAY_TIME, //按钮
							skin: 'self-success'
						});
						flag = true;
					} else {
						parent.layer.confirm(result.msg, {
							title: ['提示'],
							btn: ['确定'], //按钮
							skin: 'self'
						});
						flag = false;
					}
				},
				error: function () {
					parent.layer.confirm('提交失败！', {
						title: ['提示'],
						btn: ['确定'], //按钮
						skin: 'self'
					});
					flag = false;
				}
			});
		} else {
			parent.layer.confirm('提交失败！', {
				title: ['提示'],
				btn: ['确定'], //按钮
				skin: 'self'
			});
			flag = false;
		}
	} else {
		parent.layer.confirm('请填写必填项！', {
			title: ['提示'],
			btn: ['确定'],
			skin: 'self'
		});
		flag = false;
	}
	return flag;
}

/**
 * @desc 附件上传 （只能上传pdf文件）
 * @method uploadFile
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
		success: function (result) {
			if (result.success == 1) {
				fileId = result.rows[0].fileId;
			}
		}
	});
	return fileId;
}


/**
 * @desc 退回申请
 * @method returnApplication
 * @returns {*Boolean} true 成功 false 失败
 */
function returnApplication() {
	var flag = false;
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
			success: function (result) {
				if (result.success == 1) {
					parent.layer.msg('退回成功！', {
						time: MSG_DISPLAY_TIME,
						skin: 'self-success'
					});
					flag = true;
				} else {
					parent.layer.confirm('退回失败！', {
						title: ['提示'],
						btn: ['确定'],
						skin: 'self'
					});
					flag = false;
				}
			},
			error: function (result) {
				parent.layer.confirm('退回失败！', {
					title: ['提示'],
					btn: ['确定'],
					skin: 'self'
				});
				flag = false;
			}
		});
	} else {
		parent.layer.confirm('请填写必填项！', {
			title: ['提示'],
			btn: ['确定'],
			skin: 'self'
		});
		flag = false;
	}
	return flag;
}

/**
 * @desc 获取历史信息
 * @method getHistory
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
		success: function (result) {
			if (result.success == 1) {
				var data = result.rows;
				if (data.length > 0) {
					returnInfo = data[0].opinion;
					var li_str = "";
					for (var i = 0; i < data.length; i++) {
						if (data[i].operateTime != null) {
							li_str += '<li><div class="time_line_mark"><span class="line"></span><span class="circle"></span></div>';
							li_str += '<div><span>' + data[i].operateTime + '</span><span>' + data[i].operatorName + '</span><span>' + convertApplyStatus(data[i].action) + '</span></div></li>'
						}
					}
				}
				$(".history-body").html(li_str);
			}
		}
	});
}

/**
 * @desc 导出数据
 * @method exportData
 */
function exportData() {
	uncheck("exportData");
	if (reportType == 1) {
		layer.confirm('暂不支持阴保有效性报告导出数据！', {
			title: ['提示'],
			btn: ['确定'],
			skin: 'self'
		});
		return;
	}
	var url = '/cloudlink-corrosionengineer/report/downloadData?objectId=' + reportId + "&token=" + token;
	$("#exportIframe").attr('src', url);
}

/**
 * @desc 进入企业
 * @method changeURL
 */
function changeURL() {
	openWindowURL(enterpriseId);
}

/**
 * @desc 查看补充数据
 * @method viewData
 */
function viewData() {
	uncheck('viewData');
	parent.layer.open({
		type: 2,
		title: '补充数据',
		area: ['950px', '600px'],
		btn: ['关闭'],
		content: 'src/html/expert_report_audit/report_list.html?objectId=' + reportId + "&reportType=" + reportType
	});
}