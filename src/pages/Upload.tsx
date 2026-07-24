import { Upload as UploadIcon } from "lucide-react"
import { PlaceholderPage } from "@/components/PlaceholderPage"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Upload() {
  const [isUploaded, setIsUploaded] = useState(false)

  if (isUploaded) {
    return (
      <PlaceholderPage
        pageTitle="Dataset Upload"
        title="Dataset uploaded successfully."
        description="Waiting for backend analysis..."
        icon={UploadIcon}
      />
    )
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dataset Upload</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-dashed">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Upload Financial Dataset</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground flex flex-col items-center py-10">
            <UploadIcon className="h-16 w-16 mb-6 text-muted-foreground/50" />
            <p className="text-lg mb-6">Drag and drop your financial CSV or Excel files here.</p>
            <Button onClick={() => setIsUploaded(true)}>Simulate Upload</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
