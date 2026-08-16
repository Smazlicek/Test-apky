// TODO: formulář na přihlášení (e-mail/jméno + heslo), napojený na
// /api/auth/login endpoint, který ověří heslo (bcrypt) a založí Session.
export default function LoginPage() {
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Přihlášení</h1>
      <p className="text-sm text-neutral-500">
        TODO: přihlašovací formulář pro jednotlivé zaměstnance (e-mail + heslo).
      </p>
    </div>
  );
}
