import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import StatsSkeleton from "../component/StatsSkeleton"
function Home() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState({
    total: "0",
    assigned: "0",
    resolved: "0",
    pending: "0",
    closed: "0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setLiveStats({
        total: "12,480",
        assigned: "10,920",
        resolved: "9,870",
        pending: "1,050",
        closed: "9,200",
      });
      setStatsLoading(false);
    };
    fetchStats();
  }, []);

  const faqs = [
    {
      q: "Who can file a complaint?",
      a: "Any registered citizen can file a complaint. You need to create a free account and log in before submitting. This ensures accountability and allows us to keep you updated on your complaint's progress.",
    },
    {
      q: "How long does it take to resolve a complaint?",
      a: "Once submitted, your complaint is reviewed by the admin within 24 hours and assigned to the appropriate government department. Most complaints are resolved within 7–15 working days depending on complexity.",
    },
    {
      q: "Can I track my complaint status?",
      a: "Yes. After logging in, your dashboard shows real-time status updates — from submission, to assignment, to resolution. You will be notified at every stage.",
    },
    {
      q: "What types of complaints can I submit?",
      a: "You can submit complaints related to road damage, water supply, electricity, sanitation, public safety, municipal services, and more. Each complaint is routed to the relevant government department.",
    },
    {
      q: "What happens after my complaint is resolved?",
      a: "The assigned department marks the complaint as resolved and provides resolution notes. The admin reviews and officially closes it. You can view the full resolution summary in your complaint history.",
    },
  ];

  const steps = [
    { num: "01", icon: "👤", title: "Create an Account", desc: "Register as a citizen with your basic details. It's free, secure, and takes less than a minute." },
    { num: "02", icon: "📝", title: "Submit Your Complaint", desc: "Log in and describe your issue — add location, category, and any supporting details." },
    { num: "03", icon: "🏛️", title: "Admin Reviews & Assigns", desc: "The admin reviews your complaint and assigns it to the responsible government department." },
    { num: "04", icon: "⚙️", title: "Department Works on It", desc: "The assigned department starts work, updates progress, and marks it resolved when done." },
    { num: "05", icon: "✅", title: "Complaint Officially Closed", desc: "Admin verifies the resolution and officially closes your complaint. You can view the outcome anytime." },
  ];

  const departments = [
    { icon: "🛣️", name: "Roads & Infrastructure" },
    { icon: "💧", name: "Water Supply" },
    { icon: "⚡", name: "Electricity" },
    { icon: "🗑️", name: "Sanitation & Waste" },
    { icon: "🌳", name: "Parks & Environment" },
    { icon: "🚔", name: "Public Safety" },
    { icon: "🏗️", name: "Municipal Works" },
    { icon: "📡", name: "Public Services" },
  ];


  return (
    <div className="min-h-screen bg-gray-50 font-sans scroll-smooth">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 md:px-16 py-4 flex items-center justify-between">
        <div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Civic<span className="text-blue-600">Voice</span>
          </span>
          <p className="text-xs text-gray-400 font-medium tracking-wide leading-none mt-0.5">
            Citizen Complaint Portal
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
          <a href="#departments" className="hover:text-blue-600 transition-colors">Departments</a>
          <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </NavLink>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 md:px-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="block w-7 h-px bg-blue-600"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Government of Citizens
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
              Your Complaints,<br />
              <span className="text-blue-600 italic">Resolved</span> Officially.
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg mb-8">
              A secure, transparent government portal where citizens submit civic complaints,
              track real-time progress, and get official resolutions from the responsible
              department — all in one place.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <NavLink
                to="/register"
                className="inline-block text-sm font-semibold uppercase tracking-wide text-white bg-blue-600 px-7 py-3.5 rounded-md hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started Free
              </NavLink>
              <NavLink
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Already registered? Login
                <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
              </NavLink>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100 flex-wrap">
              {[
                { icon: "🔒", label: "Secure & Private" },
                { icon: "📋", label: "Fully Transparent" },
                { icon: "🏛️", label: "Government Backed" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-lg">{b.icon}</span>
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Stats Card */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-2 -left-2 w-full h-full bg-blue-600 rounded-2xl opacity-10"></div>
              <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl p-7">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Complaint Snapshot</p>
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                    Live
                  </span>
                </div>
                {statsLoading ? (
                  <StatsSkeleton />
                ) : (
                  <>
                    <div className="space-y-1">
                      {[
                        { label: "Total Complaints Filed", value: liveStats.total, color: "text-gray-900" },
                        { label: "Assigned to Departments", value: liveStats.assigned, color: "text-blue-600" },
                        { label: "Resolved Successfully", value: liveStats.resolved, color: "text-green-600" },
                        { label: "Pending / In Progress", value: liveStats.pending, color: "text-yellow-500" },
                        { label: "Officially Closed", value: liveStats.closed, color: "text-gray-400" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-500">{item.label}</span>
                          <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Overall Resolution Rate</span>
                        <span className="font-semibold text-green-600">94%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-700">
          {[
            { number: "12K+", label: "Complaints Filed" },
            { number: "94%", label: "Resolution Rate" },
            { number: "48h", label: "Avg. Response Time" },
            { number: "8+", label: "Active Departments" },
          ].map((stat) => (
            <div key={stat.label} className="py-8 text-center px-4">
              <p className="text-3xl font-extrabold text-white mb-1">{stat.number}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 md:px-16 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              From registration to resolution — a fully transparent, step-by-step process managed by government officials.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{step.icon}</div>
                <span className="text-xs font-bold text-blue-600 tracking-widest">{step.num}</span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section id="departments" className="py-20 px-6 md:px-16 bg-white border-t border-gray-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Government Departments</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Who Handles Your Complaint</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Complaints are routed by the admin to the relevant department for swift, accountable action.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-all group cursor-default"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{dept.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 md:px-16 bg-gray-50 border-t border-gray-100 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">FAQ</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  aria-expanded={activeAccordion === i}
                >
                  {faq.q}
                  <span
                    className={`text-blue-600 text-xl font-light transition-transform duration-200 inline-block ${
                      activeAccordion === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {activeAccordion === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-6 md:px-16 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Have a Complaint? Let Us Know.</h2>
        <p className="text-blue-100 max-w-xl mx-auto mb-8 text-base">
          Register for a free account, file your complaint, and let the government work for you — transparently and accountably.
        </p>
        <NavLink
          to="/register"
          className="inline-block bg-white text-blue-600 font-bold text-sm uppercase tracking-wide px-8 py-3.5 rounded-md hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Register & Get Started
        </NavLink>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 px-6 md:px-16 pt-12 pb-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="text-white text-lg font-extrabold tracking-tight mb-2">
              Civic<span className="text-blue-500">Voice</span>
            </p>
            <p className="text-sm leading-relaxed text-gray-500">
              A government-backed citizen complaint management portal ensuring
              accountability, transparency, and timely resolution of public grievances.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Help & Support</p>
            <ul className="space-y-2 text-sm">
              <li>📧 support@civicvoice.gov.in</li>
              <li>📞 1800-XXX-XXXX (Toll Free, Mon–Sat 9am–6pm)</li>
              <li>🌐 Available in: English, Hindi, Marathi</li>
              <li className="text-xs text-gray-500 pt-1">
                For technical issues, email us with your Complaint ID and a brief description.
              </li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/register" className="hover:text-white transition-colors">→ Register as Citizen</NavLink></li>
              <li><NavLink to="/login" className="hover:text-white transition-colors">→ Login to Portal</NavLink></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">→ How It Works</a></li>
              <li><a href="#departments" className="hover:text-white transition-colors">→ Government Departments</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">→ FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} CivicVoice — Government Complaint Portal. All rights reserved.</p>
          <div className="flex gap-5">
            <button
              onClick={() => setShowModal("terms")}
              className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setShowModal("privacy")}
              className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowModal("support")}
              className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500 rounded"
            >
              Support
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setShowModal(null)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl font-light leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close modal"
            >
              ×
            </button>

            {showModal === "terms" && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Terms & Conditions</h2>
                <p className="text-xs text-gray-400 mb-6">Last updated: January 2025</p>
                <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
                  {[
                    { title: "1. Acceptance of Terms", body: "By registering and using the CivicVoice portal, you agree to comply with and be bound by these terms. If you do not agree, please do not use this portal." },
                    { title: "2. Eligibility", body: "This portal is available to all citizens. You must provide accurate personal information during registration. Only one account per citizen is permitted." },
                    { title: "3. Complaint Submission", body: "Complaints must be genuine, factual, and relevant to civic or public services. Submitting false, misleading, or malicious complaints is strictly prohibited and may result in account suspension or legal action." },
                    { title: "4. Processing & Resolution", body: "All complaints are reviewed by the admin and assigned to the relevant government department. Resolution timelines vary depending on the nature and complexity of the issue." },
                    { title: "5. Account Responsibility", body: "You are responsible for maintaining the confidentiality of your login credentials. Any activity performed under your account is your sole responsibility." },
                    { title: "6. Modifications", body: "The government reserves the right to update these terms at any time. Continued use of the portal after changes constitutes acceptance of the revised terms." },
                  ].map((item) => (
                    <div key={item.title}>
                      <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showModal === "privacy" && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Privacy Policy</h2>
                <p className="text-xs text-gray-400 mb-6">Last updated: January 2025</p>
                <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
                  {[
                    { title: "1. Information We Collect", body: "We collect your name, contact details, and complaint information during registration and submission. This data is used solely for complaint processing and communication." },
                    { title: "2. How We Use Your Data", body: "Your information is used to process and resolve your complaints, send status updates, and improve our services. We do not use your data for marketing or any commercial purpose." },
                    { title: "3. Data Sharing", body: "Your complaint details are shared only with the relevant government department responsible for resolution. We do not share your personal information with any third parties." },
                    { title: "4. Data Security", body: "We implement industry-standard security measures to protect your personal data. All data is stored on secure government servers with strictly controlled access." },
                    { title: "5. Your Rights", body: "You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at support@civicvoice.gov.in." },
                    { title: "6. Cookies", body: "We use essential session cookies only to maintain your logged-in state. No tracking or advertising cookies are used on this portal." },
                  ].map((item) => (
                    <div key={item.title}>
                      <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showModal === "support" && (
              <>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Help & Support</h2>
                <p className="text-sm text-gray-500 mb-6">We're here to help you use the portal and resolve your civic issues efficiently.</p>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-1">📧 Email Support</h3>
                    <p>support@civicvoice.gov.in</p>
                    <p className="text-xs text-gray-400 mt-1">Response within 24 working hours. Please include your Complaint ID if applicable.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-1">📞 Helpline Number</h3>
                    <p>1800-XXX-XXXX (Toll Free)</p>
                    <p className="text-xs text-gray-400 mt-1">Monday to Saturday, 9:00 AM – 6:00 PM IST. Closed on public holidays.</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2">❓ Common Issues</h3>
                    <ul className="space-y-1.5 text-xs text-gray-500">
                      <li>• <strong>Forgot password?</strong> Use the "Forgot Password" link on the login page.</li>
                      <li>• <strong>Complaint not updating?</strong> Allow up to 48 hours for department assignment.</li>
                      <li>• <strong>Wrong department assigned?</strong> Contact support with your Complaint ID.</li>
                      <li>• <strong>Account locked?</strong> Email support with your registered email address.</li>
                      <li>• <strong>Complaint wrongly closed?</strong> Email us within 7 days of closure to raise a dispute.</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-gray-800 mb-1">🌐 Languages Supported</h3>
                    <p className="text-xs text-gray-500">The portal and support staff are available in English, Hindi, and Marathi.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;