"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Users, Calendar, Globe, Briefcase } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  description: string
  website: string
  logo_url: string
  industry: string
  company_size: string
  location: string
  founded_year: number
  is_verified: boolean
  created_at: string
}

interface Job {
  id: string
  title: string
  location: string
  job_type: string
  work_arrangement: string
  experience_level: string
  salary_min: number
  salary_max: number
  created_at: string
  is_active: boolean
}

export default function CompanyProfile({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    async function fetchCompany() {
      const { data: companyData } = await supabase.from("companies").select("*").eq("id", params.id).single()

      setCompany(companyData)

      if (companyData) {
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("company_id", companyData.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        setJobs(jobsData || [])
      }

      setLoading(false)
    }

    fetchCompany()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>The company profile you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/jobs">
              <Button className="w-full">Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Company Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="h-24 w-24 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    {company.is_verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-blue-600 mb-4">{company.industry}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {company.company_size} employees
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Founded {company.founded_year}
                    </div>
                    {company.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About {company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{company.description}</p>
            </CardContent>
          </Card>

          {/* Open Positions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Open Positions
                  </CardTitle>
                  <CardDescription>
                    {jobs.length} {jobs.length === 1 ? "position" : "positions"} available
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                            <Badge variant="outline">{job.job_type}</Badge>
                            <Badge variant="outline">{job.work_arrangement}</Badge>
                            <Badge variant="outline">{job.experience_level} level</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-600 font-medium">
                              ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              Posted {new Date(job.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline" className="ml-4 bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No open positions</h3>
                  <p className="text-gray-600">This company doesn't have any open positions at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
