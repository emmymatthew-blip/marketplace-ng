import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DEFAULT_PREFERENCES = {
  marketplaceUpdates: false,
  agreementUpdates: true,
  newMessages: true,
  forumActivity: false,
  demoAnnouncements: true,
  marketingEmails: false,
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationPreferences: true },
    })

    if (!user) {
      return NextResponse.json(DEFAULT_PREFERENCES)
    }

    const prefs = user.notificationPreferences
      ? (JSON.parse(user.notificationPreferences) as Record<string, boolean>)
      : DEFAULT_PREFERENCES

    return NextResponse.json({
      ...DEFAULT_PREFERENCES,
      ...prefs,
    })
  } catch (error) {
    console.error("[NOTIFICATION_PREFERENCES_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to load notification preferences" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()

    const preferences = {
      marketplaceUpdates: Boolean(body.marketplaceUpdates),
      agreementUpdates: Boolean(body.agreementUpdates),
      newMessages: Boolean(body.newMessages),
      forumActivity: Boolean(body.forumActivity),
      demoAnnouncements: Boolean(body.demoAnnouncements),
      marketingEmails: Boolean(body.marketingEmails),
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notificationPreferences: JSON.stringify(preferences),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[NOTIFICATION_PREFERENCES_PUT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to update notification preferences" },
      { status: 500 }
    )
  }
}
