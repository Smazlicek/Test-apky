import Link from "next/link";
import type { NavItem } from "@/types";

const NAV_ITEMS: NavItem[] = [
  { href: "/pos", label: "Stoly" },
  { href: "/pos/jmena", label: "Na jméno" },
  { href: "/rezervace", label: "Rezervace" },
  { href: "/sklad", label: "Sklad" },
  { href: "/sklad/receptury", label: "Receptury" },
  { href: "/reporty", label: "Reporty", managerOnly: true },
  { href: "/admin/produkty", label: "Produkty", managerOnly: true },
  { href: "/admin/uzivatele", label: "Personál", managerOnly: true },
];

// TODO: až bude hotové přihlašování, skrývat položky s managerOnly podle
// role přihlášeného uživatele.
export function Nav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-neutral-200 bg-white px-4 py-3">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
