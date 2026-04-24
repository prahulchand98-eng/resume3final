export default function ResumeTool() {
  return (
    <section id="tool" className="py-24 px-6" style={{ background: '#F8FAFF' }}>
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="section-badge">See It In Action</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Your AI Resume Copilot
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Watch how Vicky rewrites your resume and boosts your ATS score in under 30 seconds.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden aspect-video flex items-center justify-center">
          {/* Drop your video embed here */}
        </div>

      </div>
    </section>
  );
}
