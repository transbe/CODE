var token = lsObj.getLocalStorage("token");
var expertId = getParameter('expertId'); // 专家ID

$(function () {
    getData();
    getQualification();
});

/**
 * @desc 获取专家信息
 * @method getData
 */
function getData() {
    // 获取专家信息
    $.ajax({
        url: '/cloudlink-core-framework/user/getById?token=' + token,
        type: 'get',
        dataType: 'json',
        data: {
            'objectId': expertId
        },
        success: function (result) {
            if (result.success == 1) {
                var data = result.rows[0];
                $("#expertName").html(data.userName);
                $("#sex").html(data.sex);
                getPhoto(data.profilePhoto);
            } else {
                layer.confirm('加载数据失败！', {
                    title: ['提示'],
                    btn: ['确定'],
                    skin: 'self'
                });
            }
        }
    });
}

/**
 * @desc 获取专家资质、证书
 * @method getQualification
 */
function getQualification() {
    // 获取专家信息
    $.ajax({
        url: handleURL('/cloudlink-corrosionengineer/expert/queryQualification?token=' + token),
        type: 'get',
        dataType: 'json',
        data: {
            'expertId': expertId
        },
        success: function (result) {
            if (result.success == 1) {
                var data = result.qualificationList;
                var countRow = 0;
                for (var i = 0; i < data.length; i++) {
                    $("table").append('<tr><td class="text-right"><span>' + data[i].qualificationName + ' ' + data[i].qualificationGrade + '</span></td><td><span>' + data[i].certificateNum + '</span></td></tr>');
                    countRow++;
                }
                $('.first').attr('rowspan', 3 + countRow);
            } else {
                layer.confirm('加载数据失败！', {
                    title: ['提示'],
                    btn: ['确定'],
                    skin: 'self'
                });
            }
        }
    });
}
/**
 * @desc 获取专家照片
 * @method getPhoto
 */
function getPhoto(fileId) {
    $("#expertPhoto").attr('src', rootPath + '/cloudlink-core-file/file/downLoad?fileId=' + fileId);
}