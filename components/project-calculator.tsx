"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  Download,
  Home,
  Building2,
  Hammer,
  Trees,
  Ruler,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react"
import { generateCalculatorPDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

type ProjectType = "residential" | "commercial" | "renovation" | "landscaping"
type MeasurementType = "theoretical" | "actual"

interface Measurements {
  totalArea: string
  length: string
  breadth: string
  builtUpArea: string
  builtUpLength: string
  builtUpBreadth: string
  measurementType: MeasurementType
  floors: string
  rooms: string
  bathrooms: string
}

interface ProjectData {
  projectType: ProjectType
  measurements: Measurements
  additionalDetails: Record<string, string>
}

interface CostBreakdown {
  baseConstruction: number
  materials: number
  labor: number
  permits: number
  contingency: number
  total: number
}

const costRates = {
  residential: { base: 2200, materials: 0.35, labor: 0.3, permits: 0.05, contingency: 0.1 },
  commercial: { base: 2800, materials: 0.4, labor: 0.3, permits: 0.08, contingency: 0.12 },
  renovation: { base: 1800, materials: 0.3, labor: 0.35, permits: 0.03, contingency: 0.15 },
  landscaping: { base: 450, materials: 0.45, labor: 0.4, permits: 0.02, contingency: 0.08 },
}

export function ProjectCalculator() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [projectData, setProjectData] = useState<ProjectData>({
    projectType: "residential",
    measurements: {
      totalArea: "",
      length: "",
      breadth: "",
      builtUpArea: "",
      builtUpLength: "",
      builtUpBreadth: "",
      measurementType: "theoretical",
      floors: "1",
      rooms: "",
      bathrooms: "",
    },
    additionalDetails: {},
  })
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const projectTypes = [
    { value: "residential", label: t("Residential Building", "குடியிருப்பு கட்டிடம்"), icon: Home, color: "text-primary" },
    { value: "commercial", label: t("Commercial Building", "வணிக கட்டிடம்"), icon: Building2, color: "text-accent" },
    { value: "renovation", label: t("Renovation Project", "புதுப்பித்தல் திட்டம்"), icon: Hammer, color: "text-secondary" },
    { value: "landscaping", label: t("Landscaping", "நிலப்பரப்பு"), icon: Trees, color: "text-chart-4" },
  ]

  // Auto-calculate area from length and breadth
  useEffect(() => {
    const length = Number.parseFloat(projectData.measurements.length)
    const breadth = Number.parseFloat(projectData.measurements.breadth)

    if (length > 0 && breadth > 0) {
      const calculatedArea = (length * breadth).toFixed(2)
      if (projectData.measurements.totalArea !== calculatedArea) {
        setProjectData((prev) => ({
          ...prev,
          measurements: {
            ...prev.measurements,
            totalArea: calculatedArea,
          },
        }))
      }
    }
  }, [projectData.measurements.length, projectData.measurements.breadth])

  useEffect(() => {
    const builtUpLength = Number.parseFloat(projectData.measurements.builtUpLength)
    const builtUpBreadth = Number.parseFloat(projectData.measurements.builtUpBreadth)

    if (builtUpLength > 0 && builtUpBreadth > 0) {
      const calculatedBuiltUpArea = (builtUpLength * builtUpBreadth).toFixed(2)
      if (projectData.measurements.builtUpArea !== calculatedBuiltUpArea) {
        setProjectData((prev) => ({
          ...prev,
          measurements: {
            ...prev.measurements,
            builtUpArea: calculatedBuiltUpArea,
          },
        }))
      }
    }
  }, [projectData.measurements.builtUpLength, projectData.measurements.builtUpBreadth])

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {}
    const { totalArea, length, breadth, builtUpArea, builtUpLength, builtUpBreadth } = projectData.measurements

    if (!totalArea || Number.parseFloat(totalArea) <= 0) {
      errors.totalArea = t("Total area must be greater than 0", "மொத்த பரப்பளவு 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (!length || Number.parseFloat(length) <= 0) {
      errors.length = t("Length must be greater than 0", "நீளம் 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (!breadth || Number.parseFloat(breadth) <= 0) {
      errors.breadth = t("Breadth must be greater than 0", "அகலம் 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (!builtUpArea || Number.parseFloat(builtUpArea) <= 0) {
      errors.builtUpArea = t("Built-up area must be greater than 0", "கட்டப்பட்ட பகுதி 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (!builtUpLength || Number.parseFloat(builtUpLength) <= 0) {
      errors.builtUpLength = t("Built-up length must be greater than 0", "கட்டப்பட்ட நீளம் 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (!builtUpBreadth || Number.parseFloat(builtUpBreadth) <= 0) {
      errors.builtUpBreadth = t("Built-up breadth must be greater than 0", "கட்டப்பட்ட அகலம் 0 ஐ விட அதிகமாக இருக்க வேண்டும்")
    }

    if (builtUpArea && totalArea && Number.parseFloat(builtUpArea) > Number.parseFloat(totalArea)) {
      errors.builtUpArea = t("Built-up area cannot exceed plot area", "கட்டப்பட்ட பகுதி மனைப் பரப்பளவை விட அதிகமாக இருக்கக்கூடாது")
    }

    // Check if calculated area matches input area (with tolerance)
    if (length && breadth && totalArea) {
      const calculatedArea = Number.parseFloat(length) * Number.parseFloat(breadth)
      const inputArea = Number.parseFloat(totalArea)
      const tolerance = 0.1 // 10% tolerance

      if (Math.abs(calculatedArea - inputArea) / inputArea > tolerance) {
        errors.dimensions = t("Length × Breadth does not match total area", "நீளம் × அகலம் மொத்த பரப்பளவோடு பொருந்தவில்லை")
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateCosts = () => {
    if (!validateInputs()) {
      toast({
        title: t("Validation Error", "சரிபார்ப்பு பிழை"),
        description: t("Please correct the errors before calculating.", "கணக்கிடுவதற்கு முன் பிழைகளைச் சரிசெய்யவும்."),
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const area = Number.parseFloat(projectData.measurements.builtUpArea)
      const floors = Number.parseInt(projectData.measurements.floors) || 1
      const rates = costRates[projectData.projectType]

      const baseConstruction = area * rates.base * floors
      const materials = baseConstruction * rates.materials
      const labor = baseConstruction * rates.labor
      const permits = baseConstruction * rates.permits
      const contingency = baseConstruction * rates.contingency
      const total = baseConstruction + materials + labor + permits + contingency

      setCostBreakdown({
        baseConstruction,
        materials,
        labor,
        permits,
        contingency,
        total,
      })

      setIsCalculating(false)

      toast({
        title: t("Calculation Complete", "கணக்கீடு முடிந்தது"),
        description: t("Your project estimate is ready!", "உங்கள் திட்ட மதிப்பீடு தயாராக உள்ளது!"),
      })
    }, 800)
  }

  const handleDownloadReport = () => {
    if (!costBreakdown) {
      toast({
        title: t("No Data", "தரவு இல்லை"),
        description: t("Please calculate costs before downloading the report.", "அறிக்கையைப் பதிவிறக்குவதற்கு முன் செலவுகளைக் கணக்கிடவும்."),
        variant: "destructive",
      })
      return
    }

    try {
      generateCalculatorPDF(projectData, costBreakdown)
      toast({
        title: t("Download Started", "பதிவிறக்கம் தொடங்கியது"),
        description: t("Your project report is being downloaded.", "உங்கள் திட்ட அறிக்கை பதிவிறக்கம் செய்யப்படுகிறது."),
      })
    } catch (error) {
      toast({
        title: t("Download Failed", "பதிவிறக்கம் தோல்வியடைந்தது"),
        description: t("There was an error generating your report.", "உங்கள் அறிக்கையை உருவாக்குவதில் பிழை ஏற்பட்டது."),
        variant: "destructive",
      })
    }
  }

  const updateMeasurement = (field: keyof Measurements, value: string) => {
    setProjectData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value,
      },
    }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const selectedProjectType = projectTypes.find((pt) => pt.value === projectData.projectType)
  const ProjectIcon = selectedProjectType?.icon || Calculator

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Project Type Selection */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            {t("Select Project Type", "திட்ட வகையைத் தேர்ந்தெடுக்கவும்")}
          </CardTitle>
          <CardDescription>
            {t("Choose the type of construction project you're planning", "நீங்கள் திட்டமிட்டுள்ள கட்டுமான வகையைத் தேர்வு செய்யவும்")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projectTypes.map((type) => {
              const Icon = type.icon
              const isSelected = projectData.projectType === type.value
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    setProjectData((prev) => ({ ...prev, projectType: type.value as ProjectType }))
                    setCostBreakdown(null)
                  }}
                  className={`group relative flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:scale-105 hover:shadow-md ${isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <Icon
                    className={`size-8 transition-colors ${isSelected ? type.color : "text-muted-foreground group-hover:text-primary"}`}
                  />
                  <span
                    className={`text-center text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {type.label}
                  </span>
                  {isSelected && <CheckCircle2 className="absolute right-2 top-2 size-5 text-primary" />}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-accent/30 shadow-lg">
        <CardHeader className="bg-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-accent" />
            {t("Built-up Area (Construction Area)", "கட்டப்பட்ட பகுதி (கட்டுமான பகுதி)")}
          </CardTitle>
          <CardDescription>
            {t(
              "Enter the actual construction dimensions - the area where the building will be constructed",
              "உண்மையான கட்டுமான பரிமாணங்களை உள்ளிடவும் - கட்டிடம் கட்டப்படும் பகுதி"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            value={projectData.measurements.measurementType}
            onValueChange={(value) => updateMeasurement("measurementType", value as MeasurementType)}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="theoretical" className="gap-2">
                <Ruler className="size-4" />
                {t("Theoretical", "கோட்பாட்டு")}
              </TabsTrigger>
              <TabsTrigger value="actual" className="gap-2">
                <CheckCircle2 className="size-4" />
                {t("Actual", "உண்மையான")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="theoretical" className="mt-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Theoretical measurements are based on planned dimensions from architectural drawings or blueprints.",
                      "கோட்பாட்டு அளவீடுகள் கட்டடக்கலை வரைபடங்கள் அல்லது வரைபடங்களிலிருந்து திட்டமிடப்பட்ட பரிமாணங்களை அடிப்படையாகக் கொண்டவை."
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="actual" className="mt-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Actual measurements are taken from the physical site or existing structure.",
                      "உண்மையான அளவீடுகள் பௌதீக தளம் அல்லது இருக்கும் கட்டமைப்பிலிருந்து எடுக்கப்படுகின்றன."
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Built-up Length */}
            <div className="space-y-2">
              <Label htmlFor="builtUpLength" className="flex items-center gap-2 text-base font-semibold">
                {t("Construction Length (meters)", "கட்டுமான நீளம் (மீட்டர்)")}
                {projectData.projectType === "residential" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Building length", "கட்டிட நீளம்")})</span>
                )}
                {projectData.projectType === "commercial" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Structure length", "கட்டமைப்பு நீளம்")})</span>
                )}
                {projectData.projectType === "renovation" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Work area length", "வேலை பகுதி நீளம்")})</span>
                )}
                {projectData.projectType === "landscaping" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Development length", "மேம்பாட்டு நீளம்")})</span>
                )}
              </Label>
              <Input
                id="builtUpLength"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("Enter construction length", "கட்டுமான நீளத்தை உள்ளிடவும்")}
                value={projectData.measurements.builtUpLength}
                onChange={(e) => updateMeasurement("builtUpLength", e.target.value)}
                className={`h-12 text-lg ${validationErrors.builtUpLength ? "border-destructive" : ""}`}
              />
              {validationErrors.builtUpLength && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {validationErrors.builtUpLength}
                </p>
              )}
            </div>

            {/* Built-up Breadth */}
            <div className="space-y-2">
              <Label htmlFor="builtUpBreadth" className="flex items-center gap-2 text-base font-semibold">
                {t("Construction Breadth (meters)", "கட்டுமான அகலம் (மீட்டர்)")}
                {projectData.projectType === "residential" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Building width", "கட்டிட அகலம்")})</span>
                )}
                {projectData.projectType === "commercial" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Structure width", "கட்டமைப்பு அகலம்")})</span>
                )}
                {projectData.projectType === "renovation" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Work area width", "வேலை பகுதி அகலம்")})</span>
                )}
                {projectData.projectType === "landscaping" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Development width", "மேம்பாட்டு அகலம்")})</span>
                )}
              </Label>
              <Input
                id="builtUpBreadth"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("Enter construction breadth", "கட்டுமான அகலத்தை உள்ளிடவும்")}
                value={projectData.measurements.builtUpBreadth}
                onChange={(e) => updateMeasurement("builtUpBreadth", e.target.value)}
                className={`h-12 text-lg ${validationErrors.builtUpBreadth ? "border-destructive" : ""}`}
              />
              {validationErrors.builtUpBreadth && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {validationErrors.builtUpBreadth}
                </p>
              )}
            </div>
          </div>

          {/* Built-up Total Area */}
          <div className="mt-6 rounded-lg border-2 border-accent bg-accent/5 p-6">
            <Label htmlFor="builtUpArea" className="mb-3 flex items-center gap-2 text-lg font-bold text-accent">
              <Calculator className="size-5" />
              {t("Total Built-up Area (Square Meters)", "மொத்த கட்டப்பட்ட பகுதி (சதுர மீட்டர்)")}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="builtUpArea"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("Auto-calculated from Length × Breadth", "நீளம் × அகலத்திலிருந்து தானாகக் கணக்கிடப்படுகிறது")}
                value={projectData.measurements.builtUpArea}
                onChange={(e) => updateMeasurement("builtUpArea", e.target.value)}
                className={`h-14 text-2xl font-bold ${validationErrors.builtUpArea ? "border-destructive" : "border-accent bg-background"}`}
                readOnly
              />
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">{t("Formula:", "சூத்திரம்:")}</div>
                <div className="text-xs">{t("Length × Breadth", "நீளம் × அகலம்")}</div>
              </div>
            </div>
            {validationErrors.builtUpArea && (
              <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {validationErrors.builtUpArea}
              </p>
            )}
            {projectData.measurements.builtUpArea && !validationErrors.builtUpArea && (
              <p className="mt-2 flex items-center gap-1 text-sm text-accent">
                <CheckCircle2 className="size-4" />
                {t("Built-up area calculated successfully", "கட்டப்பட்ட பகுதி வெற்றிகரமாக கணக்கிடப்பட்டது")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Primary Measurements Section - Plot/Land Area */}
      <Card className="border-2 border-primary/30 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Ruler className="size-5 text-primary" />
            {t("Plot/Land Area", "மனை/நிலப் பரப்பளவு")}
          </CardTitle>
          <CardDescription>
            {t(
              "Enter the total plot or land dimensions where the project is located",
              "திட்டம் அமைந்துள்ள மொத்த மனை அல்லது நில பரிமாணங்களை உள்ளிடவும்"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Length */}
            <div className="space-y-2">
              <Label htmlFor="length" className="flex items-center gap-2 text-base font-semibold">
                {t("Plot Length (meters)", "மனை நீளம் (மீட்டர்)")}
                {projectData.projectType === "residential" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Land length", "நில நீளம்")})</span>
                )}
                {projectData.projectType === "commercial" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Site length", "தள நீளம்")})</span>
                )}
                {projectData.projectType === "renovation" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Property length", "சொத்து நீளம்")})</span>
                )}
                {projectData.projectType === "landscaping" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Total garden length", "மொத்த தோட்ட நீளம்")})</span>
                )}
              </Label>
              <Input
                id="length"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("Enter plot length", "மனை நீளத்தை உள்ளிடவும்")}
                value={projectData.measurements.length}
                onChange={(e) => updateMeasurement("length", e.target.value)}
                className={`h-12 text-lg ${validationErrors.length ? "border-destructive" : ""}`}
              />
              {validationErrors.length && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {validationErrors.length}
                </p>
              )}
            </div>

            {/* Breadth */}
            <div className="space-y-2">
              <Label htmlFor="breadth" className="flex items-center gap-2 text-base font-semibold">
                {t("Plot Breadth (meters)", "மனை அகலம் (மீட்டர்)")}
                {projectData.projectType === "residential" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Land width", "நில அகலம்")})</span>
                )}
                {projectData.projectType === "commercial" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Site width", "தள அகலம்")})</span>
                )}
                {projectData.projectType === "renovation" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Property width", "சொத்து அகலம்")})</span>
                )}
                {projectData.projectType === "landscaping" && (
                  <span className="text-xs font-normal text-muted-foreground">({t("Total garden width", "மொத்த தோட்ட அகலம்")})</span>
                )}
              </Label>
              <Input
                id="breadth"
                type="number"
                step="0.01"
                min="0"
                placeholder={t("Enter plot breadth", "மனை அகலத்தை உள்ளிடவும்")}
                value={projectData.measurements.breadth}
                onChange={(e) => updateMeasurement("breadth", e.target.value)}
                className={`h-12 text-lg ${validationErrors.breadth ? "border-destructive" : ""}`}
              />
              {validationErrors.breadth && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="size-3" />
                  {validationErrors.breadth}
                </p>
              )}
            </div>
          </div>

          {/* Total Area */}
          <div className="mt-6 rounded-lg border-2 border-primary bg-primary/5 p-6">
            <Label htmlFor="totalArea" className="mb-3 flex items-center gap-2 text-lg font-bold text-primary">
              <Calculator className="size-5" />
              {t("Total Plot Area (Square Meters)", "மொத்த மனைப் பரப்பளவு (சதுர மீட்டர்)")}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="totalArea"
                type="number" 
                step="0.01"
                min="0"
                placeholder={t("Auto-calculated from Length × Breadth", "நீளம் × அகலத்திலிருந்து தானாகக் கணக்கிடப்படுகிறது")}
                value={projectData.measurements.totalArea}
                onChange={(e) => updateMeasurement("totalArea", e.target.value)}
                className={`h-14 text-2xl font-bold ${validationErrors.totalArea ? "border-destructive" : "border-primary bg-background"}`}
                readOnly
              />
              <div className="text-sm text-muted-foreground">
                <div className="font-medium">{t("Formula:", "சூத்திரம்:")}</div>
                <div className="text-xs">{t("Length × Breadth", "நீளம் × அகலம்")}</div>
              </div>
            </div>
            {validationErrors.totalArea && (
              <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {validationErrors.totalArea}
              </p>
            )}
            {validationErrors.dimensions && (
              <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {validationErrors.dimensions}
              </p>
            )}
            {projectData.measurements.totalArea && !validationErrors.totalArea && !validationErrors.dimensions && (
              <p className="mt-2 flex items-center gap-1 text-sm text-primary">
                <CheckCircle2 className="size-4" />
                {t("Plot area calculated successfully", "மனைப் பரப்பளவு வெற்றிகரமாக கணக்கிடப்பட்டது")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Project Details */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ProjectIcon className={`size-5 ${selectedProjectType?.color}`} />
            {t("Additional Project Details", "கூடுதல் திட்ட விவரங்கள்")}
          </CardTitle>
          <CardDescription>
            {t("Provide additional specifications for your project", "உங்கள் திட்டத்திற்கான கூடுதல் விவரக்குறிப்புகளை வழங்கவும்")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Floors */}
            {(projectData.projectType === "residential" || projectData.projectType === "commercial") && (
              <div className="space-y-2">
                <Label htmlFor="floors">{t("Number of Floors", "தளங்களின் எண்ணிக்கை")}</Label>
                <Select
                  value={projectData.measurements.floors}
                  onValueChange={(value) => updateMeasurement("floors", value)}
                >
                  <SelectTrigger id="floors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? t("Floor", "தளம்") : t("Floors", "தளங்கள்")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Additional fields based on project type */}
            {projectData.projectType === "residential" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rooms">{t("Number of Rooms", "அறைகளின் எண்ணிக்கை")}</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="1"
                    placeholder="e.g., 3"
                    value={projectData.measurements.rooms}
                    onChange={(e) => updateMeasurement("rooms", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">{t("Number of Bathrooms", "குளியலறைகளின் எண்ணிக்கை")}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    placeholder="e.g., 2"
                    value={projectData.measurements.bathrooms}
                    onChange={(e) => updateMeasurement("bathrooms", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={calculateCosts} disabled={isCalculating} className="flex-1 gap-2" size="lg">
              <Calculator className="size-5" />
              {isCalculating ? t("Calculating...", "கணக்கிடப்படுகிறது...") : t("Calculate Estimate", "மதிப்பீட்டைக் கணக்கிடுங்கள்")}
            </Button>
            {costBreakdown && (
              <Button onClick={handleDownloadReport} variant="outline" className="gap-2 bg-transparent" size="lg">
                <Download className="size-5" />
                {t("Download Report", "அறிக்கையைப் பதிவிறக்கவும்")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      {costBreakdown && (
        <Card className="animate-fade-in-up border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="size-6" />
              {t("Cost Estimate Breakdown", "செலவு மதிப்பீட்டு விவரம்")}
            </CardTitle>
            <CardDescription>
              {t(
                `Detailed cost analysis for your ${selectedProjectType?.label.toLowerCase()}`,
                `உங்கள் திட்டத்திற்கான விரிவான செலவு பகுப்பாய்வு`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
              <h3 className="mb-3 font-semibold text-primary">{t("Project Summary", "திட்ட சுருக்கம்")}</h3>
              <div className="grid gap-3 text-sm">
                <div className="space-y-2 rounded-lg border border-primary/20 bg-background p-3">
                  <p className="font-semibold text-accent">{t("Built-up Area (Construction)", "கட்டப்பட்ட பகுதி (கட்டுமானம்)")}</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Length:", "நீளம்:")}</span>
                    <span className="font-medium">{projectData.measurements.builtUpLength} {t("meters", "மீட்டர்")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Breadth:", "அகலம்:")}</span>
                    <span className="font-medium">{projectData.measurements.builtUpBreadth} {t("meters", "மீட்டர்")}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-accent">{t("Total Built-up Area:", "மொத்த கட்டப்பட்ட பகுதி:")}</span>
                    <span className="text-lg font-bold text-accent">
                      {projectData.measurements.builtUpArea} {t("sq. meters", "சதுர மீட்டர்")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border border-primary/20 bg-background p-3">
                  <p className="font-semibold text-primary">{t("Plot/Land Area", "மனை/நிலப் பரப்பளவு")}</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Length:", "நீளம்:")}</span>
                    <span className="font-medium">{projectData.measurements.length} {t("ft", "அடி")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("Breadth:", "அகலம்:")}</span>
                    <span className="font-medium">{projectData.measurements.breadth} {t("ft", "அடி")}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-primary">{t("Total Plot Area:", "மொத்த மனைப் பரப்பளவு:")}</span>
                    <span className="text-lg font-bold text-primary">
                      {projectData.measurements.totalArea} {t("sq. ft", "சதுர அடி")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t("Base Construction", "அடிப்படை கட்டுமானம்")}</p>
                  <p className="mt-1 text-2xl font-bold">₹{costBreakdown.baseConstruction.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t("Materials", "பொருட்கள்")}</p>
                  <p className="mt-1 text-2xl font-bold text-accent">
                    ₹{costBreakdown.materials.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t("Labor", "தொழிலாளர்")}</p>
                  <p className="mt-1 text-2xl font-bold text-secondary">
                    ₹{costBreakdown.labor.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm text-muted-foreground">{t("Permits & Fees", "அனுமதிகள் & கட்டணங்கள்")}</p>
                  <p className="mt-1 text-2xl font-bold text-chart-4">
                    ₹{costBreakdown.permits.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t("Contingency (Buffer)", "எதிர்பாராத செலவுகள் (Buffer)")}</p>
                <p className="mt-1 text-2xl font-bold text-chart-5">
                  ₹{costBreakdown.contingency.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
                <p className="text-sm font-medium text-muted-foreground">{t("Total Estimated Cost", "மொத்த மதிப்பிடப்பட்ட செலவு")}</p>
                <p className="mt-2 text-4xl font-bold text-primary">₹{costBreakdown.total.toLocaleString("en-IN")}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t(
                    "* This is an estimated cost. Actual costs may vary based on material quality, location, and market conditions.",
                    "* இது ஒரு மதிப்பிடப்பட்ட செலவு. பொருளின் தரம், இடம் மற்றும் சந்தை நிலவரங்களின் அடிப்படையில் உண்மையான செலவுகள் மாறுபடலாம்."
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
