"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useParams } from "next/navigation"

interface UserProfile {
  id: string
  email: string
  full_name: string
  headline: string | null
  bio: string | null
  location: string | null
  phone: string | null
  website: string | null
  linkedin_url: string | null
  github_url: string | null
  profile_image_url: string | null
  experience_level: string | null
  is_recruiter: boolean
  is_active: boolean
  created_at: string
  user_skills: Array<{
    proficiency_level: string
    years_experience: number | null
    skills: {
      id: string
      name: string
      category: string
    }
  }>
}

export default function ProfileDetailPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string)
      getCurrentUser()
    }
  }, [params.id])

  const getCurrentUser = async () => {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    setCurrentUser(data.user)
    setIsOwnProfile(data.user?.id === params.id)
  }

  const fetchProfile = async (userId: string) => {
    const supabase = createClient()
    setLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        user_skills (
          proficiency_level,
          years_experience,
          skills (
            id,
            name,
            category
          )
        )
      `)
      .eq("id", userId)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  const getProfileCompleteness = () => {
    if (!profile) return 0
    let completed = 0
    const total = 8

    if (profile.full_name) completed++
    if (profile.headline) completed++
    if (profile.bio) completed++
    if (profile.location) completed++
    if (profile.experience_level) completed++
    if (profile.user_skills.length > 0) completed++
    if (profile.linkedin_url || profile.github_url || profile.website) completed++
    if (profile.profile_image_url) completed++

    return Math.round((completed / total) * 100)
  }

  const groupSkillsByCategory = () => {
    if (!profile) return {}
    return profile.user_skills.reduce(
      (acc, userSkill) => {
        const category = userSkill.skills.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(userSkill)
        return acc
      },
      {} as Record<string, typeof profile.user_skills>,
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
              </div>
              <div className="h-48 bg-muted rounded" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Profile not found</h1>
              <p className="text-muted-foreground mt-2">
                This user profile may not exist or is not publicly available.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const skillsByCategory = groupSkillsByCategory()
  const completeness = getProfileCompleteness()

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
            {isOwnProfile && (
              <Link href="/profile/edit">
                <Button>Edit Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profile_image_url || undefined} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl">
                      {profile.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">{profile.full_name}</h1>
                        {profile.headline && <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>}
                        {profile.location && (
                          <p className="text-muted-foreground flex items-center gap-1 mt-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {profile.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {profile.is_recruiter && <Badge variant="secondary">Recruiter</Badge>}
                        {profile.experience_level && <Badge variant="outline">{profile.experience_level} level</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Website
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {Object.keys(skillsByCategory).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-foreground mb-3">{category}</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {skills.map((userSkill) => (
                          <div
                            key={userSkill.skills.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-foreground">{userSkill.skills.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{userSkill.proficiency_level}</p>
                            </div>
                            {userSkill.years_experience && (
                              <Badge variant="outline">{userSkill.years_experience}y exp</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness (only for own profile) */}
            {isOwnProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completeness</CardTitle>
                  <CardDescription>Complete your profile to attract more opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{completeness}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      {!profile.headline && <p className="text-muted-foreground">• Add a professional headline</p>}
                      {!profile.bio && <p className="text-muted-foreground">• Write an about section</p>}
                      {!profile.location && <p className="text-muted-foreground">• Add your location</p>}
                      {!profile.experience_level && (
                        <p className="text-muted-foreground">• Set your experience level</p>
                      )}
                      {profile.user_skills.length === 0 && <p className="text-muted-foreground">• Add your skills</p>}
                      {!profile.profile_image_url && <p className="text-muted-foreground">• Upload a profile photo</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm text-muted-foreground">{profile.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardHeader>
                <CardTitle>Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Connect Button (for other users) */}
            {!isOwnProfile && currentUser && (
              <Card>
                <CardContent className="p-4">
                  <Button className="w-full">Connect</Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">Send a connection request</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
