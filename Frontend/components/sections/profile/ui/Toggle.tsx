"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"

export default function ToggleDemo() {
  const [enabled, setEnabled] = React.useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  )
}
