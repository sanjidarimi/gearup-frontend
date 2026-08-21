export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-2xl text-foreground mb-4">How It Works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li>
                Browse gear by category or search for what you need
              </li>
              <li>
                Select your rental dates using the date picker
              </li>
              <li>
                Reserve the gear and complete secure payment
              </li>
              <li>
                Provider approves the rental request
              </li>
              <li>
                Pick up the gear from the local provider
              </li>
              <li>
                Return the gear and receive your refund
              </li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-2xl text-foreground mb-4">Renters Get</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Verified providers and insured rentals</li>
              <li>Flexible daily rental periods</li>
              <li>Instant local pickup available</li>
              <li>24/7 roadside assistance</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-2xl text-foreground mb-4">Providers Get</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>List gear for free</li>
              <li>Reach local customers</li>
              <li>Secure weekly payouts</li>
              <li>Full control over availability</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}