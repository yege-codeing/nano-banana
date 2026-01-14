# Supabase Google 登录设置指南

本项目已集成 Supabase 身份验证，使用服务器端认证（PKCE flow）实现 Google 登录功能。

## 1. 安装依赖

首先，安装必要的 Supabase 包：

```bash
npm install @supabase/supabase-js @supabase/ssr
# 或使用 pnpm
pnpm add @supabase/supabase-js @supabase/ssr
```

## 2. 配置 Google Cloud Platform

### 2.1 创建 Google Cloud 项目

1. 前往 [Google Cloud Platform](https://console.cloud.google.com/home/dashboard)
2. 创建新项目或选择现有项目

### 2.2 配置 OAuth 同意屏幕

1. 前往 [Google Auth Platform](https://console.cloud.google.com/auth/overview)
2. 配置以下设置：
   - **Audience（受众）**: 设置允许登录的 Google 用户
   - **Data Access（数据访问/范围）**: 添加必需的权限范围：
     - `openid` (手动添加)
     - `.../auth/userinfo.email` (默认添加)
     - `.../auth/userinfo.profile` (默认添加)
   - **Branding（品牌）**: 设置应用名称和 Logo
   - **Verification（验证）**: （可选）验证品牌信息以提高用户信任度

### 2.3 创建 OAuth 客户端 ID

1. 前往 [Clients 页面](https://console.cloud.google.com/auth/clients)
2. [创建新的 OAuth 客户端 ID](https://console.cloud.google.com/auth/clients/create)
3. 选择 **Web application（网络应用）** 作为应用类型
4. 在 **Authorized JavaScript origins（已授权的 JavaScript 来源）** 中添加：
   - `https://your-domain.com` (生产环境)
   - `http://localhost:3000` (开发环境)
5. 在 **Authorized redirect URIs（已授权的重定向 URI）** 中添加：
   - `https://<your-project-id>.supabase.co/auth/v1/callback` (生产环境)
   - `http://localhost:54321/auth/v1/callback` (本地开发，使用 Supabase CLI)
6. 点击 **Create（创建）** 并保存 Client ID 和 Client Secret

## 3. 配置 Supabase 项目

### 3.1 在 Supabase Dashboard 中配置 Google Provider

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 前往 **Authentication > Providers**
4. 找到 **Google** provider
5. 启用 Google provider
6. 填入从 Google Cloud 获取的：
   - Client ID
   - Client Secret
7. 复制显示的 **Callback URL**（用于上一步的重定向 URI 配置）
8. 保存设置

### 3.2 配置重定向 URL

1. 在 Supabase Dashboard 中，前往 **Authentication > URL Configuration**
2. 在 **Redirect URLs** 中添加：
   - `http://localhost:3000/auth/callback` (开发环境)
   - `https://your-domain.com/auth/callback` (生产环境)

## 4. 配置环境变量

在项目根目录的 `.env.local` 文件中，填入你的 Supabase 配置：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

获取这些值：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 前往 **Project Settings > API**
4. 复制：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 5. 项目结构

本实现包含以下文件：

```
├── lib/supabase/
│   ├── client.ts          # 浏览器端 Supabase 客户端
│   ├── server.ts          # 服务器端 Supabase 客户端
│   └── proxy.ts           # 中间件会话刷新逻辑
├── middleware.ts          # Next.js 中间件（自动刷新会话）
├── app/auth/
│   ├── callback/route.ts  # OAuth 回调处理
│   └── auth-code-error/   # 错误页面
│       └── page.tsx
├── components/auth/
│   ├── google-sign-in-button.tsx  # Google 登录按钮
│   ├── user-nav.tsx              # 用户导航菜单
│   ├── auth-button.tsx           # 服务器端认证按钮
│   └── auth-button-client.tsx    # 客户端认证按钮
└── .env.local             # 环境变量配置
```

## 6. 使用方法

### 6.1 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

### 6.2 测试登录流程

1. 打开浏览器访问 `http://localhost:3000`
2. 点击导航栏中的 "Continue with Google" 按钮
3. 选择你的 Google 账户并授权
4. 登录成功后，会跳转回首页，并显示用户头像
5. 点击头像可以查看用户信息和退出登录

## 7. 关键特性

### 7.1 服务器端认证（PKCE Flow）

- 使用 PKCE（Proof Key for Code Exchange）流程，更安全
- Auth token 存储在 HttpOnly cookies 中，防止 XSS 攻击
- 中间件自动刷新过期的 Auth token

### 7.2 自动会话管理

- `middleware.ts` 在每个请求时自动检查和刷新会话
- 使用 `supabase.auth.getClaims()` 验证 JWT 签名，确保安全性
- 客户端和服务器端会话同步

### 7.3 获取 Google Refresh Token

如果需要访问 Google API（例如 Google Drive、Gmail），可以获取 refresh token：

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
})
```

登录成功后，可以从 session 中获取：
- `provider_token`: Google access token
- `provider_refresh_token`: Google refresh token

## 8. 安全注意事项

1. **永远不要信任 `getSession()` 在服务器端**：
   - 在服务器端代码（Server Components, API Routes, Middleware）中，始终使用 `getClaims()` 而不是 `getSession()`
   - `getClaims()` 每次都会验证 JWT 签名，而 `getSession()` 只读取 cookies

2. **保护敏感路由**：
   - 在需要认证的页面中检查用户状态
   - 可以在 `middleware.ts` 中添加路由保护逻辑

3. **环境变量安全**：
   - 不要将 `.env.local` 提交到版本控制
   - 在生产环境中使用环境变量管理服务

## 9. 故障排除

### 问题：登录后重定向到错误页面

**解决方案**：
- 检查 Supabase Dashboard 中的 Redirect URLs 配置
- 确保 Google Cloud Console 中的 Authorized redirect URIs 正确

### 问题：OAuth 错误 "redirect_uri_mismatch"

**解决方案**：
- 确保 Google Cloud Console 中的 redirect URI 与 Supabase 提供的 Callback URL 完全匹配
- 注意 `http` vs `https` 和尾部斜杠的差异

### 问题：用户登录后立即退出

**解决方案**：
- 检查 `middleware.ts` 是否正确配置
- 确保 cookies 设置正确（HttpOnly, Secure, SameSite）
- 检查浏览器控制台的错误信息

## 10. 参考资料

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Google 登录文档](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [服务器端认证文档](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Next.js 中间件文档](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 11. 后续开发

可以考虑添加的功能：
- [ ] 添加其他社交登录提供商（GitHub, Twitter 等）
- [ ] 实现邮箱密码登录
- [ ] 添加用户个人资料页面
- [ ] 实现受保护的路由
- [ ] 添加用户角色和权限管理
