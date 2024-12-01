

import { useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

export default function Error({ error}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="absolute top-[103px] h-[calc(100vh-103px)] flex flex-col items-center justify-center px-4 w-[100%]">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-4xl font-bold tracking-tight">Oops! Something went wrong</h1>
        <p className="text-muted-foreground text-lg">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={()=>{
                window.location.reload()
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Try again
          </Button>
          <Button 
            variant="outline" 
            asChild
          >
            <Link to="/">
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )}