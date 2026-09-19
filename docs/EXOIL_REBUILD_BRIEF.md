# EXOIL — Complete Greenfield Website Rebuild Master Brief

## 0. Mission

Design and build a completely new production website for EXOIL from scratch.

There is NO existing application codebase to preserve.

The previous EXOIL website is no longer publicly operational, therefore historical versions available through the Internet Archive / Wayback Machine and other reliable public records should be treated as source material for reconstruction.

Primary historical source:

https://web.archive.org/web/20260615072744/https://exoil.pl/

The historical site is NOT automatically the source of truth for current business information.

Its role is to help recover:

* historical information architecture
* services
* offer structure
* company history
* locations
* fuel products
* logistics information
* station information
* historical contact details
* documents
* brand assets
* photographs
* historical claims
* SEO URLs

All operational, numerical, commercial, legal and partnership information must be treated as requiring current verification unless clearly confirmed by an authoritative current source or by the client.

The new website will be built as a premium Next.js application designed for deployment on Vercel.

The desired quality level is:

high-end creative development
+
Awwwards-level interaction
+
serious industrial B2B credibility
+
strong local/regional SEO
+
excellent conversion

The result must feel like a modern energy and logistics company.

It must NOT feel like:

* a generic petrol-station website
* a transport-company template
* a construction template
* a WordPress theme
* a generic corporate website
* a futuristic crypto/AI landing page
* an automotive racing website
* a cheap black/red "fuel" website with flames

---

# 1. Absolute Brand Rule — Preserve the Existing EXOIL Logo

The historical EXOIL logo MUST remain unchanged unless the client explicitly requests a separate brand redesign.

This is a hard requirement.

Retrieve the best available original historical logo asset from:

* the Wayback Machine
* old website media files
* historical documents
* registered trademark material
* client-provided brand files

Prefer an original:

* SVG
* EPS
* PDF
* high-resolution PNG

provided directly by the client.

Do NOT:

* redraw the logo
* recreate the logo using AI
* reinterpret it
* change its proportions
* modify its typography
* change the mark
* modernize it
* alter its color relationships
* replace it with a newly designed symbol
* distort it for animation

Historical black / red / metallic brand relationships may inspire the new supporting design system, but the exact current logo supplied or approved by the client is authoritative.

Store official brand assets under an appropriate structure such as:

`/public/brand/`

Document them in:

`docs/brand-assets.md`

---

# 2. First Phase — Historical Source Recovery

Before creating production UI, perform a controlled archival content recovery.

Audit the historical website beginning with:

https://web.archive.org/web/20260615072744/https://exoil.pl/

Then discover as many historical child routes as reasonably possible.

Known historical structure includes routes conceptually corresponding to:

* Home
* About
* History
* EXOIL in Numbers
* Documents
* News
* Prices
* Fuel Wholesale
* Fuel Stations
* Heating Oil
* Fuel Tanks
* Deliveries
* Careers
* Contact

Do NOT assume this list is exhaustive.

Create:

`docs/historical-source-audit.md`

For every discovered page record:

* old URL
* page title
* major headings
* content
* images
* downloads
* contact details
* pricing references
* service claims
* operational claims
* legal/business entity references
* dates
* partner/supplier references
* archived metadata

Throttle archive access.

Do not repeatedly hammer Wayback or old infrastructure.

Cache recovered HTML/assets locally during analysis where appropriate.

---

# 3. Historical Information Is Not Automatically Current Information

Every extracted piece of business information must be classified.

Create:

`docs/content-verification.md`

Use these statuses:

* VERIFIED_CURRENT
* CLIENT_CONFIRMATION_REQUIRED
* HISTORICAL_ONLY
* CONFLICTING
* OUTDATED
* REMOVE
* SAFE_GENERAL_COPY

Examples requiring confirmation include:

* number of stations
* station locations
* station opening hours
* number of employees
* annual transaction count
* annual kilometres travelled
* number of business customers
* tanker fleet size
* tanker capacities
* delivery times
* minimum order
* free delivery threshold
* product availability
* suppliers
* fuel sourcing
* authorized distributor status
* current fuel brands
* station facilities
* concession status
* contact details
* company departments
* email addresses
* phone numbers
* careers information
* fuel prices
* payment terms
* storage tank offer
* telemetry capabilities
* SENT process details

Never silently assume an archived value is still valid.

