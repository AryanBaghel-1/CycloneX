import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import { Info, Globe, Brain, Database, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Info className="h-5 w-5 text-amber-400" />
        <h1 className="text-lg font-bold text-[var(--text-primary)]">About</h1>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* System Info */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Cyclone Monitoring & Prediction System
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            A real-time cyclone tracking, historical analysis, and AI-powered
            prediction platform. Designed for meteorologists, emergency
            management professionals, and researchers.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-[var(--text-secondary)] font-medium">Version</span>
              <span className="font-mono">0.1.0</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-[var(--text-secondary)] font-medium">Framework</span>
              <span className="font-mono">Next.js 16</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-[var(--text-secondary)] font-medium">Globe</span>
              <span className="font-mono">CesiumJS</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-[var(--text-secondary)] font-medium">Build</span>
              <span className="font-mono">Development</span>
            </div>
          </div>
        </Card>

        {/* Capabilities */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Platform Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: Globe,
                title: "3D Globe Visualization",
                desc: "Interactive CesiumJS globe with cyclone markers, track visualization, and forecast cones.",
              },
              {
                icon: Brain,
                title: "AI/ML Prediction (Planned)",
                desc: "Machine learning-based cyclone trajectory and intensity prediction with confidence scoring.",
              },
              {
                icon: Database,
                title: "Data Integration (Planned)",
                desc: "Integration with JTWC, NHC, IMD, and other meteorological agencies for real-time data.",
              },
              {
                icon: Shield,
                title: "Alert System",
                desc: "Multi-severity alert and warning system for affected regions and populations.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 border border-amber-500/20">
                  <item.icon className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Sources */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Data Sources
          </h2>
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            <p>
              <strong>JTWC</strong> — Joint Typhoon Warning Center (US Navy /
              Air Force)
            </p>
            <p>
              <strong>NHC</strong> — National Hurricane Center (NOAA)
            </p>
            <p>
              <strong>IMD</strong> — India Meteorological Department
            </p>
            <p className="text-[var(--text-muted)] mt-2 text-[11px]">
              Currently using mock data for development. Real-time data
              integration planned for future releases.
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
