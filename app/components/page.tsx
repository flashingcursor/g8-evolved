export default function ComponentsPage() {
  const components = [
    {
      category: "🔋 Power System",
      items: [
        {
          name: "Battery Pack",
          specs: "36V 100Ah LiFePO₄",
          notes: "Internal BMS included for cell balancing and protection"
        },
        {
          name: "Battery Charger",
          specs: "36V LiFePO₄-compatible",
          notes: "CC/CV charging profile optimized for LiFePO₄ chemistry"
        },
        {
          name: "Main Fuse",
          specs: "250A ANL fuse",
          notes: "Installed near battery positive terminal for overcurrent protection"
        },
        {
          name: "Main Contactor",
          specs: "SW180 (36-48V coil)",
          notes: "Connects controller to battery pack when key is in RUN position"
        },
        {
          name: "Reversing Contactor",
          specs: "SW202 dual-coil (36-48V)",
          notes: "Swaps motor field polarity for forward/reverse operation"
        },
        {
          name: "DC-DC Converter",
          specs: "36V → 12V (20-25A)",
          notes: "Powers lights, horn, and accessories independently"
        }
      ]
    },
    {
      category: "⚙️ Control & Logic Circuit",
      items: [
        {
          name: "Key Switch",
          specs: "3-position (OFF/ACC/RUN)",
          notes: "OFF isolates everything, ACC powers 12V only, RUN enables controller"
        },
        {
          name: "Direction Switch",
          specs: "3-position ON-OFF-ON toggle",
          notes: "Center=neutral, Left=reverse coil, Right=forward coil"
        },
        {
          name: "Throttle Pot Box",
          specs: "PB-6 0-5kΩ potentiometer",
          notes: "Includes microswitch for controller enable signal"
        },
        {
          name: "Flyback Diodes",
          specs: "1N5408 (3A 1000V)",
          notes: "One across each contactor coil for voltage spike suppression"
        },
        {
          name: "Inline Fuses",
          specs: "5A blade fuses",
          notes: "On key switch and coil feed circuits"
        }
      ]
    },
    {
      category: "🎛️ Drive System",
      items: [
        {
          name: "Motor Controller",
          specs: "Curtis 1204M-class (36V 275-500A)",
          notes: "Solid-state MOSFET controller for smooth throttle response"
        },
        {
          name: "DC Series Motor",
          specs: "Original G8 motor (or equivalent)",
          notes: "Separately excited series motor with reversible field"
        },
        {
          name: "Pre-charge Resistor",
          specs: "470Ω 5W",
          notes: "Limits inrush current when SW180 closes"
        }
      ]
    },
    {
      category: "🔌 Wiring Components",
      items: [
        {
          name: "Traction Cable",
          specs: "2 AWG welding cable",
          notes: "For main battery and motor power paths (high current)"
        },
        {
          name: "Control Wire",
          specs: "14-16 AWG stranded",
          notes: "For key switch, direction switch, and coil circuits"
        },
        {
          name: "Cable Lugs & Terminals",
          specs: "Various sizes for 2 AWG and 14-16 AWG",
          notes: "Crimp-style terminals for secure connections"
        },
        {
          name: "Heat Shrink Tubing",
          specs: "Assorted sizes",
          notes: "For insulating and protecting connections"
        }
      ]
    },
    {
      category: "🖥️ Optional Add-Ons",
      items: [
        {
          name: "LCD Battery Meter",
          specs: "36V battery voltage/percentage display",
          notes: "May be included with battery kit"
        },
        {
          name: "Direction Indicator LEDs",
          specs: "12V LED indicators",
          notes: "Show forward/reverse status tied to SW202 coil outputs"
        },
        {
          name: "12V Lighting Kit",
          specs: "LED headlights, taillights, turn signals",
          notes: "Powered from DC-DC converter output"
        },
        {
          name: "Horn",
          specs: "12V automotive horn",
          notes: "Powered from DC-DC converter"
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-blue-600 px-2">
          Components & Parts List
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          Complete breakdown of all components used in the G8 conversion project
        </p>
      </div>

      {components.map((category, idx) => (
        <section key={idx} className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-600">{category.category}</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🧠 System Overview</h2>
        <div className="bg-white dark:bg-gray-700 p-6 rounded shadow space-y-4">
          <h3 className="font-bold text-lg mb-2">How It Works</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>This setup replaces the old resistor/coil speed control with a solid-state MOSFET controller (Curtis 1204M), giving you smoother throttle response and much better efficiency.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>The <strong>SW180</strong> acts like the cart&apos;s &quot;main ignition relay&quot; — it connects the battery to the controller when the key is in RUN.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>The <strong>SW202</strong> reversing contactor electrically flips your motor&apos;s field direction for forward/reverse operation.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>The <strong>PB-6 throttle pot</strong> gives proportional speed input to the controller (0-5kΩ resistance).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>The key and direction switches handle all the logic, and all coils are protected with flyback diodes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">→</span>
              <span>Your <strong>36V → 12V DC-DC converter</strong> powers accessories (lights, horn, etc.) independently of the traction power system.</span>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-bold mb-2">Key Advantages</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                <strong>✓ Efficient:</strong> MOSFET controller vs. resistor-based speed control
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                <strong>✓ Safe:</strong> LiFePO₄ chemistry with internal BMS protection
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                <strong>✓ Smooth:</strong> Electronic throttle control with microswitch enable
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded">
                <strong>✓ Protected:</strong> 250A fuse, flyback diodes, pre-charge resistor
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Estimated Cost Breakdown</h2>
        <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span>36V 100Ah LiFePO₄ Battery Pack</span>
              <span className="font-bold">$800-1,200</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Curtis 1204M Controller</span>
              <span className="font-bold">$400-600</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Contactors (SW180 + SW202)</span>
              <span className="font-bold">$150-200</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>DC-DC Converter (36V→12V)</span>
              <span className="font-bold">$50-80</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Switches, Throttle, Wiring & Parts</span>
              <span className="font-bold">$150-250</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Optional: Lighting, Horn, Meter</span>
              <span className="font-bold">$100-200</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total Estimated Cost</span>
              <span className="text-blue-600">$1,650-2,530</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            * Prices are approximate and vary by supplier and whether you reuse existing components (motor, switches, etc.)
          </p>
        </div>
      </section>
    </div>
  );
}
