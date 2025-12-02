"use client"

import { TriangleAlert } from 'lucide-react'
import React from 'react'

const Error = () => {
  return (
     <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlert />
        <p className="text-base font-medium">Something went wrong</p>
      </div>
  )
}

export default Error
