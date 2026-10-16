---
title: "Skill 是什么"
description: "用一个虚构的本地文档检查任务，理解 Agent Skills 的组成、加载过程与能力边界。"
type: explanation
status: reviewed
publish: true
draft: false
updated: 2026-10-16
---

# Skill 是什么

Skill 用来组织 Agent 执行某类任务时需要的说明和资源。它通常包含适用场景、处理步骤、参考资料和输出约定。

## 使用场景

假设你维护一个虚构的本地项目 `notes-demo`。每次更新文档，都要检查 `README.md` 中两条已知链接：指向已有文件 `docs/start.md` 的链接，以及指向缺失文件 `docs/install.md` 的链接。这个示例只涉及两个已知文件目标。

你可以每次重新说明检查规则，也可以把重复使用的流程整理成一个 Skill。

## Skill 是一份有结构的工作说明

Agent Skills 是一种开放的文件组织格式。一个 Skill 至少有一个目录和其中的 `SKILL.md`；该文件包含名称、用途描述和任务说明，也可以配套脚本、参考资料或模板。详见 [Agent Skills 概览](https://agentskills.io/home)。

一个 Skill 目录示例：

```text
readme-check/
├── SKILL.md
└── references/
    └── checking-rules.md
```

这里的 `readme-check/` 是 Skill 自身的目录，`notes-demo/` 是它要检查的项目。

`SKILL.md` 开头的 YAML 区域称为 frontmatter，用来写元数据。下面是一份简化示例：

```markdown
---
name: readme-check
description: 只读检查 README.md 中指向 docs/start.md 和 docs/install.md 的两个文件链接；在用户请求此项文档检查时使用。
---

# 文档检查

1. 确认用户指定的项目根目录，以及允许读取的范围。
2. 读取 README.md，只定位指向 docs/start.md 和 docs/install.md 的两个链接。
3. 相对 README.md 所在目录解析这两个路径，分别确认目标文件是否存在；不遍历其他目录。
4. 列出来源文件、链接目标、检查结果和建议；不修改文件。
5. 不能读取或不能判断的项目标为“未验证”，不要当作通过。
```

规范要求 `name` 和 `description`，正文用于描述具体做法。示例中的 `name` 与目录名一致。脚本和参考目录是可选内容，最小结构只需要 `SKILL.md`。见 [文件格式规范](https://agentskills.io/specification)。

## 发现与加载

支持 Skill 的宿主应用负责让 Agent 找到和读取这些内容。规范采用逐步加载的思路：先提供名称和用途，选用后再读取详细步骤，需要时再取配套资料。

但“把文件放进某个目录”不代表所有应用都会发现它。扫描位置、是否支持手动选用、采用哪种调用语法，都取决于宿主。官方格式规范没有规定统一安装位置；实际使用前应查看所用产品的说明。见 [宿主接入指南](https://agentskills.io/client-implementation/adding-skills-support)。

## 执行与权限

Skill 提供工作方法，实际操作依赖宿主提供的工具和运行环境。例如，读取 `notes-demo/README.md` 需要文件读取能力及相应访问权限；Skill 中写有这一步，并不会改变文件权限。

Skill 的自然语言步骤也不是确定性函数：Agent 仍需理解任务、调用工具并解释结果。需要固定判定规则时，可以在 Skill 中配套脚本，并为脚本编写测试。

相关文档：[Prompt、Skill 与 MCP 的区别](skill-prompt-mcp.md)。
