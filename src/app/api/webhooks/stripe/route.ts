import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        await handleSuccessfulPayment(session)
        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handleFailedPayment(paymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const trialId = session.metadata?.trialId
    const matchId = session.metadata?.matchId

    if (!trialId) {
      console.error("No trial ID in session metadata")
      return
    }

    // Update trial status
    await prisma.trial.update({
      where: { id: trialId },
      data: {
        status: "ACTIVE",
        stripePaymentIntentId: session.payment_intent as string
      }
    })

    // Update match status
    if (matchId) {
      await prisma.match.update({
        where: { id: matchId },
        data: { status: "TRIAL_OFFERED" }
      })
    }

    console.log(`Trial payment successful for trial ${trialId}`)

    // TODO: Send email notifications to both founder and candidate
    
  } catch (error) {
    console.error("Error handling successful payment:", error)
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find trial by payment intent ID
    const trial = await prisma.trial.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    })

    if (trial) {
      await prisma.trial.update({
        where: { id: trial.id },
        data: { status: "PAYMENT_FAILED" }
      })

      console.log(`Trial payment failed for trial ${trial.id}`)
    }

  } catch (error) {
    console.error("Error handling failed payment:", error)
  }
}