---

# 4. Company History

Historical material indicates that the EXOIL business history goes back to 1997.

However, the current legal entity may have been registered later than the historical operation.

Do NOT write:

"EXOIL Paliwa sp. z o.o. has operated since 1997"

unless the client/legal records support that exact statement.

Prefer factual wording such as:

"The history of EXOIL reaches back to 1997."

if verified and approved.

Separate:

BUSINESS HISTORY

from:

CURRENT LEGAL ENTITY HISTORY.

Do not create misleading company-age claims.

---

# 5. Business Model

The website should communicate that EXOIL is more than a retail petrol-station operator.

The historical business model includes major areas such as:

## B2B FUEL WHOLESALE

Fuel delivered to business customers.

## LOGISTICS

Transport via fuel tankers.

## RETAIL FUEL STATIONS

EXOIL's station network.

## HEATING OIL

Delivery where currently offered.

## CUSTOMER FUEL INFRASTRUCTURE

Double-wall tanks and related fuel-management equipment where currently offered.

The new website should make the logistics and distribution system central to the brand.

---

# 6. Core Creative Concept

The central creative concept is:

# ENERGY IN MOTION

Supporting idea:

# THE ROUTE

EXOIL does not merely sell fuel.

It operates a system that moves energy through:

SOURCE
→ BASE
→ TANKER
→ ROAD
→ BUSINESS
→ MACHINE / FLEET / STATION

The website should visualize this movement.

---

# 7. Core Homepage Narrative

The primary homepage story should follow fuel through EXOIL's operational network.

Conceptual progression:

00 / SOURCE

Fuel enters the EXOIL supply system.

01 / LOAD

Fuel is loaded into an EXOIL tanker.

02 / MOVE

The tanker moves through the logistics network.

03 / DELIVER

Fuel reaches the business customer.

04 / STORE

Fuel enters customer infrastructure / storage.

05 / POWER

Fuel powers transport, machinery, industry or agriculture.

06 / RETAIL

The route expands into the EXOIL station network.

07 / SCALE

Verified operational scale.

08 / TRUST

Licences, documents, quality and compliance.

09 / HISTORY

Business history.

10 / ORDER

Contact sales / order fuel.

The experience should feel like ONE JOURNEY.

Avoid disconnected:

hero
→ services cards
→ benefits
→ statistics
→ gallery
→ CTA

---

# 8. Main 3D Object — EXOIL Fuel Tanker

The signature 3D object should be a realistic fuel tanker / road tanker.

NOT:

* a generic box truck
* delivery van
* semi truck with dry trailer

It should unmistakably communicate:

FUEL LOGISTICS.

The vehicle should be modeled or sourced as an appropriate:

* tanker truck
* tractor + fuel tanker semi-trailer
* current EXOIL fleet configuration where confirmed

Whenever possible, base the visual design on real current EXOIL vehicles.

Request from the client:

* photographs
* side/profile images
* cab configuration
* trailer configuration
* branding placement
* livery
* colors
* number of axles
* fleet references

Do not invent current fleet branding if source photography exists.

---

# 9. 3D Tanker Accuracy

The tanker model should feel realistic without becoming an engineering CAD simulation.

Important:

* correct tanker silhouette
* believable proportions
* appropriate wheels
* recognizable fuel-tanker structure
* EXOIL logo placement based on real vehicles
* realistic lights
* restrained materials

Avoid:

* racing styling
* aggressive body kits
* sci-fi design
* chrome overload
* fake military styling

The tanker represents reliability and logistics.

Not speed.

---

# 10. Signature Hero Sequence

The website may begin in near darkness.

A road exists mostly as reflection and subtle geometry.

Distant vehicle lights appear.

The EXOIL tanker approaches.

Potential headline direction:

# Fuel has to arrive where business needs it.

Polish creative direction:

# Paliwo musi być tam, gdzie jest potrzebne.

or:

# Energia w ruchu.

Do not blindly use these exact lines.

Develop final Polish copy after brand/content audit.

As the user scrolls:

* tanker begins moving
* road appears
* route trace emerges
* environment opens
* logistics system becomes visible

Primary CTA:

ZAMÓW PALIWO

Secondary CTA:

POZNAJ OFERTĘ

Potential tertiary action:

ZNAJDŹ STACJĘ

if current station network is confirmed.

---

