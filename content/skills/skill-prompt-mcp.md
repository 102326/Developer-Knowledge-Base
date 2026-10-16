---
title: "Prompt、Skill 与 MCP 的区别"
description: "区分当前任务要求、可复用工作说明与工具连接协议，并理解它们如何配合。"
type: explanation
status: reviewed
publish: true
draft: false
updated: 2026-10-16
---

# Prompt、Skill 与 MCP 的区别

Prompt 表达任务要求，Skill 组织可复用的工作方法，MCP 定义应用与服务交换能力和数据的协议。三者可以配合使用。

以下以虚构本地项目 `notes-demo`：只读检查 `README.md` 中指向 `docs/start.md` 和 `docs/install.md` 的两个链接。示例设定中，前者存在，后者缺失。

## Prompt：这次要做什么

本文用 Prompt 指你这次提供给 Agent 的任务要求。例如：

> 检查 notes-demo 的 README.md 中指向 docs/start.md 和 docs/install.md 的两个链接。只报告问题，不修改文件。

这段话给出了当前对象、范围和限制。Prompt 本身也能写得很详细，还可以保存为模板；这里不是按字数长短区分它与 Skill。

## Skill：这类任务通常怎样做

Skill 把可重复使用的任务说明及相关资源组织成目录。`readme-check` Skill 可以规定如何解析链接、怎样记录证据，以及如何区分“目标不存在”和“无法读取”。它仍然要结合当前请求，才能知道这次检查哪个项目。参见 [Agent Skills 概览](https://agentskills.io/home)。

把一段 Prompt 原样存进普通 Markdown 文件，不会自动让应用把它识别为 Skill。需要符合 Skill 格式，并由所用宿主发现和加载。具体目录和激活入口依宿主而定，见 [宿主接入指南](https://agentskills.io/client-implementation/adding-skills-support)。

## MCP：应用怎样与服务交换能力和数据

MCP 全称 Model Context Protocol。它规定客户端和服务器如何交换上下文与能力信息；宿主应用管理客户端，服务器可以运行在本地或远端。

MCP 不只涉及工具。服务器可以提供：

- **Tools（工具）：** 可调用的操作，例如读取文件或执行查询。
- **Resources（资源）：** 可供应用读取的上下文数据。
- **Prompts（提示模板）：** 可复用的交互模板。

这里的 MCP Prompts 是协议中的一类功能，和上一段泛指“当前任务要求”的 Prompt 有区别。参见 [MCP 架构概览](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)。

一个 MCP 工具有名称和输入结构，客户端可以发现工具并发起调用。工具背后的程序实际执行操作；模型仍需判断何时使用、如何传参、怎样解释结果。协议不强制所有应用采用同一种用户界面，参见 [MCP 工具规范](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)。

## 配合方式

假设宿主已经提供了获准使用的文件读取能力：

1. **当前 Prompt** 指定检查 `notes-demo`，要求只读。
2. **Skill** 提供检查顺序、判定规则和报告格式。
3. **读取工具** 返回文件内容，供 Agent 按规则检查。
4. **最终报告** 列出证据、发现和未验证项。

第三步的工具可以是宿主内置工具，也可以由 MCP 服务器提供。这个任务不一定需要 MCP；反过来，使用 MCP 工具也不要求先编写 Skill。

## 权限与实现差异

Skill 不能自行授予文件权限；连接了 MCP 服务也不等于获准执行它提供的所有操作。是否允许读取、写入或访问网络，要看宿主、服务端和当前授权。

Agent Skills 规范有实验性的 `allowed-tools` 字段，但各实现的支持情况不同。不要把它理解成可以绕过宿主限制的通用授权开关。见 [Agent Skills 格式规范](https://agentskills.io/specification#allowed-tools)。

相关文档：[Skill 是什么](overview.md)。

资料核对日期：2026-10-16。示例用于说明概念，不代表某个宿主的实测结果。
