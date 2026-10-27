import { LineChart } from "lucide-react"
import { PlaceholderPage } from "@/components/PlaceholderPage"

export function Analytics() {
  return (
    <PlaceholderPage
      pageTitle="Financial Analytics"
      title="No Financial Data Available"
      description="Upload a company dataset and wait for backend analysis."
      icon={LineChart}
    />
  )
}
