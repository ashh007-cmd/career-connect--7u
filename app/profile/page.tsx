import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Redirect to the user's own profile
  redirect(`/profile/${data.user.id}`)
}
