export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">
          Yamaha G8 Golf Cart Conversion
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive guide to upgrading and modernizing your Yamaha G8 golf cart
          with complete electronics replacement and enhanced features
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-blue-600">⚡ Power System</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete battery and charging system upgrade with modern lithium technology
            and advanced BMS integration
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-blue-600">🔌 Wiring</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive wiring diagrams showing every connection, with detailed
            specifications and color coding
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-3 text-blue-600">🎛️ Controls</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Modern motor controller, throttle system, and regenerative braking
            implementation guide
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            This project documents the complete end-to-end upgrade of a Yamaha G8 golf cart,
            replacing all original electronics with modern, efficient components.
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Lithium battery pack with advanced BMS</li>
            <li>High-efficiency motor controller</li>
            <li>LED lighting system</li>
            <li>Digital dashboard and monitoring</li>
            <li>Regenerative braking capability</li>
            <li>Enhanced safety systems</li>
          </ul>
        </div>
      </section>

      <section className="text-center">
        <a
          href="/wiring"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Interactive Wiring Diagrams →
        </a>
      </section>
    </div>
  );
}
