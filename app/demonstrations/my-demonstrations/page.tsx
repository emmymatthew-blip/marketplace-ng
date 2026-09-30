import { redirect } from "next/navigation"

export default function DeprecatedMyDemonstrationsRoute() {
  redirect("/demo-access/my-requests")
}