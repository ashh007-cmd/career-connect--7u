"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Job {
  id: string
  title: string
  description: string
  location: string
  job_type: string
  work_arrangement: string
  experience_level: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  created_at: string
  companies: {
    id: string
    name: string
    logo_url: string | null
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [workArrangementFilter, setWorkArrangementFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchJobs()
  }, [searchTerm, locationFilter, jobTypeFilter, experienceFilter, workArrangementFilter])

  const fetchJobs = async () => {
    const supabase = createClient()
    setLoading(true)

    let query = supabase
      .from("jobs")
      .select(`
        *,
        companies (
          id,
          name,
          logo_url
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    if (locationFilter) {
      query = query.ilike("location", `%${locationFilter}%`)
    }

    if (jobTypeFilter !== "all") {
      query = query.eq("job_type", jobTypeFilter)
    }

    if (experienceFilter !== "all") {
      query = query.eq("experience_level", experienceFilter)
    }

    if (workArrangementFilter !== "all") {
      query = query.eq("work_arrangement", workArrangementFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching jobs:", error)
    } else {
      setJobs(data || [])
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold text-foreground">Find Your Next Opportunity</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of job opportunities from top companies around the world
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Jobs</CardTitle>
              <CardDescription>Use filters to find the perfect job for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Job title or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="City, state, or remote..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Arrangement</label>
                  <Select value={workArrangementFilter} onValueChange={setWorkArrangementFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All arrangements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All arrangements</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setLocationFilter("")
                      setJobTypeFilter("all")
                      setExperienceFilter("all")
                      setWorkArrangementFilter("all")
                    }}
                    className="w-full bg-transparent"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                {loading ? "Loading..." : `${jobs.length} Jobs Found`}
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search criteria or check back later for new opportunities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              {job.companies.logo_url ? (
                                <img
                                  src={job.companies.logo_url || "/placeholder.svg"}
                                  alt={job.companies.name}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                  <span className="text-primary font-semibold text-sm">
                                    {job.companies.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-muted-foreground">{job.companies.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.job_type}</Badge>
                            <Badge variant="outline">{job.work_arrangement}</Badge>
                            <Badge variant="outline">{job.experience_level}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</span>
                            <span>{getTimeAgo(job.created_at)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link href={`/jobs/${job.id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
