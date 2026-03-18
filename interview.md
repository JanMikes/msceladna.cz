# Interview: Web MŠ Čeladná — Obsahová struktura

## Shrnutí porozumění

Web pro mateřskou školu v Čeladné, která má **jednu organizaci** a **dvě pracoviště** (Beruška, Krteček). Beruška má navíc program Začít spolu a Ekoškolu. Web má tři úrovně: organizace (hlavní), pracoviště Beruška, pracoviště Krteček. Aktuality a reportáže mohou být sdílené nebo specifické pro pracoviště.

---

## 1. Struktura stránek (subpages)

Navrhuji následující strukturu — potvrď, uprav nebo doplň:

```
/ (homepage)
├── /kontakty
│   ├── organizace
│   └── spolupracující pracoviště
├── /o-nas
│   ├── /o-nas/historie
│   ├── /o-nas/vize (+ ŠVP ke stažení)
│   ├── /o-nas/priprava-deti
│   ├── /o-nas/evaluacni-zpravy
│   ├── /o-nas/projekty          ← nebo ve footeru? nebo obojí?
│   ├── /o-nas/uspechy
│   └── /o-nas/inspirace
├── /aktuality                   ← organizační + filtr dle pracoviště
├── /reportaze                   ← články z obou MŠ
├── /zapis
│   ├── informace k zápisu
│   ├── dokumenty ke stažení
│   └── co děti potřebují
├── /beruska
│   ├── /beruska/zamestnanci
│   ├── /beruska/prostredi
│   ├── /beruska/zacit-spolu
│   ├── /beruska/aktuality
│   ├── /beruska/zajmove-cinnosti
│   └── /beruska/ekoskola
│       ├── /beruska/ekoskola/zapisy-schuzek
│       ├── /beruska/ekoskola/pruzkum-skoly
│       ├── /beruska/ekoskola/plan-cinnosti
│       ├── /beruska/ekoskola/nastenka
│       ├── /beruska/ekoskola/ekotym
│       ├── /beruska/ekoskola/ekokodex
│       └── /beruska/ekoskola/akce
├── /krtecek
│   ├── /krtecek/zamestnanci
│   ├── /krtecek/prostredi
│   ├── /krtecek/aktuality
│   └── /krtecek/zajmove-cinnosti
├── /dokumenty                   ← footer sekce
├── /projekty                    ← footer sekce
└── /kde-nas-najdete
```

### Otázky ke struktuře:

**Q1.** Má homepage být rozcestník (výběr Beruška / Krteček), nebo spíš společná stránka s aktualitami, úvodem a odkazy na obě pracoviště?

**Q2.** Metodické centrum Začít spolu — je to opravdu jen přesměrování na externí URL? Pokud ano, stačí odkaz v menu. Nebo chceš mít i krátkou informační stránku na vašem webu?

**Q3.** Odkaz na jídelníček — je to externí odkaz (např. na systém jídelny)? Má být v hlavním menu, nebo jen na homepage/sidebar? Mají obě pracoviště stejnou jídelnu a stejný jídelníček?

**Q4.** Zápis — chceš ho v hlavní navigaci (header) I ve footeru, nebo jen na jednom místě? V období zápisu by mohl být výraznější (banner)?

**Q5.** Beruška/Krteček — mají mít v navigaci vlastní dropdown menu s podstránkami, nebo to bude fungovat jako "sekce" s vlastním sidebar menu po rozkliknutí?

---

## 2. Entity a jejich pole

### 2.1 Organizace (globální nastavení)

| Pole | Příklad | Otázka |
|------|---------|--------|
| Název | MŠ Čeladná | Přesný oficiální název? |
| Sídlo | ? | Adresa sídla (pokud je jiná než pracoviště) |
| IČO | ? | |
| Datová schránka | ? | |
| Web | msceladna.cz? | |
| E-mail | ? | Hlavní kontaktní e-mail |
| Telefon vedení | ? | |
| Telefon administrativa | ? | |
| Zřizovatel | ? | Název, odkaz? |

**Q6.** Jsou telefony na "budovy" totožné s telefony na pracoviště (Beruška, Krteček), nebo je ještě centrální číslo?

**Q7.** Kolik kontaktních e-mailů máte? Jeden hlavní + per pracoviště + per zaměstnanec?

### 2.2 Pracoviště (Beruška, Krteček)

