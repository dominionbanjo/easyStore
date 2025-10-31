"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ──────────────── HERO ──────────────── */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-muted/30 via-background to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            About <span className="text-primary">EasyStore</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            EasyStore makes online shopping human again — a marketplace where
            simplicity meets community, empowering both small businesses and
            everyday shoppers through trust, speed, and transparency.
          </p>
        </motion.div>
      </section>

      <Separator className="max-w-5xl mx-auto my-16" />

      {/* ──────────────── MISSION ──────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We help sellers grow beyond boundaries and give buyers a seamless,
            secure, and joyful shopping experience — powered by innovation and
            care for real people.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <ShoppingBag className="h-8 w-8 text-primary" />,
              title: "Marketplace for Everyone",
              desc: "From handmade goods to cutting-edge tech — EasyStore connects every kind of seller to the right buyers.",
            },
            {
              icon: <Users className="h-8 w-8 text-primary" />,
              title: "Community-Driven Growth",
              desc: "We’re building an ecosystem where small businesses thrive through collaboration, not competition.",
            },
            {
              icon: <Heart className="h-8 w-8 text-primary" />,
              title: "Built with Care",
              desc: "Every feature is designed to simplify e-commerce and make it fair, enjoyable, and empowering.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
                  {feature.icon}
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────── STORY ──────────────── */}
      <section className="border-t border-border/40 py-20 bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="/images/about-team.jpg"
            alt="Our Story"
            className="w-full h-[420px] object-cover rounded-2xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              What started in 2024 as a small idea between a few developers soon
              evolved into a full-fledged marketplace built around transparency,
              speed, and trust. EasyStore was born from a shared passion to
              create something more human — where technology serves connection,
              not chaos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, thousands of merchants and customers use EasyStore to buy,
              sell, and grow — proving that when you mix innovation with
              empathy, commerce becomes a force for good.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── TEAM ──────────────── */}
      <section className="py-20 px-6 bg-muted/20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold">Meet the Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The EasyStore family is made up of dreamers, builders, and problem
            solvers — all dedicated to making online shopping effortless and
            delightful.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mt-10">
            {[
              {
                name: "Dominion Banjo",
                role: "Founder & Lead Engineer",
                image: "/images/team-founder.jpg",
              },
              {
                name: "Sarah Adams",
                role: "Product Designer",
                image: "/images/team-designer.jpg",
              },
              {
                name: "James Carter",
                role: "Marketing Lead",
                image: "/images/team-marketing.jpg",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-56 object-cover"
                  />
                  <CardContent className="text-center py-5 space-y-1">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CALL TO ACTION ──────────────── */}
      <section className="py-24 text-center bg-background border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-3xl font-semibold">
            Join the <span className="text-primary">EasyStore</span> community
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're a seller or a shopper, there's a place for you here.
            Start your journey with EasyStore — where commerce meets connection.
          </p>
          <Button className="rounded-full px-8 py-2">Get Started</Button>
        </motion.div>
      </section>
    </main>
  );
}
