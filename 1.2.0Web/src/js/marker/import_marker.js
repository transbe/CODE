/**
 * @author: gaohui
 * @date: 2017-03-02
 * @last modified by: gaohui
 * @last modified time: 2017-03-02 17:47:33
 * @file: 导入测试桩
 */

var pipeLineId = getParameter("pipeLineId");	//获取管线ID
var token = lsObj.getLocalStorage("token");	//获取token
var pipelinenameForTable = decodeURI(getParameter("pipelinenameForTable"));	//获取管线名称

/**
 * @desc 初始化方法
 */
$(function(){
	$('#pipeline').html('"'+pipelinenameForTable+'"')
})

/**
 * @desc 导入测试桩数据
 * @method importData
 */
function importData(){
    var result=false;
    var formData = new FormData($("#fileChooseForm")[0]);
	// alert($("input[type='file']").val())
	if($("input[type='file']").val() == ""){  
		layer.confirm('导入文件为空', {
			title: "提示",
			btn: ['确定'],
			skin: 'self',
		});
		return false;
	}
	$.ajax({
		url:'/cloudlink-corrosionengineer/marker/handleFormUpload?pipeLineId='+pipeLineId+'&token='+ token,
		method:'post',
		data:formData,
		async: false,  
		cache: false,  
		contentType: false,  
		processData: false,
		success:function(res){
			$('.modal-body').html('');
			$('.modal-body').html(res.msg);
			try{
                if(zhugeSwitch==1){
					zhuge.track('导入测试桩');
				}
            }catch(err){
                //在此处理错误
            }
			result = true
		},error:function(res){
			$('.modal-body').html('');
			$('.modal-body').html(res.msg);
		}
	});
	return result
}

/**
 * @desc 下载导入摸板
 * @method upload
 */
function upload(){
	if(token == "" && token == undefined){
		layer.confirm('登录超时，请重新登录', {
			title: "提示",
			btn: ['确定'],
			skin:'self'
		});
		return;
	}
	var url='/cloudlink-corrosionengineer/marker/downloadTemplateExcel?templateName=testpostTemplate.xlsx&token='+token;
		$("#exprotExcelIframe").attr("src", url);
}