import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock, FileText, MessageSquare } from "lucide-react"

export function DisputeGuidelines() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold">Dispute Guidelines</h2>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Filing a dispute should be a last resort after attempting to resolve the issue directly with the other party.
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="text-lg font-medium mb-2">Dispute Process</h3>
        <ol className="space-y-3 list-decimal list-inside text-sm">
          <li>File a dispute with detailed information</li>
          <li>The other party will be notified and given 7 days to respond</li>
          <li>If no resolution is reached, a marketplace administrator will review the case</li>
          <li>The administrator may request additional information from both parties</li>
          <li>A decision will be made based on the evidence provided</li>
        </ol>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Tips for Effective Disputes</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Be timely - file disputes as soon as issues arise</span>
          </li>
          <li className="flex items-start gap-2">
            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Provide specific details and evidence to support your case</span>
          </li>
          <li className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Maintain professional communication throughout the process</span>
          </li>
        </ul>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          For more information about the dispute resolution process, please refer to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  )
}
