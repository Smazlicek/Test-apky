# Bar POS — projekt

Základní kostra appky podle specifikace (`bar-pos-specifikace.md`). Tohle je
**začátek**, ne hotová appka — obrazovky jsou zatím jen prázdné placeholdery
s `TODO` komentáři, které postupně doplníme funkčností.

## Proč tenhle stack

- **Next.js + TypeScript** — jeden projekt pro frontend i backend (API),
  obrovská komunita a spousta návodů, dobře se hostuje jako jeden Docker
  kontejner v Coolify.
- **Prisma + PostgreSQL** — Prisma je ORM, díky kterému nepíšeš syrové SQL
  ručně, ale pracuješ s databází přes přehledné TypeScript funkce. Datový
  model appky je v `prisma/schema.prisma`.
- **Tailwind CSS** — rychlé stylování bez psaní vlastního CSS od nuly.
- **Dexie.js** — knihovna nad IndexedDB (offline úložiště v prohlížeči),
  pomocí které appka na tabletu ukládá objednávky, i když zrovna není
  připojení k internetu.

## Struktura projektu

```
prisma/schema.prisma     – datový model (uživatelé, produkty, sklad, účty, platby...)
src/app/                 – jednotlivé obrazovky appky (Next.js App Router)
  pos/                   – přehled stolů (rychlý prodej + otevřené účty)
  pos/jmena/             – účty na jméno (samostatná záložka, viz specifikace)
  sklad/                 – sklad produktů, naskladnění, odpisy
  sklad/receptury/       – správa receptur (kolik suroviny se odečte na 1 drink)
  rezervace/              – rezervace stolů
  reporty/                – tržby, uzávěrky, marže (jen pro manažera)
  admin/produkty/        – správa produktů a cen (jen pro manažera)
  admin/uzivatele/       – správa zaměstnanců a rolí (jen pro manažera)
src/lib/db.ts            – připojení na databázi přes Prisma
src/lib/offline/         – offline fronta událostí (Dexie) + kostra synchronizace
src/components/Nav.tsx   – horní navigace appky
```

## Jak appka řeší offline provoz (důležité)

Appka **neposílá na server výsledný stav skladu**, ale jednotlivé kroky
("prodal jsem 1 pivo", "odepsal jsem 2 skleničky"...). Tyhle kroky se na
zařízení ukládají do lokální fronty (`src/lib/offline/db.ts`) i bez
připojení, a jakmile se zařízení znovu připojí, fronta se odešle na server
(`src/lib/offline/sync.ts` — zatím jen kostra, `POST /api/sync` teprve
napíšeme). Díky tomuhle principu může offline pracovat víc zařízení naráz
(tablet, mobil, časem i další pobočky), aniž by si navzájem přepisovala data.

## Jak appku rozjet u sebe

Tohle jsem připravil tady v cloudu, kde bohužel nemám přístup k internetu
na stažení balíčků (npm), takže jsem to nemohl sám zkusit spustit. První
spuštění prosím udělej u sebe na počítači (nebo rovnou přes Coolify) —
kdyby něco nefungovalo, pošli mi chybovou hlášku a doladíme to spolu.

1. Nainstaluj závislosti:
   ```
   npm install
   ```
2. Zkopíruj `.env.example` do `.env` a vyplň skutečné údaje (hlavně
   `DATABASE_URL` k PostgreSQL databázi, tu ti vytvoří Coolify jako
   samostatný resource — viz naše dřívější rozhovor o Databases).
3. Vytvoř databázové tabulky podle `prisma/schema.prisma`:
   ```
   npm run prisma:migrate
   ```
4. Spusť appku lokálně:
   ```
   npm run dev
   ```
   a otevři http://localhost:3000

## Nasazení na VPS přes Coolify

Appku pushni do svého gitu (GitHub, nebo self-hosted Gitea/Forgejo, jak jsme
probírali), pak v Coolify vytvoř nový Application resource napojený na
tenhle repozitář (Next.js appka se dá zabuildit i bez vlastního Dockerfilu
přes Nixpacks) a zvlášť Database resource s PostgreSQL, jehož connection
string vložíš appce jako `DATABASE_URL`.

## Co je hotové a co je potřeba doplnit dál

Hotovo: datový model (`prisma/schema.prisma`), struktura obrazovek,
navigace, kostra offline fronty.

Zbývá (doporučené pořadí, budeme dělat postupně funkci po funkci):

1. Přihlašování (login formulář + API endpoint, který ověří heslo a založí
   Session) a rozlišení rolí BARMAN / MANAGER v navigaci.
2. Obrazovka objednávky — přidávání položek na účet, propojení s offline
   frontou (`queueEvent`).
3. Placení — hotovost, QR platba (vygenerování SPAYD QR kódu na účet baru),
   sleva, zaškrtnutí "nákupní cena pro personál", tlačítko Odpis.
4. Sklad — naskladnění, ruční odpis, napojení receptur na automatický odpočet
   surovin při prodeji.
5. Rezervace stolů.
6. Reporty (tržby, uzávěrka, marže).
7. Doladění PWA — ikony do `public/manifest.json` a service worker pro
   opravdové offline fungování appky jako celku (doporučuju knihovnu
   `next-pwa` nebo `@serwist/next`).
8. Napojení tiskárny účtenek (ESC/POS) — až fyzicky bude k dispozici.
