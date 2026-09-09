import { useState, useEffect, useRef, useCallback } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts"

/* ─── Types ─── */
type View = "landing" | "login" | "dashboard" | "queue" | "profile" | "explainability" | "whatif" | "cases" | "analytics" | "fairness" | "reports"

/* ─── Colour palette ─── */
const C = {
  navy: "#0D1B52",
  navyMid: "#1a2d7a",
  navyLight: "#253db5",
  teal: "#3E6B67",
  tealLight: "#5a9490",
  ivory: "#F5F1E8",
  ivoryDark: "#E7DFD0",
  ember: "#C96B4B",
  emberLight: "#e08060",
  sage: "#A9B8A9",
  graphite: "#202522",
  white: "#ffffff",
}

/* ─── Particle canvas for landing hero ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let raf: number
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    type Pt = {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      alpha: number
      color: string
    }
    const pts: Pt[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      color:
        Math.random() > 0.6
          ? C.ember
          : Math.random() > 0.5
            ? C.teal
            : "#6080d0",
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle =
          p.color +
          Math.round(p.alpha * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.y < -4) {
          p.y = canvas.height + 4
          p.x = Math.random() * canvas.width
        }
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
      })
      // Draw subtle connection lines
      pts.forEach((a, i) => {
        pts.slice(i + 1, i + 5).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 80) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(100,140,220,${0.08 * (1 - d / 80)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

/* ─── Ember orb decoration ─── */
function EmberOrb({
  size = 200,
  opacity = 0.12,
}: {
  size?: number
  opacity?: number
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${C.ember} 0%, transparent 70%)`,
        opacity,
        filter: "blur(40px)",
      }}
    />
  )
}

/* ─── Stat counter ─── */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-display font-bold text-2xl"
        style={{ color: C.ivory }}
      >
        {value}
      </div>
      <div
        className="text-xs uppercase tracking-widest mt-0.5"
        style={{ color: C.sage, fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </div>
  )
}

/* ─── Landing Page ─── */
function LandingPage({ onNav }: { onNav: (v: View) => void }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible")
        })
      },
      { threshold: 0.15 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div
      className="overflow-x-hidden"
      style={{ background: C.ivory, color: C.graphite }}
    >
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 40 ? `${C.navy}f2` : "transparent",
          backdropFilter: scrollY > 40 ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded"
              style={{
                background: `linear-gradient(135deg, ${C.ember}, ${C.navyLight})`,
              }}
            />
            <span
              className="font-display font-bold text-sm tracking-wide"
              style={{ color: C.ivory }}
            >
              GEPS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Product", "How it works", "Responsible AI", "About"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm transition-colors hover:opacity-100 opacity-70"
                  style={{ color: C.ivory, fontFamily: "var(--font-body)" }}
                >
                  {item}
                </a>
              ),
            )}
          </div>
          <button
            onClick={() => onNav("login")}
            className="px-5 py-2 rounded text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: C.ember,
              color: C.ivory,
              fontFamily: "var(--font-display)",
            }}
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: C.navy }}
      >
        <ParticleCanvas />
        <EmberOrb size={500} opacity={0.08} />
        <div
          className="absolute top-40 right-0 w-96 h-96"
          style={{ transform: "translate(30%,-20%)" }}
        >
          <EmberOrb size={400} opacity={0.12} />
        </div>

        {/* Glowing human silhouette SVG */}
        <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <svg width="320" height="480" viewBox="0 0 320 480" fill="none">
            <ellipse
              cx="160"
              cy="70"
              rx="45"
              ry="48"
              stroke={C.tealLight}
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <path
              d="M120 120 Q100 200 90 320 L160 310 L230 320 Q220 200 200 120 Z"
              stroke={C.tealLight}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 3"
            />
            <path
              d="M90 180 Q50 200 40 260"
              stroke={C.ember}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.6"
            />
            <path
              d="M230 180 Q270 200 280 260"
              stroke={C.ember}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.6"
            />
            {[...Array(12)].map((_, i) => (
              <circle
                key={i}
                cx={80 + Math.sin(i * 0.9) * 100 + 80}
                cy={60 + i * 34}
                r={2 + Math.random()}
                fill={i % 3 === 0 ? C.ember : C.tealLight}
                opacity={0.7}
              />
            ))}
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <p
            className="font-mono text-xs tracking-widest mb-6 opacity-60"
            style={{ color: C.sage }}
          >
            GRADUATE EMPLOYABILITY PREDICTION SYSTEM
          </p>
          <h1
            className="font-display font-black leading-none mb-6"
            style={{
              fontSize: "clamp(42px, 6vw, 88px)",
              color: C.ivory,
              maxWidth: "14ch",
            }}
          >
            GRADUATE
            <br />
            EMPLOYABILITY,
            <br />
            <span style={{ color: C.ember }}>BEFORE IT'S</span>
            <br />
            TOO LATE.
          </h1>
          <p
            className="text-lg leading-relaxed mb-10 max-w-xl opacity-80"
            style={{ color: C.ivory }}
          >
            Turn fragmented student data into early, explainable employability
            insights — and give advisors the information they need to act.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNav("login")}
              className="px-8 py-3.5 rounded font-display font-semibold text-sm tracking-wide transition-all hover:opacity-90 hover:translate-y-px"
              style={{ background: C.ember, color: C.ivory }}
            >
              Explore the system →
            </button>
            <button
              className="px-8 py-3.5 rounded font-display font-semibold text-sm tracking-wide transition-all hover:opacity-80"
              style={{
                border: `1px solid rgba(245,241,232,0.25)`,
                color: C.ivory,
                background: "transparent",
              }}
            >
              See how it works
            </button>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-10 mt-16 pt-10 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <StatBadge value="1,240" label="Students monitored" />
            <StatBadge value="180" label="Need attention now" />
            <StatBadge value="72%" label="Intervention success" />
            <StatBadge value="14 mo" label="Ahead of graduation" />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section
        className="py-28 reveal"
        style={{ background: C.graphite, color: C.ivory }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <p className="font-mono text-xs tracking-widest mb-6 opacity-50">
              THE PROBLEM
            </p>
            <h2
              className="font-display font-black mb-12"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.05 }}
            >
              "The problem isn't a lack of
              <br />
              student data. It's knowing{" "}
              <em style={{ fontStyle: "normal", color: C.ember }}>when</em>
              <br />
              that data should trigger action."
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                label: "Academic Data",
                sub: "GPA trend · credits · retakes · core course performance",
                icon: "📊",
              },
              {
                label: "Engagement Data",
                sub: "LMS activity · participation · assignment completion",
                icon: "🔗",
              },
              {
                label: "Placement Data",
                sub: "Internship · WIL exposure · project portfolio · skills",
                icon: "🎯",
              },
            ].map((d, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border transition-all hover:border-opacity-60"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div className="text-2xl mb-3">{d.icon}</div>
                <div className="font-mono text-xs tracking-widest mb-2 opacity-50">{`0${i + 1}`}</div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {d.label}
                </h3>
                <p className="text-sm opacity-60 leading-relaxed">{d.sub}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 p-6 rounded-lg border text-center"
            style={{ borderColor: C.ember + "44", background: C.ember + "11" }}
          >
            <div
              className="font-mono text-xs tracking-widest mb-2"
              style={{ color: C.ember }}
            >
              CONVERGES INTO
            </div>
            <div className="font-display font-bold text-2xl">
              Employability Insight
            </div>
            <div className="text-sm opacity-60 mt-1">
              Ranked · Explained · Actionable
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="py-28 reveal" style={{ background: C.navy }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="font-mono text-xs tracking-widest mb-4 opacity-50"
            style={{ color: C.sage }}
          >
            FROM DATA TO ACTION
          </p>
          <h2
            className="font-display font-black mb-16"
            style={{ fontSize: "clamp(24px, 3.5vw, 44px)", color: C.ivory }}
          >
            Six steps. One story.
          </h2>
          <div className="flex flex-wrap gap-0">
            {[
              {
                step: "01",
                label: "Student Data",
                desc: "Academic · Engagement · Career",
              },
              {
                step: "02",
                label: "Feature Intelligence",
                desc: "Trends · Ratios · Signals",
              },
              {
                step: "03",
                label: "AI Prediction",
                desc: "P(employed) · Confidence interval",
              },
              {
                step: "04",
                label: "Explanation",
                desc: "SHAP drivers · Plain language",
              },
              {
                step: "05",
                label: "Intervention",
                desc: "Advisor action · Case log",
              },
              {
                step: "06",
                label: "Outcome",
                desc: "Tracked · Feeds next model",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 min-w-40 p-5 border-r last:border-r-0"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: i === 2 ? C.ember + "18" : "transparent",
                }}
              >
                <div
                  className="font-mono text-xs opacity-40 mb-3"
                  style={{ color: C.sage }}
                >
                  {s.step}
                </div>
                <div
                  className="font-display font-bold mb-1 text-sm"
                  style={{ color: i === 2 ? C.ember : C.ivory }}
                >
                  {s.label}
                </div>
                <div className="text-xs opacity-50" style={{ color: C.sage }}>
                  {s.desc}
                </div>
                {i < 5 && (
                  <div
                    className="mt-4 text-xl opacity-30"
                    style={{ color: C.ember }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="py-28 reveal" style={{ background: C.ivory }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs tracking-widest mb-4 opacity-50">
                AI EMPLOYABILITY INSIGHT
              </p>
              <h2
                className="font-display font-black mb-6"
                style={{
                  fontSize: "clamp(24px, 3.5vw, 44px)",
                  lineHeight: 1.08,
                  color: C.navy,
                }}
              >
                One student.
                <br />
                Every signal that matters.
              </h2>
              <p className="text-base leading-relaxed opacity-70 mb-8">
                The system combines academic trajectory, engagement, and career
                readiness into a single explainable employability estimate —
                surfaced early enough for an advisor to act.
              </p>
              <button
                onClick={() => onNav("login")}
                className="px-6 py-3 rounded font-display font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: C.navy, color: C.ivory }}
              >
                View the dashboard →
              </button>
            </div>
            {/* Mini dashboard preview */}
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: C.graphite }}
            >
              <div
                className="px-5 py-4 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="text-xs font-mono opacity-40"
                  style={{ color: C.sage }}
                >
                  STUDENT EMPLOYABILITY PROFILE
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="font-display font-bold text-white text-lg">
                      Alex M.
                    </div>
                    <div
                      className="text-xs opacity-50 mt-0.5"
                      style={{ color: C.sage }}
                    >
                      BSc Information Systems · Year 3 of 4
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-display font-black text-4xl"
                      style={{ color: C.ember }}
                    >
                      34%
                    </div>
                    <div
                      className="text-xs opacity-50 mt-0.5"
                      style={{ color: C.sage }}
                    >
                      EMPLOYABILITY ESTIMATE
                    </div>
                    <div
                      className="mt-1 px-2 py-0.5 rounded text-xs font-mono inline-block"
                      style={{ background: C.ember + "22", color: C.ember }}
                    >
                      HIGH PRIORITY
                    </div>
                  </div>
                </div>
                {/* Signals */}
                <div className="space-y-2">
                  {[
                    { label: "GPA Trend", val: "↓ Declining", color: C.ember },
                    {
                      label: "Internship",
                      val: "Not completed",
                      color: C.ember,
                    },
                    {
                      label: "LMS Engagement",
                      val: "Low (18th pct)",
                      color: "#D4A843",
                    },
                    {
                      label: "Project Portfolio",
                      val: "2 projects",
                      color: "#D4A843",
                    },
                  ].map((sig) => (
                    <div
                      key={sig.label}
                      className="flex justify-between items-center py-2 border-b"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                      <span
                        className="text-xs opacity-60"
                        style={{
                          color: C.sage,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {sig.label}
                      </span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: sig.color,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {sig.val}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 p-3 rounded"
                  style={{
                    background: C.ember + "18",
                    border: `1px solid ${C.ember}33`,
                  }}
                >
                  <div className="text-xs font-mono" style={{ color: C.ember }}>
                    RECOMMENDED INTERVENTION
                  </div>
                  <div
                    className="text-sm font-display font-semibold mt-1"
                    style={{ color: C.ivory }}
                  >
                    Internship Placement Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUMAN IN THE LOOP */}
      <section className="py-28 reveal" style={{ background: C.navy }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p
            className="font-mono text-xs tracking-widest mb-6 opacity-40"
            style={{ color: C.sage }}
          >
            HUMAN-IN-THE-LOOP
          </p>
          <h2
            className="font-display font-black mb-6"
            style={{
              fontSize: "clamp(28px, 4.5vw, 64px)",
              color: C.ivory,
              lineHeight: 1.05,
            }}
          >
            "AI identifies the signal.
            <br />
            <span style={{ color: C.ember }}>People decide</span> the response."
          </h2>
          <p
            className="max-w-2xl mx-auto text-base opacity-60 leading-relaxed mb-12"
            style={{ color: C.ivory }}
          >
            The system prioritises students for advisor attention based on data
            patterns. It never automatically decides a student's future, denies
            them support, or replaces the professional judgment of an advisor.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "EXPLAINABLE",
                icon: "◎",
                desc: "Every prediction comes with a plain-language explanation of which factors are driving it and how strongly.",
              },
              {
                title: "FAIR",
                icon: "⊜",
                desc: "Model performance is audited across student groups. A model that fails the fairness gate cannot be deployed.",
              },
              {
                title: "HUMAN-LED",
                icon: "◇",
                desc: "Advisors review, decide, and record. The AI supports. The human is accountable and in control.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="p-6 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-2xl mb-3" style={{ color: C.ember }}>
                  {c.icon}
                </div>
                <div
                  className="font-mono text-xs tracking-widest mb-2 opacity-60"
                  style={{ color: C.sage }}
                >
                  {c.title}
                </div>
                <p
                  className="text-sm leading-relaxed opacity-70"
                  style={{ color: C.ivory }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT-IF PREVIEW */}
      <section className="py-28 reveal" style={{ background: C.graphite }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* What-if card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: C.navy,
                border: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="font-mono text-xs opacity-40 mb-1"
                  style={{ color: C.sage }}
                >
                  WHAT-IF INTERVENTION SIMULATOR
                </div>
                <div className="font-display font-bold text-white">
                  What could change if we act now?
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div
                  className="flex items-center justify-between py-3 px-4 rounded"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="text-sm font-mono" style={{ color: C.sage }}>
                    Current estimate
                  </span>
                  <span
                    className="font-display font-black text-2xl"
                    style={{ color: C.ember }}
                  >
                    34%
                  </span>
                </div>
                {[
                  {
                    action: "Complete internship",
                    from: 34,
                    to: 58,
                    active: true,
                  },
                  {
                    action: "Build portfolio",
                    from: 34,
                    to: 46,
                    active: false,
                  },
                  {
                    action: "Mentorship programme",
                    from: 34,
                    to: 43,
                    active: false,
                  },
                ].map((item) => (
                  <div
                    key={item.action}
                    className="p-4 rounded border"
                    style={{
                      borderColor: item.active
                        ? C.teal + "66"
                        : "rgba(255,255,255,0.06)",
                      background: item.active ? C.teal + "11" : "transparent",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: C.ivory }}>
                        {item.action}
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{ color: item.active ? C.tealLight : C.sage }}
                      >
                        {item.from}% →{" "}
                        <strong
                          style={{ color: item.active ? C.tealLight : C.ivory }}
                        >
                          {item.to}%
                        </strong>
                      </span>
                    </div>
                    {item.active && (
                      <div
                        className="mt-2 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${item.to}%`,
                            background: C.tealLight,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <p
                  className="text-xs italic opacity-40"
                  style={{ color: C.sage, fontFamily: "var(--font-mono)" }}
                >
                  Estimated scenarios — not causal guarantees.
                </p>
              </div>
            </div>
            <div>
              <p
                className="font-mono text-xs tracking-widest mb-4 opacity-50"
                style={{ color: C.sage }}
              >
                WHAT-IF SIMULATOR
              </p>
              <h2
                className="font-display font-black mb-6"
                style={{
                  fontSize: "clamp(24px, 3.5vw, 44px)",
                  lineHeight: 1.08,
                  color: C.ivory,
                }}
              >
                Model the impact of every intervention.
              </h2>
              <p
                className="text-base leading-relaxed opacity-60 mb-8"
                style={{ color: C.ivory }}
              >
                Advisors can model estimated changes to a student's
                employability trajectory by toggling actionable interventions —
                helping them prioritise where support will have the most impact.
              </p>
              <button
                onClick={() => onNav("login")}
                className="px-6 py-3 rounded font-display font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: C.ember, color: C.ivory }}
              >
                Explore the simulator →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-36 relative overflow-hidden"
        style={{ background: C.navy }}
      >
        <EmberOrb size={600} opacity={0.1} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p
            className="font-mono text-xs tracking-widest mb-8 opacity-40"
            style={{ color: C.sage }}
          >
            DON'T WAIT
          </p>
          <h2
            className="font-display font-black mb-6"
            style={{
              fontSize: "clamp(32px, 5vw, 72px)",
              color: C.ivory,
              lineHeight: 1.02,
            }}
          >
            "Don't wait for the
            <br />
            graduate tracer report."
          </h2>
          <p className="text-lg opacity-60 mb-10" style={{ color: C.ivory }}>
            Act while there is still time to change the trajectory.
          </p>
          <button
            onClick={() => onNav("login")}
            className="px-10 py-4 rounded font-display font-bold text-base transition-all hover:opacity-90"
            style={{ background: C.ember, color: C.ivory }}
          >
            Explore the platform →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t"
        style={{
          background: C.graphite,
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className="font-mono text-xs opacity-30"
            style={{ color: C.sage }}
          >
            GEPS · Graduate Employability Prediction System
          </div>
          <div
            className="font-mono text-xs opacity-30"
            style={{ color: C.sage }}
          >
            AI supports advisors. Advisors decide.
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Login Page ─── */
function LoginPage({ onNav }: { onNav: (v: View) => void }) {
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: C.navy }}
    >
      {/* Left: brand panel */}
      <div
        className="relative overflow-hidden flex flex-col justify-between p-12 hidden lg:flex"
        style={{
          background: `linear-gradient(135deg, ${C.navy} 60%, ${C.navyMid})`,
        }}
      >
        <ParticleCanvas />
        <EmberOrb size={400} opacity={0.12} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-24">
            <div
              className="w-8 h-8 rounded"
              style={{
                background: `linear-gradient(135deg, ${C.ember}, ${C.navyLight})`,
              }}
            />
            <span
              className="font-display font-bold tracking-wide"
              style={{ color: C.ivory }}
            >
              GEPS
            </span>
          </div>
        </div>
        <div className="relative">
          <p
            className="font-mono text-xs tracking-widest mb-4 opacity-40"
            style={{ color: C.sage }}
          >
            EARLY INTELLIGENCE
          </p>
          <h2
            className="font-display font-black text-4xl leading-tight mb-4"
            style={{ color: C.ivory }}
          >
            Turn student data
            <br />
            into timely action.
          </h2>
          <p
            className="text-sm opacity-50 leading-relaxed"
            style={{ color: C.ivory }}
          >
            A decision-support system for universities that identifies students
            who may need employability support — early enough to make a
            difference.
          </p>
          <div
            className="flex gap-8 mt-12 pt-8 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <StatBadge value="1,240" label="Students" />
            <StatBadge value="180" label="High priority" />
            <StatBadge value="72%" label="Outcomes improved" />
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div
        className="flex items-center justify-center p-8"
        style={{ background: C.ivoryDark }}
      >
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1
              className="font-display font-black text-3xl mb-2"
              style={{ color: C.navy }}
            >
              Welcome back
            </h1>
            <p className="text-sm opacity-60">
              Sign in to your institutional account
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              onNav("dashboard")
            }}
            className="space-y-5"
          >
            <div>
              <label
                className="block font-mono text-xs tracking-widest mb-2 opacity-60"
                style={{ color: C.graphite }}
              >
                INSTITUTIONAL EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@university.ac.za"
                className="w-full px-4 py-3 rounded border text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: C.white,
                  borderColor: "rgba(13,27,82,0.15)",
                  color: C.graphite,
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
            <div>
              <label
                className="block font-mono text-xs tracking-widest mb-2 opacity-60"
                style={{ color: C.graphite }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded border text-sm outline-none transition-all"
                style={{
                  background: C.white,
                  borderColor: "rgba(13,27,82,0.15)",
                  color: C.graphite,
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs opacity-60">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="text-xs" style={{ color: C.ember }}>
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded font-display font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: C.navy, color: C.ivory }}
            >
              Sign in to GEPS
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs opacity-40">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
              style={{ background: C.teal, color: C.ivory }}
            >
              🔒
            </div>
            <span>Protected institutional access — authorised users only</span>
          </div>

          <button
            onClick={() => onNav("landing")}
            className="mt-6 text-xs opacity-40 hover:opacity-70 transition-opacity"
          >
            ← Back to site
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Sidebar ─── */
const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: "⊞" },
  { id: "queue", label: "Student Queue", icon: "⋮⋮" },
  { id: "cases", label: "Cases", icon: "◻" },
  { id: "analytics", label: "Program Analytics", icon: "▲" },
  { id: "reports", label: "Reports", icon: "☰" },
]
const NAV_ADMIN = [
  { id: "fairness", label: "Fairness & Equity", icon: "⊜" },
  { id: "whatif", label: "Simulator", icon: "◈" },
]

