# GitHub Pages 部署详细步骤

## 第一步：创建 GitHub 账号和仓库

1. **注册/登录 GitHub**
   - 访问 https://github.com
   - 如果没有账号，点击 "Sign up" 注册
   - 如果已有账号，直接登录

2. **创建新仓库**
   - 点击右上角头像旁边的 "+" 按钮
   - 选择 "New repository"
   - 填写仓库信息：
     - **Repository name**: `shan-space`（或任何你喜欢的名字）
     - **Description**: `Personal space for books, movies and travels`
     - **Visibility**: 选择 **Public**（GitHub Pages 免费版需要公开仓库）
     - **不要勾选** "Add a README file"（我们已经有了）
     - **不要勾选** "Add .gitignore"（我们已经有了）
   - 点击绿色的 "Create repository" 按钮

## 第二步：在本地初始化 Git 并上传代码

打开终端（Terminal），执行以下命令：

### 1. 进入项目目录
```bash
cd /Users/hongshan/Desktop/shan
```

### 2. 初始化 Git 仓库
```bash
git init
```

### 3. 添加所有文件
```bash
git add .
```

### 4. 提交文件
```bash
git commit -m "Initial commit: Shan's personal space"
```

### 5. 连接到 GitHub 仓库
**重要**：将 `YOUR_USERNAME` 替换为你的 GitHub 用户名

```bash
git remote add origin https://github.com/YOUR_USERNAME/shan-space.git
```

例如，如果你的用户名是 `zhangshan`，命令应该是：
```bash
git remote add origin https://github.com/zhangshan/shan-space.git
```

### 6. 设置主分支并推送
```bash
git branch -M main
git push -u origin main
```

**注意**：第一次推送时，GitHub 会要求你输入用户名和密码。
- 用户名：你的 GitHub 用户名
- 密码：需要使用 **Personal Access Token**（不是 GitHub 密码）

### 如何获取 Personal Access Token：

1. 登录 GitHub
2. 点击右上角头像 → **Settings**
3. 左侧菜单最下方找到 **Developer settings**
4. 点击 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**
6. 填写信息：
   - **Note**: `GitHub Pages Deploy`
   - **Expiration**: 选择过期时间（建议选择较长时间）
   - **Select scopes**: 勾选 `repo`（全部权限）
7. 点击 **Generate token**
8. **重要**：复制生成的 token（只显示一次，请保存好）
9. 在终端输入密码时，粘贴这个 token

## 第三步：启用 GitHub Pages

1. **进入仓库设置**
   - 在 GitHub 仓库页面，点击顶部的 **Settings** 标签

2. **找到 Pages 设置**
   - 在左侧菜单中，向下滚动找到 **Pages**
   - 点击进入 Pages 设置页面

3. **配置部署源**
   - 在 "Source" 部分：
     - 选择 **Deploy from a branch**
     - **Branch**: 选择 `main`
     - **Folder**: 选择 `/ (root)`
   - 点击 **Save** 按钮

4. **等待部署**
   - GitHub 会在几分钟内自动部署你的网站
   - 部署完成后，你会看到绿色的提示信息，显示你的网站地址

## 第四步：访问你的网站

部署完成后，你的网站地址将是：
```
https://YOUR_USERNAME.github.io/shan-space/
```

例如，如果你的用户名是 `zhangshan`，地址就是：
```
https://zhangshan.github.io/shan-space/
```

## 后续更新网站

当你修改了代码后，只需要执行以下命令即可更新网站：

```bash
# 进入项目目录
cd /Users/hongshan/Desktop/shan

# 添加修改的文件
git add .

# 提交修改
git commit -m "Update: 描述你的修改内容"

# 推送到 GitHub
git push
```

推送后，GitHub Pages 会自动重新部署（通常需要 1-2 分钟）。

## 常见问题

### Q: 推送时提示 "remote: Support for password authentication was removed"
A: 需要使用 Personal Access Token，而不是 GitHub 密码。按照上面的步骤获取 token。

### Q: 网站显示 404
A: 
- 检查仓库名称是否正确
- 确认已启用 GitHub Pages（Settings → Pages）
- 等待几分钟让 GitHub 完成部署
- 检查 `index.html` 是否在仓库根目录

### Q: 如何修改网站地址？
A: 
- 在仓库 Settings → Pages 中可以修改
- 或者修改仓库名（会改变地址）

### Q: 可以自定义域名吗？
A: 可以！在 Settings → Pages → Custom domain 中添加你的域名。

## 需要帮助？

如果遇到问题，可以：
1. 查看 GitHub Pages 官方文档：https://docs.github.com/en/pages
2. 检查 GitHub 仓库的 Actions 标签，查看部署状态

---

**提示**：第一次设置可能需要 10-15 分钟，但之后更新网站只需要几秒钟！

