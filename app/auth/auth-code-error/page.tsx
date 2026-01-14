export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">
          Sorry, we couldn't complete your sign-in. Please try again.
        </p>
        <a href="/" className="text-primary hover:underline">
          Return to home
        </a>
      </div>
    </div>
  )
}