| Pole | Otázka |
|------|--------|
| Název | |
| Adresa | |
| Telefon | |
| E-mail | Má každé pracoviště svůj e-mail? |
| Počet tříd | |
| Počet dětí | Aktualizuje se to průběžně? Nebo jen rozmezí? |
| Popis prostředí | Volný text + fotogalerie? |
| Popis zahrady | Součást prostředí nebo samostatné? |
| Specifika | Např. zvířata — je to volný text nebo strukturovaná data? |
| Virtuální prohlídka | URL embed (iframe)? Jen Beruška zatím? |
| Typ programu | "Začít spolu" vs "běžná MŠ" — zobrazovat jako štítek? |

**Q8.** Bude v budoucnu možnost přidat třetí pracoviště, nebo je to fixně dvě?

**Q9.** Počet dětí — chceš zobrazovat konkrétní číslo, kapacitu, nebo obojí? Jak často se to mění?

**Q10.** Popis prostředí — bude to galerie fotek s textem, nebo spíš volná stránka (rich text editor)?

### 2.3 Zaměstnanec

| Pole | Otázka |
|------|--------|
| Jméno a příjmení | |
| Pozice/role | Učitelka, asistentka, ředitelka...? Jaké role existují? |
| E-mail | Pracovní? |
| Telefon | Jen pokud mají pracovní? |
| Pracoviště | Beruška / Krteček / obě? |
| Medailonek | Volný text — po kliknutí na jméno |
| Kvalifikace | Volný text nebo strukturovaně (seznam)? |
| Kurzy | Seznam kurzů — název, rok? |
| Fotografie | Píšeš, že asi ne — opravdu ne, ani v budoucnu? |
| Pořadí zobrazení | Ředitelka první, pak učitelky...? |

**Q11.** Může jeden zaměstnanec patřit do obou pracovišť (např. ředitelka)?

**Q12.** Kvalifikace a kurzy — chceš je zobrazovat jako prostý seznam, nebo je důležité rozlišovat typ (vzdělání vs. kurz vs. certifikát)?

**Q13.** Bude tam i kategorie "vedení" vs "pedagogický personál" vs "provozní zaměstnanci" (kuchařky, uklízečky)?

### 2.4 Aktualita

| Pole | Otázka |
|------|--------|
| Nadpis | |
| Text / obsah | Rich text? |
| Datum publikace | |
| Viditelnost | Kde se zobrazí: hlavní web, Beruška, Krteček (multiselect) |
| Typ | Pozvánka na akci vs. informace? Nebo nerozlišovat? |
| Datum akce | Pokud je to pozvánka — kdy se koná? |
| Přílohy / obrázky | |
| Odkaz na jídelníček? | To je spíš fixní odkaz, ne aktualita, správně? |

**Q14.** Aktuality a Reportáže — jak přesně se liší? Je to tak, že:
- **Aktualita** = pozvánka / informace o budoucí události
- **Reportáž** = článek o tom, co se už stalo (retrospektiva)?

**Q15.** Chceš u aktualit archiv (starší aktuality zůstanou přístupné) nebo se po čase automaticky skryjí?

**Q16.** Mohou mít aktuality přílohy (PDF pozvánky, obrázky)?

### 2.5 Reportáž

| Pole | Otázka |
|------|--------|
| Nadpis | |
| Perex / úvod | Krátký text pro výpis? |
| Obsah | Rich text s obrázky |
| Datum | |
| Pracoviště | Beruška / Krteček / obě |
| Fotogalerie | Součást obsahu nebo samostatná galerie? |
| Publikováno ve zpravodaji | Ano/ne? Odkaz na zpravodaj? |

**Q17.** Reportáže — posíláte je do zpravodaje jako celé články. Chceš na webu označit "vyšlo ve zpravodaji č. X"?

**Q18.** Reportáže budou mít fotogalerii? Pokud ano — v textu, nebo jako samostatný blok fotek pod článkem?

### 2.6 Projekt

| Pole | Poznámka |
|------|----------|
| Název projektu | |
| Číslo projektu | Registrační číslo dotace? |
| Cíl projektu | Volný text |
| Finanční vyčíslení | Nepovinné — částka nebo text? |
| Popis projektu | Rich text |
| Loga (povinná publicita) | Obrázky — galerie log |
| Plakát publicity | Obrázek nebo PDF? |
| Stav | Aktivní / Ukončený? |
| Pracoviště | Týká se Berušky, Krtečka, nebo obou? |
| Období | Datum od-do? |

