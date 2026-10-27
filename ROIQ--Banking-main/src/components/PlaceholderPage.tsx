import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
  pageTitle: string
}

export function PlaceholderPage({ title, description, icon: Icon, pageTitle }: PlaceholderPageProps) {
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-dashed">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground flex flex-col items-center py-10">
            <Icon className="h-16 w-16 mb-6 text-muted-foreground/30" />
            <p className="text-lg">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
