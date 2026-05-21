# 兰州市事业编考试刷题平台 - Git 部署脚本
# 使用方法：双击运行或在 PowerShell 中执行 .\deploy-to-git.ps1

# 配置信息
$gitUserEmail = "your-email@example.com"
$gitUserName = "Your Name"
$remoteUrl = "https://github.com/your-username/your-repo.git"  # 请替换为您的仓库地址

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  兰州市2026年事业编考试刷题平台部署脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了 Git
try {
    Get-Command git -ErrorAction Stop | Out-Null
} catch {
    Write-Host "❌ 错误：未找到 Git，请先安装 Git" -ForegroundColor Red
    Write-Host "下载地址：https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

# 设置 Git 用户信息
Write-Host "📝 设置 Git 用户信息..." -ForegroundColor Gray
git config user.email $gitUserEmail
git config user.name $gitUserName

# 初始化 Git 仓库（如果尚未初始化）
if (-not (Test-Path ".git")) {
    Write-Host "🔄 初始化 Git 仓库..." -ForegroundColor Gray
    git init
}

# 添加需要提交的文件
Write-Host "📁 添加文件..." -ForegroundColor Gray
git add src/
git add index.html
git add package.json
git add tsconfig.json
git add vite.config.ts
git add vercel.json
git add _redirects
git add .gitignore
git add README.md

# 检查是否有需要提交的更改
$status = git status --porcelain
if (-not $status) {
    Write-Host "⚠️ 没有需要提交的更改" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 0
}

# 提交更改
Write-Host "✅ 提交更改..." -ForegroundColor Gray
git commit -m "feat: 兰州市事业编考试刷题平台 - 初始化部署"

# 添加远程仓库
Write-Host "🔗 添加远程仓库..." -ForegroundColor Gray
git remote add origin $remoteUrl

# 推送代码
Write-Host "🚀 推送到 GitHub..." -ForegroundColor Gray
git push -u origin main

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 部署成功！" -ForegroundColor Green
Write-Host "您的代码已推送到 GitHub" -ForegroundColor Green
Write-Host "仓库地址: $remoteUrl" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Read-Host "按 Enter 键退出"