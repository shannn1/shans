# 部署指南 - 如何让网页上线

你的个人网页可以通过以下几种方式免费部署上线，让全世界的人都能访问：

## 方法一：GitHub Pages（推荐，完全免费）

### 步骤：

1. **创建 GitHub 账号**（如果还没有）
   - 访问 https://github.com 注册账号

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - 仓库名：`shan-space`（或任何你喜欢的名字）
   - 选择 Public（公开）
   - 不要勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

3. **上传文件到 GitHub**
   
   在终端中执行以下命令（在项目文件夹中）：
   
   ```bash
   # 初始化 git（如果还没有）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit"
   
   # 连接到 GitHub 仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/shan-space.git
   
   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

4. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 "Settings"
   - 左侧菜单找到 "Pages"
   - 在 "Source" 下选择 "Deploy from a branch"
   - Branch 选择 "main"，文件夹选择 "/ (root)"
   - 点击 "Save"

5. **访问你的网站**
   - 几分钟后，你的网站将在以下地址可用：
   - `https://YOUR_USERNAME.github.io/shan-space/`

---

## 方法二：Netlify（最简单，拖拽即可）

### 步骤：

1. **访问 Netlify**
   - 访问 https://www.netlify.com
   - 使用 GitHub 账号登录（推荐）或邮箱注册

2. **部署网站**
   - 登录后，在 Dashboard 页面
   - 将整个项目文件夹拖拽到页面上的虚线框内
   - 或者点击 "Add new site" → "Deploy manually"

3. **完成**
   - Netlify 会自动部署
   - 你会得到一个随机域名，如：`https://random-name-123.netlify.app`
   - 可以在 "Site settings" → "Change site name" 中修改为自定义域名

---

## 方法三：Vercel（适合开发者）

### 步骤：

1. **访问 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库（如果已上传）
   - 或直接拖拽项目文件夹

3. **部署**
   - 点击 "Deploy"
   - 几分钟后完成，你会得到一个域名

---

## 方法四：Cloudflare Pages（快速且免费）

### 步骤：

1. **访问 Cloudflare Pages**
   - 访问 https://pages.cloudflare.com
   - 使用 Cloudflare 账号登录（免费注册）

2. **连接 GitHub**
   - 点击 "Connect to Git"
   - 授权 GitHub 访问
   - 选择你的仓库

3. **部署设置**
   - Framework preset: None
   - Build command: （留空）
   - Build output directory: （留空）
   - 点击 "Save and Deploy"

---

## 推荐方案对比

| 平台 | 优点 | 缺点 |
|------|------|------|
| **GitHub Pages** | 完全免费，与代码管理集成 | 需要 Git 知识 |
| **Netlify** | 最简单，拖拽即可 | 免费版有带宽限制 |
| **Vercel** | 速度快，开发者友好 | 需要注册账号 |
| **Cloudflare Pages** | 全球 CDN，速度快 | 设置稍复杂 |

## 注意事项

⚠️ **重要提示**：
- 由于你的网站使用 localStorage 存储数据，每个访问者的数据是独立的
- 图片以 base64 格式存储，如果图片很多，可能会占用较多存储空间
- 建议定期备份数据（导出功能可以后续添加）

## 自定义域名（可选）

如果你有自己的域名，可以在上述平台的设置中添加自定义域名：
- GitHub Pages: Settings → Pages → Custom domain
- Netlify: Site settings → Domain management
- Vercel: Settings → Domains

---

**推荐新手使用 Netlify**，只需拖拽文件夹即可完成部署！

