import { NextResponse } from "next/server"

// This is a simple API route that will be used to connect to the Python backend
export async function GET(request: Request) {
  try {
    // In a real implementation, this would call the Python backend
    // For now, we'll just return a mock response
    return NextResponse.json({
      message: "Connected to Python simulation backend",
      status: "success",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to simulation backend" }, { status: 500 })
  }
}
