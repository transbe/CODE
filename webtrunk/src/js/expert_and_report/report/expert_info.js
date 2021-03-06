/**
 * @file
 * @author zhangyi
 * @desc 查看专家简介
 * @date 2017-3-13
 * @last modified by zhangyi
 * @last modified time 2017-06-12 18:08:32
 */

var token = lsObj.getLocalStorage("token");
var expertId = getParameter('expertId'); // 专家ID

$(function() {
    getExpertData();
    getQualification();
});

/**
 * @desc 获取专家信息
 */
function getExpertData() {
    changePageStyle("../../../../src");
    $.ajax({
        url: '/cloudlink-core-framework/user/getById?token=' + token,
        type: 'get',
        dataType: 'json',
        data: {
            'objectId': expertId
        },
        success: function(successResult) {
            if (successResult.success == 1) {
                var data = successResult.rows[0];
                $("#expertName").html(data.userName);
                $("#sex").html(data.sex);
                getPhoto(data.profilePhoto);
            } else {
                layer.alert(getLanguageValue("Load_data_error"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}

/**
 * @desc 获取专家资质、证书
 */
function getQualification() {
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/expert/queryQualification?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            'expertId': expertId
        },
        success: function(successResult) {
            if (successResult.success == 1) {
                var data = successResult.qualificationList;
                var countRow = 0;
                for (var i = 0; i < data.length; i++) {
                    $("table").append('<tr><td class="text-right"><span>' + data[i].qualificationName + ' ' + data[i].qualificationGrade + '</span></td><td><span>' + data[i].certificateNum + '</span></td></tr>');
                    countRow++;
                }
                $('.first').attr('rowspan', 3 + countRow);
            } else {
                layer.alert(getLanguageValue("Load_data_error"), {
                    title: getLanguageValue("tip"),
                    skin: 'self-alert'
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.alert(NET_ERROR_MSG, {
                title: getLanguageValue("tip"),
                skin: 'self-alert'
            });
        }
    });
}
/**
 * @desc 获取专家照片
 */
function getPhoto(fileId) {
    $("#expertPhoto").attr('src', rootPath + '/cloudlink-core-file/file/downLoad?fileId=' + fileId + "&token="+ lsObj.getLocalStorage("token"));
}