# 11. Route Trace

The tanker should leave behind a visual route trace.

The trace is a major brand/motion element.

It may represent:

* logistics path
* delivery status
* network
* distance
* connection
* supply infrastructure

The trace can later transform into:

* a map line
* station network
* fuel flow
* data visualization
* page transition
* section separator

Avoid making it resemble:

* Google Maps
* Tron
* cyberpunk roads
* neon racing games

Think:

industrial logistics visualization.

---

# 12. 3D Camera Language

Potential camera states:

REAR FOLLOW
→ SIDE TRACK
→ LOW DETAIL
→ AERIAL
→ NETWORK VIEW

Camera movement should remain controlled.

Avoid:

* rapid orbiting
* motion sickness
* game-like steering
* excessive camera shake
* dramatic racing cuts

The tanker should feel heavy.

Motion should communicate mass.

---

# 13. Loading Scene

One major scene should represent fuel loading.

The tanker arrives at a base / terminal abstraction.

A loading connection is established.

Fuel flow may be represented using an elegant energy stream.

Avoid literal cinematic petrol splashing.

Potential visualization:

0
→ LOADING
→ READY

If numeric litres are shown:

either use verified real figures

or clearly label them as illustrative UI.

Never accidentally present an invented tanker load as a company operating metric.

---

# 14. Road / Logistics Scene

After loading, the tanker continues along the route.

Integrate verified operating information into the environment.

Possible examples only if confirmed:

* tanker capacity range
* SENT
* measurement systems
* delivery coverage
* delivery timing

Do not show unverified numbers just because they appeared historically.

Information should appear as part of the environment:

ROUTE
VEHICLE
STATUS
DESTINATION

rather than generic statistic cards.

---

# 15. Logistics Motion Language

Define a consistent motion vocabulary:

## ROUTE

A path becomes visible.

## FLOW

Energy/fuel moves through infrastructure.

## LOAD

A tanker/storage state fills.

## CONNECT

Two parts of the network connect.

## NETWORK

One route expands into a system.

## ARRIVE

The destination activates.

Use these concepts consistently.

---

# 16. Delivery Scene

The tanker arrives at a business destination.

Avoid depicting a single customer type as the entire EXOIL market.

The route may branch conceptually toward verified customer segments such as:

TRANSPORT
AGRICULTURE
CONSTRUCTION
INDUSTRY
RETAIL
PUBLIC SECTOR

Only include market segments EXOIL currently serves.

Do not fabricate industry specialization.

---

# 17. Customer Fuel Tank Scene

Where fuel-tank solutions remain current, create a second major 3D/technical storytelling moment.

The tanker delivers into a customer's double-wall tank.

The tank may become semi-transparent or exploded.

Potential layers, only where actual offer supports them:

OUTER WALL
INNER TANK
PUMP
METER
LEVEL SENSOR
REMOTE MONITORING
USER / VEHICLE ACCOUNTING

The objective:

communicate infrastructure and control.

Do not create fictional IoT functionality.

---

# 18. Fuel Management Visualization

If current EXOIL tank systems support fuel-use accounting:

visualize:

TANK
→ DRIVER
→ VEHICLE
→ CONSUMPTION
→ REPORTING

This can differentiate EXOIL from a company that simply sells fuel.

Use actual product capabilities only.

---

# 19. Station Network Scene

Later in the homepage, the logistics route should zoom out.

The road trace becomes a network.

Verified EXOIL stations appear as nodes.

Do not hardcode historical station count before client verification.

The visualization should work with any current station count.

Desktop may use an abstract network / regional map composition.

Mobile should use a simple accessible station list with optional map enhancement.

---

# 20. Station Data Model

Create one canonical station registry.

Example conceptual fields:

id
slug
name
city
address
coordinates
phone
email
openingHours
services
parking
shop
food
fuelTypes
status
seo

All:

* station index
* station pages
* maps
* footer
* homepage network

should derive from this canonical data.

Do not duplicate contact/opening-hour information.

---

# 21. Station Detail Pages

Create:

`/stacje/[slug]`

for active stations if useful.

Potential content:

* address
* map
* opening hours
* fuels
* services
* truck parking
* shop
* food/coffee
* phone
* route directions
* nearby EXOIL stations

Only present actual facilities.

Do not preserve a facility because it existed historically if it no longer does.

---

