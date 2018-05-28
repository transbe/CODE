
## 附件接口文档(attachment)
 * [附件上传](#jump)
 * [app端文件上传](#jump2)
 * [附件上传之前检测文件的大小](#jump3)
*  [根据业务数据id和业务含义，读取附件信息列表](#jump4)
 * [附件下载](#jump5)
 * [获取图片文件缩略图](#jump6)
 * [文档预览 通过文件存放路径直接读取文件流](#jump7)
 * [获得KASS系统文件预览地址](#jump8)
 * [附件删除](#jump9)
 * [查询上传进度](#jump10)
 
 ------
<table>
  <tr>
    <th>日期</th>
    <th>编写人</th>
    <th>版本号</th>
  </tr>
  <tr>
    <td>2018年3月28日10:54:40</td>
    <td>yangyuanzhu</td>
    <td>V1.0</td>
  </tr>
  
</table>

 ------
 
<span id = "jump">附件上传</span>
<font size=2 face="黑体">接口名称</font> |附件上传 | 接口地址|attachment/upload.do
---|---|---|---|
接口类型 |  POST|传入参数| businessId <br>businessType<br>moduleCode
| 返回参数| 发生的


<span id = "jump2">app端文件上传</span>
<font size=2 face="黑体">接口名称</font> |app端文件上传 | 接口地址|attachment/app/upload.do|
---|---|---|---|
接口类型|  POST|传入参数| files<br>  businessId<br> fileDescription<br> businessType<br> moduleCode
| 返回参数 |files<br>  businessId<br> fileDescription<br> businessType<br> moduleCode<br>

<span id = "jump3">附件上传之前检测文件的大小</span>
<font size=2 face="黑体">接口名称</font> |附件上传之前检测文件的大小 | 接口地址|attachment/getInfo.do|
---|---|---|---|
接口类型|  POST|传入参数| 
| 返回参数 | success 0 大于配置的文件大小 1为小于配置文件大小<br>

<span id = "jump4">根据业务数据id和业务含义，读取附件信息列表</span>
<font size=2 face="黑体">接口名称</font> |根据业务数据id和业务含义，读取附件信息列表 | 接口地址|attachment/checkSize.do|
---|---|---|---|
接口类型|  POST|传入参数| businessId<br> businessType 默认attachment
| 返回参数 |eventid<br>fileName<br>fileDescription<br>fileSize<br>
