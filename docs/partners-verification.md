# Suppliers / partners verification

Audit date: 2026-09-19. Rule: no partner name or logo is published without a confirmed current relationship,
the right to use the mark, the correct naming and the exact approved wording (brief §32).

**Current state of the new site: no supplier or partner names and no third-party logos are rendered anywhere.**

| Name (as on old site) | Old wording | Old page (last edited) | Logo on old site | Status | Risk / note |
|---|---|---|---|---|---|
| ORLEN | "Naszym głównym dostawcą jest firma ORLEN." | `/oferta/hurt-paliw/` (2023-10-30) | Yes | CLIENT_CONFIRMATION_REQUIRED | ORLEN brand guidelines restrict logo use; "główny dostawca" is a purchasing statement, not a partnership. |
| Aramco | "Pozostali dostawcy to: Aramco, …" | same | Yes | CLIENT_CONFIRMATION_REQUIRED | Confirm the relationship still exists and the exact name of the contracting Aramco entity in Poland. |
| BP | same | same | Yes | CLIENT_CONFIRMATION_REQUIRED | Logo use requires permission. |
| Unimot | same | same | Yes | CLIENT_CONFIRMATION_REQUIRED | |
| Total | same | same | Yes | CLIENT_CONFIRMATION_REQUIRED | Brand is now "TotalEnergies"; old name/logo is outdated regardless. |
| Solumus | same | same | Yes | CLIENT_CONFIRMATION_REQUIRED | Confirm exact company name. |
| PERN bases Emilianów, Małaszewicze | customer self-pickup possible | same | No | CLIENT_CONFIRMATION_REQUIRED | Operational claim about third-party terminals. |
| ORLEN bases Lublin, Sokółka | customer self-pickup possible | same | No | CLIENT_CONFIRMATION_REQUIRED | |
| ORLEN Ekoterm (heating oil) | "autoryzowanym dystrybutorem … w ramach sieci dystrybutorów firmy ORLEN" | `/oferta/olej-opalowy/` (2023-10-09) | Ekoterm logo | CLIENT_CONFIRMATION_REQUIRED | An "authorised distributor" claim needs current written authorisation. A listing exists on ekoterm.pl (undated; could not be fetched). |
| Tank "partners" (monitoring equipment installers) | "Dodatkowy osprzęt instalowany przez naszych partnerów" | `/oferta/zbiorniki/` (2019) | No | CLIENT_CONFIRMATION_REQUIRED | Unnamed; do not imply a telemetry product. |
| Stokota (tanker trailer manufacturer) | — (visible on 2023 photo) | — | — | Not a partner claim | Appears only incidentally in photography; no mention in copy. |
| DAF (tractor brand) | — (visible on photos) | — | — | Not a partner claim | The 3D tanker is a generic cab — no DAF grille/badge is modelled. |
| Kwant Studio | built the 2018 site | news post 2018 | — | HISTORICAL_ONLY | Not relevant to the new site. |
| Chełmianka Chełm (football club) | sponsorship posts | Facebook, undated | — | CLIENT_CONFIRMATION_REQUIRED | Community section only if confirmed and approved by both sides. |
| Dom Dziecka w Dubience | "Wspieramy…" | `/o-firmie/historia/` (2018) | — | CLIENT_CONFIRMATION_REQUIRED | Needs institution's consent. |

## Data model

`src/data/partners.ts` holds these entries with `status` and optional `approvedWording`, `logo` (path to a client-supplied,
approved asset) and `relationship` (`supplier` | `terminal` | `authorisation` | `community`). A partner component exists
but renders nothing until an entry has `status: VERIFIED_CURRENT`, `approvedWording` and (for logos) `logo`.

## Questions for the client

1. Which fuel suppliers are current, and may they be named publicly?
2. For each named supplier: exact legal/brand name, approved sentence, and written permission + official logo files.
3. Is EXOIL currently an authorised ORLEN Ekoterm distributor? Please send the authorisation letter/certificate and the permitted wording/territory.
4. Is customer self-pickup at PERN / ORLEN terminals still offered?
5. Any sponsorships / community activity you want shown?
