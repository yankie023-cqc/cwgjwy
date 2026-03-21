# 仓位管家 Web 版

这是基于小程序 `cwgjxcx` 迁移出的网页版项目，代码只在 `cwgjwy` 内。

## 一、先准备环境（只做一次）

1. 安装 Node.js（建议 20.x LTS）。
2. 安装后打开 PowerShell，执行：

```powershell
node -v
npm -v
```

你会看到版本号，比如 `v20.x.x`、`10.x.x`。  
如果提示“找不到命令”，说明 Node.js 还没装好或没加到 PATH。

## 二、安装依赖

命令：

```powershell
npm install
```

执行目录：`D:\阳义\临时文件\仓位管家\cwgjwy`

执行后你会看到：
- 终端输出很多安装日志
- 目录里会出现 `node_modules` 和 `package-lock.json`

## 三、启动项目（前后端一起）

命令：

```powershell
npm run dev
```

执行目录：`D:\阳义\临时文件\仓位管家\cwgjwy`

执行后你会看到两类日志：
- `server` 日志：`[cwgjwy-server] listening on http://localhost:3000`
- `web` 日志：`Local: http://localhost:5173/`

## 四、本地访问地址

- 网页地址：`http://localhost:5173/`
- 后端接口地址：`http://localhost:3000/api/health`

## 五、怎么打开网页

1. 保持 `npm run dev` 那个窗口不要关。
2. 打开浏览器（Chrome/Edge 都可以）。
3. 地址栏输入：`http://localhost:5173/`
4. 回车后就能看到“仓位管家（Web）”页面。

## 六、常见启动失败原因（白话版）

1. `npm` 命令找不到  
原因：没安装 Node.js，或者安装后没重开终端。  
处理：安装 Node.js，再开新 PowerShell。

2. 端口被占用（3000 或 5173）  
表现：提示 `EADDRINUSE` 或 `Port ... is already in use`。  
处理：关掉占用端口的程序，或者改端口后重启。

3. 依赖没装完整  
表现：`Cannot find module ...`。  
处理：回到 `cwgjwy` 目录重新执行 `npm install`。

4. 公司网络限制第三方行情接口  
表现：页面能打开，但刷新行情失败。  
处理：先确认能访问外网；必要时换网络再试。

5. 只启动了前端，没启动后端  
表现：页面打开但请求报错（接口 404/500）。  
处理：用根目录 `npm run dev` 一次启动前后端，不要只跑单边。
