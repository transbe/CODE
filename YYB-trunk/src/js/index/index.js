  /** 
   * @file
   * @author  liangyuanyuan
   * @desc 首页头部和侧边栏js逻辑操作
   * @date 2017-06-12 11:29:42
   * @last modified by lizhenzhen
   * @last modified time  2017-06-12
   */

  var tmenpi; //参数1
  var userBo; //用户信息BO
  var newsData; //消息数据
  var roleNameNum; //角色判断
  var canOpenViewTask = true; //判断是否弹出查看任务页面


  var pageNum = 1, // 自定义向导的起始页
      allPageNum = 7; // 自定义向导的总页数
  var guideContent = [getLanguageValue("ImportTestpoints"), getLanguageValue("CPSSchematic"), getLanguageValue("ArrangeDetectionTasks"), getLanguageValue("executionTask"), getLanguageValue("DataInterpretation"), getLanguageValue("CPSReport"), getLanguageValue("OperationScope")];
  // 自定义向导的内容数组

  
  (function () {
    
    var lg = lsObj.getLocalStorage("i18nLanguage");
    if(lg == "en"){
        $(".navbar-header .logo-info").hide();
    }
      privilege(); //权限控制
      setInd_language(); //设置语言勾选
      changeBackgroudURL();
      //更新index菜单栏···
      //update
  })()


  /**
   * @desc 判断当前的角色有没有平台管理员角色 权限控制
   * @method privilege
   */
  function privilege() {
      /**
       * yang
       * 20170421 从跳转过来的用户ID，与所要查询的企业ID index.html?useId='dasdasdas'&tmenpi='queryEnterpriseId';
       * 1，首先使用/cloudlink-core-framework/user/getById查询 用户的信息，返回其角色，判断是否拥有运营人员权限，如果有 在localstroage里面插入tmenpi的值 需要查询的企业ID
       * 2，同时，自动的创建localstroage的token和Usebo对象。以便后续的功能可以使用
       * 3，在之后的所有查询界面，判断localstroage的tmenpi值是否存在，存在则在查询字符串后添加 tmenpi=“ID”
       * 
       * 
       * 20170516 2.0接口更新后，不能使用用户ID进行登录
       */

      var thisURL = document.URL;
      if (thisURL.indexOf("?") > 0) { //无需做以下操作
          //分割URL 取出参数
          var getval = thisURL.split('?')[1];
          var token_arry = getval.split("&")[0];
          var tmenpi_arry = getval.split("&")[1];
          var token = token_arry.split("=")[1];
          tmenpi = tmenpi_arry.split("=")[1];
          lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
          //获得默认企业，并加入企业完成自动登录
          getDefaultEnterpriseId(token);
      } else {
          loadIndex();
      }
  }
  /**
   * @desc 获取当前用户的默认企业Id
   * @method getDefaultEnterpriseId
   * @param {*String} token 
   */
  function getDefaultEnterpriseId(token) {
      $.ajax({
          type: "Get",
          url: "/cloudlink-core-framework/login/getDefaultEnterpriseId?token=" + token + "&appCode=" + appCode,
          contentType: "application/json",
          dataType: "json",
          success: function (data) {
              var success = data.success;
              if (success == 1) {
                  //当前用户存在默认企业Id
                  var _enterpriseId = data.rows[0].enterpriseId;
                  //查找这个企业列表中有无中盈安信企业，有则进行
                  joinDefaultEnterprise(token, _enterpriseId);
              } else {
                  //当前用户不存在默认企业Id
                  $('.hidkuai2 span').text('当前用户未设置默认登录企业');
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log(XMLHttpRequest);
              console.log(textStatus);
              console.log(errorThrown);
              layer.alert(NET_ERROR_MSG, {
                  title:getLanguageValue("Tip"),
                  btn: [getLanguageValue("ok"),getLanguageValue("cancle")], 
                  skin: 'self-alert'
              });
          }
      });
  }

  /**
   * @desc 加入默认企业
   * @method joinDefaultEnterprise
   * @param {*String} token 
   * @param {*String} _enterpriseId 
   */
  function joinDefaultEnterprise(token, _enterpriseId) {
      $.ajax({
          type: "POST",
          url: "/cloudlink-core-framework/login/loginWithEnterprise?token=" + token,
          contentType: "application/json",
          data: JSON.stringify({
              enterpriseId: _enterpriseId,
              appCode: appCode
          }),
          dataType: "json",
          success: function (data) {
              var success = data.success;
              if (success == 1) {
                  var row = data.rows;
                  var token1 = data.token;
                  var usebo = JSON.stringify(row[0]);
                  //清除之前的localstorage
                  lsObj.setLocalStorage('token', token1);
                  lsObj.setLocalStorage('userBo', usebo);

                  var roleNameStr = JSON.parse(usebo).roleNames;
                  var roleNameNum = 4; //运营人员

                  lsObj.setLocalStorage('params', roleNameNum);
                  var getval = document.URL.split('?')[0];

                  loadIndex();

                  // 运营人员没有消息的功能
                  $("#goNewNewsBox,#goHelpBox").css("display", "none");
                  $("#signOutBox").addClass("borderLeft");
                  $('#side-menu').html("");
                  $('#side-menu').renderMenu(getMenuNodes(), function (event, el, data) {
                      if (data.url && data.url != '' && data.url != '#') {
                          menuItem(el);
                      }
                  });
                  loadSelfDefinedTemplate();
              } else {
                  layer.alert("加入默认企业失败", {
                      title:getLanguageValue("Tip"),
                      btn: [getLanguageValue("ok"),getLanguageValue("cancle")], 
                      skin: 'self-alert'
                  });
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log(XMLHttpRequest);
              console.log(textStatus);
              console.log(errorThrown);
              layer.alert(NET_ERROR_MSG, {
                  title:getLanguageValue("Tip"),
                  btn: [getLanguageValue("ok")], 
                  skin: 'self-alert'
              });
          }
      });
  }


  /**
   * @desc 加载首页信息
   * @method loadIndex
   */
  function loadIndex() {
      $(document).ready(function () {

          token = lsObj.getLocalStorage("token");
          userBo = JSON.parse(lsObj.getLocalStorage("userBo")); //获取本地用户信息
          // 定义消息数据，用于和welcom.js进行iframe框架数据交换
          roleNameNum = parseInt(lsObj.getLocalStorage('params'));
          if (roleNameNum == 2) {
              //   alert("检测人");
              $("#firstPage").attr("data-id", "src/html/index/welcom_collect.html");
              $("#iframe-content").attr("src", "src/html/index/welcom_collect.html?v1.0").attr("data-id", "src/html/index/welcom_collect.html");
          } else if (roleNameNum == 5) {
              $("#firstPage").attr("data-id", "src/html/expert_index/home.html");
              $("#iframe-content").attr("src", "src/html/expert_index/home.html?v1.0").attr("data-id", "src/html/expert_index/home.html");
              $("#goPersonal").attr("href", "src/html/expert_person_settings/personal_data.html");

              // 专家人员暂时没有消息的功能（该版本暂时没有完善该功能，所以隐藏了）
              $("#goNewNewsBox").css("display", "none");
          } else {
              //   alert("非检测人");
              $("#firstPage").attr("data-id", "src/html/index/welcome.html");
              $("#iframe-content").attr("src", "src/html/index/welcome.html?v1.0").attr("data-id", "src/html/index/welcome.html");
          };

          // 获取用户信息
          getUserImage();
          //登录超时，返回登录页面，重新登录
          timeOut();

          // 判断是否是运营人员，如果是运营人员不执行消息的方法
          var roleJudge = judgePrivilege();
          if (roleJudge == false) {
              //消息未读的条数，加载到页面上,每隔20秒刷新一次
              getMsgNumber();
              setInterval(function () {
                  getMsgNumber();
              }, 20000);
          }

          // 初始化获取当前主题并选中,如果是浅灰色，则切换一下右上角图片
          var currentTheme = parseInt(lsObj.getLocalStorage('currentTheme'));
          if (currentTheme == 3) {
              $("#goNewNews img").prop(
                  "src", "src/css/theme/lightness/news.png"
              );
              $("#goHelp img").prop(
                  "src", "src/css/theme/lightness/help.png"
              );
              $("#signOut img").prop(
                  "src", "src/css/theme/lightness/signout.png"
              );
          }

          changePageStyle("./src");
          var loginNum = parseInt(lsObj.getLocalStorage('loginNum'));
       
          // 现场检测人员和专家没有向导
          if (loginNum == 0 && roleNameNum != 2 && roleNameNum != 5) {
              $(".absolute-guide").show();
              $(".guide-backdrop").show();
              guideStart(pageNum);
          }
          $(".bootstro-finish-btn").click(function () {
              $(".absolute-guide").hide();
              $(".guide-backdrop").hide();
              if (lsObj.getLocalStorage('currentTheme') != "3") {
                  $("#side-menu>li").removeClass("bootstro").removeClass("bootstro-highlight");
                  $("#side-menu>li").children("a").css({
                      color: "#fff"
                  })
              }
          });
          $(".bootstro-next-btn").click(function () {
              if (pageNum < allPageNum) {
                  pageNum++;
                  guideStart(pageNum);
              }
          })
          $(".bootstro-prev-btn").click(function () {
              if (pageNum >= 1) {
                  pageNum--;
                  guideStart(pageNum);
              }
          })

          getOK(currentTheme);
          // 显示个人资料下拉菜单
          if (roleNameNum != 4) {
              $(".open").mouseenter(function () {
                  $(".hide-person-operate").show();
              }).mouseleave(function () {
                  $(".hide-person-operate").hide();
              });
              // 显示主题设置的下拉菜单
              $(".set-theme").mouseenter(function () {
                  var setThemeW = $(".set-theme").outerWidth();
                  $(".theme").show().css({
                      left: setThemeW + "px"
                  });
              }).mouseleave(function () {
                  $(".theme").hide();
              });
          }

          getEnpUnit();
          // 显示语言设置下拉
          $(".set-language").mouseenter(function () {
              var setThemeW = $(".set-language").outerWidth();
              $(".language").show().css({
                  left: setThemeW + "px"
              });
          }).mouseleave(function () {
              $(".language").hide();
          });

          // 切换主题
          $(".theme").on("click", "li", function (e) {
              var idx = $(this).index();
              layer.confirm(getLanguageValue("changeTheme"), {
                  title: [getLanguageValue("Tip")],
                  btn: [getLanguageValue("ok"),getLanguageValue("cancle")], 
                  skin: 'self'
              }, function (index) {
                  layer.closeAll();
                  getOK(idx);
                  changeTheme(idx);
              });
          })

          // 切换语言
          $(".language").on("click", "li", function (e) {
              var idx = $(this).index();
              var key = $(this).attr('key');
              console.log(key);
              layer.confirm(getLanguageValue("languageChangeText"), {
                  title: [getLanguageValue("Tip")],
                  btn: [getLanguageValue("ok"),getLanguageValue("cancle")], 
                  skin: 'self'
              }, function (index) {
                  layer.closeAll();
                  getOK(idx);
                  changeLanguage(key);
                  //重新加载页面

              });
          })

          //去个人资料页面
          $("#goPersonal").on("click", function (e) {
              e.preventDefault();
            //   console.log($(this))
              parent.menuItem($(this));
          });

          // 去修改密码页面
          $("#goModpwd").on("click", function (e) {
              e.preventDefault();
              parent.menuItem($(this));
          });

          // 去goSetLogin登录设置页面
          $("#goSetLogin").on("click", function (e) {
              e.preventDefault();
              parent.menuItem($(this));
          });

          // 去消息页面
          $("#goNewNews").on("click", function (e) {
              e.preventDefault();
              parent.menuItem($(this));
          });

          // 去帮助页面
          $("#goHelp").on("click", function (e) {
              e.preventDefault();
              parent.menuItem($(this));
          });

          //退出登录
          $("#signOut").on("click", function (e) {
              e.preventDefault();
              layer.confirm(getLanguageValue("sureLogOut"), {
                  title: getLanguageValue("Tip"),
                  btn: [getLanguageValue("ok"),getLanguageValue("cancle")], 
                  skin: "self"
              }, function () {
                  var token = lsObj.getLocalStorage('token');
                  $.ajax({
                      url: "/cloudlink-core-framework/login/logout?token=" + token,
                      type: "POST",
                      dataType: "json",
                      success: function (data) {
                          var success = data.success;
                          if (success == 1) {
                              layer.closeAll();
                              var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
                               localStorage.clear("timeOut");
                               lsObj.setLocalStorage('i18nLanguage', language);
                               lsObj.setLocalStorage('timeOut', new Date().getTime() + (10 * 60 * 60 * 1000));
                              //   alert(language)
                            //   if (language == "en") {
                            //       location.href = 'login_en.html';
                            //   } else {
                                  location.href = 'login.html';
                            //   }
                          } else {
                              layer.alert("退出失败！", {
                                  title:getLanguageValue("Tip"),
                                  btn: [getLanguageValue("ok")], 
                                  skin: 'self-alert'
                              });
                          }
                      },
                      error: function (XMLHttpRequest, textStatus, errorThrown) {
                          console.log(XMLHttpRequest);
                          console.log(textStatus);
                          console.log(errorThrown);
                          layer.alert(NET_ERROR_MSG, {
                              title:getLanguageValue("Tip"),
                              skin: 'self-alert'
                          });
                      }
                  });
              });
          });

          // 菜单的打开与关闭
          var menuFlag = false;
          $(".menu-bar").bind("click", function () {
              if (menuFlag == false) {
                  $("#menuNav.navbar-static-side").show().slideDown(100);
                  menuFlag = true;
              } else {
                  $("#menuNav.navbar-static-side").slideUp(100).hide();
                  menuFlag = false;
              }
          });

          //窗口大小变化控制菜单栏的显示与隐藏
          $(window).on("resize", function () {
              var winW = $(window).width();
              if (winW > 768) {
                  $("#menuNav.navbar-static-side").show();
              } else {
                  $("#menuNav.navbar-static-side").hide();
              }
          });
      });
  }

  /**
   * @desc 选中当前的主题
   * @param {*Number} idx 主题对应的值
   */
  function getOK(idx) {
    //   console.log(idx)
      $(".theme li").children("a").children("span").removeClass("active");
      $(".theme li").eq(idx).children("a").children("span").addClass("active");
  }

  function setInd_language(idx) {
      //$(".language li").children("a").children("span").removeClass("active");
      var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
      // console.log(language);
      // console.log($("[key="+language+"]"))
      $("[key=" + language + "]").children("a").children("span").addClass("active");
  }

  /**
   * @desc 切换主题
   * @param {*Number} theme 主题对应的值
   */
  function changeTheme(theme) {
      var _data = {
          theme: theme
      };
      $.ajax({
          type: "post",
          contentType: "application/json; charset=utf-8",
          url: "/cloudlink-corrosionengineer/userInfo/setUserTheme?token=" + token,
          dataType: "json",
          data: JSON.stringify(_data),
          async: false,
          success: function (data) {
              if (data.success == 1) {
                  lsObj.setLocalStorage('currentTheme', theme);
                  parent.location.reload();
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log(XMLHttpRequest);
              console.log(textStatus);
              console.log(errorThrown);
              layer.alert(NET_ERROR_MSG, {
                  title:getLanguageValue("Tip"),
                  skin: 'self-alert'
              });
          }
      });
  }

  /**
   * @desc 自定义向导
   */
  function guideStart(idx) {
      var currentLi;
      if (idx == 7) {
          currentLi = 4;
      } else if (idx == 4) {
          currentLi = 9;
      } else {
          currentLi = idx
      }
     
      $(".popover .label-success").html(" -- "+idx + "/" + allPageNum);
      $("#content-title").html(guideContent[idx - 1]);
      
      // 英文状态下先隐藏动图，等翻译好之后再添加
      var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
      if(language == "en"){
           $("#content-img").attr({
                src: "src/images/guide/welcom" + idx + "_en.png"
           });
      }else{
           $("#content-img").attr({
                src: "src/images/guide/welcom" + idx + ".png"
           });
      }
     
      $("#side-menu>li").removeClass("bootstro").removeClass("bootstro-highlight");
      $("#side-menu>li").eq(currentLi).addClass("bootstro").addClass("bootstro-highlight");
      if (lsObj.getLocalStorage('currentTheme') != "3") {
          $("#side-menu>li").children("a").css({
              color: "#fff"
          })
          $("#side-menu>li").eq(currentLi).children("a").css({
              color: "#666"
          })
      }
      if (idx == allPageNum) {
          $(".bootstro-next-btn").hide();
          $(".bootstro-prev-btn").show();
      } else if (idx > 1 && idx < allPageNum) {
          $(".bootstro-next-btn").show();
          $(".bootstro-prev-btn").show();
      } else if (idx == 1) {
          $(".bootstro-next-btn").show();
          $(".bootstro-prev-btn").hide();
      }
  }


  /**
   * @desc 时间超时函数
   * @method timeOut
   */
  function timeOut() {
      //用户登录超时的时候，弹出登录超时。返回登录页面
      var timer = setInterval(function () {
          if (lsObj.getLocalStorage('timeOut') <= new Date().getTime()) {
              var layer = parent.layer.open({
                  type: 0,
                  title: getLanguageValue("helpfulHints"),
                  area: ['300px', '200px'],
                  btn: [getLanguageValue("loginAgainBtn")],
                  yes: function () {
                      location.href = "login.html";
                  },
                  content: getLanguageValue("loginAgain"),
                  closeBtn: 0,
                  anim: 0,
                  maxmin: false,
                  skin: 'self'
              });
              clearInterval(timer);
          }
      }, 3000)
  }

  /**
   * @desc 获取用户头像信息
   * @method getUserImage
   */
  function getUserImage() {
      $("#userName").html(userBo.userName);
      $("#currentEnterprise").html(userBo.enterpriseName);
      var _path = getUserProfilePath();
      if (_path != "") {
          $("#userPhoto").attr("src", _path);
      } else {
          if (userBo.sex == "女") {
              $("#userPhoto").attr("src", "../../src/images/main/girl.png");
          } else {
              $("#userPhoto").attr("src", "../../src/images/main/photo.png");
          }
      }
  }

  /**
   * @desc 获取当前用户头像的路径
   * @method getUserProfilePath
   */
  function getUserProfilePath() {
      userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
      var profilePhotoId = userBo.profilePhoto;
      var profilePhotoPath = "";
      if (profilePhotoId == null || profilePhotoId == "") {
          profilePhotoPath = "";
      } else {
          profilePhotoPath = "/cloudlink-core-file/file/getImageBySize?fileId=" + profilePhotoId + "&viewModel=fill&width=30&hight=30";
      }
      return profilePhotoPath;
  }

  /**
   * @desc 初始化消息条数数字
   * @method getMsgNumber
   */
  function getMsgNumber() {
      var messageNumber = 0;
      var msgUrl = '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token;
      $.ajax({
          url: msgUrl,
          dataType: "json",
          type: "get",
          async: false,
          success: function (result) {
              if (result.success == 1) {

                  var data = result.messageList;
                  newsData = data;
                  for (var i in data) { //遍历字符串 
                      if (data[i].readStatus == "0") {
                          messageNumber++;
                      }
                  }
                  if (messageNumber > 0 && messageNumber < 99) {
                      $("#nuReadMsg").show();
                      $("#nuReadMsg").html(messageNumber);
                  } else if (messageNumber >= 99) {
                      $("#nuReadMsg").show();
                      $("#nuReadMsg").html('99+');
                  }
              } else {
                  layer.alert("加载消息数据失败", {
                      title:getLanguageValue("Tip"),
                      skin: 'self-alert'
                  });
              }
          }
      });
  }

  /**
   * @desc 设置用户的默认语言
   * @param {number}  设置语言
   */
  function changeLanguage(language) {
      var _data = {
          language: language
      };
      $.ajax({
          type: "post",
          contentType: "application/json; charset=utf-8",
          url: "/cloudlink-corrosionengineer/userInfo/setUserLanguage?token=" + token,
          dataType: "json",
          data: JSON.stringify(_data),
          async: false,
          success: function (data) {
              if (data.success == 1) {
                  lsObj.setLocalStorage('i18nLanguage', language);
                  parent.location.reload();
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.log(XMLHttpRequest);
              console.log(textStatus);
              console.log(errorThrown);
              layer.alert(NET_ERROR_MSG, {
                  title:getLanguageValue("Tip"),
                  skin: 'self-alert'
              });
          }
      });
  }

  function changeBackgroudURL() {
      //更换背景图片
      //暂时处理 针对不同的主题 此图片不同 需要重新定方案
      var language = lsObj.getLocalStorage("i18nLanguage"); //获得语言的key
      var currentTheme = lsObj.getLocalStorage("currentTheme");
      console.log(currentTheme);
      if (language == "en") {
          switch(currentTheme){
              case "0":
                    // 默认
                    $(".logo-name").css("background", "url('src/css/theme/default/logo_en.png') no-repeat center right");
              break;
              case "1": 
                    // blue
                     console.log("blue")
                    $(".logo-name").css("background", "url('src/css/theme/blue/logo_en.png') no-repeat center right");
              break;
              case "2":
                    // bgpic
                     console.log("bgpic")
                    $(".logo-name").css("background", "url('src/css/theme/bgpic/logo_en.png') no-repeat center right");
              break;
              case "3":
                    // gray
                    console.log("gray")
                    $(".logo-name").css("background", "url('src/css/theme/lightness/logo_en.png') no-repeat center right");
              break;
              default:
                    // 默认
                    $(".logo-name").css("background", "url('src/css/theme/default/logo_en.png') no-repeat center right");
              break;
          }
         
          $(".logo-info").css("background", "url()");
           //替换data-text中值，情况较少 ，放在此处处理
            //  var msg=document.querySelectorAll ('[data-text="消息"]');
          $("#goNewNews").attr("data-text",getLanguageValue("msg"));
          $("#goHelp").attr("data-text",getLanguageValue("help"));
          $("#goHelp").attr("href","src/html/index/help_en.html");
      }
  }

  
/**
 * @desc 设置用户的默认语言
 * @param 
 */
function getEnpUnit(){
   var defaultUnitArr = queryAllField();
//    console.log(defaultUnitArr);
   var user = JSON.parse(lsObj.getLocalStorage("userBo")), //获取user
       enterpriseId = user.enterpriseId; //公司名称id
    $.ajax({
        type: "get",
        url: '/cloudlink-corrosionengineer/userInfo/queryEnpUnit?token='+token+"&enterpriseId="+enterpriseId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:false,
        success: function (res) {
            if(res.success ==1){
                if(!isNull(res.unit)){
                    var setEnpUnit = JSON.parse(res.unit.content);
                    if(setEnpUnit.length>0){
                        for(var i = 0; i < setEnpUnit.length; i++){
                            for(var tmp in defaultUnitArr){
                                if(setEnpUnit[i].fieldName == defaultUnitArr[tmp].fieldName && setEnpUnit[i].viewUnit != defaultUnitArr[tmp].defaultUnit){
                                    defaultUnitArr[tmp].defaultUnit = setEnpUnit[i].viewUnit;
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
             parent.layer.alert(NET_ERROR_MSG, {
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
    lsObj.setLocalStorage('defaultUnitArr', JSON.stringify(defaultUnitArr));
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
                title: "提示",
                skin: 'self-alert'
            });
        }
    });
    return  defaultUnit;
}