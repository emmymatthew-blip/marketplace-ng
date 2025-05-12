import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DisputeForm } from "@/components/agreements/dispute-form"
import { DisputeGuidelines } from "@/components/agreements/dispute-guidelines"

async function getAgreement(id: string) {
  // This would be replaced with actual database query
  return {
    id,
    initiatorId: "user-123",
    receiverId: "user-456",
    status: "DISPUTED",
    terms: "Agreement terms...",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    initiator: {
      name: "John Doe",
      companyName: "ABC Printing",
    },
    receiver: {
      name: "Jane Smith",
      companyName: "XYZ Manufacturing",
    },
  }
}

export default async function DisputePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/agreements/" + params.id + "/dispute")
  }

  try {
    const agreement = await getAgreement(params.id)

    // For development/testing, allow any authenticated user to view the dispute
    // In production, this would be replaced with actual user ID checks
    // if (agreement.initiatorId !== session.user.id && agreement.receiverId !== session.user.id) {
    //   redirect("/dashboard?error=You are not authorized to view this dispute")
    // }

    // Check if agreement is in a disputed state
    if (agreement.status !== "DISPUTED") {
      redirect(`/agreements/${params.id}?error=This agreement is not in a disputed state`)
    }

    // For development, we'll assume the current user is the initiator
    const otherParty = agreement.receiver

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dispute Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Agreement Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Agreement ID</p>
                  <p className="font-medium">{agreement.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{agreement.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(agreement.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Other Party</p>
                  <p className="font-medium">
                    {otherParty.name} ({otherParty.companyName})
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dispute Details</h2>
              <DisputeForm agreementId={params.id} />
            </div>
          </div>

          <div>
            <DisputeGuidelines />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading dispute:", error)
    redirect("/dashboard?error=Failed to load dispute details")
  }
}
