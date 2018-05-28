/**
 * @file 
 * @author: rongfeiyu
 * @desc: 查看专家信息
 * @Date: 2017-05-22 10:49:29
 * @Last Modified by: rongfeiyu
 * @Last Modified time:2017-06-12 11:49:24
 */

var expertID = getParameter("objectId"); //专家ID
var status = getParameter("status"); //专家账号状态
var token = lsObj.getLocalStorage('token');

/**
 * @desc 初始化函数
 */
$(function() {
    changePageStyle("../../.."); // 换肤
    getExpertData(); // 获取专家信息
    getQualificationInfo(); // 加载专家资质

    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });
});


/**
 * @desc 获取专家信息
 */
function getExpertData() {
    $.get("/cloudlink-core-framework/user/getById", {
        'token': token,
        'objectId': expertID,
        'enterpriseId': ZYAXenterpriseId,
        'appId': appId
    }, function(result, status) {
        if (result.success == 1) {
            //加载专家信息
            var data = result.rows[0];
            $("#userName").html(data.userName); // 专家姓名
            $("#age").html(data.age); // 专家年龄
            $("#sex").html(data.sex); // 专家性别
        } else {
            layer.alert(getLanguageValue("fail_load"), {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 加载专家资质
 */
function getQualificationInfo() {
    $(".panel-body #showData").bootstrapTable({
        url: '/cloudlink-corrosionengineer/expert/queryQualification?token=' + token + '&expertId=' + expertID,
        method: 'get',
        queryParams: function(params) {
            qualificationPageNum = this.pageNumber;
            qualificationPageSize = 100;
            params.pageNum = this.pageNumber;
            params.pageSize = 100;
            return params;
        },
        pagination: false, // 底部不显示分页工具栏
        showRefresh: false, // 不显示刷新按钮
        columns: [{
            field: 'objectId',
            title: 'objectId',
            visible: false
        }, {
            title: getLanguageValue("No."),
            formatter: function(value, row, index) {
                return (qualificationPageNum - 1) * qualificationPageSize + index + 1;
            }
        }, {
            field: 'qualificationName',
            width: '33.33%',
            title: getLanguageValue("Qualifiied_Organization")
        }, {
            field: 'qualificationGrade',
            width: '33.33%',
            title: getLanguageValue("Qualification")
        }, {
            field: 'certificateNum',
            width: '33.33%',
            title: getLanguageValue("Certificate_Number")
        }],
        onDblClickRow: function(row) {
            // view(row.objectId);
        },
        responseHandler: function(res) {
            if (res.success == 1) {
                var data = {
                    "total": res.qualificationList.length,
                    "rows": res.qualificationList
                }
                return data;
            } else {
                layer.alert(getLanguageValue("Load_data_error"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
                return [];
            }
        },
        onLoadSuccess: function(result) {
            // console.log(JSON.stringify(result))
        }
    });
}