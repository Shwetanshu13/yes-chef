import Link from "next/link";

const featureCards = [
  {
    title: "Manual & AI recipes",
    body: "Hand craft dishes or let AI clean up and generate delicious results.",
  },
  {
    title: "Friends first",
    body: "Follow friends, peek their saved meals, and cook together.",
  },
  {
    title: "Filters that fly",
    body: "Cuisine, course, type, and quick search keep dinner decisions easy.",
  },
];

export default function Home() {
  return (
    <section className="grid gap-10">
      <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-white via-emerald-50 to-white p-10 shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Cooking with AI</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          A minimal recipe hub with friendly sharing and AI-powered creation.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Capture your own dishes, auto-structure messy notes, or let AI cook up something new. Invite
          friends to follow and browse each other’s favorites.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signup" className="btn-primary">
            Create account
          </Link>
          <Link href="/recipes" className="btn-ghost">
            Browse recipes
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="card p-5"
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