# 22. Wholesale Fuel Page

Create a flagship B2B service page:

`/hurt-paliw/`

It should clearly answer:

* what fuels are offered
* minimum order
* delivery area
* ordering process
* payment model
* temperature settlement where still relevant
* supply quality
* transport
* contact

Historical products included:

* diesel
* diesel variants
* petrol
* heating oil

Confirm current product catalog.

Never invent current fuel grades.

---

# 23. Deliveries Page

Create:

`/dostawy/`

This page should tell the logistics story in more practical detail.

Potential content:

* order
* scheduling
* tanker
* tracking/coordination
* delivery
* measurement
* documentation

This is a strong route for B2B conversion.

Primary CTA:

ZAMÓW DOSTAWĘ

or:

SKONTAKTUJ SIĘ ZE SPRZEDAŻĄ

---

# 24. Heating Oil Page

Create or preserve:

`/olej-opalowy/`

only if heating oil remains a current business line.

Historical supplier/distributor relationships must be re-verified.

Do not publish:

"authorized distributor"

without current documentation.

---

# 25. Fuel Tanks Page

Create:

`/zbiorniki/`

if the service is current.

This page should explain:

* use case
* double-wall concept
* installation
* dispensing
* monitoring
* fuel accounting
* support

Use technical diagrams where useful.

Avoid generic sales cards.

---

# 26. B2B Segment Pages

Potential segment-specific landing pages may include:

* Transport
* Agriculture
* Construction
* Industry

ONLY create them if:

1. the client actively serves the segment
2. enough unique content exists
3. genuine commercial/search intent exists

Do not create thin SEO pages.

---

# 27. About

Create:

`/o-firmie/`

Focus on:

* company history
* Polish roots/capital if currently true
* regional development
* logistics capability
* people
* operational discipline

Do not overuse corporate value cards.

Use real operational details.

---

# 28. History Timeline

Historical material is valuable.

Create:

`/o-firmie/historia/`

or include a rich timeline on About.

Potential structure:

1997
→ foundation / origin

later milestones
→ station network
→ logistics expansion
→ B2B
→ current company

Every date/milestone must be verified.

Do not fabricate continuity between historical legal entities.

---

# 29. EXOIL in Numbers

Historical website contained a dedicated statistics page.

Do not reproduce historical numbers blindly.

Create a flexible statistics system fed by verified current data.

Examples may include:

YEARS OF HISTORY
STATIONS
BUSINESS CUSTOMERS
FLEET
EMPLOYEES
DELIVERIES

but ONLY when confirmed.

Create:

`docs/business-metrics-verification.md`

No metric enters production without verification.

---

# 30. Documents / Compliance

Create a strong trust section:

`/o-firmie/dokumenty/`

Potential documents:

* concession
* KRS
* NIP
* REGON
* tax certificates
* ZUS certificates
* tax strategy
* other compliance documents

Use CURRENT documents only.

Archive old documents outside current customer-facing content.

For each document show:

TYPE
DATE
VALIDITY / PERIOD
DOWNLOAD

Never visually imply current validity if the document is historical.

---

# 31. Fuel Concession

Fuel trading is regulated.

Do not publish old concession details as current.

Ask client to supply current documentation.

Where appropriate, communicate regulatory compliance factually.

Avoid vague claims such as:

"fully certified"

unless accurate.

---

# 32. Suppliers / Partners

Historical website referenced major fuel suppliers.

Do NOT automatically place partner logos in the redesign.

For every supplier/partner:

confirm:

* current relationship
* right to use logo
* correct naming
* approved brand asset
* exact wording

Do not imply strategic partnership when the actual relationship is ordinary purchasing.

---

# 33. Prices

Historical site included a price page.

Determine whether the client wants:

* retail station prices online
* B2B pricing
* no public pricing

If live retail prices are required:

create a canonical data source/API/process.

Do not create manually duplicated prices across station pages.

B2B fuel pricing will likely remain quote-based unless the client says otherwise.

Do not invent live fuel prices.

---

# 34. News

Create:

`/aktualnosci/`

if the client intends to publish current news.

Do not import stale historical news as if current.

Historical posts may be:

* migrated into archive
* omitted
* preserved with original date

depending on value.

Do not fabricate news articles.

---

# 35. Careers

Create:

`/kariera/`

only using current employment/legal information.

Do NOT copy old recruitment consent clauses.

