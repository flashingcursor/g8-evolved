export default function ComponentsPage() {
  const components = [
    {
      category: "Power System",
      items: [
        {
          name: "48V Lithium Battery Pack",
          specs: "100Ah capacity, 16S configuration",
          notes: "LiFePO4 chemistry for safety and longevity"
        },
        {
          name: "Battery Management System (BMS)",
          specs: "16S, 200A continuous rating",
          notes: "Active balancing, temperature monitoring, cell protection"
        },
        {
          name: "Battery Charger",
          specs: "48V, 20A smart charger",
          notes: "CC/CV charging with BMS communication"
        }
      ]
    },
    {
      category: "Drive System",
      items: [
        {
          name: "Motor Controller",
          specs: "400A continuous, 600A peak",
          notes: "Programmable, regenerative braking capable"
        },
        {
          name: "DC Series Motor",
          specs: "5kW rated power",
          notes: "High torque for hill climbing"
        },
        {
          name: "Throttle Assembly",
          specs: "Hall-effect potentiometer, 0-5V output",
          notes: "Waterproof, adjustable tension"
        }
      ]
    },
    {
      category: "Instrumentation",
      items: [
        {
          name: "Digital Dashboard",
          specs: "7-inch color display",
          notes: "Shows speed, battery %, range, power usage"
        },
        {
          name: "Current Sensor",
          specs: "±500A hall-effect sensor",
          notes: "For accurate power monitoring"
        },
        {
          name: "Voltage Monitor",
          specs: "Multi-cell voltage display",
          notes: "Real-time cell voltage monitoring"
        }
      ]
    },
    {
      category: "Lighting & Safety",
      items: [
        {
          name: "LED Headlights",
          specs: "30W LED, 3000 lumens",
          notes: "High and low beam"
        },
        {
          name: "LED Taillights",
          specs: "Brake and running lights",
          notes: "Integrated turn signals"
        },
        {
          name: "Emergency Shutoff",
          specs: "Keyed switch + e-stop button",
          notes: "Cuts all power except dashboard"
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">
          Components & Parts List
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Complete breakdown of all components used in the G8 conversion project
        </p>
      </div>

      {components.map((category, idx) => (
        <section key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">{category.category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item, itemIdx) => (
              <div key={itemIdx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Specs:</strong> {item.specs}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Notes:</strong> {item.notes}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Cost Breakdown</h2>
        <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span>Battery Pack & BMS</span>
              <span className="font-bold">$2,500</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Motor & Controller</span>
              <span className="font-bold">$1,200</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Instrumentation</span>
              <span className="font-bold">$400</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Lighting & Safety</span>
              <span className="font-bold">$300</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Wiring & Connectors</span>
              <span className="font-bold">$200</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total Estimated Cost</span>
              <span className="text-blue-600">$4,600</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
