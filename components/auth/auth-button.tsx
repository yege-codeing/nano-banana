import { createClient } from "@/lib/supabase/server"
import { GoogleSignInButton } from "./google-sign-in-button"
import { UserNav } from "./user-nav"

export async function AuthButton() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <UserNav user={user} />
  }

  return <GoogleSignInButton />
}