Historical forms may contain obsolete:

* company legal form
* privacy law references
* email addresses

Build a fresh recruitment flow based on client-approved current privacy/legal language.

---

# 36. Recruitment Form

If implemented, collect only necessary recruitment data.

For CV upload:

* server-side validation
* file type validation
* file size limits
* non-public storage
* secure access
* retention policy
* client-approved privacy notice

Do not create a public writable storage bucket.

---

# 37. Contact Architecture

Do not create one generic contact form for every purpose.

Create clear contact paths.

Potential:

ORDER FUEL
→ SALES

DELIVERY / LOGISTICS
→ LOGISTICS

INVOICE / PAYMENT
→ FINANCE

CAREER
→ HR

STATION
→ station contact

Use current department structure supplied by the client.

---

# 38. B2B Order / Quote Form

Create a high-intent route such as:

`/zamow-paliwo/`

Possible fields:

COMPANY
NIP
CONTACT
PHONE
EMAIL
FUEL TYPE
QUANTITY
DELIVERY LOCATION
PREFERRED DATE
MESSAGE

Only ask for fields commercially necessary.

Do not present the form as an immediately binding order unless business process supports that.

Clear wording:

REQUEST A QUOTE
or
ORDER REQUEST

may be more accurate.

---

# 39. Form Security

Implement forms server-side.

Recommended:

* Server Actions or Route Handlers
* Zod
* rate limiting
* honeypot
* server-side validation
* secure email delivery
* environment variables

Do not expose credentials.

Create:

`.env.example`

Use Resend or another selected email provider only when appropriate.

---

# 40. Privacy / Legal

The archived site's legal/privacy content should NOT automatically be treated as current.

Create:

`docs/legal-launch-requirements.md`

Before production launch require current client-approved:

* privacy policy
* cookies/analytics policy
* B2B inquiry information clause
* recruitment privacy notice
* file-upload terms where relevant

Do not author final legal compliance language as though legally approved.

---

# 41. Core Visual Direction

Primary art direction:

# INDUSTRIAL LOGISTICS EDITORIAL

Combine:

transport infrastructure
×
fuel logistics
×
industrial photography
×
precise data
×
premium creative development

The site should feel:

* powerful
* serious
* reliable
* heavy
* precise
* operational
* modern

Not:

* aggressive
* macho
* racing
* military
* futuristic
* flashy

---

# 42. Color System

Base supporting palette on approved EXOIL branding.

Potential direction:

CARBON BLACK
OFF-WHITE
EXOIL RED
METALLIC GREY
SIGNAL AMBER

Do not alter official logo colors.

Use red carefully.

Avoid making every element bright red.

Use visual contrast between:

NIGHT LOGISTICS
and
DAYLIGHT / TECHNICAL CONTENT.

---

# 43. Typography

Use powerful modern industrial/editorial typography.

Potential roles:

DISPLAY
large, confident

BODY
highly readable

MONO / TABULAR
for logistics/data labels

Examples of data styling:

DESTINATION
CHEŁM

STATUS
IN TRANSIT

LOAD
READY

Use tabular numerals for operational data.

Do not use fake dashboard data as decoration.

---

# 44. Photography

Request current original imagery from the client.

Priority:

* real EXOIL tankers
* stations
* drivers
* loading
* fuel infrastructure
* customer deliveries
* fuel tanks
* team
* station details
* retail environment

Avoid generic stock:

* random European truck
* generic petrol pump
* fake oil refinery
* hand on steering wheel
* anonymous industrial workers

Real operations are the proof.

---

# 45. 3D vs Real Photography

Do not replace operational photography with 3D.

Use 3D for:

* storytelling
* route visualization
* tanker sequence
* tank/infrastructure explanation

Use photography for:

* trust
* reality
* people
* stations
* actual fleet
* actual installations

The contrast is intentional.

---

# 46. Mobile 3D Strategy

Do not force the full desktop WebGL sequence onto mobile.

Create a purpose-built mobile narrative using:

* simplified tanker model
* shorter route
* SVG
* pre-rendered perspective
* reduced geometry
* fewer camera transitions

The story must survive even if technology changes.

Performance > 3D parity.

---

# 47. Reduced Motion

For:

`prefers-reduced-motion: reduce`

provide a polished static route narrative.

Possible:

