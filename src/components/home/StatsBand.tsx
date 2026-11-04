import type { Stat } from "@/content";
import { Container } from "@/components/ui/Container";

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section aria-labelledby="scale-title" className="border-y border-paper-100/[0.07] bg-navy-900/50">
      <Container className="py-14">
        <h2 id="scale-title" className="sr-only">
          Scale of work
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-paper-100/[0.08]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <dt className="order-2 mt-2 text-[0.95rem] text-paper-100">{stat.label}</dt>
              <dd className="order-1 font-display text-5xl tracking-tight text-rose-300">{stat.value}</dd>
              <dd className="order-3 mt-2 text-sm leading-snug text-mist-400">{stat.context}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
