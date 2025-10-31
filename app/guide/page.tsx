export default function GuidePage() {
  const phases = [
    {
      phase: "Phase 1: Planning & Preparation",
      duration: "1-2 weeks",
      steps: [
        "Document original wiring and take photos",
        "Order all components and verify specifications",
        "Prepare workspace and gather tools",
        "Create custom battery box if needed",
        "Plan mounting locations for all components"
      ]
    },
    {
      phase: "Phase 2: Removal",
      duration: "1 day",
      steps: [
        "Disconnect and remove old batteries",
        "Remove old controller and wiring",
        "Remove old motor (if upgrading)",
        "Clean and inspect motor compartment",
        "Label and organize removed components"
      ]
    },
    {
      phase: "Phase 3: Battery System",
      duration: "2-3 days",
      steps: [
        "Install new battery pack in secure location",
        "Mount BMS and connect to battery pack",
        "Wire BMS balance leads to each cell",
        "Install main power disconnect",
        "Test BMS functionality before proceeding"
      ]
    },
    {
      phase: "Phase 4: Drive System",
      duration: "2-3 days",
      steps: [
        "Mount motor controller in ventilated location",
        "Install new motor if upgrading",
        "Connect controller to motor",
        "Install and connect throttle assembly",
        "Connect controller to BMS power output",
        "Program controller parameters"
      ]
    },
    {
      phase: "Phase 5: Instrumentation",
      duration: "1-2 days",
      steps: [
        "Mount dashboard display",
        "Install current and voltage sensors",
        "Run data cables from sensors to dashboard",
        "Connect dashboard to BMS for telemetry",
        "Configure dashboard settings"
      ]
    },
    {
      phase: "Phase 6: Lighting & Safety",
      duration: "1-2 days",
      steps: [
        "Install LED headlights and taillights",
        "Wire turn signals and brake lights",
        "Install emergency shutoff system",
        "Add fuses and circuit protection",
        "Install warning labels"
      ]
    },
    {
      phase: "Phase 7: Testing & Commissioning",
      duration: "2-3 days",
      steps: [
        "Visual inspection of all connections",
        "Continuity testing of all circuits",
        "Low-voltage functional testing",
        "Full power testing in safe area",
        "Range testing and calibration",
        "Final adjustments and documentation"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-blue-600 px-2">
          Build Guide
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          Step-by-step guide to converting your Yamaha G8 golf cart
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Important Safety Notice
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <ul className="list-disc list-inside space-y-1">
                <li>Always disconnect power before working on electrical systems</li>
                <li>Wear appropriate safety equipment including insulated gloves</li>
                <li>Follow all local electrical codes and regulations</li>
                <li>Have a fire extinguisher rated for electrical fires nearby</li>
                <li>If you&apos;re not comfortable with high-voltage systems, hire a professional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-600">Required Tools</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-bold mb-2">Hand Tools</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Socket set (metric)</li>
              <li>Wrench set</li>
              <li>Screwdriver set</li>
              <li>Wire strippers</li>
              <li>Crimping tool</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Power Tools</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Drill with bits</li>
              <li>Angle grinder</li>
              <li>Cable cutter</li>
              <li>Heat gun</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Test Equipment</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Multimeter</li>
              <li>Continuity tester</li>
              <li>Insulation tester</li>
              <li>Torque wrench</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {phases.map((phase, idx) => (
          <section key={idx} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
                {idx + 1}
              </div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <h2 className="text-lg md:text-2xl font-bold text-blue-600">{phase.phase}</h2>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs md:text-sm font-semibold inline-block w-fit">
                    {phase.duration}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Estimated Timeline</h2>
        <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
          <p className="text-lg mb-4">
            <strong>Total Project Duration:</strong> 2-3 weeks (working part-time)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This timeline assumes you have all parts on hand and can dedicate several hours per day to the project.
            First-time builders should allow extra time for troubleshooting and learning.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Tips for Success</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-bold mb-2">Do&apos;s</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Document everything with photos</li>
              <li>Test each system before moving to the next</li>
              <li>Use properly rated wire and connectors</li>
              <li>Label all wires clearly</li>
              <li>Keep a build journal</li>
            </ul>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-bold mb-2">Don&apos;ts</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Don&apos;t rush the installation</li>
              <li>Don&apos;t skip testing phases</li>
              <li>Don&apos;t use undersized wiring</li>
              <li>Don&apos;t mix different battery chemistries</li>
              <li>Don&apos;t ignore warning signs or unusual behavior</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
