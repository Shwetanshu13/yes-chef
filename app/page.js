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
      <div className="rounded-3xl border border-emerald-500/30 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-10 shadow-xl dark:from-white dark:via-neutral-100 dark:to-white dark:border-emerald-600/30">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300 dark:text-emerald-700">Cooking with AI</p>
        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight dark:text-neutral-900">
          A minimal recipe hub with friendly sharing and AI-powered creation.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-300 dark:text-neutral-700">
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
            className="rounded-2xl border border-neutral-800/60 bg-neutral-900/60 p-5 text-neutral-100 dark:border-neutral-200 dark:bg-white"
          >
            <h3 className="text-xl font-semibold text-white dark:text-neutral-900">{card.title}</h3>
            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-700">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
