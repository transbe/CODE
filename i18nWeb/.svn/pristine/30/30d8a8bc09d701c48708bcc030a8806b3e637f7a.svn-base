$(function() {
	var userBo=JSON.parse(lsObj.getLocalStorage("userBo"));
	var token=lsObj.getLocalStorage("token")
	var enterpriseId=userBo.enterpriseId;
	var objectId=getParamter("objectId");
	var createUserName=decodeURI(getParamter("createUserName"));
	
	if(objectId!=null&&objectId!=""&&objectId!=undefined){
		$.ajax({
		url:"/cloudlink-core-framework/user/getById?token="+token+"&objectId="+objectId+"&enterpriseId="+enterpriseId,
		contentType: "application/json; charset=utf-8",
		dataType:"json",
		method:"get",
		success:function(result){
			console.log("id"+JSON.stringify(result));
			if(result.success==1){
				var data=result.rows[0];
                $("#enterpriseName").html(data.enterpriseName);
                $("#account").html(data.account);
                $("#email").html(data.email);
                if(data.status==1){
                    $("#status").html("激活");
                }else if(data.status==-1){
                    $("#status").html("冻结");
                }else if(data.status==0){
                    $("#status").html("失效");
                }else{
                    $("#status").html("移除");
                }
                if(data.userType==1){
                    $("#userType").html("内部用户");
                }else if(data.userType==2){
                    $("#userType").html("承包商");
                }
				$("#userName").html(data.userName);
				$("#password").html(data.password);
				$("#createTime").html(data.createTime);
				// $("#createUser").html(data.createUser);
				$("#createUser").html(createUserName);
				$("#mobileNum").html(data.mobileNum);
				$('#orgName').html(data.orgName);
			}else{
				layer.msg("加载用户信息失败，请重试",{skin:"self"});
			}
		}
	 });
	}
});