**Q19.** Projekty se objevují v sekci "O nás" I ve footeru — chceš je na obou místech (stejná data, dva výstupy), nebo jen na jednom?

**Q20.** Mají projekty časové období (od-do)? Chceš rozlišovat aktivní vs. ukončené projekty?

**Q21.** Publicita — stačí nahrát loga + volitelně plakát, nebo potřebuješ i "screenshoty monitorovacích zpráv" jako přílohy?

### 2.7 Dokument ke stažení

| Pole | Otázka |
|------|--------|
| Název | |
| Kategorie | Školní řád / Žádosti / Rozpočet / Zápis / GDPR / Přístupnost...? |
| Soubor | PDF, DOCX? |
| Pracoviště | Platí pro Berušku, Krtečka, nebo obě? |
| Platnost | Je důležité zobrazovat verzi/datum dokumentu? |

**Q22.** Dokumenty — chceš je rozdělit do kategorií:
- Řády a předpisy (školní řád, řád jídelny, úplata)
- Žádosti (osvobození od školného, odhláška...)
- Rozpočtové dokumenty
- GDPR
- Prohlášení o přístupnosti
- Zápis (dokumenty k zápisu)
...nebo jinak?

**Q23.** Žádosti — jsou to formuláře ke stažení (PDF/DOCX), nebo chceš v budoucnu i online formuláře?

**Q24.** Prohlášení o přístupnosti — to je ze zákona povinný text. Má to být samostatná stránka (ne dokument ke stažení)?

### 2.8 Spolupracující pracoviště

| Pole | Otázka |
|------|--------|
| Název | SPC, PPP, psycholog, logopedie... |
| Typ | Kategorie? |
| Kontaktní osoba | |
| Telefon | |
| E-mail | |
| Web | |
| Adresa | |
| Popis | Volný text — co zajišťují? |

**Q25.** Spolupracující pracoviště — je jich hodně? Je to spíš seznam 5–10 institucí, nebo desítky?

**Q26.** Chceš u nich uvádět i popis (co rodiče mohou od dané instituce očekávat), nebo stačí kontakt?

### 2.9 Ekoškola (jen Beruška)

Podsekce:
- Zápisy schůzek
- Průzkum školy
- Plán činností s vyhodnocováním
- Nástěnka
- Ekotým
- Ekokodex
- Akce Ekoškoly

**Q27.** Ekoškola — každá podsekce je jiný typ obsahu. Můžeš popsat, co v každé bude?
- **Zápisy schůzek** — PDF ke stažení, nebo text přímo na stránce?
- **Průzkum školy** — výsledky dotazníku? Opakuje se každý rok?
- **Plán činností** — tabulka s vyhodnocením? Aktualizuje se průběžně?
- **Nástěnka** — obdoba aktualit pro Ekoškolu?
- **Ekotým** — seznam členů? Děti + dospělí?
- **Ekokodex** — statický text / obrázek?
- **Akce Ekoškoly** — prokliky na vybrané aktuality/reportáže tagované jako "ekoškolní"?

**Q28.** Akce Ekoškoly — rozumím správně, že to nejsou nové záznamy, ale filtrovaný pohled na reportáže/aktuality, které jsou označené jako "Ekoškola"?

### 2.10 Zájmové činnosti (kroužky)

| Pole | Otázka |
|------|--------|
| Název kroužku | |
| Popis | |
| Vedoucí | Interní zaměstnanec nebo externí? |
| Den a čas | |
| Pracoviště | |
| Pro koho (věk) | |
| Cena | |
| Období | Pololetí / celý rok? |

**Q29.** Zájmové činnosti — zmínila jsi, že zvažuješ, jestli nejsou zbytečné. Mění se kroužky často? Stačil by statický text místo strukturovaných dat?

### 2.11 Úspěchy

| Pole | Otázka |
|------|--------|
| Název | Výhra v soutěži, certifikát... |
| Popis | |
| Datum | |
| Sken/obrázek | Certifikát, diplom? |
| Pracoviště | |

**Q30.** Úspěchy — je to spíš "zeď slávy" (galerie certifikátů s popiskem), nebo plnohodnotné články?

### 2.12 Evaluační zpráva

**Q31.** Evaluační zprávy — jsou to PDF dokumenty ke stažení, nebo text zobrazený na stránce? Kolik jich ročně přibývá?

### 2.13 Inspirace

**Q32.** Inspirace (odkazy na vzdělávací weby) — stačí seznam odkazů (název + URL + krátký popis), nebo chceš víc?

