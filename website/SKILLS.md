# Populi - Technical Skills & Workflows (SKILLS.md)

This document outlines the standard operating procedures (SOPs), technical constraints, and specific development workflows for building the **Populi** frontend.

---

## 1. Next.js App Router Fundamentals

**Context:** The target framework for the Populi frontend architecture.
    * **Routing Strategy:** Use the `app/` directory. Implement clean, dynamic routes (`politician/[slug]/page.tsx`).
    * **Component Paradigm:** Default to React Server Components for static fact displays to maximize speed and SEO. Use `"use client"` exclusively for interactive UI pieces (like a search bar or sorting toggle).
    * **Mock Data Integration:** During development, set up local mock data structures for politicians and parties so the UI can be built and tested completely independently of the final backend.

## 2. Stitch MCP Development Workflow

**Context:** How the AI will interact with the codebase to write the frontend.
    * **Context Provisioning:** Always feed Stitch MCP the exact TypeScript interfaces and design tokens before asking it to generate a component.
    * **Iterative Scaffolding:** Use Stitch tools to generate components step-by-step (e.g., first the layout skeleton, then the Tailwind styling, then the data mapping).
    * **Code Correction:** Utilize Stitch to pinpoint and fix frontend hydration errors, layout shifts, or responsive design bugs across different screen sizes.

## 3. "Vox Populi" UI/UX Design System

**Context:** The visual constraints required to keep the platform objective and factual.
    * **Minimalism & Clarity:** The UI must be highly scannable. Avoid heavy animations, gradients, or cluttered sidebars. Focus entirely on typography and whitespace to present facts clearly.
    * **Objective Data Visualization:** Use simple, neutral UI elements to represent data (e.g., plain progress bars for attendance, simple grids for voting records). Do not use colors that inherently favor one political ideology over another in the base UI.
    * **Accessibility:** Ensure strict WCAG compliance. Contrast ratios must be high, and all interactive elements must be keyboard-navigable.

## 4. Language & Content Constraints

**Context:** Developing for the Portuguese electorate.
    * **Hardcoded UI Strings:** All standard UI elements (buttons, navbars, footer links) must be generated directly in Portuguese (e.g., "Pesquisar Político", "Ver Factos", "Filtrar por Partido").
    * **Terminology:** Enforce the correct use of the Portuguese political lexicon in the code structure (e.g., naming components `AssembleiaData` instead of `ParliamentData` to maintain contextual accuracy if preferred, though English is fine for internal code variables as long as user-facing text is PT-PT).
