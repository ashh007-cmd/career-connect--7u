"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
}

interface Skill {
  id: string
  name: string
  category: string
}

interface UserSkill {
  id: string
  skill_id: string
  proficiency_level: string
  years_experience: number | null
  skills: Skill
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    linkedin_url: "",
    github_url: "",
    experience_level: "",
    is_recruiter: false,
  })

  useEffect(() => {
    getCurrentUser()
    fetchAvailableSkills()
  }, [])

  const getCurrentUser = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      router.push("/auth/login")
      return
    }

    setCurrentUser(data.user)
    fetchProfile(data.user.id)
  }

  const fetchProfile = async (userId: string) => {
    const supabase = createClient()
    setLoading(true)

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
    } else {
      setProfile(data)
      setFormData({
        full_name: data.full_name || "",
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        phone: data.phone || "",
        website: data.website || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        experience_level: data.experience_level || "",
        is_recruiter: data.is_recruiter || false,
      })
    }

    // Fetch user skills
    const { data: skillsData } = await supabase
      .from("user_skills")
      .select(`
        *,
        skills (
          id,
          name,
          category
        )
      `)
      .eq("user_id", userId)

    if (skillsData) {
      setUserSkills(skillsData)
    }

    setLoading(false)
  }

  const fetchAvailableSkills = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("skills").select("*").order("name")

    if (error) {
      console.error("Error fetching skills:", error)
    } else {
      setAvailableSkills(data || [])
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    if (!currentUser) return

    const supabase = createClient()
    setSaving(true)

    const { error } = await supabase.from("profiles").update(formData).eq("id", currentUser.id)

    if (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile. Please try again.")
    } else {
      alert("Profile updated successfully!")
      router.push(`/profile/${currentUser.id}`)
    }

    setSaving(false)
  }

  const addSkill = async (skillId: string, proficiencyLevel: string, yearsExperience: number | null) => {
    if (!currentUser) return

    const supabase = createClient()

    const { error } = await supabase.from("user_skills").insert({
      user_id: currentUser.id,
      skill_id: skillId,
      proficiency_level: proficiencyLevel,
      years_experience: yearsExperience,
    })

    if (error) {
      console.error("Error adding skill:", error)
      alert("Error adding skill. Please try again.")
    } else {
      fetchProfile(currentUser.id) // Refresh skills
    }
  }

  const removeSkill = async (userSkillId: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("user_skills").delete().eq("id", userSkillId)

    if (error) {
      console.error("Error removing skill:", error)
      alert("Error removing skill. Please try again.")
    } else {
      setUserSkills((prev) => prev.filter((skill) => skill.id !== userSkillId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <Link href="/profile">
              <Button variant="ghost">← Back to Profile</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href={`/profile/${currentUser?.id}`}>
              <Button variant="ghost">← Back to Profile</Button>
            </Link>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground mt-2">Update your professional information</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your core professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        value={formData.headline}
                        onChange={(e) => handleInputChange("headline", e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">About</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                      rows={4}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_level">Experience Level</Label>
                      <Select
                        value={formData.experience_level}
                        onValueChange={(value) => handleInputChange("experience_level", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How people can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        value={formData.github_url}
                        onChange={(e) => handleInputChange("github_url", e.target.value)}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>Add skills that showcase your expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Skills */}
                  {userSkills.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Your Skills</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {userSkills.map((userSkill) => (
                          <div
                            key={userSkill.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-foreground">{userSkill.skills.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {userSkill.proficiency_level}
                                {userSkill.years_experience && ` • ${userSkill.years_experience}y exp`}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(userSkill.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Add New Skill */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Add New Skill</h4>
                    <SkillForm availableSkills={availableSkills} onAddSkill={addSkill} userSkills={userSkills} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={profile?.profile_image_url || undefined} alt={formData.full_name} />
                    <AvatarFallback className="text-lg">
                      {formData.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{formData.full_name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">{formData.headline || "Your Professional Headline"}</p>
                    {formData.location && <p className="text-xs text-muted-foreground mt-1">{formData.location}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Recruiter Account</p>
                      <p className="text-sm text-muted-foreground">Enable if you're hiring</p>
                    </div>
                    <Button
                      variant={formData.is_recruiter ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange("is_recruiter", !formData.is_recruiter)}
                    >
                      {formData.is_recruiter ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Skill Form Component
function SkillForm({
  availableSkills,
  onAddSkill,
  userSkills,
}: {
  availableSkills: Skill[]
  onAddSkill: (skillId: string, proficiencyLevel: string, yearsExperience: number | null) => void
  userSkills: UserSkill[]
}) {
  const [selectedSkillId, setSelectedSkillId] = useState("")
  const [proficiencyLevel, setProficiencyLevel] = useState("intermediate")
  const [yearsExperience, setYearsExperience] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSkillId) return

    onAddSkill(selectedSkillId, proficiencyLevel, yearsExperience ? Number.parseInt(yearsExperience) : null)

    // Reset form
    setSelectedSkillId("")
    setProficiencyLevel("intermediate")
    setYearsExperience("")
  }

  const availableSkillsFiltered = availableSkills.filter(
    (skill) => !userSkills.some((userSkill) => userSkill.skill_id === skill.id),
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
          <SelectTrigger>
            <SelectValue placeholder="Select skill" />
          </SelectTrigger>
          <SelectContent>
            {availableSkillsFiltered.map((skill) => (
              <SelectItem key={skill.id} value={skill.id}>
                {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Years exp"
          value={yearsExperience}
          onChange={(e) => setYearsExperience(e.target.value)}
          min="0"
          max="50"
        />
      </div>
      <Button type="submit" disabled={!selectedSkillId} className="w-full">
        Add Skill
      </Button>
    </form>
  )
}
