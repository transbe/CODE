  /**
   * @author: liangyuanyuan
   * @date: 2017-02-23
   * @last modified by: lizhenzhen 
   * @last modified time: 2017-05-22 
   * @file:首页头部和侧边栏的js操作
   */

  var tmenpi; //参数1
  var userBo; //用户信息BO
  var newsData; //消息数据
  var roleNameNum; //角色判断
  var canOpenViewTask = true;   //判断是否弹出查看任务页面
  (function() {
      privilege(); //权限控制
  })()


  /**
   * 判断当前的角色有没有平台管理员角色 权限控制
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
          //   loadIndex();
      } else {
          loadIndex();
      }
      //获取当前用户的默认企业Id
      function getDefaultEnterpriseId(token) {
          $.ajax({
              type: "Get",
              url: "/cloudlink-core-framework/login/getDefaultEnterpriseId?token=" + token + "&appCode=" + appCode,
              contentType: "application/json",
              dataType: "json",
              success: function(data) {
                  //   console.log(data);
                  var success = data.success;
                  if (success == 1) {
                      //   alert("获取默认企业");
                      //当前用户存在默认企业Id
                      var _enterpriseId = data.rows[0].enterpriseId;
                      //查找这个企业列表中有无中盈安信企业，有则进行
                      console.log(_enterpriseId);
                      joinDefaultEnterprise(token, _enterpriseId);

                  } else {
                      //当前用户不存在默认企业Id
                      $('.hidkuai2 span').text('当前用户未设置默认登录企业');
                  }
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log(XMLHttpRequest);
                  console.log(textStatus);
                  console.log(errorThrown);
              }
          });
      }
      //加入默认企业
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
              success: function(data) {
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
                      //alert(document.URL)
                      var getval = document.URL.split('?')[0];
                      //   console.log(getval);
                      // window.location.href = getval;

                      loadIndex();
                     
                      // 运营人员没有消息的功能
                      $("#goNewNewsBox,#goHelpBox").css("display", "none");
                      $("#signOutBox").addClass("borderLeft");
                      $('#side-menu').html("");
                      $('#side-menu').renderMenu(getMenuNodes(), function(event, el, data) {
                          if (data.url && data.url != '' && data.url != '#') {
                              menuItem(el);
                          }
                      });

                  }
              },
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log(XMLHttpRequest);
                  console.log(textStatus);
                  console.log(errorThrown);
              }
          });
      }
  }

  function loadIndex() {
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
      //   $(".person-operate").children("li").eq(1).addClass("borderLeft");

      // 获取用户信息
      getUserImage();
      //登录超时，返回登录页面，重新登录
      timeOut();

      // 判断是否是运营人员，如果是运营人员不执行消息的方法
      var roleJudge = judgePrivilege();
      if (roleJudge == false) {
          //消息未读的条数，加载到页面上,每隔20秒刷新一次
          getMsgNumber();
          setInterval(function() {
              getMsgNumber();
          }, 20000);
      }

      // 显示个人资料下拉菜单
      $(".open").mouseenter(function() {
          $(".hide-person-operate").show();
      }).mouseleave(function() {
          $(".hide-person-operate").hide();
      });

      //去个人资料页面
      $("#goPersonal").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });

      // 去修改密码页面
      $("#goModpwd").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });

      // 去goSetLogin登录设置页面
      $("#goSetLogin").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });


      // 换肤功能
      $("#setSkin").click(function() {
          var skinLayer = parent.layer.open({
              type: 2,
              title: '皮肤设置',
              area: ['950px', '600px'],
              btn: ["确定", "关闭"],
              yes: function(index, layero) {
                  parent.layer.close(index);
              },
              content: "src/html/person_settings/set_skin.html"
          });
          // parent.layer.full(skinLayer);
      })

      // 去消息页面
      $("#goNewNews").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });

      // 去帮助页面
      $("#goHelp").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });

      //退出登录
      $("#signOut").on("click", function(e) {
          e.preventDefault();
          layer.confirm("您确定要退出登录吗？", {
              title: "提示",
              btn: ['确定', "取消"], //按钮
              skin: "self"
          }, function() {
              var token = lsObj.getLocalStorage('token');
              $.ajax({
                  url: "/cloudlink-core-framework/login/logout?token=" + token,
                  type: "POST",
                  dataType: "json",
                  success: function(data) {
                      var success = data.success;
                      if (success == 1) {
                          layer.closeAll();
                          localStorage.clear("timeOut");

                          location.href = 'login.html';
                      } else {
                          layer.confirm("退出失败！", {
                              btn: ['确定'], //按钮
                              skin: 'self'
                          });
                      }
                  },
                  error: function(XMLHttpRequest, textStatus, errorThrown) {
                      console.log(XMLHttpRequest);
                      console.log(textStatus);
                      console.log(errorThrown);
                  }
              });
          });
      });

      // 设置右上角按钮的鼠标移入移出事件
      $(".person-operate li a").click(function() {
              $(this).css({
                  background: "#434e62"
              });
          })
          .mouseenter(function() {
              $(this).css({
                  background: "#434e62"
              });
          }).mouseleave(function() {
              $(this).css({
                  background: "#344052"
              });
          })
          .focus(function() {
              $(this).css({
                  background: "#434e62"
              });
          }).blur(function() {
              $(this).css({
                  background: "#344052"
              });
          });

      // 菜单的打开与关闭
      var menuFlag = false;
      $(".menu-bar").bind("click", function() {
          console.log(menuFlag);
          if (menuFlag == false) {
              $("#menuNav.navbar-static-side").show().slideDown(100);
              menuFlag = true;
          } else {
              $("#menuNav.navbar-static-side").slideUp(100).hide();
              menuFlag = false;
          }
      });

      //窗口大小变化控制菜单栏的显示与隐藏
      $(window).on("resize", function() {
          var winW = $(window).width();
          if (winW > 768) {
              $("#menuNav.navbar-static-side").show();
          } else {
              $("#menuNav.navbar-static-side").hide();
          }
      });

  }

  // 时间超时函数
  function timeOut() {
      //用户登录超时的时候，弹出登录超时。返回登录页面
      var timer = setInterval(function() {
          if (lsObj.getLocalStorage('timeOut') <= new Date().getTime()) {
              var layer = parent.layer.open({
                  type: 0,
                  title: '友情提示',
                  area: ['300px', '200px'],
                  btn: ['重新登录'],
                  yes: function() {
                      location.href = "login.html";
                  },
                  content: "您的登录超时，请重新登录",
                  closeBtn: 0,
                  anim: 0,
                  maxmin: false,
                  skin: 'self'
              });
              clearInterval(timer);
          }
      }, 3000)
  }

  // 获取用户头像信息
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

  // 获取当前用户头像的路径
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

  // 初始化数字，显示到页面上
  function getMsgNumber() {
      var messageNumber = 0;
      var msgUrl = '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token;
      $.ajax({
          url: msgUrl,
          dataType: "json",
          type: "get",
          async: false,
          success: function(result) {
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
                  layer.msg("加载数据失败", {
                      skin: "self-success"
                  });
              }
          },
          error: function(msg) {}
      });
  }