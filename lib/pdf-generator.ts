import jsPDF from "jspdf"

interface ProjectDetails {
  name: string
  email: string
  phone: string
  message: string
  projectType: string
  builtUpArea: string
  totalAreaLength?: string
  totalAreaBreadth?: string
  totalArea?: string
  pricingPackage?: string
  parkingSpace?: string
  numFloors?: string
  floorAreas?: Record<number, string>
  parapetWallLength?: string
  parapetWallThickness?: string
  headroomLength?: string
  headroomBreadth?: string
  headroomHeight?: string
  compoundWallEnabled?: boolean
  compoundWallLength?: string
  compoundWallThickness?: string
  septicTankEnabled?: boolean
  septicTankCapacity?: string
  coolingTileEnabled?: boolean
  coolingTileArea?: string
  elevationDesignType?: string
}

interface CostBreakdown {
  [key: string]: number
}

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

interface CalculatorCostBreakdown {
  baseConstruction: number
  materials: number
  labor: number
  permits: number
  contingency: number
  total: number
}

// Function to load image from public folder
const getBackgroundImage = async (): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = '/pdf-background.png'
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export async function generateQuotationPDF(projectDetails: ProjectDetails, costBreakdown: CostBreakdown, totalCost: number) {
  const doc = new jsPDF()

  // Colors
  const primaryColor: [number, number, number] = [184, 134, 11] // Golden
  const accentColor: [number, number, number] = [41, 128, 185] // Blue
  const textColor: [number, number, number] = [51, 51, 51]
  const lightGray: [number, number, number] = [240, 240, 240]
  const highlightGold: [number, number, number] = [255, 250, 230]

  // Wait for background image to load
  let bgImage: HTMLImageElement | null = null
  try {
    bgImage = await getBackgroundImage()
  } catch (error) {
    console.error("Failed to load PDF background", error)
    // Continue without background or handle error
  }

  const addBackgroundToPage = (doc: jsPDF, pageNum: number) => {
    if (bgImage) {
      doc.addImage(bgImage, 'PNG', 0, 0, 210, 297) // A4 size

      // Patch the date area with a white rectangle to overwrite image date if needed, 
      // or just print over it if it's blank. The user said "observe image work on pdf generator those background has to be exactly like this". 
      // The image has a static date "6 November 2025". We likely want to overwrite it with current date.
      // Approx position for date based on user image: Top Right.
      doc.setFillColor(255, 255, 255)
      doc.rect(175, 40, 30, 10, 'F') // Erase old date area if needed, adjusting coordinates based on standard A4 layout relative to image

      // Add dynamic date
      const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(100, 100, 100)
      doc.text(currentDate, 200, 45, { align: "right" }) // Adjust alignment to match image style
    }
  }

  // Initial setup
  addBackgroundToPage(doc, 1) // Add to first page

  // Content Start Position (below header logo)
  let yPosition = 60

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("CONSTRUCTION QUOTATION", 105, yPosition, { align: "center" })
  yPosition += 15

  // -- Client Info --
  doc.setFillColor(...accentColor)
  doc.rect(20, yPosition - 4, 170, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("CLIENT INFORMATION", 25, yPosition + 1)
  yPosition += 10

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.text(`Name: ${projectDetails.name}`, 25, yPosition)
  yPosition += 6
  doc.text(`Email: ${projectDetails.email}`, 25, yPosition)
  yPosition += 6
  doc.text(`Phone: ${projectDetails.phone}`, 25, yPosition)
  yPosition += 12
  // -- Project Details --
  doc.setFillColor(...primaryColor)
  doc.rect(20, yPosition - 4, 170, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("PROJECT DETAILS", 25, yPosition + 1)
  yPosition += 12

  doc.setTextColor(...textColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const projectTypeLabels: Record<string, string> = {
    new_construction: "New Construction",
    commercial_building: "Commercial Building",
    elevation_only: "Elevation Only",
  }
  doc.text(`Project Type: ${projectTypeLabels[projectDetails.projectType] || projectDetails.projectType}`, 25, yPosition)
  yPosition += 8

  // Area Box
  if (projectDetails.totalArea) {
    doc.setFillColor(...highlightGold)
    doc.rect(20, yPosition - 4, 170, 20, "F")
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.1)
    doc.rect(20, yPosition - 4, 170, 20, "S")

    doc.setFont("helvetica", "bold")
    doc.text("Total Area (Plot/Land)", 25, yPosition)
    yPosition += 6
    doc.setFont("helvetica", "normal")
    doc.text(`Dimensions: ${projectDetails.totalAreaLength}m x ${projectDetails.totalAreaBreadth}m`, 25, yPosition)
    yPosition += 6
    doc.setFont("helvetica", "bold")
    doc.text(`Total Area: ${projectDetails.totalArea} sq.m`, 25, yPosition)
    yPosition += 10
  }

  // Built up area
  doc.setFont("helvetica", "bold")
  doc.text(`Built-up Area: ${projectDetails.builtUpArea} sq.ft`, 25, yPosition)
  yPosition += 8

  // Package
  if (projectDetails.pricingPackage) {
    const packageLabels: Record<string, string> = {
      premium: "Premium Package",
      elite: "Elite Package",
    }
    doc.setFont("helvetica", "normal")
    doc.text(`Package: ${packageLabels[projectDetails.pricingPackage] || projectDetails.pricingPackage}`, 25, yPosition)
    yPosition += 6
  }

  // Other details
  if (projectDetails.numFloors && parseInt(projectDetails.numFloors) > 0) {
    doc.text(`Floors: G + ${projectDetails.numFloors}`, 25, yPosition)
    yPosition += 6
  }

  if (projectDetails.parkingSpace) {
    doc.text(`Parking: ${projectDetails.parkingSpace} sq.ft`, 25, yPosition)
    yPosition += 6
  }

  yPosition += 6

  // -- Additional Features --
  if (
    projectDetails.parapetWallLength ||
    projectDetails.headroomLength ||
    projectDetails.compoundWallEnabled ||
    projectDetails.septicTankEnabled ||
    projectDetails.coolingTileEnabled
  ) {
    if (yPosition > 240) {
      doc.addPage()
      addBackgroundToPage(doc, doc.getNumberOfPages())
      yPosition = 60
    }

    doc.setFillColor(...accentColor)
    doc.rect(20, yPosition - 4, 170, 8, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("ADDITIONAL FEATURES", 25, yPosition + 1)
    yPosition += 12

    doc.setTextColor(...textColor)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    if (projectDetails.parapetWallLength) {
      doc.text(`- Parapet Wall: ${projectDetails.parapetWallLength} ft`, 25, yPosition); yPosition += 6
    }
    if (projectDetails.headroomLength) {
      doc.text(`- Headroom: ${projectDetails.headroomLength}x${projectDetails.headroomBreadth} ft`, 25, yPosition); yPosition += 6
    }
    if (projectDetails.compoundWallEnabled) {
      doc.text(`- Compound Wall: ${projectDetails.compoundWallLength} ft`, 25, yPosition); yPosition += 6
    }
    if (projectDetails.septicTankEnabled) {
      doc.text(`- Septic Tank: ${projectDetails.septicTankCapacity} L`, 25, yPosition); yPosition += 6
    }
    if (projectDetails.coolingTileEnabled) {
      doc.text(`- Cooling Tiles: ${projectDetails.coolingTileArea} sq.ft`, 25, yPosition); yPosition += 6
    }
    yPosition += 6
  }

  // -- Cost Breakdown --
  if (yPosition > 220) {
    doc.addPage()
    addBackgroundToPage(doc, doc.getNumberOfPages())
    yPosition = 60
  }

  doc.setFillColor(...primaryColor)
  doc.rect(20, yPosition - 4, 170, 8, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("COST ESTIMATE", 25, yPosition + 1)
  yPosition += 12

  // Table Header
  doc.setFillColor(230, 230, 230)
  doc.rect(20, yPosition - 5, 170, 10, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Description", 25, yPosition)
  doc.text("Amount (Rs.)", 160, yPosition)
  yPosition += 10

  // Items
  doc.setFont("helvetica", "normal")
  const costLabels: Record<string, string> = {
    packageCost: "Base Construction Cost",
    parkingCost: "Parking Area Cost",
    additionalFloorsCost: "Additional Floors Cost",
    parapetWallCost: "Parapet Wall",
    headroomCost: "Headroom Construction",
    compoundWallCost: "Compound Wall",
    septicTankCost: "Septic Tank",
    coolingTileCost: "Cooling Tiles",
    commercialBuildingCost: "Commercial Building Base",
    elevationCost: "Elevation Design Charges",
  }

  Object.entries(costBreakdown).forEach(([key, value]) => {
    if (value > 0) {
      if (yPosition > 250) { // Keep margin for footer
        doc.addPage()
        addBackgroundToPage(doc, doc.getNumberOfPages())
        yPosition = 60
        // Redraw header
        doc.setFillColor(230, 230, 230)
        doc.rect(20, yPosition - 5, 170, 10, "F")
        doc.text("Description", 25, yPosition)
        doc.text("Amount (Rs.)", 160, yPosition)
        yPosition += 10
      }

      doc.text(costLabels[key] || key, 25, yPosition)
      doc.text(value.toLocaleString("en-IN"), 160, yPosition)
      yPosition += 8
    }
  })

  // Total
  yPosition += 5
  doc.setLineWidth(0.5)
  doc.setDrawColor(...primaryColor)
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 8

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("TOTAL ESTIMATED COST", 25, yPosition)
  doc.text(`Rs. ${totalCost.toLocaleString("en-IN")}`, 160, yPosition)

  // Save
  const timestamp = new Date().toISOString().split("T")[0]
  const filename = `NCB_Quotation_${projectDetails.name.replace(/\s+/g, "_")}_${timestamp}.pdf`
  doc.save(filename)
}

export async function generateCalculatorPDF(projectData: ProjectData, costBreakdown: CalculatorCostBreakdown) {
  const doc = new jsPDF()
  const primaryColor: [number, number, number] = [184, 134, 11]
  const textColor: [number, number, number] = [51, 51, 51]

  // Wait for background image
  let bgImage: HTMLImageElement | null = null
  try {
    bgImage = await getBackgroundImage()
  } catch (error) {
    console.error("Failed to load PDF background", error)
  }

  const addBackgroundToPage = (doc: jsPDF) => {
    if (bgImage) {
      doc.addImage(bgImage, 'PNG', 0, 0, 210, 297)
      // Date overlay
      doc.setFillColor(255, 255, 255)
      doc.rect(175, 40, 30, 10, 'F')
      const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(100, 100, 100)
      doc.text(currentDate, 200, 45, { align: "right" })
    }
  }

  addBackgroundToPage(doc)
  let yPosition = 65

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("PROJECT COST ESTIMATE", 105, yPosition, { align: "center" })
  yPosition += 15

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Project Summary", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Project Type: ${projectData.projectType}`, 20, yPosition); yPosition += 6
  doc.text(`Built-up Area: ${projectData.measurements.builtUpArea} sq.m`, 20, yPosition); yPosition += 6
  doc.text(`Total Plot Area: ${projectData.measurements.totalArea} sq.m`, 20, yPosition); yPosition += 12

  // Breakdown
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Cost Breakdown", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const items = [
    { label: "Base Construction", val: costBreakdown.baseConstruction },
    { label: "Materials", val: costBreakdown.materials },
    { label: "Labor", val: costBreakdown.labor },
    { label: "Permits", val: costBreakdown.permits },
    { label: "Contingency", val: costBreakdown.contingency },
  ]

  items.forEach(item => {
    doc.text(item.label, 20, yPosition)
    doc.text(`Rs. ${item.val.toLocaleString("en-IN")}`, 150, yPosition)
    yPosition += 7
  })

  yPosition += 5
  doc.setLineWidth(0.5)
  doc.setDrawColor(...primaryColor)
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 8

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("TOTAL ESTIMATE", 20, yPosition)
  doc.text(`Rs. ${costBreakdown.total.toLocaleString("en-IN")}`, 150, yPosition)

  const timestamp = new Date().toISOString().split("T")[0]
  const filename = `NCB_Estimate_${projectData.projectType}_${timestamp}.pdf`
  doc.save(filename)
}
