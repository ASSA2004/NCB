"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Calculator, Home, Ruler, Building2, CheckCircle2, AlertCircle, Download, Save } from 'lucide-react'
import { generateQuotationPDF } from "@/lib/pdf-generator"
import { createClientComponentClient } from "@/lib/supabase/client"
import { AnimatePresence, motion } from "framer-motion"


type ProjectType = "new_construction" | "commercial_building" | "elevation_only" | ""

interface FormData {
  // Contact Info
  name: string
  email: string
  phone: string
  message: string

  // Project Type Selection
  projectType: ProjectType

  // Common Fields
  builtUpArea: string
  totalAreaLength: string
  totalAreaBreadth: string
  totalArea: string

  // New Construction Fields
  pricingPackage: string
  parkingSpace: string
  numFloors: string
  floorAreas: Record<number, string>
  parapetWallLength: string
  parapetWallThickness: "4.5" | "9"
  headroomLength: string
  headroomBreadth: string
  headroomHeight: string
  compoundWallEnabled: boolean
  compoundWallLength: string
  compoundWallThickness: "4.5" | "9"
  septicTankEnabled: boolean
  septicTankCapacity: string
  coolingTileEnabled: boolean
  coolingTileArea: string

  // Elevation Only Fields
  elevationDesignType: "3d_2d" | "2d_only"
  elevationArea: string
}

const PRICING_PACKAGES = [
  { id: "premium", name: "Premium Package", name_ta: "பிரீமியம் தொகுப்பு", price_per_sqft: 2450, description: "High quality materials", description_ta: "உயர்தர பொருட்கள்" },
  { id: "elite", name: "Elite Package", name_ta: "எலைட் தொகுப்பு", price_per_sqft: 2600, description: "Luxury finishes", description_ta: "ஆடம்பர முடிவுகள்" },
]



