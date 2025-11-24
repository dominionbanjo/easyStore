// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Users, Heart, ShoppingBag } from "lucide-react";
// import HomepageLayout from "@/components/layout/homepage/HomePageLayout";

// export default function AboutPage() {
//   return (
//     <HomepageLayout>
//       <main className="min-h-screen bg-emerald-50 text-foreground">
//         {/* ──────────────── HERO SECTION ──────────────── */}
//         <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-emerald-50">
//           <div className="max-w-3xl mx-auto space-y-6">
//             <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
//               About <span className="text-primary">EasyStore</span>
//             </h1>
//             <p className="text-lg text-muted-foreground leading-relaxed">
//               EasyStore is your friendly online marketplace designed to make
//               shopping simple, smart, and satisfying — whether you're a small
//               business owner or a customer looking for quality products at great
//               prices.
//             </p>
//           </div>
//         </section>

//         <Separator className="max-w-5xl mx-auto mb-16" />

//         {/* ──────────────── MISSION SECTION ──────────────── */}
//         <section className="max-w-6xl mx-auto px-6 py-10 text-center">
//           <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             To empower sellers to grow and reach customers globally, while
//             giving shoppers a seamless and trustworthy experience — all through
//             a modern, intuitive platform that puts people first.
//           </p>

//           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
//             {[
//               {
//                 icon: <ShoppingBag className="h-8 w-8 text-primary" />,
//                 title: "Marketplace for Everyone",
//                 desc: "From handmade crafts to cutting-edge tech, EasyStore connects every kind of seller to the right buyers.",
//               },
//               {
//                 icon: <Users className="h-8 w-8 text-primary" />,
//                 title: "Community-Driven Growth",
//                 desc: "We believe in supporting local businesses and building trust between sellers and customers.",
//               },
//               {
//                 icon: <Heart className="h-8 w-8 text-primary" />,
//                 title: "Built with Care",
//                 desc: "Our team is passionate about making e-commerce simple, fair, and full of delight for everyone involved.",
//               },
//             ].map((feature, i) => (
//               <Card
//                 key={i}
//                 className="bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-6"
//               >
//                 <CardContent className="flex flex-col items-center text-center space-y-4">
//                   {feature.icon}
//                   <h3 className="font-semibold text-lg">{feature.title}</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     {feature.desc}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* ──────────────── STORY SECTION ──────────────── */}
//         <section className="bg-white py-20 mt-10 border-t border-border/20">
//           <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
//             <img
//               src="/images/about-team.jpg"
//               alt="Our Story"
//               className="w-full h-[400px] object-cover rounded-2xl shadow-sm"
//             />

//             <div className="space-y-6">
//               <h2 className="text-3xl font-semibold">Our Story</h2>
//               <p className="text-muted-foreground leading-relaxed">
//                 EasyStore began as a small idea in 2024 — to bridge the gap
//                 between sellers and buyers with an elegant, fast, and
//                 human-centered platform. What started as a passion project
//                 quickly grew into a full-fledged marketplace powered by
//                 creativity, transparency, and trust.
//               </p>
//               <p className="text-muted-foreground leading-relaxed">
//                 Today, we help thousands of merchants sell smarter and give
//                 customers access to quality goods they can love and rely on —
//                 from fashion and electronics to home essentials and beyond.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* ──────────────── TEAM SECTION ──────────────── */}
//         <section className="py-20 px-6 text-center bg-emerald-100">
//           <div className="max-w-5xl mx-auto space-y-8">
//             <h2 className="text-3xl font-semibold">Meet the Team</h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               Behind every feature is a team of designers, developers, and
//               dreamers working to make online shopping a joy, not a chore.
//             </p>

//             <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mt-10">
//               {[
//                 {
//                   name: "Dominion Banjo",
//                   role: "Founder & Lead Engineer",
//                   image: "/images/team-founder.jpg",
//                 },
//                 {
//                   name: "Sarah Adams",
//                   role: "Product Designer",
//                   image: "/images/team-designer.jpg",
//                 },
//                 {
//                   name: "James Carter",
//                   role: "Marketing Lead",
//                   image: "/images/team-marketing.jpg",
//                 },
//               ].map((member, i) => (
//                 <Card
//                   key={i}
//                   className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//                 >
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-56 object-cover"
//                   />
//                   <CardContent className="text-center py-4 space-y-1">
//                     <h3 className="font-semibold text-lg">{member.name}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {member.role}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ──────────────── CALL-TO-ACTION ──────────────── */}
//         <section className="py-20 text-center bg-card">
//           <h2 className="text-3xl font-semibold mb-4">
//             Join the EasyStore community today
//           </h2>
//           <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Start selling or shopping today with a platform built for
//             simplicity, trust, and growth. Your next opportunity is just a click
//             away.
//           </p>
//           <Button className="bg-primary text-primary-foreground rounded-full px-8 py-2 hover:bg-primary/90">
//             Get Started
//           </Button>
//         </section>
//       </main>
//     </HomepageLayout>
//   );
// }
