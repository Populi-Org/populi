<div align="center">
    <img alt="Banner" src="./assets/banner.png">
</div>

<p align="center">
    <a href="https://status.henriquesf.me/"><img alt="Status" src="https://uptime.henriquesf.me/api/badge/10/uptime?labelColor=ffffff&labelValueColor=000000&color=2252E1"></a>
    <a href="https://github.com/Populi-Org/populi/actions/workflows/deploy.yml"><img alt="Deploy" src="https://img.shields.io/github/actions/workflow/status/Populi-Org/populi/deploy.yml?label=Deploy&logo=githubactions&logoColor=black&labelColor=white&color=2252E1"></a>
    <a href="https://codecov.io/gh/Populi-Org/populi"><img alt="Coverage" src="https://img.shields.io/codecov/c/github/Populi-Org/populi?logo=codecov&logoColor=black&labelColor=white&color=2252E1"></a>
    <a href="https://github.com/Populi-Org/populi/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Populi-Org/populi?label=Issues&logoColor=black&labelColor=white&color=2252E1"/></a>
    <a href="https://github.com/Populi-Org/populi/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Populi-Org/populi?label=PRs&logoColor=black&labelColor=white&color=2252E1"/></a>
</p>

<p align="center">
    <a href="https://github.com/Populi-Org/populi/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Populi-Org/populi?style=flat&logo=github&label=Stars&logoColor=black&labelColor=white&color=2251E1"/></a>
    <a href="https://www.figma.com/design/EfSVqJoV9CnLxAxfZWUGup/Populi?node-id=255-5&t=NAeMO7nN6KVn6SKt-1"><img alt="Figma Project" src="https://img.shields.io/badge/Figma-2252E1?logo=figma&logoColor=white"></a>
    <a href="https://taikai.network/shift-appens/hackathons/shift-appens-2026/projects/cmon7bccd00wilr6x2g758qgb/idea"><img alt="Taikai Project" src="https://img.shields.io/badge/Taikai-2252E1"></a>
    <a href="https://github.com/Populi-Org/populi/blob/main/LICENSE"><img alt="License: EPL" src="https://img.shields.io/github/license/Populi-Org/populi?label=License&logo=readthedocs&logoColor=black&labelColor=white&color=2251E1"/></a>
</p>

<h4 align="center">
    Vox Populi, Vox Dei
</h4>

# Project Overview


Following political activity in Portugal has become an exhausting exercise: information about representatives is scattered across an unceasing flow of ephemeral news and the polarized noise of social media. Without a way to filter what is relevant, citizens get lost in isolated headlines and fragmented narratives, making it nearly impossible to obtain a consolidated, factual, and unbiased view of each politician’s track record and positions.

To solve this problem, we created Populi. The name, drawn from the expression "Vox Populi, Vox Dei"; Latin for "The voice of the people is the voice of God"; demonstrates the platform's objective: a place where users can find concise and structured information regarding the politicians within each political party. By ignoring rumors and reinforcing facts, Populi is the key to a better-informed political opinion.

# Tech Stack

- **Frontend:** React, Tailwind CSS, Next.js, Lucide Icons
- **Backend (runtime app):** Next.js, Prisma
- **Data ingestion/scraper:** Python
- **Database:** PostgreSQL
- **AI Integration:** AI SDK, OpenCode
- **DevOps:** Docker, GitHub Actions
- **Code Quality:** Biome
- **Design:** Figma, Stitch
- **Testing:** Vitest with Codecov
- **External APIs/Sources:** Público, Expresso, Polígrafo, Dados Abertos da Assembleia da República

# Main Features

- **Homepage** - The "Mural da Democracia" displays a live count of active deputies, highlights trending politicians based on parliamentary interventions, and allows users to explore the deputy mosaic filtered by party, region, or theme.

- **Deputy Directory** (`/deputy`) - A searchable and paginated grid of all deputies. Users can filter by name, party, constituency, or theme, and toggle the inclusion of substitute deputies.

- **Deputy Profile** (`/deputy/[id]`) - A detailed, tabbed profile for each politician including biographical highlights, legislative activity, recent initiatives, a featured parliamentary quote, profile statistics, news coverage, and Polígrafo fact-checks.

- **Assembly Overview** (`/assembly`) - A visual breakdown of the Portuguese Parliament's composition, displaying all parties with seat counts, percentages, and an interactive hemicycle seating chart.

- **Legislative Proposals** (`/proposals`) - A searchable and filterable catalog of legislative initiatives. Users can filter by type, author party, or result, and view detailed timelines of each proposal's legislative journey, including vote breakdowns by party.

- **AI Chat Assistant** (`/chat`) - A conversational interface powered by an LLM with access to structured database tools. Users can ask natural language questions about deputies, parties, and parliamentary activity to receive factual, data-driven answers.

- **Information Pages** — Dedicated pages for FAQ, Contact, Team, and Privacy Policy.

# The Team

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/42045371?v=4" width="auto" height="auto" alt="Bruno Oliveira">
      <br>
      <b>Bruno Oliveira</b>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/116096892?v=4" width="auto" height="auto" alt="Clara Sousa">
      <br>
      <b>Clara Sousa</b>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/85371550?v=4" width="auto" height="auto" alt="Henrique Fernandes">
      <br>
      <b>Henrique Fernandes</b>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/139002032?v=4" width="auto" height="auto" alt="José Sousa">
      <br>
      <b>José Sousa</b>
    </td>
  </tr>
</table>


