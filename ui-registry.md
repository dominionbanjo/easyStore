### Hero Section

File: src/modules/website/components/home/HeroSection.tsx
Last updated: 2026-07-17

| Property | Class |
|---|---|
| Background container | `bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-emerald-950/70` |
| Overlay/orbs | `bg-emerald-500/10` + `bg-amber-500/5` with `blur-[150px]` |
| Border — frosted elements | `border border-white/10` + `backdrop-blur-xl` |
| Border radius — CTA/chips | `rounded-sm` |
| Border radius — device frame | `rounded-xl` (laptop), `rounded-[2rem]` (phone) |
| Text — primary heading | `text-white font-black tracking-tighter` (size scales: 40px→82px) |
| Text — subtitle | `text-neutral-300 font-medium text-lg→2xl` |
| Text — eyebrow/badge | `text-amber-400 font-bold text-sm` |
| Text — muted | `text-neutral-400` |
| Text — accent | `text-emerald-400` / `text-primary` |
| Spacing — section outer | `pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-32 lg:pb-40` |
| Spacing — content columns | `space-y-8 lg:space-y-10` |
| Spacing — pill group | `gap-3` |
| Spacing — CTA group | `gap-4` |
| Hover — primary CTA | `hover:bg-emerald-600 hover:scale-[1.02] active:scale-95` |
| Hover — frosted chip | `hover:bg-white/10` |
| Hover — icon | `group-hover:scale-110 transition-transform` |
| Shadow — CTA | `shadow-2xl shadow-emerald-500/30` |
| Shadow — device frame | `shadow-[0_30px_80px_rgba(0,0,0,0.6)]` |
| Accent — primary | `#10b981` (emerald) |
| Accent — secondary | `#f59e0b` (amber) |

**Pattern notes:**
- All trust/reassurance elements use frosted glass style: `bg-white/5 backdrop-blur-xl border border-white/10`
- Premium feel is established through dark gradient background, slow orchestrated animations (staggered fade-up), and accent glow effects
- CTA button uses `animate-pulse-glow` for subtle ambient glow — applied only to the primary action
- Floating elements use the existing `animate-float` / `animate-float-delayed` classes from index.css
- Device mockup is responsive: phone frame on `<lg`, laptop frame on `>=lg`