TANKER
→ ROUTE
→ BUSINESS
→ NETWORK

without camera movement.

All information must remain accessible.

---

# 48. Technical Stack

Build from scratch using the current stable:

* Next.js
* App Router
* TypeScript
* React

Recommended supporting stack:

* React Three Fiber
* Three.js
* Drei where useful
* GSAP
* ScrollTrigger
* optional Lenis if it materially improves the experience
* Tailwind CSS or high-quality CSS token system
* Zod
* next/image
* next/font

Use shaders only when justified.

Do not install packages simply because the brief mentions them.

---

# 49. 3D Architecture

Keep 3D isolated.

Potential structure:

`components/3d/`

* TankerScene
* LoadingScene
* RouteScene
* TankScene
* StationNetworkScene

Use dynamic loading.

Do not ship the complete Three.js bundle into:

* documents
* careers
* news
* legal
* lightweight local pages

unless required.

---

# 50. 3D Asset Optimization

Optimize models.

Use:

* GLTF / GLB
* Draco where appropriate
* texture compression
* sensible texture resolution
* baked detail where useful
* instancing
* controlled shadows
* adaptive DPR

Do not load a massive cinematic-quality tanker model with unnecessary interior geometry.

---

# 51. Server-Rendered Content

3D is presentation.

Important business content must be rendered in semantic HTML.

Search engines and AI crawlers should understand the business without WebGL.

They must be able to identify:

* services
* stations
* areas
* history
* B2B offer
* contact
* documents

---

# 52. SEO Migration

The old website may still have historical authority/indexed URLs.

Create:

`docs/url-migration-map.md`

Map:

OLD URL
→ NEW URL
→ ACTION

Prefer preserving valuable old slugs.

Potential historical URLs such as:

* `/o-firmie/`
* `/o-firmie/historia/`
* `/o-firmie/exoil-w-liczbach/`
* `/o-firmie/dokumenty/`
* `/aktualnosci/`
* `/nasze-ceny/`
* `/oferta/hurt-paliw/`
* `/oferta/stacje-paliw/`
* `/oferta/olej-opalowy/`
* `/oferta/zbiorniki/`
* `/oferta/dostawy/`
* `/kariera/`
* `/kontakt/`

must be investigated.

Preserve or redirect intentionally.

---

# 53. New Information Architecture

Recommended direction:

/
├── hurt-paliw/
├── dostawy/
├── stacje/
│   └── [slug]/
├── olej-opalowy/
├── zbiorniki/
│
├── dla-firm/
│   └── [segment]/     only if justified
│
├── o-firmie/
│   ├── historia/
│   └── dokumenty/
│
├── aktualnosci/
│   └── [slug]/
│
├── kariera/
├── kontakt/
└── zamow-paliwo/

Preserve historical URL aliases using redirects where appropriate.

---

# 54. Main Navigation

Recommended:

HURT PALIW
DOSTAWY
STACJE
ZBIORNIKI
O FIRMIE
KONTAKT

Primary CTA:

ZAMÓW PALIWO

Potential secondary utility:

ZNAJDŹ STACJĘ

Adjust after current business verification.

Do not overload navigation.

---

# 55. Footer

Footer should include:

* EXOIL logo
* wholesale fuel
* delivery
* stations
* tanks
* company
* documents
* careers
* contact
* legal information
* current company registration data

Do not visually dump dozens of links.

Use structured groups.

---

# 56. Station Finder

If station network remains significant, build a high-quality station finder.

Features may include:

* list
* map
* search by city
* nearest station if user grants location
* opening hours
* services

Do not require location permission.

Do not use exact user location without explicit browser permission.

---

# 57. Maps

Use a map provider only if useful.

Avoid shipping huge mapping libraries into every route.

Station pages may link to external directions if simpler.

If interactive map is used:

load lazily.

---

# 58. Structured Data

Implement accurate schema where appropriate:

* Organization
* LocalBusiness / GasStation for individual stations
* Service
* BreadcrumbList
* Article / NewsArticle for actual news
* JobPosting for real active vacancies

Do not create fake:

* ratings
* price ranges
* opening hours
* coordinates

Use verified data.

---

# 59. AI Crawlability

Public content should remain highly readable to search and AI systems.

Do not put service information only inside WebGL.

Crawlers should understand:

