"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  job: {
    id: string
    title: string
    companies: {
      name: string
      logo_url: string | null
    }
    location: string
    job_type: string
    work_arrangement: string
  }
  onApplicationSubmitted: () => void
}

export function JobApplicationModal({ isOpen, onClose, job, onApplicationSubmitted }: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Get current user
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      alert("Please sign in to apply for jobs")
      return
    }

    setSubmitting(true)

    try {
      // Check if user already applied
      const { data: existingApplication } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("applicant_id", userData.user.id)
        .single()

      if (existingApplication) {
        alert("You have already applied for this job!")
        setSubmitting(false)
        return
      }

      // Submit application
      const { error } = await supabase.from("applications").insert({
        job_id: job.id,
        applicant_id: userData.user.id,
        cover_letter: coverLetter.trim() || null,
        resume_url: resumeUrl.trim() || null,
        status: "pending",
      })

      if (error) {
        throw error
      }

      alert("Application submitted successfully!")
      onApplicationSubmitted()
      onClose()
      setCoverLetter("")
      setResumeUrl("")
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error submitting application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for Position</DialogTitle>
          <DialogDescription>Submit your application for this job opportunity</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {job.companies.logo_url ? (
                  <img
                    src={job.companies.logo_url || "/placeholder.svg"}
                    alt={job.companies.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">{job.companies.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription>{job.companies.name}</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {job.job_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {job.work_arrangement}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cover_letter">Cover Letter</Label>
              <Textarea
                id="cover_letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're interested in this position and what makes you a great fit..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                A personalized cover letter can help you stand out from other candidates.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume_url">Resume/CV URL (Optional)</Label>
              <Input
                id="resume_url"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/your-resume-link"
              />
              <p className="text-xs text-muted-foreground">
                Provide a link to your resume hosted on Google Drive, Dropbox, or similar service.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Application Review</h4>
            <p className="text-sm text-muted-foreground">
              Your application will be reviewed by the hiring team at {job.companies.name}. You'll receive updates on
              your application status via email and in your CareerConnect dashboard.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
