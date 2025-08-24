import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4 animate-in zoom-in duration-500 delay-200" />
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-700">
              <svg
                className="w-8 h-8 text-blue-600 animate-in zoom-in duration-300 delay-1000"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-slate-800 animate-in slide-in-from-top-2 duration-500 delay-600">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base text-slate-600 animate-in slide-in-from-top-2 duration-500 delay-700">
              We've sent you a confirmation link to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600 animate-in slide-in-from-bottom-2 duration-500 delay-800">
              Please check your email and click the confirmation link to activate your CareerConnect account. You may
              need to check your spam folder.
            </p>
            <div className="pt-4 animate-in slide-in-from-bottom-2 duration-500 delay-900">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center animate-in slide-in-from-bottom-2 duration-500 delay-1000">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
