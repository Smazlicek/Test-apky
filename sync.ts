import { db, type PendingEvent, type PendingEventType } from "./db";

// Přidá novou událost do offline fronty. Volá se vždy, když uživatel
// v appce něco udělá (přidá položku, zapíše odpis, přijme platbu...) –
// bez ohledu na to, jestli je zařízení zrovna online, nebo ne.
export async function queueEvent(
  type: PendingEventType,
  payload: unknown
): Promise<void> {
  const event: PendingEvent = {
    clientEventId: crypto.randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    synced: false,
  };
  await db.pendingEvents.add(event);
  // Po přidání rovnou zkusíme synchronizovat (pokud jsme online) – pokud ne,
  // událost zůstane ve frontě do dalšího pokusu.
  void trySync();
}

async function getUnsyncedEvents(): Promise<PendingEvent[]> {
  return db.pendingEvents.where("synced").equals(0).sortBy("createdAt");
}

// Odešle nesynchronizované události na server. Zatím jen kostra – jakmile
// budeme mít hotový API endpoint (např. POST /api/sync), doplníme sem
// skutečné volání fetch().
export async function trySync(): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }

  const pending = await getUnsyncedEvents();
  if (pending.length === 0) {
    return;
  }

  try {
    // TODO: nahradit skutečným voláním, např.:
    // const res = await fetch("/api/sync", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ events: pending }),
    // });
    // if (!res.ok) throw new Error("Sync selhal");
    // Server by měl podle clientEventId ignorovat události, které už zpracoval
    // (idempotence) – viz unikátní `clientEventId` v prisma/schema.prisma.
    console.log("[offline-sync] TODO: odeslat na server", pending.length, "událostí");
  } catch (err) {
    // Necháváme události ve frontě, zkusíme to znovu při dalším pokusu
    // (např. po návratu online).
    console.warn("[offline-sync] synchronizace selhala, zkusím to později", err);
  }
}

// Zaregistruje listener, který se pokusí synchronizovat frontu, jakmile se
// zařízení znovu připojí k internetu. Zavolat jednou při startu appky
// (např. v klientské komponentě v layoutu).
export function registerAutoSync(): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => void trySync();
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}
