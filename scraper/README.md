# Parlamento.pt Deputy Activity Data

This directory contains scraped activity data for Portuguese Parliament deputies.

## Files

- **`final_data.json`** — Sorted JSON export of the XVII Legislatura deputy activity dataset (the latest available from parlamento.pt). Contains 1,446 deputy records.

## Data Structure

`final_data.json` is a JSON array. Each element represents one deputy and has the following top-level keys:

```json
[
  {
    "AtividadeDeputadoList": [ ... ],
    "Deputado": { ... }
  }
]
```

### `Deputado` — Deputy Identity

| Field | Type | Description |
|-------|------|-------------|
| `DepId` | float | Unique deputy ID |
| `DepCadId` | float | Cadastre ID |
| `DepNomeParlamentar` | string | Parliamentary name (short) |
| `DepNomeCompleto` | string | Full legal name |
| `DepCPId` | float | Electoral district ID |
| `DepCPDes` | string | Electoral district name (e.g. "Lisboa", "Aveiro") |
| `DepCargo` | string \| null | Official position/role |
| `LegDes` | string | Legislature description (always `"XVII"` in this dataset) |
| `DepGP` | array | Party/group affiliation history |
| `DepSituacao` | array | Deputy status history |

#### `DepGP` — Party/Group Affiliation (array)

| Field | Type | Description |
|-------|------|-------------|
| `GpId` | float | Group ID |
| `GpSigla` | string | Party acronym (e.g. `"PS"`, `"IL"`, `"CH"`, `"PCP"`) |
| `GpDtInicio` | string | Start date (`YYYY-MM-DD`) |
| `GpDtFim` | string | End date (`YYYY-MM-DD`) |

#### `DepSituacao` — Deputy Status (array)

| Field | Type | Description |
|-------|------|-------------|
| `SioDes` | string | Status description (e.g. `"Suplente"`, `"Efetivo"`, `"Renunciou"`) |
| `SioDtInicio` | string | Start date (`YYYY-MM-DD`) |
| `SioDtFim` | string \| null | End date (null if ongoing) |

### `AtividadeDeputadoList` — Deputy Activities

An array with a single object containing all activity categories. Most fields are `null` when the deputy has no records of that type.

| Field | Type | Description |
|-------|------|-------------|
| `ActP` | array \| null | Parliamentary acts (votos, etc.) |
| `Audicoes` | array \| null | Hearings (audições) |
| `Audiencias` | array \| null | Audiences/auditions |
| `Cms` | array \| null | Committee memberships |
| `DadosLegisDeputado` | array \| null | Legislature-specific deputy info |
| `Deslocacoes` | array \| null | Work trips/travels |
| `DlE` | array \| null | International delegations |
| `DlP` | array \| null | National delegations (always null in this dataset) |
| `Eventos` | array \| null | Events |
| `Gpa` | array \| null | Parliamentary friendship groups |
| `Ini` | array \| null | Initiatives (bills, proposals) |
| `Intev` | array \| null | Interventions (speeches, questions) |
| `ParlamentoJovens` | array \| null | Youth parliament activities |
| `Rel` | object \| null | Rapporteur activities |
| `Req` | array \| null | Requests |
| `Scgt` | array \| null | Committee sub-groups |

#### Common Activity Fields

Many activity types share these fields:

| Field | Type | Description |
|-------|------|-------------|
| `ActId` | string | Activity ID |
| `ActAs` | string | Activity subject/description |
| `ActDtent` | string \| null | Entry date |
| `ActNr` | string \| null | Activity number |
| `ActTp` | string | Activity type code (e.g. `"VOT"`, `"AUD"`, `"DES"`, `"EVN"`) |
| `ActTpdesc` | string | Activity type description |
| `ActLg` | string | Legislature (e.g. `"XVII"`) |
| `ActLoc` | string \| null | Location |
| `ActSl` | string \| null | Session number |

#### `Rel` — Rapporteur Activities (object)

| Field | Type | Description |
|-------|------|-------------|
| `AutoresPareceresIncImu` | array \| null | Opinion authors (imunities) |
| `RelatoresContasPublicas` | array \| null | Public accounts rapporteurs |
| `RelatoresIniciativas` | array \| null | Initiative rapporteurs |
| `RelatoresIniEuropeias` | array \| null | EU initiative rapporteurs |
| `RelatoresPeticoes` | array \| null | Petition rapporteurs |

#### `Cms` — Committee Membership (array)

