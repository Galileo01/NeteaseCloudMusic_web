# Music.163-Web_wangyiyunyinyue

#### 介绍
网页版网易云音乐
v 1.4.1

在线访问 pages  服务  :    
https://ego-git.gitee.io/music.163-web_wangyiyunyinyue/
#### 软件架构
jQuery + css  +html
主要 响应方式 ：Ajax（对json文件发送请求）


#### 访问教程
1. 内含 3首歌   点击切换
2. 默认 第一首和 单曲播放模式 ，第二次进入会从上一次播放的歌曲开始播放，模式也是上一次的模式（localstorage 实现）
3. 进度和音量 可以点击，但还没 写拖动（其实耶差不多）
4. 科普：顺序模式 下播放完最后一首 就会停止播放  而 列表模式就会从头开始播放

最新issues
1.根据搜索结果 从chrome浏览器的某个版本开始，处于安全考虑，禁止浏览器 未知媒体文件的 autoplay 属性 
