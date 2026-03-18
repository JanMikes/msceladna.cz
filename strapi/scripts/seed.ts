/**
 * Seed script for MS Celadna Strapi project.
 *
 * Creates all content types in the correct dependency order:
 * tags -> workplaces -> employees -> organization -> pages -> navigation
 * -> projects -> news-articles -> cooperating-institutions -> footer
 *
 * Usage:
 *   STRAPI_API_TOKEN=<token> npx tsx scripts/seed.ts
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error("ERROR: STRAPI_API_TOKEN environment variable is required.");
  console.error("Usage: STRAPI_API_TOKEN=<token> npx tsx scripts/seed.ts");
  process.exit(1);
}

const DELAY_MS = 500;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apiRequest(
  method: "GET" | "POST" | "PUT",
  path: string,
  body?: Record<string, unknown>,
): Promise<any> {
  const url = `${STRAPI_URL}/api/${path}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };
  if (body) {
    options.body = JSON.stringify({ data: body });
  }
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `${method} /api/${path} -> ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json;
}

async function createEntry(
  pluralName: string,
  label: string,
  data: Record<string, unknown>,
): Promise<string | null> {
  try {
    process.stdout.write(`  Creating ${pluralName}: ${label}...`);
    await delay(DELAY_MS);
    const json = await apiRequest("POST", pluralName, data);
    const documentId = json?.data?.documentId;
    console.log(` done (documentId: ${documentId})`);
    return documentId ?? null;
  } catch (err: any) {
    console.log(` ERROR: ${err.message}`);
    return null;
  }
}

async function updateSingleType(
  singularName: string,
  data: Record<string, unknown>,
): Promise<string | null> {
  try {
    process.stdout.write(`  Updating single type: ${singularName}...`);
    await delay(DELAY_MS);
    const json = await apiRequest("PUT", singularName, data);
    const documentId = json?.data?.documentId;
    console.log(` done (documentId: ${documentId})`);
    return documentId ?? null;
  } catch (err: any) {
    console.log(` ERROR: ${err.message}`);
    return null;
  }
}

async function findBySlug(
  pluralName: string,
  slug: string,
): Promise<string | null> {
  try {
    const json = await apiRequest(
      "GET",
      `${pluralName}?filters[slug][$eq]=${encodeURIComponent(slug)}`,
    );
    return json?.data?.[0]?.documentId ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. Tags
// ---------------------------------------------------------------------------

async function seedTags(): Promise<Record<string, string>> {
  console.log("\n=== Tags ===");
  const tags = ["Beruska", "Krtecek", "Ekoskola", "Zacit spolu", "Uspechy", "Zapis"];
  const tagNames = ["Beruška", "Krteček", "Ekoškola", "Začít spolu", "Úspěchy", "Zápis"];
  const slugs = ["beruska", "krtecek", "ekoskola", "zacit-spolu", "uspechy", "zapis"];
  const map: Record<string, string> = {};

  for (let i = 0; i < tagNames.length; i++) {
    const docId = await createEntry("tags", tagNames[i], {
      name: tagNames[i],
      slug: slugs[i],
    });
    if (docId) map[slugs[i]] = docId;
  }
  return map;
}

// ---------------------------------------------------------------------------
// 2. Workplaces
// ---------------------------------------------------------------------------

async function seedWorkplaces(): Promise<Record<string, string>> {
  console.log("\n=== Workplaces ===");
  const map: Record<string, string> = {};

  const beruskaId = await createEntry("workplaces", "MŠ Beruška", {
    name: "MŠ Beruška",
    slug: "beruska",
    address: "Čeladná 555",
    phone: "+420 558 684 100",
    email: "beruska@msceladna.cz",
    programType: "zacit_spolu",
    classCount: 2,
    childrenCapacity: 50,
  });
  if (beruskaId) map["beruska"] = beruskaId;

  const krtecekId = await createEntry("workplaces", "MŠ Krteček", {
    name: "MŠ Krteček",
    slug: "krtecek",
    address: "Čeladná 556",
    phone: "+420 558 684 101",
    email: "krtecek@msceladna.cz",
    programType: "bezna_ms",
    classCount: 2,
    childrenCapacity: 50,
  });
  if (krtecekId) map["krtecek"] = krtecekId;

  return map;
}

// ---------------------------------------------------------------------------
// 3. Employees
// ---------------------------------------------------------------------------

async function seedEmployees(
  workplaces: Record<string, string>,
): Promise<void> {
  console.log("\n=== Employees ===");

  const employees: {
    firstName: string;
    lastName: string;
    role: string;
    category: string;
    email: string;
    workplaceSlug: string | null;
    sortOrder: number;
  }[] = [
    {
      firstName: "Jana",
      lastName: "Nováková",
      role: "ředitelka",
      category: "vedeni",
      email: "novakova@msceladna.cz",
      workplaceSlug: "beruska",
      sortOrder: 1,
    },
    {
      firstName: "Marie",
      lastName: "Dvořáková",
      role: "učitelka",
      category: "pedagogicky",
      email: "dvorakova@msceladna.cz",
      workplaceSlug: "beruska",
      sortOrder: 2,
    },
    {
      firstName: "Petra",
      lastName: "Svobodová",
      role: "učitelka",
      category: "pedagogicky",
      email: "svobodova@msceladna.cz",
      workplaceSlug: "beruska",
      sortOrder: 3,
    },
    {
      firstName: "Lenka",
      lastName: "Černá",
      role: "učitelka",
      category: "pedagogicky",
      email: "cerna@msceladna.cz",
      workplaceSlug: "krtecek",
      sortOrder: 4,
    },
    {
      firstName: "Eva",
      lastName: "Procházková",
      role: "učitelka",
      category: "pedagogicky",
      email: "prochazkova@msceladna.cz",
      workplaceSlug: "krtecek",
      sortOrder: 5,
    },
    {
      firstName: "Anna",
      lastName: "Králová",
      role: "asistentka pedagoga",
      category: "pedagogicky",
      email: "kralova@msceladna.cz",
      workplaceSlug: "krtecek",
      sortOrder: 6,
    },
  ];

  for (const emp of employees) {
    const data: Record<string, unknown> = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      role: emp.role,
      category: emp.category,
      email: emp.email,
      sortOrder: emp.sortOrder,
    };
    if (emp.workplaceSlug && workplaces[emp.workplaceSlug]) {
      data.workplace = {
        connect: [{ documentId: workplaces[emp.workplaceSlug] }],
      };
    }
    await createEntry(
      "employees",
      `${emp.firstName} ${emp.lastName}`,
      data,
    );
  }
}

// ---------------------------------------------------------------------------
// 4. Organization (single type)
// ---------------------------------------------------------------------------

async function seedOrganization(): Promise<void> {
  console.log("\n=== Organization ===");
  await updateSingleType("organization", {
    name: "Mateřská škola Čeladná, příspěvková organizace",
    address: "Čeladná 555, 739 12",
    ico: "12345678",
    dataBox: "abc1234",
    web: "www.msceladna.cz",
    email: "info@msceladna.cz",
    phoneManagement: "+420 558 684 100",
    phoneAdmin: "+420 558 684 102",
    founder: "Obec Čeladná",
    founderUrl: "https://www.celadna.cz",
  });
}

// ---------------------------------------------------------------------------
// 5. Pages
// ---------------------------------------------------------------------------

async function seedPages(): Promise<Record<string, string>> {
  console.log("\n=== Pages ===");
  const map: Record<string, string> = {};

  // --- Parent-less pages first ---

  // 1. Homepage
  const uvodId = await createEntry("pages", "Úvod (homepage)", {
    title: "Úvod",
    slug: "uvod",
    meta_description: "Mateřská škola Čeladná - dvě pracoviště Beruška a Krteček",
    content: [
      {
        __component: "components.workplace-cards",
        cards: [
          {
            title: "MŠ Beruška",
            description: "Program Začít spolu",
            link: { url: "/beruska" },
          },
          {
            title: "MŠ Krteček",
            description: "Běžná mateřská škola",
            link: { url: "/krtecek" },
          },
        ],
      },
      { __component: "components.heading", text: "Aktuality", type: "h2" },
      { __component: "components.news-articles" },
    ],
  });
  if (uvodId) map["uvod"] = uvodId;

  // 2. O nás (parent for sub-pages)
  const onasId = await createEntry("pages", "O nás", {
    title: "O nás",
    slug: "o-nas",
    meta_description: "Informace o naší mateřské škole",
    content: [
      {
        __component: "components.heading",
        text: "O naší mateřské škole",
        type: "h2",
      },
      {
        __component: "components.text",
        text: "Mateřská škola Čeladná je příspěvková organizace zřízená obcí Čeladná. Provozujeme dvě pracoviště - MŠ Beruška s programem Začít spolu a MŠ Krteček.",
      },
      {
        __component: "components.feature-cards",
        columns: "3",
        card_clickable: true,
        cards: [
          {
            icon_type: "text",
            icon_text: "🏠",
            title: "Dvě pracoviště",
            description: "Beruška a Krteček",
            link: { text: "Více", url: "/beruska" },
          },
          {
            icon_type: "text",
            icon_text: "👶",
            title: "100 dětí",
            description: "Celková kapacita obou pracovišť",
          },
          {
            icon_type: "text",
            icon_text: "👩‍🏫",
            title: "Kvalifikovaný tým",
            description: "Zkušené pedagožky s praxí",
          },
        ],
      },
    ],
  });
  if (onasId) map["o-nas"] = onasId;

  // 3. Kontakty
  const kontaktyId = await createEntry("pages", "Kontakty", {
    title: "Kontakty",
    slug: "kontakty",
    meta_description: "Kontaktní informace mateřské školy Čeladná",
    content: [
      { __component: "components.heading", text: "Kontakty", type: "h2" },
      {
        __component: "components.text",
        text: "Kontaktujte nás na následujících adresách a telefonních číslech.",
      },
      {
        __component: "components.section-divider",
        spacing: "M",
        style: "solid",
      },
      { __component: "components.heading", text: "MŠ Beruška", type: "h3" },
      {
        __component: "components.contact-cards",
        cards: [
          {
            name: "Jana Nováková",
            role: "Ředitelka",
            phone: "+420 558 684 100",
            email: "novakova@msceladna.cz",
          },
          {
            name: "Marie Dvořáková",
            role: "Učitelka",
            phone: "+420 558 684 100",
            email: "dvorakova@msceladna.cz",
          },
        ],
      },
      {
        __component: "components.section-divider",
        spacing: "M",
        style: "solid",
      },
      { __component: "components.heading", text: "MŠ Krteček", type: "h3" },
      {
        __component: "components.contact-cards",
        cards: [
          {
            name: "Lenka Černá",
            role: "Učitelka",
            phone: "+420 558 684 101",
            email: "cerna@msceladna.cz",
          },
          {
            name: "Eva Procházková",
            role: "Učitelka",
            phone: "+420 558 684 101",
            email: "prochazkova@msceladna.cz",
          },
        ],
      },
      {
        __component: "components.section-divider",
        spacing: "M",
        style: "solid",
      },
      {
        __component: "components.heading",
        text: "Spolupracující pracoviště",
        type: "h3",
      },
      {
        __component: "components.accordion-sections",
        sections: [
          {
            title: "Speciálně pedagogické centrum",
            description:
              "SPC Frýdek-Místek\nTel: +420 558 123 456\nWeb: www.spc-fm.cz",
          },
          {
            title: "Pedagogicko-psychologická poradna",
            description: "PPP Frýdek-Místek\nTel: +420 558 234 567",
          },
        ],
      },
    ],
  });
  if (kontaktyId) map["kontakty"] = kontaktyId;

  // 4. Zápis
  const zapisId = await createEntry("pages", "Zápis", {
    title: "Zápis",
    slug: "zapis",
    meta_description: "Informace o zápisu do mateřské školy Čeladná",
    content: [
      {
        __component: "components.heading",
        text: "Zápis do mateřské školy",
        type: "h2",
      },
      {
        __component: "components.alert",
        type: "info",
        title: "Zápis pro školní rok 2026/2027",
        text: "Zápis proběhne v květnu 2026. Podrobné informace budou zveřejněny.",
      },
      {
        __component: "components.text",
        text: "## Informace k zápisu\n\nZápis do naší mateřské školy probíhá v souladu se školským zákonem.",
      },
      {
        __component: "components.heading",
        text: "Co budou děti potřebovat",
        type: "h3",
      },
      {
        __component: "components.feature-cards",
        columns: "3",
        cards: [
          {
            icon_type: "text",
            icon_text: "📋",
            title: "Přihláška",
            description: "Vyplněná žádost o přijetí",
          },
          {
            icon_type: "text",
            icon_text: "🏥",
            title: "Potvrzení lékaře",
            description: "O zdravotní způsobilosti a očkování",
          },
          {
            icon_type: "text",
            icon_text: "🪪",
            title: "Rodný list",
            description: "Kopie rodného listu dítěte",
          },
        ],
      },
    ],
  });
  if (zapisId) map["zapis"] = zapisId;

  // 5. Projekty
  const projektyId = await createEntry("pages", "Projekty", {
    title: "Projekty",
    slug: "projekty",
    meta_description: "Projekty realizované mateřskou školou Čeladná",
    content: [
      { __component: "components.heading", text: "Projekty", type: "h2" },
      {
        __component: "components.text",
        text: "Přehled projektů realizovaných naší mateřskou školou.",
      },
    ],
  });
  if (projektyId) map["projekty"] = projektyId;

  // --- Child pages of O nás (need parent relation) ---

  if (onasId) {
    // 3a. Jak fungujeme
    const jakFungujemeId = await createEntry("pages", "Jak fungujeme", {
      title: "Jak fungujeme",
      slug: "jak-fungujeme",
      parent: { connect: [{ documentId: onasId }] },
      content: [
        {
          __component: "components.heading",
          text: "Jak fungujeme",
          type: "h2",
        },
        {
          __component: "components.text",
          text: "Naše mateřská škola funguje celoročně s výjimkou letních prázdnin...",
        },
        {
          __component: "components.stats-highlights",
          columns: "4",
          items: [
            {
              number: "6:30",
              title: "Otevíráme",
              description: "Ranní příchod",
            },
            {
              number: "16:30",
              title: "Zavíráme",
              description: "Odpolední vyzvednutí",
            },
            {
              number: "3",
              title: "Jídla denně",
              description: "Svačina, oběd, svačina",
            },
            {
              number: "100",
              title: "Míst celkem",
              description: "V obou pracovištích",
            },
          ],
        },
        {
          __component: "components.section-divider",
          spacing: "M",
          style: "solid",
        },
        {
          __component: "components.accordion-sections",
          sections: [
            {
              title: "Denní režim",
              description:
                "**6:30 - 8:30** Příchod dětí, volná hra\n\n**8:30 - 9:00** Svačina\n\n**9:00 - 11:30** Řízené činnosti, pobyt venku\n\n**11:30 - 12:15** Oběd\n\n**12:15 - 14:15** Odpočinek\n\n**14:15 - 14:30** Svačina\n\n**14:30 - 16:30** Odpolední činnosti, odchod dětí",
              default_open: true,
            },
            {
              title: "Stravování",
              description:
                "Stravování zajišťuje školní jídelna. Děti dostávají dopolední svačinu, oběd a odpolední svačinu.",
            },
            {
              title: "Úplata za vzdělávání",
              description:
                "Výše úplaty za předškolní vzdělávání je stanovena dle vyhlášky.",
            },
          ],
        },
      ],
    });
    if (jakFungujemeId) map["jak-fungujeme"] = jakFungujemeId;

    // 3b. Historie
    const historieId = await createEntry("pages", "Historie", {
      title: "Historie",
      slug: "historie",
      parent: { connect: [{ documentId: onasId }] },
      content: [
        {
          __component: "components.heading",
          text: "Historie mateřských škol v Čeladné",
          type: "h2",
        },
        {
          __component: "components.text",
          text: "Historie předškolního vzdělávání v Čeladné sahá do minulého století.",
        },
        {
          __component: "components.timeline",
          style: "style1",
          collapsible: false,
          items: [
            {
              number: "1960",
              title: "Založení MŠ",
              description:
                "V Čeladné byla založena první mateřská škola.",
            },
            {
              number: "1985",
              title: "Nová budova",
              description:
                "Byla postavena nová budova mateřské školy.",
            },
            {
              number: "2005",
              title: "Program Začít spolu",
              description:
                "MŠ Beruška zavedla vzdělávací program Začít spolu.",
            },
            {
              number: "2020",
              title: "Modernizace",
              description:
                "Proběhla rozsáhlá rekonstrukce a modernizace obou pracovišť.",
            },
          ],
        },
      ],
    });
    if (historieId) map["historie"] = historieId;

    // 3c. Jak pracujeme
    const jakPracujemeId = await createEntry("pages", "Jak pracujeme", {
      title: "Jak pracujeme",
      slug: "jak-pracujeme",
      parent: { connect: [{ documentId: onasId }] },
      content: [
        {
          __component: "components.heading",
          text: "Jak pracujeme",
          type: "h2",
        },
        {
          __component: "components.text",
          text: "Vzdělávání v naší mateřské škole probíhá dle školního vzdělávacího programu.",
        },
        {
          __component: "components.accordion-sections",
          sections: [
            {
              title: "Školní vzdělávací program",
              description:
                "Náš ŠVP vychází z Rámcového vzdělávacího programu pro předškolní vzdělávání.",
            },
            {
              title: "Příprava na ZŠ",
              description:
                "Systematicky připravujeme děti na vstup do základního vzdělávání.",
            },
          ],
        },
      ],
    });
    if (jakPracujemeId) map["jak-pracujeme"] = jakPracujemeId;

    // 3d. Naše úspěchy
    const naseUspechy = await createEntry("pages", "Naše úspěchy", {
      title: "Naše úspěchy",
      slug: "nase-uspechy",
      parent: { connect: [{ documentId: onasId }] },
      content: [
        {
          __component: "components.heading",
          text: "Naše úspěchy",
          type: "h2",
        },
        {
          __component: "components.text",
          text: "Jsme hrdí na úspěchy našich dětí a pedagogů.",
        },
      ],
    });
    if (naseUspechy) map["nase-uspechy"] = naseUspechy;

    // 3e. Galerie
    const galerieId = await createEntry("pages", "Galerie", {
      title: "Galerie",
      slug: "galerie",
      parent: { connect: [{ documentId: onasId }] },
      content: [
        { __component: "components.heading", text: "Galerie", type: "h2" },
        {
          __component: "components.text",
          text: "Fotografie z naší mateřské školy a školních akcí.",
        },
      ],
    });
    if (galerieId) map["galerie"] = galerieId;
  }

  return map;
}

// ---------------------------------------------------------------------------
// 6. Navigation
// ---------------------------------------------------------------------------

async function seedNavigation(
  pages: Record<string, string>,
): Promise<void> {
  console.log("\n=== Navigation ===");

  // Helper to build a link component pointing to a page
  function pageLink(slug: string): Record<string, unknown> {
    const docId = pages[slug];
    if (docId) {
      return { page: { connect: [{ documentId: docId }] } };
    }
    // fallback to url
    return { url: `/${slug}` };
  }

  function urlLink(url: string): Record<string, unknown> {
    return { url };
  }

  // 1. O nás (with children)
  await createEntry("navigations", "O nás", {
    title: "O nás",
    sortOrder: 1,
    link: pageLink("o-nas"),
    children: [
      { title: "Jak fungujeme", link: pageLink("jak-fungujeme") },
      { title: "Historie", link: pageLink("historie") },
      { title: "Jak pracujeme", link: pageLink("jak-pracujeme") },
      { title: "Naše úspěchy", link: pageLink("nase-uspechy") },
      { title: "Galerie", link: pageLink("galerie") },
    ],
  });

  // 2. Kontakty
  await createEntry("navigations", "Kontakty", {
    title: "Kontakty",
    sortOrder: 2,
    link: pageLink("kontakty"),
  });

  // 3. Aktuality
  await createEntry("navigations", "Aktuality", {
    title: "Aktuality",
    sortOrder: 3,
    link: urlLink("/aktuality"),
  });

  // 4. Projekty
  await createEntry("navigations", "Projekty", {
    title: "Projekty",
    sortOrder: 4,
    link: urlLink("/projekty"),
  });

  // 5. Zápis
  await createEntry("navigations", "Zápis", {
    title: "Zápis",
    sortOrder: 5,
    link: pageLink("zapis"),
  });

  // 6. Beruška
  await createEntry("navigations", "Beruška", {
    title: "Beruška",
    sortOrder: 6,
    link: urlLink("/beruska"),
  });

  // 7. Krteček
  await createEntry("navigations", "Krteček", {
    title: "Krteček",
    sortOrder: 7,
    link: urlLink("/krtecek"),
  });
}

// ---------------------------------------------------------------------------
// 7. Projects
// ---------------------------------------------------------------------------

async function seedProjects(): Promise<void> {
  console.log("\n=== Projects ===");

  await createEntry("projects", "Šablony pro MŠ III", {
    name: "Šablony pro MŠ III",
    slug: "sablony-pro-ms-iii",
    projectNumber: "CZ.02.02.XX/00/22_003/0003456",
    goal: "Podpora profesního rozvoje pedagogů",
    description:
      "Projekt zaměřený na další vzdělávání pedagogických pracovníků.",
    status: "aktivni",
    dateFrom: "2023-01-01",
    dateTo: "2025-12-31",
  });

  await createEntry("projects", "Zahrada pro všechny", {
    name: "Zahrada pro všechny",
    slug: "zahrada-pro-vsechny",
    goal: "Revitalizace zahrady MŠ Beruška",
    financialAmount: "450 000 Kč",
    description: "Projekt revitalizace zahrady.",
    status: "ukonceny",
    dateFrom: "2022-03-01",
    dateTo: "2023-06-30",
  });

  await createEntry("projects", "Digitalizace ve vzdělávání", {
    name: "Digitalizace ve vzdělávání",
    slug: "digitalizace-ve-vzdelavani",
    goal: "Zavedení digitálních technologií do předškolního vzdělávání",
    description: "Pořízení interaktivních tabulí a tabletů.",
    status: "aktivni",
    dateFrom: "2024-09-01",
  });
}

// ---------------------------------------------------------------------------
// 8. News Articles
// ---------------------------------------------------------------------------

async function seedNewsArticles(
  workplaces: Record<string, string>,
  tags: Record<string, string>,
): Promise<void> {
  console.log("\n=== News Articles ===");

  const beruskaDocId = workplaces["beruska"];
  const krtecekDocId = workplaces["krtecek"];
  const zapisTagId = tags["zapis"];
  const beruskaTagId = tags["beruska"];
  const krtecekTagId = tags["krtecek"];

  // 1. Zápis do MŠ
  const zapisData: Record<string, unknown> = {
    title: "Zápis do MŠ pro rok 2026/2027",
    slug: "zapis-do-ms-pro-rok-2026-2027",
    type: "aktualita",
    date: "2026-03-15T08:00:00.000Z",
    description: "Zveme vás k zápisu do naší mateřské školy...",
  };
  if (zapisTagId) {
    zapisData.tags = { connect: [{ documentId: zapisTagId }] };
  }
  await createEntry("news-articles", "Zápis do MŠ pro rok 2026/2027", zapisData);

  // 2. Karneval v MŠ Beruška
  const karnevalData: Record<string, unknown> = {
    title: "Karneval v MŠ Beruška",
    slug: "karneval-v-ms-beruska",
    type: "reportaz",
    date: "2026-02-14T08:00:00.000Z",
    description:
      "V pátek 14. února proběhl tradiční karneval...",
  };
  if (beruskaDocId) {
    karnevalData.workplaces = { connect: [{ documentId: beruskaDocId }] };
  }
  if (beruskaTagId) {
    karnevalData.tags = { connect: [{ documentId: beruskaTagId }] };
  }
  await createEntry("news-articles", "Karneval v MŠ Beruška", karnevalData);

  // 3. Vánoční besídka
  const besidkaData: Record<string, unknown> = {
    title: "Vánoční besídka",
    slug: "vanocni-besidka",
    type: "reportaz",
    date: "2025-12-18T08:00:00.000Z",
    description:
      "Děti z obou pracovišť si připravily vánoční vystoupení...",
  };
  const besidkaWorkplaces: { documentId: string }[] = [];
  if (beruskaDocId) besidkaWorkplaces.push({ documentId: beruskaDocId });
  if (krtecekDocId) besidkaWorkplaces.push({ documentId: krtecekDocId });
  if (besidkaWorkplaces.length) {
    besidkaData.workplaces = { connect: besidkaWorkplaces };
  }
  await createEntry("news-articles", "Vánoční besídka", besidkaData);

  // 4. Den otevřených dveří
  const denData: Record<string, unknown> = {
    title: "Den otevřených dveří",
    slug: "den-otevrenych-dveri",
    type: "aktualita",
    date: "2026-04-10T08:00:00.000Z",
    description: "Srdečně zveme rodiče na den otevřených dveří...",
  };
  await createEntry("news-articles", "Den otevřených dveří", denData);

  // 5. Výlet do ZOO
  const vyletData: Record<string, unknown> = {
    title: "Výlet do ZOO",
    slug: "vylet-do-zoo",
    type: "reportaz",
    date: "2026-03-05T08:00:00.000Z",
    description: "Děti z Berušky navštívily ostravskou ZOO...",
  };
  if (beruskaDocId) {
    vyletData.workplaces = { connect: [{ documentId: beruskaDocId }] };
  }
  if (beruskaTagId) {
    vyletData.tags = { connect: [{ documentId: beruskaTagId }] };
  }
  await createEntry("news-articles", "Výlet do ZOO", vyletData);
}

// ---------------------------------------------------------------------------
// 9. Cooperating Institutions
// ---------------------------------------------------------------------------

async function seedCooperatingInstitutions(): Promise<void> {
  console.log("\n=== Cooperating Institutions ===");

  await createEntry("cooperating-institutions", "SPC Frýdek-Místek", {
    name: "SPC Frýdek-Místek",
    type: "SPC",
    phone: "+420 558 123 456",
    sortOrder: 1,
  });

  await createEntry("cooperating-institutions", "PPP Frýdek-Místek", {
    name: "PPP Frýdek-Místek",
    type: "PPP",
    phone: "+420 558 234 567",
    sortOrder: 2,
  });

  await createEntry("cooperating-institutions", "Klinická logopedie", {
    name: "Klinická logopedie",
    type: "Logopedie",
    contactPerson: "Mgr. Eva Malá",
    sortOrder: 3,
  });
}

// ---------------------------------------------------------------------------
// 10. Footer (single type)
// ---------------------------------------------------------------------------

async function seedFooter(): Promise<void> {
  console.log("\n=== Footer ===");

  await updateSingleType("footer", {
    text: "Mateřská škola Čeladná, příspěvková organizace",
    address: "Čeladná 555, 739 12 Čeladná",
    mail: "info@msceladna.cz",
    phone: "+420 558 684 100",
    linkSections: [
      {
        title: "Dokumenty",
        sortOrder: 1,
        links: [
          { text: "Zpracování osobních údajů", url: "#" },
          { text: "Rozpočtové dokumenty", url: "#" },
          { text: "Prohlášení o přístupnosti", url: "#" },
        ],
      },
      {
        title: "Rychlé odkazy",
        sortOrder: 2,
        links: [
          { text: "Aktuality", url: "/aktuality" },
          { text: "Kontakty", url: "/kontakty" },
          { text: "Zápis", url: "/zapis" },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("=================================================");
  console.log("  MS Celadna Strapi - Data Seed Script");
  console.log(`  Target: ${STRAPI_URL}`);
  console.log("=================================================");

  // Verify connection
  try {
    process.stdout.write("\nVerifying Strapi connection...");
    const res = await fetch(`${STRAPI_URL}/api/content-type-builder/content-types`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    if (!res.ok) {
      // Try a simpler endpoint
      const res2 = await fetch(`${STRAPI_URL}/admin/project-type`);
      if (!res2.ok) {
        throw new Error(`Cannot reach Strapi at ${STRAPI_URL}`);
      }
    }
    console.log(" OK\n");
  } catch (err: any) {
    console.log(` WARNING: Could not verify connection (${err.message}). Proceeding anyway...\n`);
  }

  // Seed in dependency order
  const tags = await seedTags();
  const workplaces = await seedWorkplaces();
  await seedEmployees(workplaces);
  await seedOrganization();
  const pages = await seedPages();
  await seedNavigation(pages);
  await seedProjects();
  await seedNewsArticles(workplaces, tags);
  await seedCooperatingInstitutions();
  await seedFooter();

  console.log("\n=================================================");
  console.log("  Seeding complete!");
  console.log("=================================================\n");
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
