# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: LinkMatch — AI 跨境服务智能撮合助手（MVP）

面向海外华人与出海企业的 AI 跨境服务撮合平台。用户用自然语言描述需求，AI 通过多轮 CoT 对话拆解意图，基于 RAG 匹配服务商知识库，最终生成带推荐理由的服务方案。

## Commands

```bash
npm run dev      # 启动开发服务器 (http://localhost:3000)
npm run build    # 生产构建
npm run lint     # ESLint 检查
npm run start    # 启动生产服务器
```

## Tech Stack

- **前端**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **字体**: Playfair Display（标题/衬线） + DM Sans（正文/UI） + JetBrains Mono（代码）
- **AI 对话**: SSE 流式 + 本地规则引擎（`lib/ai.ts`）+ Mock RAG（`lib/rag.ts`）
- **AI Provider**: 预留 LLMProvider 接口，可接入 DeepSeek / GPT / Mimo

## Architecture

```
app/
  page.tsx                  # / AI 对话首页（SSE 流式）
  decompose/page.tsx        # /decompose 需求拆解页
  provider/[id]/page.tsx    # /provider/[id] 服务商详情
  admin/page.tsx            # /admin 运营后台
  api/chat/route.ts         # POST SSE 对话
  api/providers/route.ts    # GET/POST 服务商列表
  api/providers/[id]/route.ts # GET 单个服务商
  layout.tsx                # 根布局 + 导航
  globals.css               # 全局样式（暖纸底 Editorial 主题）
lib/
  types.ts                  # Provider, RequirementSlots, ChatMessage 等
  mock-data.ts              # 15 家服务商 Mock 数据（4 品类 × 4 国家）
  rag.ts                    # 本地关键词匹配 + 加权打分
  ai.ts                     # 槽位提取、完整度判断、追问/推荐回复
components/
  chat/chat-panel.tsx       # 对话面板 + 推荐卡片
```

## Page Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/` | AI 对话首页 | 自然语言入口，SSE 流式对话 |
| `/decompose` | 需求拆解页 | CoT 思维链展示，结构化需求标签 |
| `/provider/[id]` | 服务商详情页 | AI 推荐理由 + 信任标签 |
| `/admin` | 极简运营后台 | 服务商列表 + 知识库覆盖统计 |

## Design System

Editorial Luxury 风格 — 暖纸底 (FBF7F0) + 深墨蓝 accent (1A3A4A) + 陶土 CTA (C75B39) + 暗金信任标 (B8935A)。
不要改回暗色模式或 Geist 字体。

## Reference Documents

- `产品方案.md` — 原始产品方案（含求职策略、1 周突击执行路径）
- `LinkMatch-面试版.md` — 精简面试版（飞书: https://lll0x0hhh.feishu.cn/docx/IiASd3OuBoy95SxvotAcS5clnlc）
- `LinkMatch产品方案文档.md` — 完整产品方案（旧版）
