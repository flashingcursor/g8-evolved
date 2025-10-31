import WiringDiagram from '@/components/WiringDiagram';

export default function WiringPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">
          Interactive Wiring Diagrams
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore the complete electrical system of the G8 conversion project.
          Click on components and connections for detailed information.
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              <strong>Safety Warning:</strong> Always disconnect the battery before working on any electrical components.
              Follow proper electrical safety procedures and local codes.
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <WiringDiagram
          title="Main Power Distribution"
          width={800}
          height={600}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-3 text-blue-600">Component Specifications</h3>
          <div className="space-y-3 text-sm">
            <div className="border-b pb-2">
              <strong>Battery Pack:</strong> 48V Lithium-Ion, 100Ah capacity
            </div>
            <div className="border-b pb-2">
              <strong>BMS:</strong> 16S Battery Management System with balancing
            </div>
            <div className="border-b pb-2">
              <strong>Motor Controller:</strong> 400A continuous, 600A peak
            </div>
            <div className="border-b pb-2">
              <strong>Motor:</strong> 5kW DC Series Motor
            </div>
            <div className="border-b pb-2">
              <strong>Throttle:</strong> Hall-effect 0-5V potentiometer
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-3 text-blue-600">Wire Specifications</h3>
          <div className="space-y-3 text-sm">
            <div className="border-b pb-2">
              <strong>Main Power (Battery to BMS):</strong>
              <br />2/0 AWG, Red (+) / Black (-)
            </div>
            <div className="border-b pb-2">
              <strong>BMS to Controller:</strong>
              <br />2 AWG, Red (+) / Black (-)
            </div>
            <div className="border-b pb-2">
              <strong>Controller to Motor:</strong>
              <br />2 AWG, Orange (motor cables)
            </div>
            <div className="border-b pb-2">
              <strong>Control Signals:</strong>
              <br />18 AWG shielded cable
            </div>
            <div className="border-b pb-2">
              <strong>Telemetry/Data:</strong>
              <br />22 AWG CAT6 or CAN bus cable
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Additional Diagrams</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h4 className="font-bold mb-2">Charging System</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Detailed view of the charging circuit including safety cutoffs
            </p>
            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold">
              View Diagram →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h4 className="font-bold mb-2">Lighting System</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              LED headlights, taillights, and turn signals wiring
            </p>
            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold">
              View Diagram →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h4 className="font-bold mb-2">Safety Systems</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Emergency shutoff, brake switches, and interlocks
            </p>
            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold">
              View Diagram →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
