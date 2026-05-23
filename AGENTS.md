# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project: LinkMatch — AI 跨境服务智能撮合助手（MVP）

面向海外华人与出海企业的 AI 跨境服务撮合平台。用户用自然语言描述需求，AI 通过多轮 CoT 对话拆解意图，基于 RAG 匹配服务商知识库，最终生成带推荐理由的服务方案。

## Phase: 代码尚未初始化

当前目录仅有产品方案文档。Web MVP 尚未开始编码。

## Planned Tech Stack

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **AI**: DeepSeek API 或 GPT API（对话 + Prompt 工程）
- **RAG**: MVP 阶段用本地 TF-IDF + 余弦相似度，无需向量数据库
- **部署**: Vercel（前端）, Railway/Render（后端 API）

## Planned Page Structure (4 pages)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | AI 对话首页 | 自然语言入口，SSE 流式对话 |
| `/decompose` | 需求拆解页 | 动态展示 CoT 思维链，结构化需求标签 |
| `/provider/[id]` | 服务商详情页 | AI 生成的个性化推荐理由 + 信任标签 |
| `/admin` | 极简运营后台 | 上传服务商资料，更新 RAG 知识库 |

## Reference Documents

- `产品方案.md` — 原始产品方案（含求职策略、1 周突击执行路径）
- `LinkMatch-面试版.md` — 精简面试版产品文档（已同步到飞书: https://lll0x0hhh.feishu.cn/docx/IiASd3OuBoy95SxvotAcS5clnlc）
- `LinkMatch产品方案文档.md` — 完整产品方案（旧版，保留参考）

## First Steps (when coding begins)

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir=false`
2. Install shadcn/ui: `npx shadcn@latest init`
3. Create Mock data: 15 家服务商（公司注册/税务/签证/商标 × 新加坡/英国/加拿大/美国）
4. Implement `/api/chat/route.ts` with SSE streaming + CoT prompt
5. Deploy to Vercel: `npx vercel --prod`
