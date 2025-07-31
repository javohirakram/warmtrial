import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

interface CheckoutRequest {
  matchId: string
  trial: {
    title: string
    description: string
    requirements: string
    deliverables: string
    timeline: string
    fee: number
  }
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

    const { matchId, trial }: CheckoutRequest = await request.json()

    if (!matchId || !trial) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the match exists and user owns it
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { 
        candidate: true,
        role: true,
        founder: true
      }
    })

    if (!match || match.founderId !== session.user.id) {
      return NextResponse.json(
        { error: "Match not found or unauthorized" },
        { status: 404 }
      )
    }

    // Create trial record
    const trialRecord = await prisma.trial.create({
      data: {
        title: trial.title,
        description: trial.description,
        requirements: trial.requirements,
        deliverables: trial.deliverables,
        timeline: trial.timeline,
        fee: trial.fee,
        status: "PENDING_PAYMENT",
        matchId,
        candidateId: match.candidateId,
        founderId: session.user.id
      }
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Trial Project: ${trial.title}`,
              description: `${trial.timeline} trial project with ${match.candidate.name}`,
            },
            unit_amount: trial.fee,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/trial/success?session_id={CHECKOUT_SESSION_ID}&trial_id=${trialRecord.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/trial/${matchId}`,
      metadata: {
        trialId: trialRecord.id,
        matchId,
        founderId: session.user.id,
        candidateId: match.candidateId
      },
      customer_email: session.user.email || undefined,
    })

    // Update trial with Stripe session ID
    await prisma.trial.update({
      where: { id: trialRecord.id },
      data: { stripeSessionId: checkoutSession.id }
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      trialId: trialRecord.id
    })

  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}