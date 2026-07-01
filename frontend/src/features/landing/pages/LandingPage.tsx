import { Link } from 'react-router-dom'

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Find Your Perfect Room & Flatmate
        </h1>
        <p className="text-xl text-primary font-medium mb-4">
          Powered by AI Compatibility Matching
        </p>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Browse verified listings, compare compatibility scores, and connect with owners instantly.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg">
            Get Started
          </Link>
        </div>
      </section>

      {/* AI Matching Feature Highlight */}
      <section className="w-full bg-muted/30 py-16 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Stop guessing. Start matching.</h2>
            <p className="text-muted-foreground text-lg">
              Our advanced AI analyzes lifestyle habits, preferences, and budgets to give you a definitive compatibility score before you even say hello.
            </p>
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            {/* Mock Compatibility Card */}
            <div className="bg-card p-6 rounded-2xl shadow-md border border-border w-full max-w-sm flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-600">92%</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Great Match!</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">
                You both value quiet evenings and cleanliness.
              </p>
              <button className="w-full py-2 bg-primary/10 text-primary font-medium rounded-md">
                Show Interest
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
