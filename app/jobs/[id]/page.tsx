"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { JobApplicationModal } from "@/components/job-application-modal"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

interface JobDetail {
  id: string
  title: string
  description: string
  requirements: string | null
  responsibilities: string | null
  location: string
  job_type: string
  work_arrangement: string
  experience_level: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  application_deadline: string | null
  created_at: string
  companies: {
    id: string
    name: string
    description: string | null
    website: string | null
    logo_url: string | null
    industry: string | null
    company_size: string | null
    location: string | null
  }
  job_skills: Array<{
    skills: {
      id: string
      name: string
      category: string
    }
    is_required: boolean
  }>
}

export default function JobDetailPage() {
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchJobDetail(params.id as string)
      getCurrentUser()
    }
  }, [params.id])

  const getCurrentUser = async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    setCurrentUser(data.user)

    if (data.user && params.id) {
      checkApplicationStatus(params.id as string, data.user.id)
    }
  }

  const checkApplicationStatus = async (jobId: string, userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", userId)
      .single()

    setHasApplied(!!data)
  }

  const fetchJobDetail = async (jobId: string) => {
    const supabase = createClient()
    setLoading(true)

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        companies (
          id,
          name,
          description,
          website,
          logo_url,
          industry,
          company_size,
          location
        ),
        job_skills (
          is_required,
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq("id", jobId)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching job:", error)
      router.push("/jobs")
    } else {
      setJob(data)
    }
    setLoading(false)
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Salary not specified"
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}`
    if (min) return `From $${min.toLocaleString()} ${currency}`
    if (max) return `Up to $${max.toLocaleString()} ${currency}`
    return "Salary not specified"
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleApply = () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setShowApplicationModal(true)
  }

  const handleApplicationSubmitted = () => {
    setHasApplied(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <Link href="/jobs">
              <Button variant="ghost">← Back to Jobs</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <Link href="/jobs">
              <Button variant="ghost">← Back to Jobs</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Job not found</h1>
              <p className="text-muted-foreground mt-2">This job may have been removed or is no longer available.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/jobs">
            <Button variant="ghost">← Back to Jobs</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {job.companies.logo_url ? (
                      <img
                        src={job.companies.logo_url || "/placeholder.svg"}
                        alt={job.companies.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">{job.companies.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-serif font-bold text-foreground">{job.title}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{job.companies.name}</p>
                    <p className="text-muted-foreground">{job.location}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="secondary">{job.job_type}</Badge>
                      <Badge variant="outline">{job.work_arrangement}</Badge>
                      <Badge variant="outline">{job.experience_level}</Badge>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">Posted {getTimeAgo(job.created_at)}</p>
                  </div>
                  {hasApplied ? (
                    <Button size="lg" disabled className="bg-green-600 hover:bg-green-600">
                      ✓ Applied
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleApply}>
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.responsibilities}</p>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.job_skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.job_skills
                          .filter((js) => js.is_required)
                          .map((js) => (
                            <Badge key={js.skills.id} variant="default">
                              {js.skills.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    {job.job_skills.some((js) => !js.is_required) && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Preferred</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.job_skills
                            .filter((js) => !js.is_required)
                            .map((js) => (
                              <Badge key={js.skills.id} variant="outline">
                                {js.skills.name}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.companies.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.companies.description && (
                  <p className="text-sm text-muted-foreground">{job.companies.description}</p>
                )}
                <div className="space-y-2 text-sm">
                  {job.companies.industry && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="text-foreground">{job.companies.industry}</span>
                    </div>
                  )}
                  {job.companies.company_size && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{job.companies.company_size} employees</span>
                    </div>
                  )}
                  {job.companies.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground">{job.companies.location}</span>
                    </div>
                  )}
                </div>
                {job.companies.website && (
                  <div className="pt-2">
                    <a
                      href={job.companies.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Visit Company Website →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Deadline */}
            {job.application_deadline && (
              <Card>
                <CardHeader>
                  <CardTitle>Application Deadline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">
                    {new Date(job.application_deadline).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.ceil(
                      (new Date(job.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days remaining
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            <Card>
              <CardContent className="p-4">
                {hasApplied ? (
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-600" disabled>
                    ✓ Application Submitted
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={handleApply}>
                    Apply for This Job
                  </Button>
                )}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {hasApplied
                    ? "You can track your application status in your dashboard"
                    : "You'll be able to review your application before submitting"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {job && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={job}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  )
}