function Sidebar({
  current,
  onNav,
}: {
  current: View
  onNav: (v: View) => void
}) {
  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col thin-scroll overflow-y-auto"
      style={{
        background: C.graphite,
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 border-b flex items-center gap-3"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="w-7 h-7 rounded flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${C.ember}, ${C.navyLight})`,
          }}
        />
        <div>
          <div
            className="font-display font-bold text-sm"
            style={{ color: C.ivory }}
          >
            GEPS
          </div>
          <div
            className="font-mono text-xs opacity-30"
            style={{ color: C.sage }}
          >
            Advisor Portal
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4">
        <p
          className="font-mono text-xs px-2 mb-2 opacity-30"
          style={{ color: C.sage }}
        >
          MAIN
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id as View)}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 text-sm transition-all"
            style={{
              background: current === item.id ? C.navy : "transparent",
              color: current === item.id ? C.ivory : C.sage,
              fontFamily: "var(--font-body)",
            }}
          >
            <span className="text-base w-5 text-center opacity-70">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <p
          className="font-mono text-xs px-2 mb-2 mt-6 opacity-30"
          style={{ color: C.sage }}
        >
          ADMIN
        </p>
        {NAV_ADMIN.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id as View)}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 text-sm transition-all"
            style={{
              background: current === item.id ? C.navy : "transparent",
              color: current === item.id ? C.ivory : C.sage,
              fontFamily: "var(--font-body)",
            }}
          >
            <span className="text-base w-5 text-center opacity-70">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: C.teal, color: C.ivory }}
          >
            SM
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: C.ivory }}>
              Sarah M.
            </div>
            <div
              className="font-mono text-xs opacity-40"
              style={{ color: C.sage }}
            >
              Career Advisor
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

/* ─── Top bar ─── */
function Topbar({ title, onNav }: { title: string; onNav: (v: View) => void }) {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ background: C.graphite, borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="font-display font-semibold text-sm"
        style={{ color: C.ivory }}
      >
        {title}
      </div>
      <div className="flex items-center gap-4">
        <div
          className="px-3 py-1.5 rounded flex items-center gap-2 text-xs"
          style={{ background: "rgba(255,255,255,0.04)", color: C.sage }}
        >
          <span>🔍</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            Search students...
          </span>
        </div>
        <div className="relative">
          <span
            className="text-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: C.ivory }}
          >
            🔔
          </span>
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center"
            style={{ background: C.ember, color: C.ivory, fontSize: "9px" }}
          >
            3
          </span>
        </div>
        <button
          onClick={() => onNav("landing")}
          className="font-mono text-xs opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: C.sage }}
        >
          ← Site
        </button>
      </div>
    </header>
  )
}

/* ─── Metric Card ─── */
function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div
      className="p-5 rounded-lg border"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="font-mono text-xs tracking-widest opacity-40 mb-2"
        style={{ color: C.sage }}
      >
        {label}
      </div>
      <div
        className="font-display font-black text-3xl"
        style={{ color: accent || C.ivory }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs opacity-50 mt-1" style={{ color: C.sage }}>
          {sub}
        </div>
      )}
    </div>
  )
}

/* ─── Advisor Dashboard ─── */
const gpaData = [
  { sem: "Y1S1", avg: 68 },
  { sem: "Y1S2", avg: 66 },
  { sem: "Y2S1", avg: 64 },
  { sem: "Y2S2", avg: 61 },
  { sem: "Y3S1", avg: 58 },
]
const riskData = [
  { name: "High", value: 180, color: C.ember },
  { name: "Medium", value: 326, color: "#D4A843" },
  { name: "Low", value: 734, color: C.tealLight },
]
const interventionData = [
  { name: "Aug", completed: 14, active: 22 },
  { name: "Sep", completed: 28, active: 38 },
  { name: "Oct", completed: 41, active: 45 },
  { name: "Nov", completed: 52, active: 48 },
]

function AdvisorDashboard({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1
            className="font-display font-black text-3xl mb-1"
            style={{ color: C.ivory }}
          >
            Good morning, Sarah
          </h1>
          <p className="font-mono text-xs opacity-40" style={{ color: C.sage }}>
            Department of Information Systems ·{" "}
            {new Date().toLocaleDateString("en-ZA", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <div
            className="font-mono text-xs opacity-40 mb-1"
            style={{ color: C.sage }}
          >
            YOUR QUEUE THIS WEEK
          </div>
          <div
            className="font-display font-black text-2xl"
            style={{ color: C.ember }}
          >
            18
          </div>
        </div>
      </div>

      {/* Main call-to-action */}
      <div
        className="rounded-lg border p-6 mb-6 cursor-pointer transition-all hover:border-opacity-60"
        style={{ borderColor: C.ember + "44", background: C.ember + "08" }}
        onClick={() => onNav("queue")}
      >
        <div className="flex items-start justify-between">
          <div>
            <div
              className="font-display font-bold text-lg mb-1"
              style={{ color: C.ivory }}
            >
              Review your prioritized queue
            </div>
            <p className="text-sm opacity-60" style={{ color: C.sage }}>
              180 students need attention today, sorted by risk. Average review
              time: 2-3 minutes per student.
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="text-3xl opacity-40">→</div>
          </div>
        </div>
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="STUDENTS MONITORED"
          value="1,240"
          sub="This cohort"
        />
        <MetricCard
          label="🔴 HIGH PRIORITY"
          value="180"
          sub="Act this week"
          accent={C.ember}
        />
        <MetricCard
          label="🟡 MEDIUM PRIORITY"
          value="326"
          sub="Monitor closely"
          accent="#D4A843"
        />
        <MetricCard
          label="ACTIVE INTERVENTIONS"
          value="214"
          sub="In progress"
          accent={C.tealLight}
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Pie / risk */}
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            RISK DISTRIBUTION
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                stroke="none"
              >
                {riskData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [`${v} students`]}
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: C.sage }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: d.color }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* GPA trend */}
        <div
          className="rounded-lg border p-5 col-span-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            COHORT EMPLOYABILITY TREND (AVG SCORE)
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart
              data={gpaData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.tealLight} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.tealLight} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="sem"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
                domain={[50, 75]}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 12,
                }}
                labelStyle={{ color: C.sage }}
                itemStyle={{ color: C.tealLight }}
              />
              <Area
                type="monotone"
                dataKey="avg"
                stroke={C.tealLight}
                strokeWidth={2}
                fill="url(#tealGrad)"
                dot={{ fill: C.tealLight, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Students requiring attention + intervention progress */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Students */}
        <div
          className="col-span-2 rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className="font-mono text-xs tracking-widest opacity-40"
              style={{ color: C.sage }}
            >
              STUDENTS REQUIRING ATTENTION
            </div>
            <button
              onClick={() => onNav("queue")}
              className="text-xs hover:opacity-80 transition-opacity"
              style={{ color: C.ember }}
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {[
              {
                id: "#4F91A20C",
                prog: "Information Systems",
                year: 3,
                score: 34,
                priority: "HIGH",
                signals: ["GPA declining", "No internship", "Low engagement"],
              },
              {
                id: "#A821C91",
                prog: "Software Engineering",
                year: 2,
                score: 41,
                priority: "HIGH",
                signals: ["GPA trend ↓", "Low LMS activity"],
              },
              {
                id: "#D921F02",
                prog: "Business",
                year: 3,
                score: 52,
                priority: "MED",
                signals: ["Low engagement"],
              },
            ].map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between p-4 rounded border cursor-pointer hover:border-opacity-60 transition-all"
                style={{
                  borderColor:
                    s.priority === "HIGH"
                      ? C.ember + "44"
                      : "rgba(255,255,255,0.07)",
                  background:
                    s.priority === "HIGH" ? C.ember + "08" : "transparent",
                }}
                onClick={() => onNav("profile")}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: C.ivory }}
                    >
                      {s.id}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{
                        background:
                          s.priority === "HIGH" ? C.ember + "22" : "#D4A84322",
                        color: s.priority === "HIGH" ? C.ember : "#D4A843",
                      }}
                    >
                      {s.priority}
                    </span>
                  </div>
                  <div
                    className="text-xs opacity-50 mb-2"
                    style={{ color: C.sage }}
                  >
                    {s.prog} · Year {s.year}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.signals.map((sig) => (
                      <span
                        key={sig}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: C.sage,
                        }}
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div
                    className="font-display font-black text-2xl"
                    style={{
                      color: s.priority === "HIGH" ? C.ember : "#D4A843",
                    }}
                  >
                    {s.score}%
                  </div>
                  <div
                    className="font-mono text-xs opacity-40"
                    style={{ color: C.sage }}
                  >
                    est.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Intervention progress */}
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            INTERVENTION PROGRESS
          </div>
          <div className="space-y-4 mb-6">
            {[
              { label: "Active", count: 214, color: C.tealLight },
              { label: "Completed", count: 86, color: C.sage },
              { label: "Follow-up", count: 42, color: "#D4A843" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: C.sage }}>{item.label}</span>
                  <span
                    style={{
                      color: item.color,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.count}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.count / 342) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={interventionData}
              margin={{ left: -20, right: 5, top: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                }}
              />
              <Bar
                dataKey="completed"
                fill={C.tealLight}
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="active"
                fill={C.ember + "88"}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          {/* Recent activity */}
          <div
            className="mt-4 pt-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-30 mb-3"
              style={{ color: C.sage }}
            >
              RECENT
            </div>
            {[
              "Advisor reviewed Student #203",
              "Internship intervention assigned",
              "Student #421 moved to follow-up",
            ].map((a, i) => (
              <div
                key={i}
                className="text-xs opacity-50 mb-1.5"
                style={{ color: C.sage }}
              >
                • {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Student Queue ─── */
const QUEUE_DATA = [
  {
    id: "#4F91A20C",
    name: "A. Mokoena",
    prog: "Information Systems",
    year: 3,
    score: 34,
    priority: "HIGH",
    signal: "No internship",
    review: "2 days ago",
  },
  {
    id: "#A821C91A",
    name: "T. Nkosi",
    prog: "Software Engineering",
    year: 2,
    score: 41,
    priority: "HIGH",
    signal: "GPA declining",
    review: "4 days ago",
  },
  {
    id: "#D921F02B",
    name: "F. Osei",
    prog: "Business Management",
    year: 3,
    score: 52,
    priority: "MED",
    signal: "Low engagement",
    review: "1 week ago",
  },
  {
    id: "#C120A88C",
    name: "B. Dlamini",
    prog: "Computer Science",
    year: 4,
    score: 67,
    priority: "MED",
    signal: "Portfolio gap",
    review: "3 days ago",
  },
  {
    id: "#E334B11D",
    name: "C. Abara",
    prog: "Information Systems",
    year: 2,
    score: 71,
    priority: "LOW",
    signal: "Credit shortfall",
    review: "5 days ago",
  },
  {
    id: "#F445C22E",
    name: "M. Sithole",
    prog: "Software Engineering",
    year: 3,
    score: 44,
    priority: "HIGH",
    signal: "No internship · Low GPA",
    review: "Today",
  },
  {
    id: "#G556D33F",
    name: "P. Asamoah",
    prog: "Data Science",
    year: 2,
    score: 58,
    priority: "MED",
    signal: "Engagement trend ↓",
    review: "2 days ago",
  },
]

function StudentQueue({ onNav }: { onNav: (v: View) => void }) {
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState("ALL")

  const filtered = QUEUE_DATA.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.prog.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    const matchPriority = priority === "ALL" || s.priority === priority
    return matchSearch && matchPriority
  })

  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <div className="mb-6">
        <h1
          className="font-display font-black text-2xl mb-1"
          style={{ color: C.ivory }}
        >
          Students Requiring Attention
        </h1>
        <p className="font-mono text-xs opacity-40" style={{ color: C.sage }}>
          {filtered.length} students · sorted by priority
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID or programme..."
          className="px-4 py-2 rounded border text-sm outline-none flex-1 min-w-48"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.1)",
            color: C.ivory,
            fontFamily: "var(--font-body)",
          }}
        />
        {["ALL", "HIGH", "MED", "LOW"].map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className="px-4 py-2 rounded border text-xs font-mono transition-all"
            style={{
              background: priority === p ? C.ember : "transparent",
              borderColor: priority === p ? C.ember : "rgba(255,255,255,0.1)",
              color: priority === p ? C.ivory : C.sage,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                "Student",
                "Programme",
                "Yr",
                "Estimate",
                "Priority",
                "Main Signal",
                "Last Review",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs tracking-widest opacity-40"
                  style={{ color: C.sage }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr
                key={s.id}
                className="border-b cursor-pointer transition-all hover:bg-white hover:bg-opacity-5"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
                onClick={() => onNav("profile")}
              >
                <td className="px-4 py-3">
                  <div
                    className="font-mono text-xs font-bold"
                    style={{ color: C.ivory }}
                  >
                    {s.id}
                  </div>
                  <div
                    className="text-xs opacity-50 mt-0.5"
                    style={{ color: C.sage }}
                  >
                    {s.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sage }}>
                  {s.prog}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {s.year}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-display font-black text-lg"
                    style={{
                      color:
                        s.score < 45
                          ? C.ember
                          : s.score < 65
                            ? "#D4A843"
                            : C.tealLight,
                    }}
                  >
                    {s.score}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background:
                        s.priority === "HIGH"
                          ? C.ember + "22"
                          : s.priority === "MED"
                            ? "#D4A84322"
                            : C.tealLight + "22",
                      color:
                        s.priority === "HIGH"
                          ? C.ember
                          : s.priority === "MED"
                            ? "#D4A843"
                            : C.tealLight,
                    }}
                  >
                    {s.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sage }}>
                  {s.signal}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs opacity-50"
                  style={{ color: C.sage }}
                >
                  {s.review}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="px-3 py-1 rounded text-xs font-medium transition-all hover:opacity-90"
                    style={{ background: C.navy, color: C.ivory }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onNav("profile")
                    }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Student Profile ─── */
const academicData = [
  { sem: "Y1S1", gpa: 3.4 },
  { sem: "Y1S2", gpa: 3.2 },
  { sem: "Y2S1", gpa: 3.1 },
  { sem: "Y2S2", gpa: 2.8 },
  { sem: "Y3S1", gpa: 2.6 },
]
const engagementData = [
  { wk: "Wk1", sessions: 3.2 },
  { wk: "Wk2", sessions: 2.8 },
  { wk: "Wk3", sessions: 2.1 },
  { wk: "Wk4", sessions: 1.6 },
  { wk: "Wk5", sessions: 1.2 },
  { wk: "Wk6", sessions: 1.0 },
]

function StudentProfile({ onNav }: { onNav: (v: View) => void }) {
  const [caseCreated, setCaseCreated] = useState(false)
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [newCaseId, setNewCaseId] = useState<string>("")

  const handleCaseSubmit = (form: CreateCaseForm) => {
    const caseNum = `CASE-${String(CASES.length + 1).padStart(3, "0")}`
    setNewCaseId(caseNum)
    setCaseCreated(true)
    setShowCaseModal(false)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.teal}, ${C.navy})`,
              color: C.ivory,
            }}
          >
            AM
          </div>
          <div>
            <h1
              className="font-display font-black text-2xl"
              style={{ color: C.ivory }}
            >
              Alex M.
            </h1>
            <div
              className="font-mono text-xs opacity-40 mt-0.5"
              style={{ color: C.sage }}
            >
              BSc Information Systems · Year 3 of 4 · ID: #4F91A20C
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNav("explainability")}
            className="px-4 py-2 rounded text-sm font-medium border transition-all hover:border-opacity-60"
            style={{ borderColor: "rgba(255,255,255,0.12)", color: C.sage }}
          >
            Why prioritised? →
          </button>
          <button
            onClick={() => onNav("whatif")}
            className="px-4 py-2 rounded text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: C.navy,
              color: C.ivory,
              borderColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Model impact →
          </button>
        </div>
      </div>

      {caseCreated && (
        <div
          className="p-4 rounded-lg border mb-6 flex items-center justify-between"
          style={{
            borderColor: C.tealLight + "44",
            background: C.tealLight + "11",
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: C.tealLight }}>✓</span>
            <div>
              <div
                className="font-display font-semibold text-sm"
                style={{ color: C.ivory }}
              >
                Intervention case created
              </div>
              <div
                className="font-mono text-xs opacity-50"
                style={{ color: C.sage }}
              >
                {newCaseId} · Intervention logged
              </div>
            </div>
          </div>
          <button
            onClick={() => onNav("cases")}
            className="text-xs"
            style={{ color: C.tealLight }}
          >
            View case →
          </button>
        </div>
      )}

      {/* Score + priority */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className="col-span-2 p-6 rounded-lg border"
          style={{ borderColor: C.ember + "44", background: C.ember + "08" }}
        >
          <div className="flex items-end gap-4 mb-2">
            <div
              className="font-display font-black"
              style={{ fontSize: 56, lineHeight: 1, color: C.ember }}
            >
              34%
            </div>
            <div className="mb-2">
              <div
                className="px-2 py-0.5 rounded font-mono text-xs inline-block mb-1"
                style={{ background: C.ember + "22", color: C.ember }}
              >
                HIGH PRIORITY
              </div>
              <div
                className="font-mono text-xs opacity-40 block"
                style={{ color: C.sage }}
              >
                EMPLOYABILITY ESTIMATE
              </div>
            </div>
          </div>
          <p className="font-mono text-xs opacity-30" style={{ color: C.sage }}>
            Estimate — not a guaranteed outcome · CI: 27% – 41%
          </p>
        </div>
        <MetricCard
          label="GPA THIS SEM"
          value="2.6"
          sub="Declining trend"
          accent={C.ember}
        />
        <MetricCard
          label="INTERNSHIP"
          value="None"
          sub="Not completed"
          accent={C.ember}
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-3"
            style={{ color: C.sage }}
          >
            ACADEMIC TRAJECTORY
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart
              data={academicData}
              margin={{ left: -20, right: 5, top: 5, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="sem"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
                domain={[2, 4]}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                }}
                itemStyle={{ color: C.ember }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke={C.ember}
                strokeWidth={2}
                dot={{ fill: C.ember, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-3"
            style={{ color: C.sage }}
          >
            LMS ENGAGEMENT (SESSIONS/WEEK)
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={engagementData}
              margin={{ left: -20, right: 5, top: 5, bottom: 0 }}
            >
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.ember} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.ember} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="wk"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                }}
                itemStyle={{ color: C.ember }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke={C.ember}
                strokeWidth={2}
                fill="url(#engGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Career readiness */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Internship",
            value: "Not completed",
            status: "risk",
            icon: "◎",
          },
          {
            label: "Projects",
            value: "2 completed",
            status: "warn",
            icon: "◻",
          },
          {
            label: "Portfolio",
            value: "Needs improvement",
            status: "risk",
            icon: "◈",
          },
          {
            label: "Skills verified",
            value: "6 skills",
            status: "ok",
            icon: "✓",
          },
          {
            label: "Co-curricular",
            value: "None recorded",
            status: "risk",
            icon: "◇",
          },
          {
            label: "Credit completion",
            value: "78% (84/108)",
            status: "warn",
            icon: "⊞",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-lg border"
            style={{
              borderColor:
                item.status === "risk"
                  ? C.ember + "33"
                  : item.status === "warn"
                    ? "#D4A84333"
                    : C.tealLight + "33",
              background:
                item.status === "risk"
                  ? C.ember + "08"
                  : "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div
                  className="font-mono text-xs opacity-40 mb-1"
                  style={{ color: C.sage }}
                >
                  {item.label}
                </div>
                <div
                  className="font-display font-semibold text-sm"
                  style={{
                    color:
                      item.status === "risk"
                        ? C.ember
                        : item.status === "warn"
                          ? "#D4A843"
                          : C.tealLight,
                  }}
                >
                  {item.value}
                </div>
              </div>
              <span className="text-lg opacity-40">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk drivers + recommendation */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            MAJOR RISK DRIVERS
          </div>
          <div className="space-y-3">
            {[
              {
                driver: "GPA trend",
                impact: "High influence",
                pct: 85,
                color: C.ember,
              },
              {
                driver: "Internship not completed",
                impact: "High influence",
                pct: 90,
                color: C.ember,
              },
              {
                driver: "Low LMS engagement",
                impact: "Medium influence",
                pct: 60,
                color: "#D4A843",
              },
              {
                driver: "Limited project evidence",
                impact: "Medium influence",
                pct: 50,
                color: "#D4A843",
              },
              {
                driver: "No co-curricular activity",
                impact: "Low influence",
                pct: 30,
                color: C.sage,
              },
            ].map((d) => (
              <div key={d.driver}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: C.ivory }}>{d.driver}</span>
                  <span
                    style={{ color: d.color, fontFamily: "var(--font-mono)" }}
                  >
                    {d.impact}
                  </span>
                </div>
                <div
                  className="h-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.pct}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            RECOMMENDED INTERVENTIONS
          </div>
          {[
            {
              action: "Internship Placement Support",
              priority: "PRIMARY",
              desc: "Connect to employer network and internship placement programme before end of semester.",
            },
            {
              action: "Portfolio Development",
              priority: "SECONDARY",
              desc: "Assigned to skills workshop and project mentorship to strengthen portfolio.",
            },
            {
              action: "Academic Recovery Plan",
              priority: "SECONDARY",
              desc: "Academic advisor meeting recommended to address declining GPA trend.",
            },
          ].map((rec, i) => (
            <div
              key={i}
              className="mb-3 p-3 rounded border"
              style={{
                borderColor:
                  i === 0 ? C.ember + "44" : "rgba(255,255,255,0.07)",
                background: i === 0 ? C.ember + "08" : "transparent",
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className="font-display font-semibold text-sm"
                  style={{ color: C.ivory }}
                >
                  {rec.action}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: i === 0 ? C.ember : C.sage }}
                >
                  {rec.priority}
                </span>
              </div>
              <p
                className="text-xs opacity-50 leading-relaxed"
                style={{ color: C.sage }}
              >
                {rec.desc}
              </p>
            </div>
          ))}
          {!caseCreated && (
            <button
              onClick={() => setShowCaseModal(true)}
              className="w-full mt-2 py-2.5 rounded font-display font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: C.ember, color: C.ivory }}
            >
              Create intervention case
            </button>
          )}
        </div>
      </div>

      {showCaseModal && (
        <CaseCreationModal
          studentId="#4F91A20C"
          studentName="Alex M."
          onClose={() => setShowCaseModal(false)}
          onSubmit={handleCaseSubmit}
        />
      )}
    </div>
  )
}

/* ─── Explainability ─── */
function ExplainabilityPanel({ onNav }: { onNav: (v: View) => void }) {
  const shapData = [
    { factor: "No internship", impact: -0.19, dir: "neg" },
    { factor: "Falling GPA", impact: -0.11, dir: "neg" },
    { factor: "Low engagement", impact: -0.06, dir: "neg" },
    { factor: "No co-curricular", impact: -0.04, dir: "neg" },
    { factor: "Credit completion", impact: 0.08, dir: "pos" },
    { factor: "Relevant coursework", impact: 0.05, dir: "pos" },
  ].sort((a, b) => a.impact - b.impact)

  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => onNav("profile")}
          className="text-xs opacity-40 hover:opacity-80 transition-opacity"
          style={{ color: C.sage }}
        >
          ← Back to profile
        </button>
        <div className="w-px h-4 opacity-20" style={{ background: C.sage }} />
        <div className="font-mono text-xs opacity-40" style={{ color: C.sage }}>
          Alex M. · #4F91A20C
        </div>
      </div>

      <h1
        className="font-display font-black text-2xl mb-2"
        style={{ color: C.ivory }}
      >
        Why is this student prioritised?
      </h1>
      <p
        className="text-sm opacity-60 mb-8 max-w-2xl leading-relaxed"
        style={{ color: C.ivory }}
      >
        The factors below contributed to Alex's employability estimate. Bars
        show the relative influence of each signal — positive factors support
        employability, negative factors indicate areas of concern.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SHAP chart */}
        <div
          className="rounded-lg border p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            FACTOR CONTRIBUTION (SHAP VALUES)
          </div>
          <div className="space-y-3">
            {shapData.map((d) => (
              <div key={d.factor} className="flex items-center gap-3">
                <div
                  className="w-36 text-xs text-right flex-shrink-0"
                  style={{ color: C.sage }}
                >
                  {d.factor}
                </div>
                <div className="flex-1 relative h-6 flex items-center">
                  <div
                    className="absolute inset-y-0 left-1/2 w-px"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                  {d.dir === "neg" ? (
                    <div
                      className="absolute right-1/2 h-4 rounded-l"
                      style={{
                        width: `${Math.abs(d.impact) * 300}%`,
                        maxWidth: "50%",
                        background: C.ember,
                        opacity: 0.8,
                      }}
                    />
                  ) : (
                    <div
                      className="absolute left-1/2 h-4 rounded-r"
                      style={{
                        width: `${d.impact * 300}%`,
                        maxWidth: "50%",
                        background: C.tealLight,
                        opacity: 0.8,
                      }}
                    />
                  )}
                </div>
                <div
                  className="w-14 text-xs font-mono flex-shrink-0"
                  style={{ color: d.dir === "neg" ? C.ember : C.tealLight }}
                >
                  {d.impact > 0 ? "+" : ""}
                  {d.impact.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between mt-4 text-xs opacity-30"
            style={{ color: C.sage, fontFamily: "var(--font-mono)" }}
          >
            <span>← Increases risk</span>
            <span>Reduces risk →</span>
          </div>
        </div>

        {/* Plain language */}
        <div className="space-y-4">
          <div
            className="rounded-lg border p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-3"
              style={{ color: C.sage }}
            >
              PLAIN LANGUAGE EXPLANATION
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.ivory }}>
              Alex's current trajectory shows{" "}
              <strong style={{ color: C.ember }}>
                declining academic performance
              </strong>{" "}
              (GPA dropped from 3.4 to 2.6 over six semesters),{" "}
              <strong style={{ color: C.ember }}>
                no practical work experience
              </strong>{" "}
              (internship not completed), and{" "}
              <strong style={{ color: C.ember }}>low engagement</strong> with
              course materials. These signals are associated with an increased
              likelihood of requiring employability support after graduation.
            </p>
          </div>

          <div
            className="rounded-lg border p-5"
            style={{
              borderColor: C.tealLight + "33",
              background: C.tealLight + "08",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-3"
              style={{ color: C.sage }}
            >
              POSITIVE SIGNALS
            </div>
            {[
              {
                label: "Credit completion rate",
                detail: "78% — near target despite GPA decline",
              },
              {
                label: "Relevant coursework",
                detail:
                  "Strong performance in core IS modules in earlier years",
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-2 mb-2">
                <span style={{ color: C.tealLight }}>✓</span>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: C.ivory }}
                  >
                    {item.label}
                  </div>
                  <div className="text-xs opacity-50" style={{ color: C.sage }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg border p-5"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-3"
              style={{ color: C.sage }}
            >
              RECOMMENDED NEXT STEP
            </div>
            <div
              className="font-display font-semibold"
              style={{ color: C.ivory }}
            >
              Internship Placement Support
            </div>
            <p
              className="text-sm opacity-60 mt-1 mb-3"
              style={{ color: C.sage }}
            >
              Internship completion is the highest-impact actionable
              intervention for this student.
            </p>
            <button
              onClick={() => onNav("cases")}
              className="px-4 py-2 rounded text-sm font-medium transition-all hover:opacity-90"
              style={{ background: C.ember, color: C.ivory }}
            >
              Assign intervention
            </button>
          </div>

          <p
            className="text-xs italic opacity-30 leading-relaxed"
            style={{ color: C.sage, fontFamily: "var(--font-mono)" }}
          >
            This explanation reflects the model's trained patterns and should be
            used as a starting point for advisor judgment — not as a definitive
            diagnosis.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── What-If Simulator ─── */
function WhatIfSimulator() {
  const [internship, setInternship] = useState(false)
  const [portfolio, setPortfolio] = useState(false)
  const [mentorship, setMentorship] = useState(false)
  const [academic, setAcademic] = useState(false)

  const base = 34
  const score =
    base +
    (internship ? 24 : 0) +
    (portfolio ? 12 : 0) +
    (mentorship ? 9 : 0) +
    (academic ? 8 : 0)
  const capped = Math.min(score, 82)

  const toggles = [
    {
      label: "Complete internship",
      desc: "Highest-impact actionable intervention",
      state: internship,
      set: setInternship,
      gain: 24,
    },
    {
      label: "Build project portfolio",
      desc: "Targeted skills and project development programme",
      state: portfolio,
      set: setPortfolio,
      gain: 12,
    },
    {
      label: "Mentorship programme",
      desc: "Peer-to-peer mentoring with senior student or alumni",
      state: mentorship,
      set: setMentorship,
      gain: 9,
    },
    {
      label: "Academic recovery plan",
      desc: "Structured academic support to stabilise GPA",
      state: academic,
      set: setAcademic,
      gain: 8,
    },
  ]

  const beforeData = [{ name: "Before", score: base }]
  const afterData = [{ name: "After", score: capped }]

  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <h1
        className="font-display font-black text-2xl mb-2"
        style={{ color: C.ivory }}
      >
        What-If Intervention Simulator
      </h1>
      <p
        className="text-sm opacity-60 mb-8 max-w-2xl"
        style={{ color: C.ivory }}
      >
        Toggle potential interventions to see estimated changes to Alex's
        employability score. Use this to prioritise where support will have most
        impact.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Toggles */}
        <div className="space-y-3">
          <div
            className="rounded-lg border p-5 mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-2"
              style={{ color: C.sage }}
            >
              CURRENT ESTIMATE
            </div>
            <div
              className="font-display font-black text-5xl"
              style={{ color: C.ember }}
            >
              {base}%
            </div>
            <p
              className="font-mono text-xs opacity-30 mt-2"
              style={{ color: C.sage }}
            >
              Alex M. · #4F91A20C · BSc Information Systems
            </p>
          </div>
          {toggles.map((t) => (
            <div
              key={t.label}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                borderColor: t.state ? C.teal + "66" : "rgba(255,255,255,0.07)",
                background: t.state ? C.teal + "11" : "rgba(255,255,255,0.02)",
              }}
              onClick={() => t.set(!t.state)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div
                    className="font-display font-semibold text-sm mb-0.5"
                    style={{ color: C.ivory }}
                  >
                    {t.label}
                  </div>
                  <div className="text-xs opacity-50" style={{ color: C.sage }}>
                    {t.desc}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span
                    className="font-mono text-sm"
                    style={{ color: t.state ? C.tealLight : C.sage }}
                  >
                    +{t.gain}%
                  </span>
                  <div
                    className="w-10 h-5 rounded-full relative transition-all"
                    style={{
                      background: t.state ? C.teal : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{
                        background: C.ivory,
                        left: t.state ? "calc(100% - 18px)" : "2px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="space-y-4">
          <div
            className="rounded-lg border p-6 text-center"
            style={{
              borderColor: capped > 50 ? C.tealLight + "44" : C.ember + "44",
              background: capped > 50 ? C.tealLight + "08" : C.ember + "08",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-3"
              style={{ color: C.sage }}
            >
              ESTIMATED SCENARIO
            </div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div
                  className="font-display font-black text-4xl"
                  style={{ color: C.ember }}
                >
                  {base}%
                </div>
                <div
                  className="font-mono text-xs opacity-40 mt-1"
                  style={{ color: C.sage }}
                >
                  CURRENT
                </div>
              </div>
              <div className="text-2xl opacity-40" style={{ color: C.sage }}>
                →
              </div>
              <div className="text-center">
                <div
                  className="font-display font-black text-5xl"
                  style={{ color: capped > 50 ? C.tealLight : C.ember }}
                >
                  {capped}%
                </div>
                <div
                  className="font-mono text-xs opacity-40 mt-1"
                  style={{ color: C.sage }}
                >
                  ESTIMATED
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div
              className="h-3 rounded-full overflow-hidden mb-3"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${capped}%`,
                  background: capped > 50 ? C.tealLight : C.ember,
                }}
              />
            </div>
            <div
              className="font-display font-semibold text-lg"
              style={{ color: C.ivory }}
            >
              +{capped - base}% improvement estimated
            </div>
            <p
              className="font-mono text-xs opacity-30 mt-3"
              style={{ color: C.sage }}
            >
              Estimated scenario — not a causal guarantee. Individual outcomes
              may vary.
            </p>
          </div>

          {/* Comparison chart */}
          <div
            className="rounded-lg border p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="font-mono text-xs tracking-widest opacity-40 mb-4"
              style={{ color: C.sage }}
            >
              TRAJECTORY COMPARISON
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={[
                  { name: "Before interventions", score: base },
                  { name: "After interventions", score: capped },
                ]}
                margin={{ left: -20, right: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: C.sage }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: C.sage }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: C.graphite,
                    border: "none",
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                  formatter={(v: any) => [`${v}%`]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {[
                    { fill: C.ember },
                    { fill: capped > 50 ? C.tealLight : C.ember },
                  ].map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="p-4 rounded-lg border text-sm"
            style={{ borderColor: C.navy + "88", background: C.navy + "33" }}
          >
            <p
              className="leading-relaxed opacity-70"
              style={{ color: C.ivory }}
            >
              <strong style={{ color: C.tealLight }}>
                Internship completion
              </strong>{" "}
              is the highest-impact intervention available. Even partial
              combinations show meaningful estimated improvement. This tool
              helps advisors prioritise limited support resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Case Creation Modal ─── */
interface CreateCaseForm {
  interventionType: string;
  priority: string;
  notes: string;
}

function CaseCreationModal({
  studentId,
  studentName,
  onClose,
  onSubmit
}: {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onSubmit: (data: CreateCaseForm) => void;
}) {
  const [form, setForm] = useState<CreateCaseForm>({
    interventionType: "internship",
    priority: "high",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interventionTypes = [
    { id: "internship", label: "Internship Placement Support", desc: "Connect to employers and internship programs" },
    { id: "portfolio", label: "Portfolio Development", desc: "Skills workshop and project mentorship" },
    { id: "mentorship", label: "Mentorship Programme", desc: "Peer or alumni mentoring" },
    { id: "academic", label: "Academic Recovery Plan", desc: "Academic support and GPA improvement" },
    { id: "engagement", label: "Engagement Boost", desc: "Career readiness workshops and skills building" },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.interventionType) newErrors.interventionType = "Intervention type required";
    if (!form.priority) newErrors.priority = "Priority required";
    if (form.notes.trim().length < 10) newErrors.notes = "Notes must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm({ interventionType: "internship", priority: "high", notes: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-graphite rounded-lg border border-opacity-15 w-full max-w-lg max-h-96 overflow-y-auto" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b bg-graphite" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg" style={{ color: C.ivory }}>Create Intervention Case</h2>
            <button onClick={onClose} className="text-xl opacity-50 hover:opacity-100" style={{ color: C.sage }}>×</button>
          </div>
          <p className="text-xs mt-1 opacity-50" style={{ color: C.sage }}>{studentName} · {studentId}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Intervention Type */}
          <div>
            <label className="block font-mono text-xs tracking-widest mb-2 opacity-60" style={{ color: C.sage }}>INTERVENTION TYPE</label>
            <div className="space-y-2">
              {interventionTypes.map((type) => (
                <label key={type.id} className="flex items-start gap-3 p-3 rounded border cursor-pointer transition-all" style={{ borderColor: form.interventionType === type.id ? C.ember + "44" : "rgba(255,255,255,0.07)", background: form.interventionType === type.id ? C.ember + "08" : "transparent" }}>
                  <input
                    type="radio"
                    name="interventionType"
                    value={type.id}
                    checked={form.interventionType === type.id}
                    onChange={(e) => setForm({ ...form, interventionType: e.target.value })}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-display font-semibold text-sm" style={{ color: C.ivory }}>{type.label}</div>
                    <div className="text-xs opacity-50 mt-0.5" style={{ color: C.sage }}>{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.interventionType && <p className="text-xs mt-1" style={{ color: C.ember }}>{errors.interventionType}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block font-mono text-xs tracking-widest mb-2 opacity-60" style={{ color: C.sage }}>PRIORITY</label>
            <div className="flex gap-2">
              {["high", "medium", "low"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className="flex-1 py-2 rounded border text-xs font-mono transition-all capitalize"
                  style={{
                    background: form.priority === p ? C.ember : "transparent",
                    borderColor: form.priority === p ? C.ember : "rgba(255,255,255,0.15)",
                    color: form.priority === p ? C.ivory : C.sage,
                  }}
                >{p}</button>
              ))}
            </div>
            {errors.priority && <p className="text-xs mt-1" style={{ color: C.ember }}>{errors.priority}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-xs tracking-widest mb-2 opacity-60" style={{ color: C.sage }}>NOTES ({form.notes.length}/500)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value.slice(0, 500) })}
              placeholder="Why is this intervention needed? What are the goals?"
              className="w-full p-3 rounded border text-sm outline-none resize-none focus:ring-2"
              rows={3}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: errors.notes ? C.ember + "66" : "rgba(255,255,255,0.15)",
                color: C.ivory,
                fontFamily: "var(--font-body)"
              }}
            />
            {errors.notes && <p className="text-xs mt-1" style={{ color: C.ember }}>{errors.notes}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded border text-sm font-medium transition-all"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: C.sage }}
            >Cancel</button>
            <button
              type="submit"
              className="flex-1 py-2 rounded text-sm font-medium transition-all hover:opacity-90"
              style={{ background: C.ember, color: C.ivory }}
            >Create Case</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Case Management ─── */
const CASES = [
  {
    id: "CASE-001",
    student: "#4F91A20C",
    issue: "No internship",
    intervention: "Internship placement",
    advisor: "Sarah M.",
    status: "In Progress",
    next: "Sept 15",
  },
  {
    id: "CASE-002",
    student: "#A821C91A",
    issue: "GPA declining",
    intervention: "Academic recovery",
    advisor: "James O.",
    status: "New",
    next: "Sept 12",
  },
  {
    id: "CASE-003",
    student: "#D921F02B",
    issue: "Low engagement",
    intervention: "Mentorship match",
    advisor: "Sarah M.",
    status: "Follow-up",
    next: "Sept 18",
  },
  {
    id: "CASE-004",
    student: "#C120A88C",
    issue: "Portfolio gap",
    intervention: "Portfolio workshop",
    advisor: "Thabo N.",
    status: "Resolved",
    next: "—",
  },
  {
    id: "CASE-005",
    student: "#F445C22E",
    issue: "No internship",
    intervention: "Internship placement",
    advisor: "Sarah M.",
    status: "In Progress",
    next: "Sept 20",
  },
]

const STATUS_COLORS: Record<string, string> = {
  New: "#D4A843",
  "In Progress": C.tealLight,
  "Follow-up": C.navyLight + "cc",
  Resolved: C.sage,
}

function CaseManagement({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1
            className="font-display font-black text-2xl mb-1"
            style={{ color: C.ivory }}
          >
            Intervention Cases
          </h1>
          <p className="font-mono text-xs opacity-40" style={{ color: C.sage }}>
            Advisor: Sarah M. · Information Systems
          </p>
        </div>
        <button
          className="px-4 py-2 rounded text-sm font-medium transition-all hover:opacity-90"
          style={{ background: C.ember, color: C.ivory }}
        >
          + New case
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "OPEN", count: 38, color: C.ember },
          { label: "IN PROGRESS", count: 24, color: C.tealLight },
          { label: "FOLLOW-UP", count: 16, color: "#D4A843" },
          { label: "RESOLVED", count: 86, color: C.sage },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-lg border text-center"
            style={{ borderColor: s.color + "33", background: s.color + "08" }}
          >
            <div
              className="font-display font-black text-3xl mb-1"
              style={{ color: s.color }}
            >
              {s.count}
            </div>
            <div
              className="font-mono text-xs tracking-widest opacity-60"
              style={{ color: C.sage }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-hidden mb-6"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                "Case",
                "Student",
                "Issue",
                "Intervention",
                "Advisor",
                "Status",
                "Next follow-up",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs tracking-widest opacity-40"
                  style={{ color: C.sage }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASES.map((c) => (
              <tr
                key={c.id}
                className="border-b transition-all hover:bg-white hover:bg-opacity-5 cursor-pointer"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <td
                  className="px-4 py-3 font-mono text-xs font-bold"
                  style={{ color: C.ivory }}
                >
                  {c.id}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {c.student}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sage }}>
                  {c.issue}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.ivory }}>
                  {c.intervention}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.sage }}>
                  {c.advisor}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background: (STATUS_COLORS[c.status] || C.sage) + "22",
                      color: STATUS_COLORS[c.status] || C.sage,
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {c.next}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: C.ember }}
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline detail for CASE-001 */}
      <div
        className="rounded-lg border p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono text-xs tracking-widest opacity-40 mb-4"
          style={{ color: C.sage }}
        >
          CASE-001 TIMELINE · #4F91A20C
        </div>
        <div className="space-y-4">
          {[
            {
              date: "4 Sept",
              event: "Student identified by model as high priority",
              done: true,
            },
            {
              date: "5 Sept",
              event: "Advisor notified and case opened",
              done: true,
            },
            {
              date: "6 Sept",
              event: "Internship placement recommendation created",
              done: true,
            },
            {
              date: "10 Sept",
              event: "Follow-up meeting scheduled",
              done: false,
            },
            {
              date: "15 Sept",
              event: "Internship confirmation expected",
              done: false,
            },
          ].map((t, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: t.done ? C.tealLight : "rgba(255,255,255,0.15)",
                    marginTop: 2,
                  }}
                />
                {i < 4 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                )}
              </div>
              <div className="pb-4">
                <div
                  className="font-mono text-xs opacity-40 mb-0.5"
                  style={{ color: C.sage }}
                >
                  {t.date}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: t.done ? C.ivory : C.sage,
                    opacity: t.done ? 1 : 0.5,
                  }}
                >
                  {t.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Program Analytics ─── */
const programData = [
  { prog: "Info Systems", high: 18, med: 28, low: 54 },
  { prog: "Software Eng", high: 12, med: 35, low: 53 },
  { prog: "Business", high: 22, med: 30, low: 48 },
  { prog: "Computer Sci", high: 10, med: 25, low: 65 },
  { prog: "Data Science", high: 14, med: 22, low: 64 },
]
const internshipData = [
  { prog: "Info Systems", completed: 62, pending: 38 },
  { prog: "Software Eng", completed: 74, pending: 26 },
  { prog: "Business", completed: 55, pending: 45 },
  { prog: "Computer Sci", completed: 80, pending: 20 },
]

function ProgramAnalytics() {
  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <h1
        className="font-display font-black text-2xl mb-1"
        style={{ color: C.ivory }}
      >
        Program Employability Analytics
      </h1>
      <p
        className="font-mono text-xs opacity-40 mb-6"
        style={{ color: C.sage }}
      >
        2026 Cohort · All Programmes · As of September 2026
      </p>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="STUDENTS" value="1,240" sub="This cohort" />
        <MetricCard
          label="HIGH PRIORITY"
          value="14.5%"
          sub="180 students"
          accent={C.ember}
        />
        <MetricCard
          label="INTERNSHIP COMPLETION"
          value="62%"
          sub="Across all programmes"
          accent={C.tealLight}
        />
        <MetricCard
          label="AVERAGE ESTIMATE"
          value="68%"
          sub="Employability score"
          accent={C.sage}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            RISK DISTRIBUTION BY PROGRAMME (%)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={programData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="prog"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                }}
              />
              <Bar dataKey="high" stackId="a" fill={C.ember} name="High" />
              <Bar dataKey="med" stackId="a" fill="#D4A843" name="Medium" />
              <Bar
                dataKey="low"
                stackId="a"
                fill={C.tealLight}
                name="Low"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-4"
            style={{ color: C.sage }}
          >
            INTERNSHIP COMPLETION BY PROGRAMME (%)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={internshipData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="prog"
                tick={{ fontSize: 10, fill: C.sage }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: C.graphite,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                }}
                formatter={(v: any) => [`${v}%`]}
              />
              <Bar
                dataKey="completed"
                fill={C.tealLight}
                name="Completed %"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="rounded-lg border p-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono text-xs tracking-widest opacity-40 mb-4"
          style={{ color: C.sage }}
        >
          PROGRAMME COMPARISON SUMMARY
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  "Programme",
                  "Students",
                  "Avg Estimate",
                  "High Priority",
                  "Internship %",
                  "Intervention Rate",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-3 pr-6 font-mono text-xs tracking-widest opacity-40"
                    style={{ color: C.sage }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  prog: "Information Systems",
                  n: 310,
                  avg: "61%",
                  high: "18%",
                  intern: "62%",
                  intv: "24%",
                },
                {
                  prog: "Software Engineering",
                  n: 280,
                  avg: "66%",
                  high: "12%",
                  intern: "74%",
                  intv: "18%",
                },
                {
                  prog: "Business Management",
                  n: 340,
                  avg: "58%",
                  high: "22%",
                  intern: "55%",
                  intv: "28%",
                },
                {
                  prog: "Computer Science",
                  n: 200,
                  avg: "72%",
                  high: "10%",
                  intern: "80%",
                  intv: "14%",
                },
                {
                  prog: "Data Science",
                  n: 110,
                  avg: "69%",
                  high: "14%",
                  intern: "68%",
                  intv: "20%",
                },
              ].map((row) => (
                <tr
                  key={row.prog}
                  className="border-b"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <td className="py-3 pr-6 text-sm" style={{ color: C.ivory }}>
                    {row.prog}
                  </td>
                  <td
                    className="py-3 pr-6 font-mono text-xs"
                    style={{ color: C.sage }}
                  >
                    {row.n}
                  </td>
                  <td
                    className="py-3 pr-6 font-mono text-xs"
                    style={{ color: C.tealLight }}
                  >
                    {row.avg}
                  </td>
                  <td
                    className="py-3 pr-6 font-mono text-xs"
                    style={{ color: C.ember }}
                  >
                    {row.high}
                  </td>
                  <td
                    className="py-3 pr-6 font-mono text-xs"
                    style={{ color: C.sage }}
                  >
                    {row.intern}
                  </td>
                  <td
                    className="py-3 pr-6 font-mono text-xs"
                    style={{ color: C.sage }}
                  >
                    {row.intv}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Fairness & Equity ─── */
function FairnessMonitor() {
  const groupData = [
    {
      group: "Female",
      n: 612,
      predRate: "68%",
      errorRate: "12%",
      fpRate: "8%",
      fnRate: "14%",
      status: "ok",
    },
    {
      group: "Male",
      n: 628,
      predRate: "64%",
      errorRate: "13%",
      fpRate: "9%",
      fnRate: "15%",
      status: "ok",
    },
    {
      group: "Year 1–2",
      n: 480,
      predRate: "71%",
      errorRate: "10%",
      fpRate: "7%",
      fnRate: "12%",
      status: "ok",
    },
    {
      group: "Year 3–4",
      n: 760,
      predRate: "62%",
      errorRate: "14%",
      fpRate: "10%",
      fnRate: "17%",
      status: "warn",
    },
    {
      group: "Full scholarship",
      n: 210,
      predRate: "59%",
      errorRate: "16%",
      fpRate: "12%",
      fnRate: "19%",
      status: "warn",
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <h1
        className="font-display font-black text-2xl mb-2"
        style={{ color: C.ivory }}
      >
        Fairness & Equity
      </h1>
      <p
        className="text-sm opacity-60 mb-6 max-w-2xl"
        style={{ color: C.ivory }}
      >
        Continuous monitoring of model behaviour across student groups. A model
        version that exceeds disparity thresholds cannot be promoted to active
        status.
      </p>

      {/* Status banner */}
      <div
        className="p-5 rounded-lg border mb-6"
        style={{
          borderColor: C.tealLight + "44",
          background: C.tealLight + "08",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: C.tealLight }}
          />
          <div>
            <div
              className="font-display font-semibold"
              style={{ color: C.ivory }}
            >
              Fairness Monitoring — Within Threshold
            </div>
            <div
              className="font-mono text-xs opacity-50 mt-0.5"
              style={{ color: C.sage }}
            >
              EMP-Model v1.3 · Last evaluated September 2026 · No critical
              alerts
            </div>
          </div>
          <div
            className="ml-auto font-mono text-xs px-3 py-1 rounded"
            style={{ background: C.tealLight + "22", color: C.tealLight }}
          >
            HEALTHY
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="PREDICTION COVERAGE"
          value="94%"
          sub="Students with valid scores"
          accent={C.tealLight}
        />
        <MetricCard
          label="MODEL PERFORMANCE"
          value="AUC 0.81"
          sub="Discrimination accuracy"
          accent={C.tealLight}
        />
        <MetricCard
          label="FAIRNESS STATUS"
          value="Within threshold"
          sub="All groups monitored"
          accent={C.sage}
        />
      </div>

      {/* Group analysis */}
      <div
        className="rounded-lg border overflow-hidden mb-6"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="px-5 py-3 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40"
            style={{ color: C.sage }}
          >
            GROUP-WISE ANALYSIS
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                "Group",
                "N",
                "Prediction Rate",
                "Error Rate",
                "False Positive",
                "False Negative",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-mono text-xs tracking-widest opacity-40"
                  style={{ color: C.sage }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupData.map((g) => (
              <tr
                key={g.group}
                className="border-b"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                <td
                  className="px-4 py-3 text-sm font-medium"
                  style={{ color: C.ivory }}
                >
                  {g.group}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {g.n}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.tealLight }}
                >
                  {g.predRate}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {g.errorRate}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {g.fpRate}
                </td>
                <td
                  className="px-4 py-3 font-mono text-xs"
                  style={{ color: C.sage }}
                >
                  {g.fnRate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded font-mono text-xs"
                    style={{
                      background:
                        g.status === "ok" ? C.tealLight + "22" : "#D4A84322",
                      color: g.status === "ok" ? C.tealLight : "#D4A843",
                    }}
                  >
                    {g.status === "ok" ? "OK" : "REVIEW"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "#D4A84333",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest mb-3"
            style={{ color: "#D4A843" }}
          >
            ⚠ REVIEW RECOMMENDED
          </div>
          <div
            className="font-display font-semibold mb-2"
            style={{ color: C.ivory }}
          >
            Scholarship holders showing higher error rates
          </div>
          <p
            className="text-sm opacity-60 leading-relaxed"
            style={{ color: C.sage }}
          >
            The scholarship holder subgroup (N=210) shows slightly elevated
            false negative rates (19%). This group should be monitored more
            closely in the next model evaluation cycle. No threshold breach —
            advisory flag only.
          </p>
        </div>
        <div
          className="rounded-lg border p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="font-mono text-xs tracking-widest opacity-40 mb-3"
            style={{ color: C.sage }}
          >
            MODEL INFORMATION
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: "Model version", val: "EMP-Model v1.3" },
              { label: "Algorithm", val: "XGBoost (gradient boosting)" },
              { label: "Training cohorts", val: "2022, 2023, 2024" },
              { label: "Labelled records", val: "2,847 (35% response rate)" },
              { label: "Last retrained", val: "February 2026" },
              { label: "Next evaluation", val: "February 2027" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-1.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="opacity-50" style={{ color: C.sage }}>
                  {item.label}
                </span>
                <span
                  style={{
                    color: C.ivory,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                  }}
                >
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Reports ─── */
function Reports() {
  return (
    <div className="flex-1 overflow-y-auto p-6 hide-scroll">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1
            className="font-display font-black text-2xl mb-1"
            style={{ color: C.ivory }}
          >
            Institutional Reports
          </h1>
          <p className="font-mono text-xs opacity-40" style={{ color: C.sage }}>
            Information Systems · Academic year 2025–2026
          </p>
        </div>
        <div className="flex gap-2">
          {["PDF", "Excel", "CSV"].map((fmt) => (
            <button
              key={fmt}
              className="px-3 py-1.5 rounded border text-xs font-mono transition-all hover:opacity-80"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: C.sage }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Date range", val: "Sept 2025 – Sept 2026" },
          { label: "Programme", val: "All programmes" },
          { label: "Risk level", val: "All" },
        ].map((f) => (
          <div
            key={f.label}
            className="px-4 py-2 rounded border text-sm"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              color: C.sage,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <span className="opacity-50 mr-2 font-mono text-xs">
              {f.label}:
            </span>
            {f.val}
          </div>
        ))}
      </div>

      {/* Report cards */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          {
            title: "Employability Overview",
            desc: "2026 Cohort",
            date: "Last generated: today",
            color: C.ember,
          },
          {
            title: "Intervention Outcomes",
            desc: "2025–2026 academic year",
            date: "Last generated: 2 days ago",
            color: C.tealLight,
          },
          {
            title: "Programme Performance",
            desc: "By department",
            date: "Last generated: 1 week ago",
            color: C.sage,
          },
        ].map((r) => (
          <div
            key={r.title}
            className="p-5 rounded-lg border transition-all hover:border-opacity-60 cursor-pointer"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="w-8 h-8 rounded mb-4 flex items-center justify-center text-sm"
              style={{ background: r.color + "22" }}
            >
              <span style={{ color: r.color }}>☰</span>
            </div>
            <div
              className="font-display font-bold mb-1"
              style={{ color: C.ivory }}
            >
              {r.title}
            </div>
            <div className="text-xs opacity-60 mb-4" style={{ color: C.sage }}>
              {r.desc}
            </div>
            <div
              className="font-mono text-xs opacity-30 mb-4"
              style={{ color: C.sage }}
            >
              {r.date}
            </div>
            <button
              className="w-full py-2 rounded text-xs font-medium border transition-all hover:opacity-80"
              style={{ borderColor: r.color + "44", color: r.color }}
            >
              Generate report
            </button>
          </div>
        ))}
      </div>

      {/* Scheduled */}
      <div
        className="rounded-lg border p-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="font-mono text-xs tracking-widest opacity-40 mb-4"
          style={{ color: C.sage }}
        >
          SCHEDULED REPORTS
        </div>
        <div className="space-y-3">
          {[
            {
              title: "Monthly Employability Report",
              freq: "Monthly",
              next: "1 Oct 2026",
              status: "Active",
            },
            {
              title: "High-Priority Student Alert",
              freq: "Weekly",
              next: "16 Sept 2026",
              status: "Active",
            },
            {
              title: "Intervention Outcomes Summary",
              freq: "Quarterly",
              next: "1 Dec 2026",
              status: "Active",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="flex items-center justify-between py-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <div className="text-sm font-medium" style={{ color: C.ivory }}>
                  {s.title}
                </div>
                <div
                  className="font-mono text-xs opacity-40 mt-0.5"
                  style={{ color: C.sage }}
                >
                  {s.freq} · Next: {s.next}
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded font-mono text-xs"
                style={{ background: C.tealLight + "22", color: C.tealLight }}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── App Shell (dashboard layout) ─── */
const VIEW_TITLES: Record<View, string> = {
  landing: "Home",
  login: "Sign in",
  dashboard: "Overview",
  queue: "Student Queue",
  profile: "Student Profile — Alex M.",
  explainability: "Explainability — Why this student?",
  whatif: "What-If Simulator",
  cases: "Intervention Cases",
  analytics: "Program Analytics",
  fairness: "Fairness & Equity",
  reports: "Institutional Reports",
}

function AppShell({ view, onNav }: { view: View; onNav: (v: View) => void }) {
  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <AdvisorDashboard onNav={onNav} />
      case "queue":
        return <StudentQueue onNav={onNav} />
      case "profile":
        return <StudentProfile onNav={onNav} />
      case "explainability":
        return <ExplainabilityPanel onNav={onNav} />
      case "whatif":
        return <WhatIfSimulator />
      case "cases":
        return <CaseManagement onNav={onNav} />
      case "analytics":
        return <ProgramAnalytics />
      case "fairness":
        return <FairnessMonitor />
      case "reports":
        return <Reports />
      default:
        return <AdvisorDashboard onNav={onNav} />
    }
  }

  return (
    <div className="h-full flex flex-col" style={{ background: C.graphite }}>
      <Topbar title={VIEW_TITLES[view]} onNav={onNav} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={view} onNav={onNav} />
        <main
          className="flex-1 overflow-hidden flex flex-col"
          style={{ background: "#191f1c" }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

/* ─── Root ─── */
export default function App() {
  const [view, setView] = useState<View>("landing")

  const handleNav = useCallback((v: View) => {
    setView(v)
    window.scrollTo(0, 0)
  }, [])

  if (view === "landing") return <LandingPage onNav={handleNav} />
  if (view === "login") return <LoginPage onNav={handleNav} />
  return <AppShell view={view} onNav={handleNav} />
}
