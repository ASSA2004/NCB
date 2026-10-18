import { ProjectCalculator } from "@/components/project-calculator"

export default function ProjectCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-balance font-bold">Project Cost Calculator</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-pretty">
            Get instant estimates for your construction project. Select your project type, enter measurements, and
            download a detailed report.
          </p>
        </div>
        <ProjectCalculator />
      </div>
    </div>
  )
}
