# Reactive-Resume-Generator

通过[Reactive-Resume](https://rxresu.me/)可以在线进行简历的编写、在线预览以及导出。但是官方导出的PDF中文汉字字体表现奇怪，通过本工具可以导出正常的PDF文件。

## 安装

``` bash
git clone https://github.com/Messiahhh/reactive-resume-generator.git
cd reactive-resume-generator
pnpm install
node index.js https://rxresu.me/messiahhhc/akara # 替换成你的简历在线地址
```

## QA
1. 怎么获得在线地址？
在简历编辑页面中点击Copy Link to Resume即可生成在线地址。

2. 访问不到简历数据
需要在设置中把简历设置为公开可见