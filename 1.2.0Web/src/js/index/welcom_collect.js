  /**
   * @author: lizhenzhen
   * @date: 2017-04-19
   * @last modified by: lizhenzhen 
   * @last modified time: 2017-04-19 09:07:33
   * @file:现场检测人员首页图表的配置
   */

  var userBo = JSON.parse(lsObj.getLocalStorage("userBo"));
  var token = lsObj.getLocalStorage("token");

  var wholeOption, WholeChart; //整体完成情况配置项与图表
  var byTimeCheckChart, TimeCheckOption; //人员工作量统计配置项与图表
  var Options, Charts; //各任务进度
  var divArr = [];

  $(function() {
      getIframHeight();
      $(window).bind("resize", function() {
          getIframHeight();
      });

      setExecuteGraph();
      setTimeCheckGraph();
      setTaskRateGraph();
      getTaskData();
      getExecuteTaskData();
      getPersonTaskData();
      getNewsData();

      // 去消息页面
      $("#goNews").on("click", function(e) {
          e.preventDefault();
          parent.menuItem($(this));
      });
  })

  // 获取首页内容框的高度
  function getIframHeight() {
      var iframH = $(window).height();
      var iframW = $(window).width();
      if (iframH < 600 || iframW <= 985) {
          iframH = 600;
      }
      var iframHeadH = $(".welcom-header").outerHeight();
      var contentHeight = (iframH - 8 * 2 - iframHeadH);
      var graphBoxHeight = (contentHeight - 80) / 2;
      $(".entirety").height(contentHeight + "px");
      $(".execute-content").height(contentHeight - 50 + "px");
      $(".news-lists").height(contentHeight - 50 + "px");
      if (iframW <= 985) {
          $(".entirety").height("1000px");
          $(".execute-content").height("650px");
          $(".news-main").height("250px");
          $(".news-lists").height("250px");
      }
  }

  // 获取个人任务信息
  function getTaskData() {
      $.ajax({
          url: "/cloudlink-corrosionengineer/statistics/detectUserCount?token=" + token,
          type: "get",
          async: false,
          success: function(result) {
              if (result.success == 1) {
                  var data = result.dataMap;
                  $("#taskSum").html(data.taskSum);
                  $("#unclaimed").html(data.unclaimed);
                  $("#running").html(data.running);
                  $("#unchecked").html(data.unchecked);
              } else {
                  layer.msg("加载数据失败");
              }
          },
          error: function(e) {
              console.log(e);
          }
      });
  }

  // 获取首页整体完成情况与各任务进度数据
  function getExecuteTaskData() {
      $.ajax({
          url: "/cloudlink-corrosionengineer/statistics/getTasProgressForDetectUser?token=" + token + "&detectUserId=" + userBo.objectId + "&enterpriseId=" + userBo.enterpriseId,
          dataType: "json",
          type: "get",
          async: false,
          success: function(result) {
              if (result.success == 1) {

                  var data = result.dataList;
                  drowTaskRateGraph(data);
              } else {
                  layer.msg("加载数据失败");
              }
          }
      });
  }

  // 获取人员工作量统计数据 与任务的完成情况
  function getPersonTaskData() {
      $.ajax({
          url: "/cloudlink-corrosionengineer/task/getTaskProcess?token=" + token,
          dataType: "json",
          type: "get",
          async: false,
          success: function(result) {
              if (result.success == 1) {
                  var data = result.taskInfoBo.createUserCount;
                  drowExecuteGraph(result)
                  drowTimeCheckGraph(data);

              } else {
                  layer.msg("加载数据失败");
              }
          }
      });
  }

  // 获取首页消息部分数据task_statistics_collect
  function getNewsData() {
      $.ajax({
          url: '/cloudlink-corrosionengineer/message/queryAllMessage?token=' + token,
          dataType: "json",
          type: "get",
          async: false,
          success: function(result) {
              if (result.success == 1) {
                  var data = result.messageList;

                  createOnPage(data);
              } else {
                  layer.msg("加载数据失败");
              }
          }
      });
  }

  // 加载消息到页面上
  function createOnPage(data) {
      var newsNoReadArr = [];
      for (var temp in data) {
          if (data[temp].readStatus == "0" && (data[temp].businessType == 1 || data[temp].businessType == 2 || data[temp].businessType == 6)) { //未读

              newsNoReadArr.push(data[temp]);
          }
      }
      $("#news-length").html("(" + newsNoReadArr.length + ")");
      $("#lists").html("");
      for (var i = 0; i < newsNoReadArr.length; i++) {
          $("<li><p class = 'list-line1'><span>" +
              newsNoReadArr[i].sendTime + "</span></p><p>" + newsNoReadArr[i].businessTypeName + "</p><p><span>任务名称: </span><span>" + newsNoReadArr[i].taskName + "</span></p><a class='news-check-btn' id=btn" + i + "  data-text='全部任务' data-index='8' href='src/html/task/all_task/all_task.html'>查看</a></li>").appendTo($("#lists"))
      }
      //点击消息查看跳转到全部任务页面
      var newCheckBtn = $(".news-check-btn");
      for (var i = 0; i < newCheckBtn.length; i++) {
          $("#btn" + i).on("click", function(e) {
              e.preventDefault();
              parent.menuItem($(this));
          });
      }
  }

  // 配置整体完成饼图
  function setExecuteGraph() {
      WholeChart = echarts.init(document.getElementById('wholeGraph'));
      wholeOption = {
          title: {
              subtext: '',
              bottom: 0,
              left: "38%",
              subtextStyle: {
                  color: "#333",
                  fontSize: 12
              }

          },
          tooltip: {
              trigger: 'item',
              formatter: "{b}"
          },
          textStyle: {
              color: "#666",
              fontSize: 12
          },
          series: [{
              name: '全部测试桩个数',
              type: 'pie',
              radius: '50%',
              center: ['50%', '45%'],
              data: [{
                  itemStyle: {
                      normal: {
                          color: '#4fc877' //已完成
                      }
                  },
                  labelLine: {
                      normal: {
                          //   show: false
                          length: 1
                      }
                  }
              }, {
                  itemStyle: {
                      normal: {
                          color: '#fb7760' //无法检测
                      }
                  },
                  labelLine: {
                      normal: {
                          //   show: false
                          length: 1
                      }
                  }

              }, {
                  itemStyle: {
                      normal: {
                          color: '#e2e2e2' //待检测
                      }
                  },
                  labelLine: {
                      normal: {
                          //   show: false
                          length: 1
                      }
                  }
              }],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }]
      };
      window.addEventListener("resize", function() {
          WholeChart.resize();
      });
      WholeChart.setOption(wholeOption, true);
  }

  // 画整体完成情况图
  function drowExecuteGraph(data) {

      var result = data.taskInfoBo;

      var detectionMarker = result.testSum, //测试桩总数
          complete = result.complete, //已完成
          notdetectCount = result.unableTest; //无法检测
      var undetection = detectionMarker - complete - notdetectCount; //未检测

      var completedbili, unablebili, notdetectbili;
      if (complete == 0) {
          completedbili = 0;
      } else {
          completedbili = (complete / detectionMarker * 100).toFixed(0);
      }

      if (undetection == 0) {
          unablebili = 0;
      } else {
          unablebili = (undetection / detectionMarker * 100).toFixed(0);
      }

      if (notdetectCount == 0) {
          notdetectbili = 0;
      } else {
          notdetectbili = (notdetectCount / detectionMarker * 100).toFixed(0);
      }
      try {
          if (wholeOption && typeof wholeOption === "object") {
              wholeOption.title.subtext = ("全部测试桩(个):" + detectionMarker);
              wholeOption.series[0].data[0].value = complete;
              wholeOption.series[0].data[0].name = complete + "个/" + completedbili + "%\n已检测";
              wholeOption.series[0].data[1].value = notdetectCount;
              wholeOption.series[0].data[1].name = notdetectCount + "个/" + notdetectbili + "%\n无法检测";
              wholeOption.series[0].data[2].value = undetection;
              wholeOption.series[0].data[2].name = undetection + "个/" + unablebili + "%\n待检测";
              WholeChart.setOption(wholeOption, true);
          }
      } catch (e) {
          alert(e);
      }
  }

  // 配置下部柱状图
  function setTimeCheckGraph() {
      byTimeCheckChart = echarts.init(document.getElementById('byTimeCheckGraph'));
      TimeCheckOption = {
          tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              right: 10,
              icon: 'circle',
              data: ['今日', '本周', '本月']
          },
          grid: {
              show: true,
              //   left: '3%',
              right: '4%',
              bottom: '6%',
              containLabel: true,
              //   backgroundColor: "pink"
          },
          dataZoom: [{
                  type: 'inside',
                  start: 80,
                  end: 100,
                  zoomLock: true //是否锁定选择区域（或叫做数据窗口）的大小。
                      // 如果设置为 true 则锁定选择区域的大小， 也就是说， 只能平移， 不能缩放。
              },
              {
                  show: false,
                  type: 'slider',
                  y: '90%',
                  start: 80,
                  end: 100,
              }
          ],
          xAxis: [{
              type: 'category',
              //   nameGap: 5,
              //   nameRotate: 45,
              axisLabel: {
                  //   rotate: 45,
                  interval: 0
              },
              axisTick: {
                  //   show: false
                  show: true,
                  inside: true
              },
              nameTextStyle: {
                  fontSize: 8,
              },
              //   data: ['周一', '周二', '周三']
              data: ""
          }],
          yAxis: [{
              type: 'value'
          }],
          series: [{
                  name: '今日',
                  type: 'bar',
                  barWidth: 10,
                  itemStyle: {
                      normal: {
                          color: '#50c979',
                          barBorderRadius: 5
                      }
                  },
                  label: {
                      normal: {
                          show: true,
                          position: 'top',
                          textStyle: {
                              color: "#666",
                              fontSize: 12
                          }
                      }
                  },
                  data: ""
                      //   data: [320, 332, 301]
              },
              {
                  name: '本周',
                  type: 'bar',
                  barWidth: 10,
                  itemStyle: {
                      normal: {
                          color: '#f59324',
                          barBorderRadius: 5
                      }
                  },
                  label: {
                      normal: {
                          show: true,
                          position: 'top',
                          textStyle: {
                              color: "#666",
                              fontSize: 12
                          }
                      }
                  },
                  data: ""
                      //   data: [120, 132, 101]
              },
              {
                  name: '本月',
                  type: 'bar',
                  barWidth: 10,
                  itemStyle: {
                      normal: {
                          color: '#fb7760',
                          barBorderRadius: 5
                      }
                  },
                  label: {
                      normal: {
                          show: true,
                          position: 'top',
                          textStyle: {
                              color: "#666",
                              fontSize: 12
                          }
                      }
                  },
                  data: ""
                      //   data: [220, 182, 191]
              }

          ]
      };
      window.addEventListener("resize", function() {
          byTimeCheckChart.resize();
      });
      byTimeCheckChart.setOption(TimeCheckOption, true);
  }

  // 画下部柱状图
  function drowTimeCheckGraph(data) {
      //   console.log(data);

      var taskNameArr = [],
          listArr = [],
          thisDayArr = [],
          thisWeekArr = [],
          thisMonthArr = [];

      var datazoomStart = "",
          datazoomEnd = "";
      for (var temp in data) {
          taskNameArr.push(temp);
          listArr.push(data[temp]);


      }
      for (var i in listArr) {
          thisDayArr.push(listArr[i][0]);
          thisWeekArr.push(listArr[i][1]);
          thisMonthArr.push(listArr[i][2]);
      }

      if (listArr.length < 10) {
          datazoomStart = 0;
          datazoomEnd = 100;
      } else if (listArr.length < 20) {
          datazoomStart = 50;
          datazoomEnd = 100;
      } else if (listArr.length < 30) {
          datazoomStart = 80;
          datazoomEnd = 100;
      } else if (listArr.length < 40) {
          datazoomStart = 90;
          datazoomEnd = 100;
      } else {
          datazoomStart = 95;
          datazoomEnd = 100;
      }

      $("#personSumNum").html("(总人数：" + listArr.length + ")");
      if (TimeCheckOption && typeof TimeCheckOption === "object") {
          TimeCheckOption.dataZoom[0].start = datazoomStart;
          TimeCheckOption.dataZoom[0].end = datazoomEnd;
          TimeCheckOption.dataZoom[1].start = datazoomStart;
          TimeCheckOption.dataZoom[1].end = datazoomEnd;

          TimeCheckOption.xAxis[0].data = taskNameArr;
          TimeCheckOption.series[0].data = thisDayArr;
          TimeCheckOption.series[1].data = thisWeekArr;
          TimeCheckOption.series[2].data = thisMonthArr;
          byTimeCheckChart.setOption(TimeCheckOption, true);
      }
  }

  // 配置饼状图任务进度
  function setTaskRateGraph() {
      Options = {
          title: {
              subtext: '',
              //   top: 0,
              bottom: 30,
              left: "center",
              subtextStyle: {
                  color: "#333",
                  fontSize: 12
              }

          },
          grid: {
              left: "0",
              right: "0",
              //   show: true
          },
          tooltip: {
              show: false,
              trigger: 'item',
              formatter: "{a} <br/>{b}"
          },
          animation: { show: false },
          series: [{
                  name: '任务统计',
                  type: 'pie',
                  radius: [0, '20%'],
                  center: ['50%', '30%'],
                  hoverAnimation: false,
                  selectedOffset: 0,
                  label: {
                      normal: {
                          position: 'inner',
                          textStyle: {
                              color: '#464646',
                              fontSize: 12
                          }
                      }
                  },
                  line: {
                      markPoint: {
                          silent: true
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data: [{
                      value: 1000,
                      name: "1000",
                      itemStyle: {
                          normal: {
                              color: '#fff',
                              //   color: 'yellow',
                          }
                      }
                  }]
              },
              {
                  name: '任务统计',
                  type: 'pie',
                  radius: ['40%', '50%'],
                  center: ['50%', '35%'],
                  //   hoverAnimation: false,
                  label: {
                      normal: {
                          position: "outside",
                          textStyle: {
                              color: '#464646',
                              fontSize: 12
                          }
                      }
                  },

                  data: [{
                          value: "200",
                          name: '200',
                          itemStyle: {
                              normal: {
                                  color: '#50c979'
                              }
                          },
                          labelLine: {
                              normal: {
                                  length: 0.1,
                              }
                          },
                      },
                      {
                          value: "300",
                          itemStyle: {
                              normal: {
                                  color: '#e3e3e3'
                              }
                          },
                          labelLine: {
                              normal: {
                                  show: false
                              }
                          }
                      },

                  ]
              }
          ]
      };

  }

  // 画饼状图任务进度
  function drowTaskRateGraph(data) {
      for (var temp in data) {
          var list = data[temp].taskList;
          for (var temp in list) {
              divArr.push(list[temp]);
          }
      }
      for (var i = 0; i < divArr.length; i++) {
          (function(i) {
              var that = i;
              $("#executeModel").append($("<div class='whole-model' id=" + that + "></div>"));
              if (Options && typeof Options === "object") {
                  var charts = echarts.init(document.getElementById(that));
                  Options.series[0].data[0].name = divArr[that].testSum; //总
                  Options.series[1].data[0].value = divArr[that].complete; //完成
                  Options.series[1].data[0].name = divArr[that].complete + "个\n完成"; //完成
                  Options.series[1].data[1].value = (parseInt(divArr[that].testSum) - parseInt(divArr[that].complete));
                  Options.title.subtext = divArr[that].taskName;
                  window.addEventListener("resize", function() {
                      getIframHeight();
                      charts.resize();
                  });
                  charts.setOption(Options, true);
              }
          })(i)
      }
      $("#taskNum").html("(" + divArr.length + ")");


  }