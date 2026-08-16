import Dexie, { type EntityTable } from "dexie";

// Offline fronta událostí. Princip: appka na tabletu/mobilu NIKDY neposílá
// "výsledný stav" (např. "sklad má teď 12 ks"), ale jen jednotlivé kroky,
// které uživatel udělal (prodal 1 ks, odepsal 2 ks, přijal platbu...).
// Díky tomu můžou offline pracovat klidně 2, 3 i víc zařízení zároveň,
// aniž by si navzájem přepisovala data – server si při synchronizaci jen
// postupně "přehraje" všechny fronty od všech zařízení za sebou.
// Viz specifikace appky, sekce 2 (Technická architektura).

export type PendingEventType =
  | "ORDER_ITEM_ADD"
  | "STOCK_EVENT"
  | "PAYMENT"
  | "ACCOUNT_OPEN"
  | "ACCOUNT_CLOSE";

export interface PendingEvent {
  // Lokální auto-increment ID jen pro potřeby IndexedDB, neposílá se na server.
  id?: number;
  // Stabilní ID vygenerované na zařízení (např. crypto.randomUUID()) –
  // tohle je to, co odpovídá `clientEventId` v databázovém schématu
  // (prisma/schema.prisma) a zajišťuje, že server stejnou událost
  // nezpracuje dvakrát, i kdyby se poslala víckrát.
  clientEventId: string;
  type: PendingEventType;
  // Konkrétní data události – tvar se liší podle `type`, proto `unknown`.
  // TODO: až budeme psát API endpointy, doplnit přesné typy pro každý `type`.
  payload: unknown;
  createdAt: string; // ISO datum, kdy k události došlo na zařízení
  synced: boolean;
}

const db = new Dexie("bar-pos-offline") as Dexie & {
  pendingEvents: EntityTable<PendingEvent, "id">;
};

db.version(1).stores({
  // "synced" je v indexu, ať jde rychle vytáhnout jen nesynchronizované záznamy.
  pendingEvents: "++id, clientEventId, synced, createdAt",
});

export { db };
