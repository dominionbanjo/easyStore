import {
  Rocket,
  Code,
  Server,
  Terminal,
  Cpu,
  Globe,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  const roles = [
    {
      id: "frontend",
      title: "Frontend Engineer",
      type: "Full-time",
      location: "Remote",
      icon: <Code className="w-6 h-6" />,
      description:
        "Build beautiful, responsive interfaces using React, TypeScript, and Tailwind CSS. Join our mission to create the world's most intuitive e-commerce platform.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      id: "backend",
      title: "Backend Engineer",
      type: "Full-time",
      location: "Remote / Hybrid",
      icon: <Server className="w-6 h-6" />,
      description:
        "Architect scalable microservices and high-performance APIs. Work with Node.js, PostgreSQL, and Redis to power millions of transactions.",
      skills: ["Node.js", "PostgreSQL", "Redis", "System Design"],
    },
    {
      id: "devops",
      title: "DevOps Engineer",
      type: "Full-time",
      location: "Remote",
      icon: <Terminal className="w-6 h-6" />,
      description:
        "Manage our cloud infrastructure, CI/CD pipelines, and security. Ensure 99.99% uptime and streamlined developer experiences.",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute top-0 center w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-emerald-900/20" />

        <div className="w-full mx-auto text-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/5 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 font-bold text-sm mb-8 border border-primary/10 dark:border-emerald-500/20">
              <Rocket className="w-4 h-4" />
              <span>We are hiring!</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-foreground">
              Build the future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 dark:from-emerald-400 dark:to-teal-500">
                Commerce
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join a team of visionaries, builders, and dreamers. We're on a
              mission to democratize online selling for everyone, everywhere.
            </p>

            <Button
              size="lg"
              className="rounded-sm px-8 h-12 text-base font-bold   hover:scale-105 transition-transform"
            >
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 px-4 bg-zinc-50/50 dark:bg-neutral-900/20">
        <div className="w-full mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              Open Positions
            </h2>
            <p className="text-muted-foreground">Find your next challenge.</p>
          </div>

          <div
            className="grid md:grid-cols-3 gap-6"
          >
            {roles.map((role) => (
              <div
                key={role.id}
                className="group relative bg-white dark:bg-neutral-900 rounded-sm p-8 border border-zinc-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-emerald-500/50 transition-all duration-300 hover: hover: dark:hover:-emerald-500/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-sm bg-primary/5 dark:bg-emerald-500/10 flex items-center justify-center text-primary dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {role.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">
                  {role.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>{role.type}</span>
                  <span>•</span>
                  <span>{role.location}</span>
                </div>

                <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed mb-8 min-h-[5rem]">
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-sm text-xs font-medium text-zinc-600 dark:text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-primary dark:text-emerald-400 font-bold text-sm group/link">
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 px-4 overflow-hidden relative">
        <div className="w-full mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Why work with us?
              </h2>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                We believe in taking care of our people so they can take care of
                our users. We offer competitive compensation, comprehensive
                benefits, and a culture that celebrates curiosity and
                innovation.
              </p>

              <div className="grid grid-cols-2 gap-8">
                {[
                  {
                    title: "Remote First",
                    icon: Globe,
                    desc: "Work from anywhere in the world, on your own schedule.",
                  },
                  {
                    title: "Top Gear",
                    icon: Cpu,
                    desc: "Get the tools you need to succeed.",
                  },
                  {
                    title: "High Impact",
                    icon: Rocket,
                    desc: "Build products that empower thousands of businesses globally.",
                  },
                  {
                    title: "Growth",
                    icon: Briefcase,
                    desc: "Annual budget for courses, books, and conferences.",
                  },
                ].map((perk) => (
                  <div key={perk.title} className="flex gap-4 items-start">
                    <div className="p-2 rounded-sm bg-primary/10 dark:bg-emerald-500/10 text-primary dark:text-emerald-400">
                      <perk.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{perk.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-sm blur-3xl" />
              <div className="relative bg-zinc-100 dark:bg-neutral-900 rounded-sm p-8 border border-zinc-200 dark:border-white/5 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🚀</div>
                  <div className="text-2xl font-black">Join the Mission</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
