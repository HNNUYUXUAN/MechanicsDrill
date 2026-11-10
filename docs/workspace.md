# 题源与工作区

项目以周衍柏编《理论力学教程》（第五版，高等教育出版社，2023 年）为题源。网页版题干按原题条件转述，解答依据工作区的独立推导整理。教材扫描和裁切图保存在本地原材料中，公开题图采用自绘 SVG。阅卷要点供自评使用。

## 工作区归并

| 本地材料 | 题号 | 公开站点 |
| --- | --- | --- |
| 理论力学第二章习题 HTML 程序包与 Markdown 原题包 | 2.1、2.3、2.5 | 第二章 · 质点系力学 |
| theory-mechanics-exercises-html 与 theory-mechanics-exercises-markdown | 2.8、2.13、2.16 | 第二章 · 质点系力学 |
| html_program 与 markdown_source | 3.1、3.2、3.4、3.5 | 第三章 · 刚体力学 |
| TheoryMechanics_Ch3_HTML_StudyApp 与 TheoryMechanics_Ch3_Markdown_SourcePack | 3.9、3.10、3.30 | 第三章 · 刚体力学 |

## 维护入口

- [sources/questions.json](../sources/questions.json) 存题号、转述题面、知识点、速刷检查项及辨析依据。
- [sources/solutions/](../sources/solutions/) 存解答。2.13 和 2.13-energy 分别对应动力学与机械能守恒。
- [public/figures/](../public/figures/) 存学习示意图。第二章示意图和第三章受力图来自本地整理材料中的自绘 SVG，3.2、3.4、3.30 的题面示意图为本项目重绘。
- [scripts/bank.mjs](../scripts/bank.mjs) 生成可重复构建的题库，并检查解答中的粗体数学命令与图像路径。
- [src/](../src/) 实现训练会话、订正、错题、复习计划、统计与备份。界面及状态机制来自本账号下的 [PhysDrill](https://github.com/HNNUYUXUAN/PhysDrill/tree/7ce4a4c8ff0932f1e358fcddd7d46f4e0cd0e77c)，题库及判定逻辑按理论力学习题适配。
- [GitHub Pages 工作流](../.github/workflows/pages.yml) 对主分支做题库一致性检查、格式检查、测试和构建，再部署到项目子路径。
