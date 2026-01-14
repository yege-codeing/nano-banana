# 🚀 快速开始 - Google 登录功能

## 立即开始的 3 个步骤

### 步骤 1: 安装依赖包

```bash
npm install @supabase/supabase-js @supabase/ssr
```

或使用 pnpm:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 步骤 2: 配置环境变量

编辑 `.env.local` 文件，填入你的 Supabase 项目配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

**如何获取这些值：**

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（或创建新项目）
3. 前往 **Project Settings > API**
4. 复制：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 步骤 3: 配置 Google OAuth

#### 3.1 在 Google Cloud Platform 创建 OAuth 客户端

1. 前往 [Google Cloud Console](https://console.cloud.google.com/auth/clients/create)
2. 选择 **Web application**
3. 在 **Authorized JavaScript origins** 添加：
   - `http://localhost:3000`
   - `https://your-production-domain.com`
4. 在 **Authorized redirect URIs** 添加：
   - `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
5. 保存 **Client ID** 和 **Client Secret**

#### 3.2 在 Supabase 配置 Google Provider

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 > **Authentication > Providers**
3. 启用 **Google**
4. 填入 Google 的 Client ID 和 Client Secret
5. 在 **Authentication > URL Configuration** 中添加允许的重定向 URL：
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.com/auth/callback`

## ✅ 完成！

启动开发服务器：

```bash
npm run dev
```

访问 `http://localhost:3000`，点击 "Continue with Google" 按钮测试登录功能！

## 📖 需要更多帮助？

查看完整的设置指南：[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 🎯 已实现的功能

✅ Google OAuth 登录（使用服务器端 PKCE flow）
✅ 自动会话刷新（通过 middleware）
✅ 用户导航菜单（显示头像和用户信息）
✅ 安全的 token 管理（HttpOnly cookies）
✅ 响应式登录按钮（桌面端和移动端）
✅ 优雅的登录/登出体验

## 🔒 安全特性

- ✅ 使用 PKCE flow 增强安全性
- ✅ HttpOnly cookies 防止 XSS 攻击
- ✅ 服务器端使用 `getClaims()` 验证 JWT
- ✅ 自动刷新过期 token
- ✅ 安全的会话管理

## 🛠️ 文件结构

```
你的项目/
├── lib/supabase/          # Supabase 客户端工具
│   ├── client.ts          # 浏览器端客户端
│   ├── server.ts          # 服务器端客户端
│   └── proxy.ts           # 会话刷新逻辑
├── middleware.ts          # Next.js 中间件
├── app/
│   ├── auth/
│   │   ├── callback/route.ts      # OAuth 回调
│   │   └── auth-code-error/...    # 错误页面
│   └── page.tsx           # 首页（已集成登录按钮）
└── components/auth/       # 认证相关组件
    ├── google-sign-in-button.tsx
    ├── user-nav.tsx
    ├── auth-button.tsx
    └── auth-button-client.tsx
```

## 📝 注意事项

1. **开发环境**: 确保在 Google Cloud 和 Supabase 中都配置了 `localhost:3000`
2. **生产环境**: 部署前更新所有配置为生产域名
3. **安全**: 永远不要将 `.env.local` 提交到 Git

## 🎉 下一步

- 添加受保护的路由
- 实现用户个人资料页面
- 添加其他社交登录（GitHub, Twitter）
- 集成数据库存储用户数据