---

## 3. Vazby mezi entitami

Jak chápu vztahy — potvrď nebo oprav:

```
Organizace (1)
 ├── Pracoviště (1:N, aktuálně 2)
 │    ├── Zaměstnanci (1:N)
 │    ├── Aktuality (M:N — aktualita se zobrazí na 1+ pracovištích)
 │    ├── Zájmové činnosti (1:N)
 │    └── Beruška navíc:
 │         ├── Začít spolu (1:1 stránka)
 │         └── Ekoškola (1:1 sekce s podsekemi)
 ├── Aktuality (M:N — globální + per pracoviště)
 ├── Reportáže (M:N — per pracoviště, zobrazeno i globálně)
 ├── Projekty (1:N, s vazbou na pracoviště)
 ├── Dokumenty (1:N, s vazbou na pracoviště/kategorii)
 ├── Spolupracující pracoviště (1:N)
 ├── Evaluační zprávy (1:N)
 ├── Úspěchy (1:N)
 └── Inspirace (1:N)
```

**Q33.** Reportáže — mohou se propojit s Ekoškola akcemi? Tedy: napíšeš reportáž a označíš ji jako "Ekoškola akce" a ona se automaticky objeví i v sekci Ekoškola > Akce?

**Q34.** Projekty — váží se na konkrétní pracoviště, nebo jsou vždy celoorganizační?

---

## 4. Navigace a UX

**Q35.** Hlavní menu — kolik položek maximálně? Návrh:
```
Kontakty | O nás ▾ | Aktuality | Reportáže | Beruška ▾ | Krteček ▾ | Zápis
```
Je to OK, nebo chceš jiné řazení / jiné položky?

**Q36.** Beruška a Krteček — mají mít vizuálně odlišené stránky (jiná barva/motiv), nebo jednotný design?

**Q37.** Mobilní verze — je důležitá? (Rodiče pravděpodobně prohlíží na telefonu.)

---

## 5. Správa obsahu

**Q38.** Kdo bude web spravovat? Jedna osoba (ty?), nebo více lidí (učitelky z obou pracovišť)?

**Q39.** Pokud více lidí — potřebuješ rozlišovat oprávnění? Např. učitelka z Berušky smí editovat jen Berušku?

**Q40.** Jak často se přidávají aktuality/reportáže? Denně, týdně, měsíčně?

---

## 6. Další otázky

**Q41.** Začít spolu (sekce u Berušky) — co tam bude za obsah? Statická stránka popisující program, nebo i dynamický obsah (novinky, materiály)?

**Q42.** Existuje stávající web? Pokud ano, jaká je URL? Potřebujeme migrovat obsah?

**Q43.** Jídelna — je společná pro obě pracoviště? Je provozována vaší organizací, nebo externě?

**Q44.** Zpravodaj (do kterého posíláte články) — je to obecní zpravodaj? Chceš na něj odkazovat?

**Q45.** Fotografie dětí — máte souhlas rodičů s publikací fotek na webu? To ovlivní, zda reportáže budou mít fotogalerie s dětmi.

**Q46.** Máte logo školy / obou pracovišť? Grafickou identitu (barvy, fonty)?

**Q47.** "Kde nás najdete" (footer) — mapa s oběma pracovišti? Google Maps embed?

**Q48.** Jazyky — web bude pouze česky?

---

## 7. Návrhy navíc (ke zvážení)

1. **Tagovací systém pro aktuality/reportáže** — místo pevných kategorií umožnit tagy: "Ekoškola", "Začít spolu", "zápis", "jídelna" atd. Reportáž/aktualita tagovaná "Ekoškola" se automaticky objeví v sekci Ekoškola > Akce.

2. **Kalendář akcí** — vizuální kalendář vedle výpisu aktualit (pozvánky s datem akce).

3. **Galerie** — sdílená fotogalerie pro reportáže, aby se fotky daly snadno přiřadit k článkům.

4. **Rychlé odkazy na homepage** — "Jídelníček", "Zápis", "Dokumenty ke stažení" jako výrazné tlačítka/karty pro rodiče.

5. **Breadcrumbs navigace** — pro orientaci v podstránkách (hlavně Ekoškola s mnoha úrovněmi).

6. **Sézonní banner** — pro období zápisu zobrazit výrazný banner na homepage.

7. **RSS/notifikace** — umožnit rodičům odebírat aktuality (volitelně).
