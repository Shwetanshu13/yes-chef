import Link from "next/link";
import Image from "next/image";

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
        <section className="grid gap-12 sm:gap-16">
            <div className="card overflow-hidden border-0 bg-transparent p-6 sm:p-12 lg:p-16 text-center lg:text-left shadow-none hover:-translate-y-0 hover:shadow-none">
                <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                    <div className="space-y-6 flex-1 max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-accent animate-pulse">Cooking with AI</p>
                        <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl text-foreground">
                            A minimal recipe hub with friendly sharing and <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-500">AI-powered creation.</span>
                        </h1>
                        <p className="text-lg text-muted sm:text-xl leading-relaxed">
                            Capture your own dishes, auto-structure messy notes, or let AI cook up something new. Invite
                            friends to follow and browse each other's favorites.
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link href="/signup" className="btn-primary text-base px-8 py-3.5">
                                Create account
                            </Link>
                            <Link href="/recipes" className="btn-ghost text-base px-8 py-3.5">
                                Browse recipes
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative h-40 w-40 flex-shrink-0 sm:h-56 sm:w-56 lg:h-72 lg:w-72 drop-shadow-2xl transition-transform duration-700 hover:scale-110 hover:rotate-3">
                        <Image src="/logo.svg" alt="Yes Chef" fill sizes="(max-width: 768px) 160px, 288px" priority className="object-contain filter drop-shadow-[0_20px_20px_rgba(16,185,129,0.3)]" />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
                {featureCards.map((card) => (
                    <div
                        key={card.title}
                        className="card group p-8 hover:bg-[color:var(--card-border)]/5"
                    >
                        <div className="mb-4 h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center transition-colors group-hover:bg-accent/20">
                            <div className="h-6 w-6 rounded-full bg-accent/80 group-hover:animate-ping" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                        <p className="mt-3 text-base text-muted leading-relaxed">{card.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
