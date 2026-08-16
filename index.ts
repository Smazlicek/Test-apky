// Sdílené typy pro appku. Postupně sem budeme přidávat typy pro
// offline frontu, API odpovědi apod.

export type NavItem = {
  href: string;
  label: string;
  managerOnly?: boolean;
};
