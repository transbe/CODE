/**
 * @author: rongfeiyu
 * @date: 2017/5/22
 * @last modified by: rongfeiyu
 * @last modified time:
 * @file: 查看专家信息
 */


var expertID = getParameter("objectId"); //专家ID
var status = getParameter("status"); //专家账号状态
var token = lsObj.getLocalStorage('token');

/**
 * @desc 初始化函数
 */
$(function() {
    getExpertData(); // 获取专家信息
    getQualificationInfo(); // 加载专家资质

    $('.panel-heading').on('click', function() {
        $(this).siblings('.panel-body').toggleClass('panel-body-close');
    });
});


/**
 * @desc 获取专家信息
 * @method getExpertData
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
            parent.layer.confirm("加载失败", {
                btn: ['确定'],
                skin: "self"
            });
        }
    });
}

/**
 * @desc 加载专家资质
 * @method getQualificationInfo
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
            title: '序号',
            formatter: function(value, row, index) {
                return (qualificationPageNum - 1) * qualificationPageSize + index + 1;
            }
        }, {
            field: 'qualificationName',
            title: '资质名称'
        }, {
            field: 'qualificationGrade',
            title: '资质等级'
        }, {
            field: 'certificateNum',
            title: '证书编号'
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
                layer.confirm("加载数据出错", {
                    btn: ['确定'],
                    skin: 'self'
                });
                return [];
            }
        },
        onLoadSuccess: function(result) {
            // console.log(JSON.stringify(result))
        }
    });
}