* EXOIL is a fuel/logistics business
* B2B wholesale offer
* delivery
* storage systems
* active stations
* service region
* company history
* contact details

---

# 60. Analytics

Do not blindly migrate old tracking.

Decide with the client:

* whether analytics is required
* whether advertising tracking is required
* what consent mechanism is needed

Do not automatically install:

* Meta Pixel
* Google Ads
* session recording
* fingerprinting

Create an explicit tracking plan.

---

# 61. Performance

Target excellent Core Web Vitals despite the 3D hero.

Critical requirements:

* server-render page immediately
* lazy-load 3D
* show high-quality fallback while loading
* avoid blocking interaction
* adaptive DPR
* reduce scene quality on low-power devices
* pause rendering when offscreen
* dispose resources
* image optimization
* minimal third-party scripts

The site must not require a gaming PC.

---

# 62. Accessibility

Support:

* semantic HTML
* keyboard navigation
* visible focus
* accessible forms
* adequate contrast
* accessible maps/list alternatives
* screen readers
* reduced motion
* touch input

3D must never contain the only representation of essential information.

---

# 63. Content Architecture

Create structured canonical data.

Suggested:

`src/data/company.ts`
`src/data/stations.ts`
`src/data/fuels.ts`
`src/data/services.ts`
`src/data/documents.ts`
`src/data/metrics.ts`

Content:

`content/news/`
`content/projects-or-case-studies/` if used

Prevent duplicated station/contact/product data.

---

# 64. CMS

Do not automatically add a CMS.

But EXOIL may need to update:

* news
* station information
* documents
* vacancies
* potentially retail prices

Architect the content layer so a CMS can be added cleanly.

If client requires self-service content management from launch:

evaluate Sanity or another suitable headless CMS.

Do not add it without need.

---

# 65. Vercel Readiness

The new application is intended for Vercel.

Create:

`docs/vercel-deployment.md`

Requirements:

* environment variables documented
* no runtime filesystem writes
* server actions/routes compatible with Vercel
* image configuration
* production domains documented
* no automatic deployment

Do not change DNS.

Do not deploy automatically.

---

# 66. Migration Checklist

Create:

`docs/migration-checklist.md`

Include:

* final URL audit
* old/new mapping
* redirects
* logo/assets
* current company data
* station verification
* supplier verification
* document verification
* contact verification
* privacy/legal
* forms
* analytics
* sitemap
* robots
* Search Console
* DNS
* post-launch 404 monitoring

---

# 67. No Fabrication

NEVER fabricate:

* station locations
* station count
* opening hours
* tanker capacity
* vehicle count
* employee count
* customer count
* kilometres
* transactions
* fuel products
* brands
* suppliers
* delivery time
* free delivery threshold
* equipment capabilities
* tank telemetry
* licences
* concessions
* certificates
* business customers
* testimonials
* public contracts
* partnerships

When uncertain:

flag for client verification.

---

# 68. Historical Claims To Flag Immediately

At minimum flag historical claims such as:

* 5 stations
* later 7-station historical listing
* current media mentions of other location configurations
* 20+ years
* 70 employees
* 100+ employees
* approximately 4,000 businesses
* approximately 2,000,000 km annually
* 500,000+ annual transactions
* 17–35 m³ tanker capacities
* free transport from 500 litres
* delivery within 24 hours
* specific supplier relationships
* authorized Ekoterm distribution
* station opening hours

Do not choose between conflicting values yourself.

---

# 69. Whole-Site AI-Smell Audit

Before completion remove:

* generic SaaS bento grids
* glassmorphism
* arbitrary gradients
* meaningless floating UI
* AI-generated corporate slogans
* fake industrial dashboards
* excessive rounded cards
* generic logistics icons
* random glowing nodes
* cyberpunk roads
* racing visuals
* flame graphics
* petrol splash effects
* decorative Three.js unrelated to operations
* repetitive fade-up

The website must feel designed specifically for EXOIL.

---

# 70. Implementation Phases

Proceed approximately:

