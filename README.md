# Simple Frontend App

一个基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 的前端应用，集成了 RESTful API 调用功能。

## 功能特性

- ⚡ **Next.js 16** - React 框架，支持 App Router
- 🎨 **Tailwind CSS v4** - 原子化 CSS 样式
- 🔷 **TypeScript** - 类型安全
- 🌐 **API 集成** - 通过 RESTful API 与后端通信
- 🏗️ **Repository Pattern** - 优雅封装 API 调用层
- 🔄 **实时状态管理** - React Hooks 管理 UI 状态

## 项目结构

```
simpleFrontendApp/
├── app/
│   ├── layout.tsx          # 根布局（Geist 字体配置）
│   ├── page.tsx            # 首页（API 调用演示 UI）
│   └── globals.css         # 全局样式
├── lib/
│   └── api.ts              # API 封装模块（Repository Pattern）
├── next.config.ts          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 依赖管理
```

## API 架构

本项目采用 **Repository Pattern** 封装 HTTP 请求：

```
page.tsx ──► lib/api.ts ──► Backend API (FastAPI)
  UI 层        服务层         数据层
```

### 封装特性

- 统一错误处理（`ApiError` 类）
- 类型安全的请求/响应（TypeScript 接口）
- 支持环境变量配置 API 地址
- 业务 API 按模块拆分（`greetingApi`, `weatherApi`）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

创建 `.env.local` 文件：

```bash
# 后端 API 地址（默认：http://localhost:8000）
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. 启动后端服务

确保后端运行在 `http://localhost:8000`：

```bash
cd ../fastapi-ecs-pro
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端需要配置 CORS 以允许前端访问：

```python
# fastapi-ecs-pro/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. 启动前端开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 访问应用。

## 可用的 API 调用

| 功能 | 端点 | 描述 |
|------|------|------|
| 问候 | `GET /greet/{name}` | 获取个性化问候语 |
| 天气 | `GET /weather` | 获取今日天气数据 |
| 健康检查 | `GET /health` | 检查后端服务状态 |

## 使用示例

```typescript
import { greetingApi, weatherApi } from '@/lib/api';

// 获取问候语
const data = await greetingApi.getGreeting('Alice');
console.log(data.message); // "Hello Alice, I think you are great!!!"

// 获取天气
const weather = await weatherApi.getWeather();
console.log(weather.city); // "Shanghai"
```

## 脚本命令

```bash
npm run dev      # 开发模式（热重载）
npm run build    # 生产构建
npm run start    # 生产模式启动
npm run lint     # ESLint 代码检查
```

## 部署

本项目可部署在 Vercel：

```bash
vercel --prod
```

部署后需要配置环境变量 `NEXT_PUBLIC_API_URL` 指向生产后端地址。

## 技术栈

- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Font**: Geist (Vercel)

## 相关项目

- [fastapi-ecs-pro](../fastapi-ecs-pro/) - 后端 API 服务（FastAPI）

---

Built with ❤️ using Next.js
