---
title: "开发者知识文库"
description: "面向制作者的技术说明、使用方法和工程参考。"
type: explanation
status: reviewed
publish: true
draft: false
updated: 2026-11-19
---

# 开发者知识文库

这里整理工具与 Mod 开发中的概念、接口、使用方法和工程经验。读者可以按问题直接查阅。

## Agent Skill

- [什么是 Skill](skills/overview.md)：组成、工作方式与能力边界。
- [Skill、Prompt 与 MCP](skills/skill-prompt-mcp.md)：职责区别与配合方式。
- [SKILL.md 结构](skills/skill-md.md)：元数据、正文与资源组织。
- [创建与使用 Skill](skills/create-and-use.md)：目录、完整示例、调用和常见问题。
- [怎样判断一个 Skill 真的有用](skills/evaluate-a-skill.md)：用小组对照案例检查触发、执行和结果。

示例用于解释用法，不是作业，也不要求逐篇完成。可以直接打开需要的章节。

## 工程实践

- [小型仓库的持续维护与 Agent 协作](engineering/repository-maintenance.md)：权威实现、小步迁移、调试验证与旧实现清理。
- [构建通过，为什么 404 返回后链接却坏了](engineering/check-deployed-subpath.md)：从一次子路径修复理解构建与部署验证的区别。

## 文库说明

- [阅读说明](start/reading-guide.md)：适用环境、示例和验证范围。
- [文档导航](start/navigation.md)：按问题找到合适文章。
- [编写规范](writing/editorial-guide.md)：结构、术语、引用和维护方式。

首版包含 Skill 技术文档。后续按资料准备情况加入 DoL、SugarCube、ModLoader 与更多工程案例，并说明来源和适用版本。技术说明已完成编辑审阅；具体宿主的运行覆盖以各篇文末说明为准。
