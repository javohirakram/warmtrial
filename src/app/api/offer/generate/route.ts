import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"

interface OfferData {
  title: string
  type: "CONTRACT" | "FULL_TIME"
  salary?: number
  hourlyRate?: number
  equity?: number
  vestingSchedule?: string
  benefits: string[]
  responsibilities: string
  startDate?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const { trialId, offerData }: { trialId: string, offerData: OfferData } = await request.json()

    if (!trialId || !offerData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get trial and related data
    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
      include: {
        candidate: true,
        founder: true,
        match: {
          include: { role: true }
        }
      }
    })

    if (!trial || trial.founderId !== session.user.id) {
      return NextResponse.json(
        { error: "Trial not found or unauthorized" },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    const margin = 20
    let yPosition = 30

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont("helvetica", "bold")
      } else {
        pdf.setFont("helvetica", "normal")
      }
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      pdf.text(lines, margin, yPosition)
      yPosition += lines.length * (fontSize * 0.6) + 5
    }

    // Header
    addText("OFFER LETTER", 20, true)
    yPosition += 10

    addText(`Date: ${new Date().toLocaleDateString()}`, 12)
    yPosition += 5

    addText(`Dear ${trial.candidate.name},`, 12)
    yPosition += 5

    // Opening paragraph
    addText(
      `We are pleased to offer you the position of ${offerData.title} at our company. Based on your excellent performance during the trial project and our discussions, we believe you would be a valuable addition to our team.`,
      12
    )
    yPosition += 5

    // Position Details
    addText("POSITION DETAILS:", 14, true)
    yPosition += 5

    addText(`Position: ${offerData.title}`, 12)
    addText(`Employment Type: ${offerData.type === "FULL_TIME" ? "Full-Time Employee" : "Contract/Freelance"}`, 12)

    // Compensation
    if (offerData.type === "FULL_TIME" && offerData.salary) {
      addText(`Annual Salary: $${offerData.salary.toLocaleString()}`, 12)
    } else if (offerData.type === "CONTRACT" && offerData.hourlyRate) {
      addText(`Hourly Rate: $${offerData.hourlyRate}/hour`, 12)
    }

    if (offerData.equity && offerData.type === "FULL_TIME") {
      addText(`Equity: ${offerData.equity}% of company shares`, 12)
      if (offerData.vestingSchedule) {
        addText(`Vesting Schedule: ${offerData.vestingSchedule}`, 12)
      }
    }

    if (offerData.startDate) {
      addText(`Start Date: ${new Date(offerData.startDate).toLocaleDateString()}`, 12)
    }

    yPosition += 10

    // Benefits
    if (offerData.benefits.length > 0 && offerData.type === "FULL_TIME") {
      addText("BENEFITS & PERKS:", 14, true)
      yPosition += 5
      
      offerData.benefits.forEach(benefit => {
        addText(`• ${benefit}`, 12)
      })
      yPosition += 5
    }

    // Responsibilities
    if (offerData.responsibilities) {
      addText("KEY RESPONSIBILITIES:", 14, true)
      yPosition += 5
      addText(offerData.responsibilities, 12)
      yPosition += 10
    }

    // Closing
    addText(
      "This offer is contingent upon successful completion of our standard background check and reference verification process.",
      12
    )
    yPosition += 5

    addText(
      "Please confirm your acceptance of this offer by signing and returning this letter by [DATE]. We are excited about the possibility of you joining our team and look forward to your response.",
      12
    )
    yPosition += 10

    addText("Sincerely,", 12)
    yPosition += 15
    addText(`${trial.founder.name}`, 12)
    addText("Founder", 12)
    yPosition += 20

    addText("Accepted by:", 12)
    yPosition += 15
    addText("_________________________", 12)
    addText(`${trial.candidate.name}`, 12)
    yPosition += 10
    addText("Date: _________________________", 12)

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="offer-letter-${trial.candidate.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`
      }
    })

  } catch (error) {
    console.error("Error generating offer PDF:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}