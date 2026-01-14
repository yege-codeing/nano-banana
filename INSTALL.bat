@echo off
echo ========================================
echo 安装 Supabase 依赖
echo ========================================
echo.

echo 尝试使用 npm 安装...
npm install
if %errorlevel% == 0 goto success

echo.
echo npm 安装失败，尝试使用 yarn...
yarn install
if %errorlevel% == 0 goto success

echo.
echo yarn 安装失败，尝试清理缓存后重试...
npm cache clean --force
npm install
if %errorlevel% == 0 goto success

echo.
echo ========================================
echo 安装失败！请手动运行以下命令：
echo   npm install
echo 或者
echo   yarn install
echo ========================================
pause
exit /b 1

:success
echo.
echo ========================================
echo 安装成功！
echo ========================================
echo.
echo 下一步：
echo 1. 配置 .env.local 文件中的 Supabase 凭据
echo 2. 运行 npm run dev 启动开发服务器
echo.
echo 详细设置说明请查看：QUICK_START.md
echo ========================================
pause