| Field | Type | Description |
|-------|------|-------------|
| `CmsCd` | string | Committee code |
| `CmsNo` | string | Committee name |
| `CmsCargo` | string | Role (e.g. `"Vice-CGP"`, `"Membro"`) |
| `CmsSituacao` | string | Status (e.g. `"Efetivo"`) |
| `CmsSubCargo` | string \| null | Sub-role |
| `CmsLg` | string | Legislature |

#### `DlE` — International Delegations (array)

| Field | Type | Description |
|-------|------|-------------|
| `DevId` | string | Delegation ID |
| `DevNo` | string | Delegation description |
| `DevLoc` | string | Location |
| `DevDtini` | string | Start datetime |
| `DevDtfim` | string | End datetime |
| `DevTp` | string | Type (e.g. `"Internacional"`) |

#### `Gpa` — Parliamentary Friendship Groups (array)

| Field | Type | Description |
|-------|------|-------------|
| `GplId` | string | Group ID |
| `GplNo` | string | Group name (e.g. `"Portugal - Alemanha"`) |
| `CgaCrg` | string | Role (e.g. `"Membro"`) |
| `CgaDtini` | string | Start date |
| `CgaDtfim` | string \| null | End date |
| `GplSelLg` | string | Legislature |

#### `Ini` — Initiatives (array)

| Field | Type | Description |
|-------|------|-------------|
| `IniId` | string | Initiative ID |
| `IniNr` | string | Number |
| `IniTi` | string | Title |
| `IniTp` | string | Type code (e.g. `"J"` = Projeto de Lei) |
| `IniTpdesc` | string | Type description |
| `IniSelLg` | string | Legislature |

#### `Intev` — Interventions (array)

| Field | Type | Description |
|-------|------|-------------|
| `IntId` | string | Intervention ID |
| `IntTe` | string | Target/Recipient |
| `IntSu` | string | Subject |
| `PubDtreu` | string | Publication date |
| `PubNr` | string | Publication number |
| `PubSl` | string | Session |
| `PubDar` | string | Pages |
| `PubTp` | string | Publication type |
| `TinDs` | string | Intervention type description |

#### `Req` — Requests (array)

| Field | Type | Description |
|-------|------|-------------|
| `ReqId` | string | Request ID |
| `ReqNr` | string | Number |
| `ReqAs` | string | Subject |
| `ReqDt` | string | Date |
| `ReqLg` | string | Legislature |
| `ReqSl` | string | Session |
| `ReqPerTp` | string | Period type |

#### `ParlamentoJovens` — Youth Parliament (array)

| Field | Type | Description |
|-------|------|-------------|
| `Data` | string | Date |
| `Estabelecimento` | string | School/institution |
| `CirculoEleitoral` | string | Electoral district |
| `Sessao` | string | Session type |
| `TipoReuniao` | string | Meeting type |
| `Legislatura` | string | Legislature |

## Notes for PostgreSQL Ingestion

### Normalization Strategy

The data is deeply nested. For a PostgreSQL schema, consider normalizing into these tables:

1. **`deputies`** — Core deputy identity (`DepId`, `DepNomeParlamentar`, `DepNomeCompleto`, `DepCPId`, `DepCPDes`, etc.)
2. **`parties`** — Unique political parties (`gp_id`, `sigla`). Extracted automatically from `DepGP` data.
3. **`party_history`** — One row per `DepGP` entry, referencing `parties` via `party_id`
4. **`status_history`** — One row per `DepSituacao` entry
5. **`activities` (or per-type tables)** — Each activity type (Audiencias, Cms, Ini, etc.) can be its own table with a `deputy_id` foreign key.

### JSONB Alternative

For simpler ingestion, you can store the entire `AtividadeDeputadoList` array in a single `jsonb` column on the `deputies` table and query it with PostgreSQL's JSON operators:

```sql
SELECT DepNomeParlamentar,
       AtividadeDeputadoList->0->'Audiencias' AS audiencias
FROM deputies
WHERE AtividadeDeputadoList->0->>'Audiencias' IS NOT NULL;
```

### Known Data Issues

- **All files serve the same dataset**: The Parlamento website currently returns the XVII Legislatura data regardless of which historical term is requested. This is a server-side bug.
- **Many null fields**: Most deputies have sparse activity records. Only ~10-20% of deputies have non-null values for any given activity type.
- **`LegDes` is always `"XVII"`**: Even for files labeled as other legislaturas.
