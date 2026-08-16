import { redirect } from "next/navigation";

// Úvodní stránka appku jen přesměruje na hlavní obrazovku pokladny (stoly).
export default function HomePage() {
  redirect("/pos");
}
