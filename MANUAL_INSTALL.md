# 手动安装指南

## 当前状态

✅ 所有 Google 登录代码已经创建完成
✅ package.json 已更新包含 Supabase 依赖
❌ 依赖包安装遇到网络/认证问题

## 解决方案

### 方案 1: 清理 npm 缓存后重试

打开命令提示符或 PowerShell，运行以下命令：

```bash
cd D:\workspace\aicoding\Nano-Banana-20260103

# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json（如果存在）
rmdir /s /q node_modules
del package-lock.json

# 重新安装（选择以下一种方式）
npm install
# 或使用 yarn（如果可用）
yarn install
```

### 方案 2: 使用 cnpm（国内镜像）

如果你在中国大陆，可以使用淘宝 npm 镜像：

```bash
# 安装 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

# 使用 cnpm 安装依赖
cd D:\workspace\aicoding\Nano-Banana-20260103
cnpm install
```

### 方案 3: 配置 npm 镜像

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

安装完成后，恢复默认镜像：
```bash
npm config set registry https://registry.npmjs.org
```

### 方案 4: 只安装 Supabase 包

如果其他包已经安装好了，只需要安装 Supabase：

```bash
cd D:\workspace\aicoding\Nano-Banana-20260103
npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
```

## 验证安装

安装成功后，运行以下命令验证：

```bash
npm ls @supabase/supabase-js @supabase/ssr
```

应该看到两个包的版本信息。

## 启动项目

安装完成后：

```bash
npm run dev
```

访问 http://localhost:3000 应该可以看到首页，不再有模块找不到的错误。

## 下一步

1. 查看 `QUICK_START.md` 配置 Supabase 项目
2. 查看 `SUPABASE_SETUP.md` 了解完整设置流程
3. 配置 `.env.local` 文件中的 Supabase 凭据

## 故障排除

### 问题：npm access token 过期

这是之前 npm login 的 token 过期导致的。解决方法：

```bash
npm logout
# 重新安装，不需要登录即可安装公开包
npm install
```

### 问题：网络连接超时

- 检查网络连接
- 尝试使用 VPN 或更换网络
- 使用国内镜像源（方案 2 或 3）

### 问题：peer dependency 警告

这些警告可以忽略，不会影响项目运行。是 Next.js 16 与某些 storybook 包的版本不匹配导致的，但不影响核心功能。

## 需要帮助？

如果以上方法都无法解决问题，请：

1. 检查 Node.js 版本：`node --version`（建议 v18 或更高）
2. 检查 npm 版本：`npm --version`
3. 查看完整错误日志：`npm install --verbose`