export function QuotationCalculatorNew() {
  const { toast } = useToast()
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: "",
    builtUpArea: "",
    totalAreaLength: "",
    totalAreaBreadth: "",
    totalArea: "",
    pricingPackage: "",
    parkingSpace: "",
    numFloors: "0",
    floorAreas: {},
    parapetWallLength: "",
    parapetWallThickness: "4.5",
    headroomLength: "",
    headroomBreadth: "",
    headroomHeight: "7",
    compoundWallEnabled: false,
    compoundWallLength: "",
    compoundWallThickness: "4.5",
    septicTankEnabled: false,
    septicTankCapacity: "",
    coolingTileEnabled: false,
    coolingTileArea: "",
    elevationDesignType: "3d_2d",
    elevationArea: "",
  })

  const [estimatedCost, setEstimatedCost] = useState(0)
  const [costBreakdown, setCostBreakdown] = useState<Record<string, number>>({})
  const [pricingPackages, setPricingPackages] = useState(PRICING_PACKAGES)

  const t = (en: string, ta: string) => (language === "ta" ? ta : en)

  const [rates, setRates] = useState({
    parking_sqft: 300,
    parapet_4_5_inch: 600,
    parapet_9_inch: 800,
    headroom_sqft: 1900,
    compound_4_5_inch: 2450,
    compound_9_inch: 2600,
    septic_tank_liter: 20,
    cooling_tile_sqft: 110,
    commercial_sqft: 2000,
    elevation_3d_2d: 12,
    elevation_2d: 2
  })

  // Load rates from localStorage if available
  useEffect(() => {
    const savedRates = localStorage.getItem('ncb_rates')
    if (savedRates) {
      try {
        setRates(prev => ({ ...prev, ...JSON.parse(savedRates) }))
      } catch (e) {
        console.error("Failed to parse saved rates", e)
      }
    }
  }, [])

  useEffect(() => {
    if (formData.totalAreaLength && formData.totalAreaBreadth) {
      const length = Number.parseFloat(formData.totalAreaLength) || 0
      const breadth = Number.parseFloat(formData.totalAreaBreadth) || 0
      const area = length * breadth
      setFormData((prev) => ({ ...prev, totalArea: area > 0 ? area.toFixed(2) : "" }))
    } else {
      setFormData((prev) => ({ ...prev, totalArea: "" }))
    }
  }, [formData.totalAreaLength, formData.totalAreaBreadth])

  // Auto-calculate parapet wall length
  useEffect(() => {
    if (formData.projectType === "new_construction" && formData.builtUpArea) {
      const builtUp = Number.parseFloat(formData.builtUpArea) || 0
      if (builtUp > 0) {
        const calculated = (builtUp / 40 + 40) * 2
        setFormData((prev) => ({ ...prev, parapetWallLength: calculated.toFixed(2) }))
      }
    }
  }, [formData.builtUpArea, formData.projectType])

  useEffect(() => {
    if (
      formData.projectType === "new_construction" &&
      formData.coolingTileEnabled &&
      formData.builtUpArea &&
      formData.parapetWallLength
    ) {
      const builtUp = Number.parseFloat(formData.builtUpArea) || 0
      const parapetLength = Number.parseFloat(formData.parapetWallLength) || 0
      const parapetHeight = 3 // Assuming 3 ft height for area calculation
      const parapetArea = parapetLength * parapetHeight
      const coolingArea = builtUp + parapetArea
      setFormData((prev) => ({ ...prev, coolingTileArea: coolingArea.toFixed(2) }))
    } else if (formData.projectType === "new_construction" && !formData.coolingTileEnabled) {
      // Reset coolingTileArea if disabled
      setFormData((prev) => ({ ...prev, coolingTileArea: "" }))
    }
  }, [formData.builtUpArea, formData.parapetWallLength, formData.projectType, formData.coolingTileEnabled])

  // Calculate cost
  useEffect(() => {
    calculateCost()
  }, [formData])

  const calculateCost = () => {
    let total = 0
    const breakdown: Record<string, number> = {}

    if (formData.projectType === "new_construction") {
      const builtUp = Number.parseFloat(formData.builtUpArea) || 0
      const pkg = PRICING_PACKAGES.find((p) => p.id === formData.pricingPackage)

      if (builtUp > 0 && pkg) {
        // Base package cost
        const packageCost = builtUp * pkg.price_per_sqft
        breakdown.packageCost = packageCost
        total += packageCost

        // Parking space
        const parking = Number.parseFloat(formData.parkingSpace) || 0
        if (parking > 0) {
          const parkingCost = parking * rates.parking_sqft
          breakdown.parkingCost = parkingCost
          total += parkingCost
        }

        // Additional floors
        const numFloors = Number.parseInt(formData.numFloors) || 1
        if (numFloors > 1) {
          let additionalFloorsCost = 0
          for (let i = 2; i <= numFloors; i++) {
            const floorArea = Number.parseFloat(formData.floorAreas[i] || "0") || 0
            additionalFloorsCost += floorArea * pkg.price_per_sqft
          }
          breakdown.additionalFloorsCost = additionalFloorsCost
          total += additionalFloorsCost
        }

        // Parapet wall
        const parapetLength = Number.parseFloat(formData.parapetWallLength) || 0
        if (parapetLength > 0) {
          const parapetRate = formData.parapetWallThickness === "4.5" ? rates.parapet_4_5_inch : rates.parapet_9_inch
          const parapetCost = parapetLength * parapetRate
          breakdown.parapetWallCost = parapetCost
          total += parapetCost
        }

        // Headroom
        const headL = Number.parseFloat(formData.headroomLength) || 0
        const headB = Number.parseFloat(formData.headroomBreadth) || 0
        const headH = Number.parseFloat(formData.headroomHeight) || 0
        if (headL >= 12 && headB >= 7 && headH >= 7 && headH <= 12) {
          const headroomCost = headL * headB * rates.headroom_sqft
          breakdown.headroomCost = headroomCost
          total += headroomCost
        }

        // Compound wall
        if (formData.compoundWallEnabled) {
          const compoundLength = Number.parseFloat(formData.compoundWallLength) || 0
          if (compoundLength > 0) {
            const compoundRate = formData.compoundWallThickness === "4.5" ? rates.compound_4_5_inch : rates.compound_9_inch
            const compoundCost = compoundLength * compoundRate
            breakdown.compoundWallCost = compoundCost
            total += compoundCost
          }
        }

        if (formData.septicTankEnabled) {
          const septicCapacity = Number.parseFloat(formData.septicTankCapacity) || 0
          if (septicCapacity >= 4000) {
            const septicCost = septicCapacity * rates.septic_tank_liter
            breakdown.septicTankCost = septicCost
            total += septicCost
          }
        }

        if (formData.coolingTileEnabled) {
          const coolingArea = Number.parseFloat(formData.coolingTileArea) || 0
          if (coolingArea > 0) {
            const coolingCost = coolingArea * rates.cooling_tile_sqft
            breakdown.coolingTileCost = coolingCost
            total += coolingCost
          }
        }
      }
    } else if (formData.projectType === "commercial_building") {
      const builtUp = Number.parseFloat(formData.builtUpArea) || 0
      if (builtUp > 0) {
        const commercialCost = builtUp * rates.commercial_sqft
        breakdown.commercialBuildingCost = commercialCost
        total += commercialCost

        // Parapet wall (same as new construction)
        const parapetLength = Number.parseFloat(formData.parapetWallLength) || 0
        if (parapetLength > 0) {
          const parapetRate = formData.parapetWallThickness === "4.5" ? rates.parapet_4_5_inch : rates.parapet_9_inch
          const parapetCost = parapetLength * parapetRate
          breakdown.parapetWallCost = parapetCost
          total += parapetCost
        }

        // Headroom (same as new construction)
        const headL = Number.parseFloat(formData.headroomLength) || 0
        const headB = Number.parseFloat(formData.headroomBreadth) || 0
        const headH = Number.parseFloat(formData.headroomHeight) || 0
        if (headL >= 12 && headB >= 7 && headH >= 7 && headH <= 12) {
          const headroomCost = headL * headB * rates.headroom_sqft
          breakdown.headroomCost = headroomCost
          total += headroomCost
        }
      }
    } else if (formData.projectType === "elevation_only") {
      const elevationArea = Number.parseFloat(formData.elevationArea) || 0
      if (elevationArea > 0) {
        const rate = formData.elevationDesignType === "3d_2d" ? rates.elevation_3d_2d : rates.elevation_2d
        const elevationCost = elevationArea * rate
        breakdown.elevationCost = elevationCost
        total += elevationCost
      }
    }

    setEstimatedCost(total)
    setCostBreakdown(breakdown)
  }

  const validateStep1 = () => {
    if (!formData.projectType) {
      toast({
        title: t("Project Type Required", "திட்ட வகை தேவை"),
        description: t("Please select a project type", "திட்ட வகையைத் தேர்ந்தெடுக்கவும்"),
        variant: "destructive",
      })
      return false
    }

    if (
      !formData.totalAreaLength ||
      !formData.totalAreaBreadth ||
      Number.parseFloat(formData.totalAreaLength) <= 0 ||
      Number.parseFloat(formData.totalAreaBreadth) <= 0
    ) {
      toast({
        title: t("Total Area Required", "மொத்த பகுதி தேவை"),
        description: t(
          "Please enter both length and breadth for the total area",
          "மொத்த பகுதிக்கு நீளம் மற்றும் அகலம் இரண்டையும் உள்ளிடவும்",
        ),
        variant: "destructive",
      })
      return false
    }

    if (!formData.builtUpArea || Number.parseFloat(formData.builtUpArea) <= 0) {
      toast({
        title: t("Built-up Area Required", "கட்டுமானப் பகுதி தேவை"),
        description: t("Please enter built-up area", "கட்டுமானப் பகுதியை உள்ளிடவும்"),
        variant: "destructive",
      })
      return false
    }

    if (formData.projectType === "new_construction") {
      if (!formData.pricingPackage) {
        toast({
          title: t("Package Required", "தொகுப்பு தேவை"),
          description: t("Please select a pricing package", "விலை தொகுப்பைத் தேர்ந்தெடுக்கவும்"),
          variant: "destructive",
        })
        return false
      }

      const numFloorsInput = Number.parseInt(formData.numFloors) || 0
      const actualFloors = numFloorsInput === 0 ? 1 : numFloorsInput + 1

      if (numFloorsInput > 4) {
        toast({
          title: t("Maximum Floors Exceeded", "அதிகபட்ச தளங்கள் மீறப்பட்டது"),
          description: t("Maximum value is 4 (representing 5 floors)", "அதிகபட்ச மதிப்பு 4 (5 தளங்களை குறிக்கிறது)"),
          variant: "destructive",
        })
        return false
      }

      if (numFloorsInput > 0) {
        const mainArea = Number.parseFloat(formData.builtUpArea) || 0
        for (let i = 2; i <= actualFloors; i++) {
          const floorArea = Number.parseFloat(formData.floorAreas[i] || "0") || 0
          if (floorArea <= 0) {
            toast({
              title: t(`Floor ${i} Area Required`, `தளம் ${i} பகுதி தேவை`),
              description: t(`Please enter area for floor ${i}`, `தளம் ${i} க்கான பகுதியை உள்ளிடவும்`),
              variant: "destructive",
            })
            return false
          }
          if (floorArea > mainArea) {
            toast({
              title: t(`Floor ${i} Area Exceeds Main Floor`, `தளம் ${i} பகுதி முதன்மை தளத்தை மீறுகிறது`),
              description: t(
                `Floor ${i} area must be less than or equal to main floor area`,
                `தளம் ${i} பகுதி முதன்மை தள பகுதிக்கு சமமாகவோ அல்லது குறைவாகவோ இருக்க வேண்டும்`,
              ),
              variant: "destructive",
            })
            return false
          }
        }
      }
    }

    if (formData.projectType === "elevation_only") {
      if (!formData.elevationArea || Number.parseFloat(formData.elevationArea) <= 0) {
        toast({
          title: t("Elevation Area Required", "உயர்வு பகுதி தேவை"),
          description: t("Please enter elevation area", "உயர்வு பகுதியை உள்ளிடவும்"),
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const validateStep2 = () => {
    if (formData.projectType === "new_construction") {
      const headL = Number.parseFloat(formData.headroomLength) || 0
      const headB = Number.parseFloat(formData.headroomBreadth) || 0
      const headH = Number.parseFloat(formData.headroomHeight) || 0

      if (formData.headroomLength && headL < 12) {
        toast({
          title: t("Invalid Headroom Length", "தவறான தலைப்பகுதி நீளம்"),
          description: t("Headroom length must be at least 12 feet", "தலைப்பகுதி நீளம் குறைந்தது 12 அடி இருக்க வேண்டும்"),
          variant: "destructive",
        })
        return false
      }

      if (formData.headroomBreadth && headB < 7) {
        toast({
          title: t("Invalid Headroom Breadth", "தவறான தலைப்பகுதி அகலம்"),
          description: t("Headroom breadth must be at least 7 feet", "தலைப்பகுதி அகலம் குறைந்தது 7 அடி இருக்க வேண்டும்"),
          variant: "destructive",
        })
        return false
      }

      if (formData.headroomLength && formData.headroomBreadth && (headH < 7 || headH > 12)) {
        toast({
          title: t("Invalid Headroom Height", "தவறான தலைப்பகுதி உயரம்"),
          description: t(
            "Headroom height must be between 7 and 12 feet",
            "தலைப்பகுதி உயரம் 7 முதல் 12 அடி வரை இருக்க வேண்டும்",
          ),
          variant: "destructive",
        })
        return false
      }

      if (formData.septicTankEnabled) {
        const septicCapacity = Number.parseFloat(formData.septicTankCapacity) || 0
        if (septicCapacity > 0 && septicCapacity < 4000) {
          toast({
            title: t("Invalid Septic Tank Capacity", "தவறான செப்டிக் தொட்டி கொள்ளளவு"),
            description: t(
              "Septic tank capacity must be at least 4000 liters",
              "செப்டிக் தொட்டி கொள்ளளவு குறைந்தது 4000 லிட்டர் இருக்க வேண்டும்",
            ),
            variant: "destructive",
          })
          return false
        }
      }
    }

    return true
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFloorAreaChange = (floorNum: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      floorAreas: { ...prev.floorAreas, [floorNum]: value },
    }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: t("Contact Information Required", "தொடர்பு தகவல் தேவை"),
        description: t("Please fill in all contact fields", "அனைத்து தொடர்பு புலங்களையும் நிரப்பவும்"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save the final lead data to Supabase before generating PDF
      await captureLead("phone", formData.phone) // This triggers an update with the latest formData in 'details'

      generateQuotationPDF(formData, costBreakdown, estimatedCost)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: t("Quotation Downloaded!", "மேற்கோள் பதிவிறக்கப்பட்டது!"),
        description: t(
          "Your quotation PDF has been downloaded and sent to our team. We'll contact you within 24 hours.",
          "உங்கள் மேற்கோள் PDF பதிவிறக்கப்பட்டு எங்கள் குழுவிற்கு அனுப்பப்பட்டது. 24 மணி நேரத்திற்குள் நாங்கள் உங்களைத் தொடர்பு கொள்வோம்.",
        ),
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        projectType: "",
        builtUpArea: "",
        // Reset total area fields
        totalAreaLength: "",
        totalAreaBreadth: "",
        totalArea: "",
        pricingPackage: "",
        parkingSpace: "",
        numFloors: "1",
        floorAreas: {},
        parapetWallLength: "",
        parapetWallThickness: "4.5",
        headroomLength: "",
        headroomBreadth: "",
        headroomHeight: "7",
        compoundWallEnabled: false,
        compoundWallLength: "",
        compoundWallThickness: "4.5",
        septicTankEnabled: false, // Reset flags
        septicTankCapacity: "",
        coolingTileEnabled: false, // Reset flags
        coolingTileArea: "",
        elevationDesignType: "3d_2d",
        elevationArea: "",
      })
      setStep(1)
    } catch (error) {
      toast({
        title: t("Submission Failed", "சமர்ப்பிப்பு தோல்வியுற்றது"),
        description: t("Please try again later.", "பிறகு முயற்சிக்கவும்."),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveQuote = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: t("Contact Information Required", "தொடர்பு தகவல் தேவை"),
        description: t("Please fill in all contact fields to save", "சேமிக்க அனைத்து தொடர்பு புலங்களையும் நிரப்பவும்"),
        variant: "destructive",
      })
      return
    }

    if (estimatedCost <= 0) {
      toast({
        title: t("No Estimate Available", "மதிப்பீடு இல்லை"),
        description: t("Please complete the project details first", "முதலில் திட்ட விவரங்களை முடிக்கவும்"),
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Simulate saving to local storage
      const quote = {
        id: Date.now().toString(),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        projectType: formData.projectType,
        projectSize: Number.parseFloat(formData.builtUpArea) || 0,
        materials: {
          formData,
          costBreakdown,
        },
        totalCost: estimatedCost,
        createdAt: new Date().toISOString(),
      }

      const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes") || "[]")
      savedQuotes.push(quote)
      localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: t("Quote Saved!", "மேற்கோள் சேமிக்கப்பட்டது!"),
        description: t(
          "Your quote has been saved locally. You can access it anytime from this device.",
          "உங்கள் மேற்கோள் உள்நாட்டில் சேமிக்கப்பட்டது. இந்த சாதனத்திலிருந்து எப்போது வேண்டுமானாலும் அணுகலாம்.",
        ),
      })
    } catch (error) {
      toast({
        title: t("Save Failed", "சேமிப்பு தோல்வியுற்றது"),
        description: t("An unexpected error occurred.", "எதிர்பாராத பிழை ஏற்பட்டது."),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const captureLead = async (field: string, value: string) => {
    if (!value) return

    try {
      const supabase = createClientComponentClient()
      const storedLeadId = localStorage.getItem('ncb_lead_id')

      const leadData = {
        [field]: value,
        updated_at: new Date().toISOString(),
        details: { ...formData, totalCost: estimatedCost, costBreakdown },
        ...(field !== 'name' && formData.name ? { name: formData.name } : {}),
        ...(field !== 'email' && formData.email ? { email: formData.email } : {}),
        ...(field !== 'phone' && formData.phone ? { phone: formData.phone } : {}),
      }

      if (storedLeadId) {
        const { error, data } = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', storedLeadId)
          .select()

        if (!error && data && data.length > 0) {
          console.log(`Captured ${field} (Updated)`)
          return
        } else {
          localStorage.removeItem('ncb_lead_id')
        }
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) throw error

      if (data) {
        localStorage.setItem('ncb_lead_id', data.id)
        console.log(`Captured ${field} (New Insert)`)

        // Trigger Push Notification background task
        // We use fetch without awaiting to not block the UI
        fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Lead Captured!',
            body: `${formData.name || 'Visitor'} has started a quote.`,
            url: '/admin-secret-dashboard',
            icon: '/new-crescent-logo.png'
          })
        }).catch(err => console.error('Push trigger failed', err))
      }

    } catch (error: any) {
      console.error('Error capturing lead:', error)
      toast({
        title: "Connection Error",
        description: "Could not save data. Please check your internet or contact admin.",
        variant: "destructive"
      })
    }
  }

  const renderContactStep = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-bold">
          <Label htmlFor="name">{t("Full Name", "முழு பெயர்")} *</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={(e) => captureLead("name", e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 text-bold">
            <Label htmlFor="email">{t("Email", "மின்னஞ்சல்")} *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={(e) => captureLead("email", e.target.value)}
            />
          </div>
          <div className="space-y-2 text-bold">
            <Label htmlFor="phone">{t("Phone", "தொலைபேசி")} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              onBlur={(e) => captureLead("phone", e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderProjectDetailsStep = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectType" className="text-base font-semibold">
            {t("Project Type", "திட்ட வகை")} *
          </Label>
          <Select
            value={formData.projectType}
            onValueChange={(v) => handleInputChange("projectType", v as ProjectType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select project type", "திட்ட வகையைத் தேர்ந்தெடுக்கவும்")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_construction">{t("New Construction", "புதிய கட்டுமானம்")}</SelectItem>
              <SelectItem value="commercial_building">{t("Commercial Building", "வணிக கட்டிடம்")}</SelectItem>
              <SelectItem value="elevation_only">{t("Elevation Only", "உயர்வு மட்டும்")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.projectType && (
          <>
            <Card id="cost-breakdown" className="bg-muted/30 border-primary/10 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-base">{t("Total Area (Plot/Land)", "மொத்த பகுதி (நிலம்)")}</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAreaLength">{t("Length (meters)", "நீளம் (மீட்டர்)")} *</Label>
                  <Input
                    id="totalAreaLength"
                    type="number"
                    step="0.10"
                    placeholder="e.g., 30"
                    value={formData.totalAreaLength}
                    onChange={(e) => handleInputChange("totalAreaLength", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAreaBreadth">{t("Breadth (meters)", "அகலம் (மீட்டர்)")} *</Label>
                  <Input
                    id="totalAreaBreadth"
                    type="number"
                    step="0.10"
                    placeholder="e.g., 20"
                    value={formData.totalAreaBreadth}
                    onChange={(e) => handleInputChange("totalAreaBreadth", e.target.value)}
                  />
                </div>
              </div>

              {formData.totalArea && (
                <div className="bg-background rounded-md p-3 border border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{t("Total Area", "மொத்த பகுதி")}</span>
                    <span className="text-lg font-bold text-primary">
                      {formData.totalArea} {t("sq.m", "சதுர மீ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Auto-calculated from length × breadth", "நீளம் × அகலம் இலிருந்து தானாக கணக்கிடப்பட்டது")}
                  </p>
                </div>
              )}
            </Card>

            <div className="space-y-2">
              <Label htmlFor="builtUpArea">
                <Ruler className="h-4 w-4 inline mr-2" />
                {t("Built-up Area (sq.ft)", "கட்டுமானப் பகுதி (சதுர அடி)")} *
              </Label>
              <Input
                id="builtUpArea"
                type="number"
                placeholder="e.g., 1800"
                value={formData.builtUpArea}
                onChange={(e) => handleInputChange("builtUpArea", e.target.value)}
              />
            </div>

            {formData.projectType === "new_construction" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pricingPackage">{t("Pricing Package", "விலை தொகுப்பு")} *</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pricingPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary ${formData.pricingPackage === pkg.id ? "border-primary bg-primary/5" : "border-muted"
                          }`}
                        onClick={() => handleInputChange("pricingPackage", pkg.id)}
                      >
                        <h3 className="font-semibold text-base mb-1">
                          {language === "ta" ? pkg.name_ta : pkg.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {language === "ta" ? pkg.description_ta : pkg.description}
                        </p>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-bold text-primary">
                            ₹{pkg.price_per_sqft}
                            <span className="text-sm font-normal text-muted-foreground">/sq.ft</span>
                          </span>
                          {formData.pricingPackage === pkg.id && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numFloors">{t("Number of Additional Floors", "கூடுதல் தளங்களின் எண்ணிக்கை")} *</Label>
                  <Input
                    id="numFloors"
                    type="number"
                    min="0"
                    max="4"
                    placeholder="0-4"
                    value={formData.numFloors}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value) || 0
                      if (val > 4) {
                        toast({
                          title: t("Maximum 4 Additional Floors", "அதிகபட்சம் 4 கூடுதல் தளங்கள்"),
                          description: t("Maximum value is 4", "அதிகபட்ச மதிப்பு 4"),
                          variant: "destructive",
                        })
                        return
                      }
                      handleInputChange("numFloors", e.target.value)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "Maximum 4",
                      "அதிகபட்சம் 4",
                    )}
                  </p>
                  {Number.parseInt(formData.numFloors) > 4 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {t("Maximum value is 4 (5 floors total)", "அதிகபட்ச மதிப்பு 4 (மொத்தம் 5 தளங்கள்)")}
                    </p>
                  )}
                </div>

                {Number.parseInt(formData.numFloors) > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {t("Built-up Area for Each Additional Floor", "ஒவ்வொரு கூடுதல் தளத்திற்கும் கட்டுமானப் பகுதி")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "Each floor area must be less than or equal to the main built-up area",
                        "ஒவ்வொரு தள பகுதியும் முதன்மை கட்டுமானப் பகுதிக்கு சமமாகவோ அல்லது குறைவாகவோ இருக்க வேண்டும்",
                      )}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Array.from({ length: Number.parseInt(formData.numFloors) }, (_, i) => i + 2).map((floorNum) => (
                        <div key={floorNum} className="space-y-2">
                          <Label>{t(`Floor ${floorNum} (sq.ft)`, `தளம் ${floorNum} (சதுர அடி)`)} *</Label>
                          <Input
                            type="number"
                            placeholder={`EG: ${formData.builtUpArea || "1800"}`}
                            value={formData.floorAreas[floorNum] || ""}
                            onChange={(e) => handleFloorAreaChange(floorNum, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {formData.projectType === "elevation_only" && (
              <>
                <div className="space-y-2">
                  <Label>{t("Design Type", "வடிவமைப்பு வகை")} *</Label>
                  <RadioGroup
                    value={formData.elevationDesignType}
                    onValueChange={(v) => handleInputChange("elevationDesignType", v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3d_2d" id="3d_2d" />
                      <Label htmlFor="3d_2d" className="font-normal cursor-pointer">
                        {t("3D + 2D (₹12/sq.ft)", "3D + 2D (₹12/சதுர அடி)")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2d_only" id="2d_only" />
                      <Label htmlFor="2d_only" className="font-normal cursor-pointer">
                        {t("2D Only (₹2/sq.ft)", "2D மட்டும் (₹2/சதுர அடி)")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elevationArea">{t("Elevation Area (sq.ft)", "உயர்வு பகுதி (சதுர அடி)")} *</Label>
                  <Input
                    id="elevationArea"
                    type="number"
                    placeholder="e.g., 1800"
                    value={formData.elevationArea}
                    onChange={(e) => handleInputChange("elevationArea", e.target.value)}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    )
  }

  const renderAdditionalFeaturesStep = () => {
    if (formData.projectType === "elevation_only") {
      return (
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground text-sm px-4">
            {t("No additional features for elevation only projects", "உயர்வு மட்டும் திட்டங்களுக்கு கூடுதல் அம்சங்கள் இல்லை")}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Parapet Wall */}
        <div className="space-y-4 border-b pb-4">
          <h4 className="font-bold text-base">{t("Parapet Wall", "பாராபெட் சுவர்")}</h4>
          <div className="space-y-2">
            <Label className="text-sm font-bold">{t("Length (Running Feet)", "நீளம் (ஓடும் அடி)")}</Label>
            <Input
              type="number"
              value={formData.parapetWallLength}
              onChange={(e) => handleInputChange("parapetWallLength", e.target.value)}
              placeholder="Auto-calculated"
              className="text-sm font-semibold"
            />
            <p className="text-xs text-muted-foreground break-words">
              {t("Formula: ((Built-up Area / 40) + 40) × 2", "சூத்திரம்: ((கட்டுமானப் பகுதி / 40) + 40) × 2")}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold">{t("Wall Thickness", "சுவர் தடிமன்")}</Label>
            <RadioGroup
              value={formData.parapetWallThickness}
              onValueChange={(v) => handleInputChange("parapetWallThickness", v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4.5" id="parapet_4.5" />
                <Label htmlFor="parapet_4.5" className="font-semibold cursor-pointer text-sm break-words">
                  {t("4.5 inches (₹600/running foot)", "4.5 அங்குலம் (₹600/ஓடும் அடி)")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="9" id="parapet_9" />
                <Label htmlFor="parapet_9" className="font-semibold cursor-pointer text-sm break-words">
                  {t("9 inches (₹800/running foot)", "9 அங்குலம் (₹800/ஓடும் அடி)")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Headroom */}
        <div className="space-y-4 border-b pb-4">
          <h4 className="font-bold text-base">{t("Headroom", "தலைப்பகுதி")}</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-bold">{t("Length (ft)", "நீளம் (அடி)")}</Label>
              <Input
                type="number"
                min="12"
                value={formData.headroomLength}
                onChange={(e) => handleInputChange("headroomLength", e.target.value)}
                placeholder="Min: 12"
                className="text-sm font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-bold">{t("Breadth (ft)", "அகலம் (அடி)")}</Label>
              <Input
                type="number"
                min="7"
                value={formData.headroomBreadth}
                onChange={(e) => handleInputChange("headroomBreadth", e.target.value)}
                placeholder="Min: 7"
                className="text-sm font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-bold">{t("Height (ft)", "உயரம் (அடி)")}</Label>
              <Input
                type="number"
                min="7"
                max="12"
                value={formData.headroomHeight}
                onChange={(e) => handleInputChange("headroomHeight", e.target.value)}
                placeholder="7-12"
                className="text-sm font-semibold"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground break-words">
            {t(
              "Length min: 12ft, Breadth min: 7ft, Height: 7-12ft",
              "நீளம் குறைந்தது: 12அடி, அகலம் குறைந்தது: 7அடி, உயரம்: 7-12அடி",
            )}
          </p>
        </div>

        {formData.projectType === "new_construction" && (
          <>
            <div className="space-y-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <input
                  id="parkingEnabled"
                  type="checkbox"
                  checked={!!formData.parkingSpace}
                  onChange={(e) => handleInputChange("parkingSpace", e.target.checked ? "150" : "")}
                  className="h-4 w-4"
                />
                <Label htmlFor="parkingEnabled" className="font-bold text-sm md:text-base cursor-pointer">
                  {t("Include Parking Space", "வாகனம் நிறுத்தும் இடம் சேர்க்கவும்")}
                </Label>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">{t("Area (sq.ft)", "பகுதி (சதுர அடி)")}</Label>
                <Input
                  type="number"
                  value={formData.parkingSpace}
                  onChange={(e) => handleInputChange("parkingSpace", e.target.value)}
                  placeholder="e.g., 200"
                  className="text-sm font-semibold"
                />
                <p className="text-xs text-muted-foreground break-words">
                  {t(`Cost: ₹${rates.parking_sqft}/sq.ft`, `செலவு: ₹${rates.parking_sqft}/சதுர அடி`)}
                </p>
              </div>
            </div>

            {/* Compound Wall */}
            <div className="space-y-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <input
                  id="compoundWallEnabled"
                  type="checkbox"
                  checked={formData.compoundWallEnabled}
                  onChange={(e) => handleInputChange("compoundWallEnabled", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="compoundWallEnabled" className="font-bold text-sm md:text-base cursor-pointer">
                  {t("Include Compound Wall", "மதில் சுவர் சேர்க்கவும்")}
                </Label>
              </div>
              {formData.compoundWallEnabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">{t("Length (Running Feet)", "நீளம் (ஓடும் அடி)")}</Label>
                    <Input
                      type="number"
                      value={formData.compoundWallLength}
                      onChange={(e) => handleInputChange("compoundWallLength", e.target.value)}
                      placeholder="e.g., 100"
                      className="text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">{t("Wall Thickness", "சுவர் தடிமன்")}</Label>
                    <RadioGroup
                      value={formData.compoundWallThickness}
                      onValueChange={(v) => handleInputChange("compoundWallThickness", v)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4.5" id="compound_4.5" />
                        <Label htmlFor="compound_4.5" className="font-semibold cursor-pointer text-sm break-words">
                          {t("4.5 inches (₹2450/running foot)", "4.5 அங்குலம் (₹2450/ஓடும் அடி)")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="9" id="compound_9" />
                        <Label htmlFor="compound_9" className="font-semibold cursor-pointer text-sm break-words">
                          {t("9 inches (₹2600/running foot)", "9 அங்குலம் (₹2600/ஓடும் அடி)")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <p className="text-xs text-muted-foreground break-words">
                    {t("Note: Gate is excluded", "குறிப்பு: வாயில் தவிர்க்கப்பட்டது")}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-4 border-b pb-4">
              <div className="flex items-center gap-3">
                <input
                  id="septicTankEnabled"
                  type="checkbox"
                  checked={formData.septicTankEnabled}
                  onChange={(e) => handleInputChange("septicTankEnabled", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="septicTankEnabled" className="font-bold text-sm md:text-base cursor-pointer">
                  {t("Include Septic Tank", "செப்டிக் தொட்டி சேர்க்கவும்")}
                </Label>
              </div>
              {formData.septicTankEnabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">{t("Capacity (Liters)", "கொள்ளளவு (லிட்டர்)")}</Label>
                    <Input
                      type="number"
                      min="4000"
                      value={formData.septicTankCapacity}
                      onChange={(e) => handleInputChange("septicTankCapacity", e.target.value)}
                      placeholder="Min: 4000"
                      className="text-sm font-semibold"
                    />
                    <p className="text-xs text-muted-foreground break-words">
                      {t("Minimum: 4000L. Cost: ₹20/liter", "குறைந்தபட்சம்: 4000L. செலவு: ₹20/லிட்டர்")}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Cooling Tile */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  id="coolingTileEnabled"
                  type="checkbox"
                  checked={formData.coolingTileEnabled}
                  onChange={(e) => handleInputChange("coolingTileEnabled", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="coolingTileEnabled" className="font-bold text-sm md:text-base cursor-pointer">
                  {t("Include Cooling Tile", "குளிரூட்டும் ஓடு சேர்க்கவும்")}
                </Label>
              </div>
              {formData.coolingTileEnabled && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">{t("Area (sq.ft)", "பகுதி (சதுர அடி)")}</Label>
                    <Input
                      type="number"
                      value={formData.coolingTileArea}
                      disabled
                      className="bg-muted text-sm font-semibold"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-muted-foreground break-words">
                      {t(
                        "Formula: Built-up Area + Parapet Wall Area. Cost: ₹110/sq.ft",
                        "சூத்திரம்: கட்டுமானப் பகுதி + பாராபெட் சுவர் பகுதி. செலவு: ₹110/சதுர அடி",
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <section id="quotation" className="py-6 md:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full mb-4">
              <Calculator className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 text-balance px-2">
              {t("Calculate Your", "உங்கள் கணக்கிடுங்கள்")}{" "}
              <span className="text-primary">{t("Construction Cost", "கட்டுமான செலவு")}</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {t(
                "Get an instant, transparent estimate for your construction project",
                "உங்கள் கட்டுமான திட்டத்திற்கான உடனடி, வெளிப்படையான மதிப்பீட்டைப் பெறுங்கள்",
              )}
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
                English
              </Button>
              <Button variant={language === "ta" ? "default" : "outline"} size="sm" onClick={() => setLanguage("ta")}>
                தமிழ்
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 md:mb-10 overflow-x-auto pb-2 px-2">
            {[
              { num: 1, label: t("Contact", "தொடர்பு"), icon: Home },
              { num: 2, label: t("Project", "திட்டம்"), icon: Building2 },
              { num: 3, label: t("Features", "அம்சங்கள்"), icon: CheckCircle2 },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap ${step >= s.num ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"
                    }`}
                >
                  <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold hidden xs:inline">{s.label}</span>
                  <span className="text-xs sm:text-sm font-semibold xs:hidden">{s.num}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-4 sm:w-6 md:w-8 h-1 rounded flex-shrink-0 ${step > s.num ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:gap-8 items-start">
            {/* Form - Full width on mobile, left 2 cols on desktop */}
            <div className="lg:col-span-2 order-1">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl break-words">
                    {step === 1 && t("Contact Information", "தொடர்பு விவரங்கள்")}
                    {step === 2 && t("Project Details", "திட்ட விவரங்கள்")}
                    {step === 3 && t("Additional Features", "கூடுதல் அம்சங்கள்")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm break-words">
                    {step === 1 && t("How can we reach you?", "நாங்கள் உங்களை எவ்வாறு தொடர்பு கொள்ளலாம்?")}
                    {step === 2 &&
                      t("Select your project type and enter details", "உங்கள் திட்ட வகையைத் தேர்ந்தெடுத்து விவரங்களை உள்ளிடவும்")}
                    {step === 3 && t("Add optional features to your project", "உங்கள் திட்டத்தில் விருப்ப அம்சங்களைச் சேர்க்கவும்")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step === 1 && renderContactStep()}
                      {step === 2 && renderProjectDetailsStep()}
                      {step === 3 && renderAdditionalFeaturesStep()}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-4 sm:pt-5 border-t mt-5 sm:mt-6 gap-2 sm:gap-3 flex-wrap">
                    {step > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        {t("Previous", "முந்தையது")}
                      </Button>
                    )}
                    <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
                      {step === 3 && estimatedCost > 0 && (
                        <Button
                          onClick={handleSaveQuote}
                          disabled={isSaving}
                          variant="outline"
                          className="flex items-center gap-1.5 sm:gap-2 bg-transparent text-xs sm:text-sm"
                          size="sm"
                        >
                          <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {isSaving ? t("Saving...", "சேமிக்கிறது...") : t("Save Quote", "மேற்கோளைச் சேமி")}
                        </Button>
                      )}
                      {step < 3 ? (
                        <Button
                          onClick={() => {
                            if (step === 1) {
                              if (!formData.name?.trim() || !formData.email?.trim() || !formData.phone?.trim()) {
                                toast({
                                  title: t("Required Fields Missing", "தேவையான புலங்கள் விடுபட்டுள்ளன"),
                                  description: t(
                                    "Please enter your Name, Email, and Phone Number to continue.",
                                    "தொடர உங்கள் பெயர், மின்னஞ்சல் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்."
                                  ),
                                  variant: "destructive",
                                })
                                return
                              }
                            }
                            if (step === 2 && !validateStep1()) return
                            if (step === 3 && !validateStep2()) return
                            setStep(step + 1)
                          }}
                          size="sm"
                          className="text-xs sm:text-sm"
                        >
                          {t("Next Step", "அடுத்த படி")}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                          size="sm"
                        >
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">
                            {isSubmitting
                              ? t("Generating PDF...", "PDF உருவாக்குகிறது...")
                              : t("Download Quotation PDF", "மேற்கோள் PDF பதிவிறக்கவும்")}
                          </span>
                          <span className="sm:hidden">
                            {isSubmitting ? t("Generating...", "உருவாக்குகிறது...") : t("Download", "பதிவிறக்கு")}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 order-2 lg:sticky lg:top-32 h-fit z-30">
              <Card className="bg-card border-border shadow-xl">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg break-words text-foreground font-bold">
                    {t("Cost Estimate", "செலவு மதிப்பீடு")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm break-words text-muted-foreground">
                    {t("Real-time calculation", "நிகழ்நேர கணக்கீடு")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {estimatedCost > 0 ? (
                    <>
                      <div className="space-y-2 sm:space-y-2.5">
                        {Object.entries(costBreakdown).map(([key, value]) => {
                          if (value <= 0) return null
                          const labels: Record<string, { en: string; ta: string }> = {
                            packageCost: { en: "Package Base", ta: "தொகுப்பு அடிப்படை" },
                            parkingCost: { en: "Parking Space", ta: "வாகனம் நிறுத்தும் இடம்" },
                            additionalFloorsCost: { en: "Additional Floors", ta: "கூடுதல் தளங்கள்" },
                            parapetWallCost: { en: "Parapet Wall", ta: "பாராபெட் சுவர்" },
                            headroomCost: { en: "Headroom", ta: "தலைப்பகுதி" },
                            compoundWallCost: { en: "Compound Wall", ta: "மதில் சுவர்" },
                            septicTankCost: { en: "Septic Tank", ta: "செப்டிக் தொட்டி" },
                            coolingTileCost: { en: "Cooling Tile", ta: "குளிரூட்டும் ஓடு" },
                            commercialBuildingCost: { en: "Commercial Building", ta: "வணிக கட்டிடம்" },
                            elevationCost: { en: "Elevation Design", ta: "உயர்வு வடிவமைப்பு" },
                          }
                          const label = labels[key] || { en: key, ta: key }
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between text-xs sm:text-sm pb-1.5 sm:pb-2 border-b border-border gap-2"
                            >
                              <span className="font-semibold break-words flex-1 text-muted-foreground">
                                {language === "ta" ? label.ta : label.en}
                              </span>
                              <span className="font-bold whitespace-nowrap text-foreground text-xs sm:text-sm">
                                ₹{value.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="border-t border-border pt-2.5 sm:pt-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm sm:text-base break-words text-foreground">
                            {t("Total Estimate", "மொத்த மதிப்பீடு")}
                          </span>
                          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary whitespace-nowrap drop-shadow-lg">
                            ₹{estimatedCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 sm:p-4 text-xs text-muted-foreground border border-border">
                        <p className="leading-relaxed break-words">
                          {t(
                            "* This is an approximate estimate. Final cost may vary based on site conditions.",
                            "* இது ஒரு தோராயமான மதிப்பீடு. தள நிலைமைகளின் அடிப்படையில் இறுதி செலவு மாறுபடலாம்.",
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <Calculator className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                      <p className="text-xs sm:text-sm break-words px-2">
                        {t(
                          "Fill in the project details to see your cost estimate",
                          "உங்கள் செலவு மதிப்பீட்டைப் பார்க்க திட்ட விவரங்களை நிரப்பவும்",
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Summary Bar */}
      <AnimatePresence>
        {estimatedCost > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 bg-background/95 backdrop-blur-lg border border-border p-4 rounded-2xl shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("Total Estimate", "மொத்த மதிப்பீடு")}</p>
                <p className="text-xl font-bold text-primary">₹{estimatedCost.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-border text-foreground hover:bg-muted"
                  onClick={() => {
                    const detailsElement = document.getElementById("cost-breakdown");
                    if (detailsElement) detailsElement.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("View", "பார்")}
                </Button>
                <Button size="sm" onClick={handleSaveQuote}>
                  <Save className="w-4 h-4 mr-2" />
                  {t("Save", "சேமி")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