1. archival crawl
2. historical route inventory
3. brand/logo recovery
4. historical asset inventory
5. company/legal research inventory
6. content verification matrix
7. stations verification matrix
8. business metrics verification
9. suppliers/partners verification
10. documents verification
11. URL migration map
12. information architecture
13. initialize Next.js project
14. global design system
15. tanker 3D prototype
16. route-trace prototype
17. loading scene prototype
18. tank/infrastructure prototype
19. navigation/footer
20. homepage
21. wholesale fuel
22. deliveries
23. fuel tanks
24. heating oil if current
25. station network
26. station detail pages
27. company/about
28. history
29. documents
30. news
31. career
32. contact
33. fuel-order/quote flow
34. responsive refinement
35. mobile 3D simplification
36. reduced motion
37. accessibility
38. SEO
39. structured data
40. sitemap/robots
41. performance optimization
42. AI crawlability
43. legal/privacy launch checklist
44. migration documentation
45. whole-site AI-smell audit
46. route-by-route QA
47. production build

Do not stop after homepage or 3D prototype.

---

# 71. QA

Test:

* desktop
* laptop
* mobile
* tablet
* low-performance mode
* reduced motion
* keyboard navigation
* fuel inquiry
* contact
* station finder
* station pages
* documents
* careers
* historical redirects
* not-found
* sitemap
* robots
* canonical tags
* structured data

Run:

* build
* TypeScript
* lint
* tests where configured

Fix issues instead of merely reporting them.

---

# 72. Git Safety — CRITICAL

NEVER create a git commit unless the user explicitly asks you to.

Never automatically:

* stage
* commit
* push
* force push
* amend
* rebase
* tag
* publish
* deploy

Leave all work uncommitted by default.

You may inspect:

`git status`
`git diff`

---

# 73. Commit Attribution — CRITICAL

If the user explicitly asks you to create a commit later:

NEVER include AI attribution.

Never add:

* `Co-authored-by: ChatGPT`
* `Co-authored-by: OpenAI`
* `Co-authored-by: Codex`
* `Generated-by`
* `Created with AI`
* `AI-generated`

Do not mention AI authorship in:

* commit messages
* trailers
* source comments
* README
* changelog
* pull requests
* metadata
* release notes

Use a normal concise human-style commit message describing only the actual changes.

---

# 74. No AI Branding

Never add:

* OpenAI branding
* ChatGPT branding
* Codex branding
* generator comments
* AI watermarks

This is the client's website.

---

# 75. Final Review

Before completion review the entire experience from the perspective of:

* Creative Director
* Industrial Brand Designer
* Fuel Logistics Customer
* Fleet Manager
* Procurement Manager
* Station Customer
* Conversion Designer
* Motion Designer
* Senior Creative Developer
* Three.js Performance Engineer
* Accessibility Specialist
* B2B SEO Specialist
* Privacy/Security Engineer

Fix the weaknesses found.

---

# 76. Final Acceptance Criteria

The website is complete only when:

1. The historical EXOIL logo remains unchanged.
2. The new design feels unmistakably built for EXOIL.
3. The tanker is clearly a fuel tanker, not a generic truck.
4. The main creative narrative is ENERGY IN MOTION.
5. One tanker/route system visually connects the homepage story.
6. The 3D experience explains the business rather than decorating it.
7. Fuel logistics is a central brand element.
8. Wholesale fuel is clearly communicated.
9. Deliveries are clearly communicated.
10. Fuel-tank infrastructure is represented accurately if current.
11. Station network is represented using verified data.
12. Historical/current business information is clearly separated internally during content work.
13. Conflicting historical metrics are not silently published.
14. Current contacts are client-verified.
15. Current stations are client-verified.
16. Current supplier relationships are client-verified.
17. Current concessions/documents are used.
18. No outdated recruitment/legal clauses are migrated.
19. Forms are secure.
20. Current privacy/legal requirements are documented.
21. Historical SEO value is preserved where useful.
22. Server-rendered content remains fully understandable without WebGL.
23. AI crawlers can understand the company and offer.
24. Mobile has an intentionally simplified experience.
25. Reduced motion works.
26. Accessibility is strong.
27. Core Web Vitals remain good despite 3D.
28. Heavy Three.js code is isolated.
29. No fake operational data exists.
30. No fake partners, customers or metrics exist.
31. Production build succeeds.
32. The entire website passes the AI-smell audit.
33. Nothing is deployed automatically.
34. All work remains uncommitted until explicitly requested.

# Final Principle

Do not build a website about petrol.

Build a digital representation of the system that moves energy from source to destination.

The visitor should remember:

SOURCE
→ LOAD
→ ROUTE
→ DELIVER
→ POWER

EXOIL is energy in motion.
