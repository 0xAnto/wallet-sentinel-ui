import { NextResponse } from "next/server"
import { checkWalletAlerts } from "@/lib/alert-service"

export async function GET() {
  try {
    await checkWalletAlerts()
    return NextResponse.json({ success: true, message: "Alerts checked successfully" })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, error: "Failed to check alerts" }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
