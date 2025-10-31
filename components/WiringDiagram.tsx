'use client';

import { useEffect, useRef, useState } from 'react';
import { dia, shapes } from '@joint/core';
import { AvoidRouter } from '../utils/avoid-router';

interface WiringDiagramProps {
  title?: string;
  width?: number;
  height?: number;
}

export default function WiringDiagram({
  title = "Wiring Diagram",
  width = 2000,
  height = 1200
}: WiringDiagramProps) {
  const paperContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const routerRef = useRef<AvoidRouter | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    console.log('WiringDiagram useEffect called, paperContainer.current:', !!paperContainer.current);

    if (!paperContainer.current) {
      console.warn('paperContainer.current is null, returning');
      return;
    }

    let paper: dia.Paper;
    let graph: dia.Graph;

    const initDiagram = async () => {
      console.log('initDiagram called');

      let useLibavoid = true;

      try {
        // Try to load the libavoid WASM library with timeout
        console.log('Attempting to load libavoid WASM from /libavoid.wasm');

        const loadPromise = AvoidRouter.load();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('WASM load timeout after 10 seconds')), 10000)
        );

        await Promise.race([loadPromise, timeoutPromise]);
        console.log('✓ Libavoid WASM loaded successfully!');
        setUseFallback(false);
      } catch (err) {
        console.warn('⚠ Failed to load libavoid, falling back to Manhattan router:', err);
        useLibavoid = false;
        setUseFallback(true);
      }

      setIsLoading(false);

      // Create a graph and paper
      console.log('Creating graph...');
      graph = new dia.Graph({}, { cellNamespace: shapes });

      console.log('Creating paper...');
      paper = new dia.Paper({
        el: paperContainer.current!,
        model: graph,
        width: width,
        height: height,
        gridSize: 10,
        drawGrid: true,
        background: { color: '#F3F7F6' },
        cellViewNamespace: shapes,
        interactive: useLibavoid ? { linkMove: false } : true,
        linkPinning: false,
        async: true,
        frozen: true,
        snapLinks: { radius: 30 },
        overflow: true,
        defaultConnector: {
          name: 'straight',
          args: {
            cornerType: 'cubic',
            cornerRadius: 4,
          },
        },
        // Use Manhattan router as fallback if libavoid fails
        ...(useLibavoid ? {} : {
          defaultRouter: {
            name: 'manhattan',
            args: {
              step: 10,
              padding: 20,
              maximumLoops: 2000,
              perpendicular: true,
            }
          }
        }),
      });

      // Define port groups with enhanced styling
      const PORT_RADIUS = 8;
      const portAttrs = {
        circle: {
          cursor: 'crosshair',
          fill: '#3B82F6',
          stroke: '#FFFFFF',
          strokeWidth: 2,
          magnet: 'active',
          r: PORT_RADIUS,
          filter: {
            name: 'dropShadow' as const,
            args: {
              dx: 0,
              dy: 1,
              blur: 2,
              color: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }
      };

      const portLabelMarkup = [{
        tagName: 'text',
        selector: 'portLabel'
      }];

      const portGroups = {
        'top': {
          position: 'top',
          attrs: portAttrs,
          label: {
            position: {
              name: 'top',
              args: { y: PORT_RADIUS + 15 }  // Inside: port radius + distance into component
            },
            markup: portLabelMarkup
          }
        },
        'bottom': {
          position: 'bottom',
          attrs: portAttrs,
          label: {
            position: {
              name: 'bottom',
              args: { y: -(PORT_RADIUS + 15) }  // Inside: -(port radius + distance into component)
            },
            markup: portLabelMarkup
          }
        },
        'right': {
          position: 'right',
          attrs: portAttrs,
          label: {
            position: {
              name: 'right',
              args: { x: -(PORT_RADIUS + 15) }  // Inside: -(port radius + distance into component)
            },
            markup: portLabelMarkup
          }
        },
        'left': {
          position: 'left',
          attrs: portAttrs,
          label: {
            position: {
              name: 'left',
              args: { x: PORT_RADIUS + 15 }  // Inside: port radius + distance into component
            },
            markup: portLabelMarkup
          }
        },
      };

      // Helper function to create component with ports (enhanced styling)
      const createComponentWithPorts = (
        x: number,
        y: number,
        width: number,
        height: number,
        label: string,
        ports: any[],
        componentType: 'power' | 'control' | 'motor' | 'accessory' = 'control'
      ) => {
        // Color schemes for different component types
        const colorSchemes = {
          power: {
            gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            stroke: '#D97706',
            labelColor: '#92400E',
          },
          motor: {
            gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
            stroke: '#2563EB',
            labelColor: '#1E3A8A',
          },
          control: {
            gradient: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
            stroke: '#4F46E5',
            labelColor: '#312E81',
          },
          accessory: {
            gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
            stroke: '#059669',
            labelColor: '#064E3B',
          }
        };

        const scheme = colorSchemes[componentType];

        return new shapes.standard.Rectangle({
          position: { x, y },
          size: { width, height },
          z: 2,
          attrs: {
            root: {
              highlighterSelector: 'body',
              magnetSelector: 'body',
            },
            body: {
              fill: {
                type: 'linearGradient',
                stops: [
                  { offset: '0%', color: scheme.gradient.match(/#[A-F0-9]{6}/gi)?.[0] || '#E0E7FF' },
                  { offset: '100%', color: scheme.gradient.match(/#[A-F0-9]{6}/gi)?.[1] || '#C7D2FE' }
                ]
              },
              stroke: scheme.stroke,
              strokeWidth: 2.5,
              rx: 8,
              ry: 8,
              filter: {
                name: 'dropShadow' as const,
                args: {
                  dx: 0,
                  dy: 2,
                  blur: 4,
                  color: 'rgba(0, 0, 0, 0.15)'
                }
              }
            },
            label: {
              text: label,
              fill: scheme.labelColor,
              fontSize: 13,
              fontWeight: '600',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle'
            }
          },
          ports: {
            groups: portGroups,
            items: ports
          }
        });
      };

      // SCALED LAYOUT - Component dimensions based on actual physical sizes
      // Scale factor: 0.7 pixels per mm (makes battery ~364px wide - 2x previous scale)

      // Physical dimensions (L×W×H in mm):
      // Battery: 520×269×220, SW180: 61×45×122, SW202: 160.5×82×152
      // Curtis 1204M: 174×130×~100, ANL fuse block: ~158×58, PB-6: ~102×60×52
      // DC-DC converter: ~100×80 (typical 30A), Key switch: ~20Ø body

      // ROW 1: MAIN POWER PATH (Top)

      // 1. Battery Pack (520×269mm → 364×188px)
      const battery = createComponentWithPorts(
        100, 100, 364, 188,
        '36V Battery\n100Ah LiFePO₄',
        [
          { id: 'b_plus', group: 'right', attrs: { portLabel: { text: 'B+', fontSize: 12, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'b_minus', group: 'right', attrs: { portLabel: { text: 'B-', fontSize: 12, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'power'
      );

      // 2. 250A ANL Fuse Block (158×58mm → 110×40px)
      const fuse = createComponentWithPorts(
        620, 150, 110, 40,
        '250A ANL Fuse',
        [
          { id: 'fuse_in', group: 'left', attrs: { portLabel: { text: 'IN', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'fuse_out', group: 'right', attrs: { portLabel: { text: 'OUT', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'power'
      );

      // 3. SW180 Main Contactor (61×45mm cap → 42×32px, height 122mm → 86px)
      const sw180 = createComponentWithPorts(
        890, 100, 42, 86,
        'SW180\nContactor',
        [
          { id: 'sw180_b_in', group: 'left', attrs: { portLabel: { text: 'B+', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_b_out', group: 'right', attrs: { portLabel: { text: 'B+', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_coil_pos', group: 'bottom', attrs: { portLabel: { text: '86', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_coil_neg', group: 'bottom', attrs: { portLabel: { text: '85', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'power'
      );

      // 4. Curtis 1204M Controller (174×130mm → 122×92px)
      const controller = createComponentWithPorts(
        1120, 100, 122, 92,
        'Curtis 1204M\nController',
        [
          { id: 'ctrl_b_plus', group: 'left', attrs: { portLabel: { text: 'B+', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_b_minus', group: 'left', attrs: { portLabel: { text: 'B-', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_m_minus', group: 'right', attrs: { portLabel: { text: 'M-', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_ksi', group: 'bottom', attrs: { portLabel: { text: 'KSI', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_high', group: 'bottom', attrs: { portLabel: { text: '5V', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_wiper', group: 'bottom', attrs: { portLabel: { text: 'POT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_low', group: 'bottom', attrs: { portLabel: { text: 'GND', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_enable', group: 'bottom', attrs: { portLabel: { text: 'EN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'motor'
      );

      // 5. DC Series Motor (approximate 200×150mm → 140×106px)
      const motor = createComponentWithPorts(
        1440, 100, 140, 106,
        'DC Series\nMotor',
        [
          { id: 'motor_a1', group: 'left', attrs: { portLabel: { text: 'A1', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_a2', group: 'bottom', attrs: { portLabel: { text: 'A2', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_f1', group: 'bottom', attrs: { portLabel: { text: 'F1', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_f2', group: 'bottom', attrs: { portLabel: { text: 'F2', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'motor'
      );

      // 6. DC-DC Converter (100×80mm → 70×56px)
      const dcConverter = createComponentWithPorts(
        1780, 120, 70, 56,
        '36V→12V\nConverter',
        [
          { id: 'dc_36v_pos', group: 'left', attrs: { portLabel: { text: '36+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_36v_neg', group: 'left', attrs: { portLabel: { text: '36-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_12v_pos', group: 'bottom', attrs: { portLabel: { text: '12+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_12v_neg', group: 'bottom', attrs: { portLabel: { text: '12-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'accessory'
      );

      // ROW 2: SAFETY COMPONENTS (Middle-upper)

      // 7. Pre-charge Resistor (49×10mm 10W axial → 34×8px)
      const prechargeRes = createComponentWithPorts(
        870, 260, 34, 8,
        '1.5kΩ 10W\nPre-charge',
        [
          { id: 'precharge_in', group: 'left', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'precharge_out', group: 'right', attrs: { portLabel: { text: 'OUT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'power'
      );

      // 8. 5A Control Circuit Fuse (blade fuse holder ~40×20mm → 28×14px)
      const controlFuse = createComponentWithPorts(
        160, 400, 28, 14,
        '5A Fuse',
        [
          { id: 'ctrl_fuse_in', group: 'top', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_fuse_out', group: 'bottom', attrs: { portLabel: { text: 'OUT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // 9. SW202 Reversing Contactor (160.5×82mm → 112×58px, height 152mm → 106px)
      const sw202 = createComponentWithPorts(
        1440, 340, 112, 106,
        'SW202\nReversing',
        [
          { id: 'sw202_a2', group: 'top', attrs: { portLabel: { text: 'A2', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_f1', group: 'top', attrs: { portLabel: { text: 'F1', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_f2', group: 'top', attrs: { portLabel: { text: 'F2', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_fwd_coil', group: 'left', attrs: { portLabel: { text: 'FWD', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_rev_coil', group: 'left', attrs: { portLabel: { text: 'REV', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_common', group: 'left', attrs: { portLabel: { text: 'COM', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'motor'
      );

      // 10. 15A Accessory Fuse (blade fuse holder ~40×20mm → 28×14px)
      const accessoryFuse = createComponentWithPorts(
        1780, 240, 28, 14,
        '15A Fuse',
        [
          { id: 'acc_fuse_in', group: 'top', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'acc_fuse_out', group: 'bottom', attrs: { portLabel: { text: 'OUT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'accessory'
      );

      // 11. 12V Accessories (representative box 120×80mm → 84×56px)
      const accessories = createComponentWithPorts(
        1740, 320, 84, 56,
        '12V Accessories\nLights/Horn',
        [
          { id: 'acc_12v_pos', group: 'top', attrs: { portLabel: { text: '+', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'acc_12v_neg', group: 'top', attrs: { portLabel: { text: '-', fontSize: 11, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'accessory'
      );

      // ROW 3: FLYBACK DIODES (Middle) - scaled up 3x for visibility
      // Actual: DO-201AD 9.5×5.3mm, displayed as 20×12px for usability

      // 12. SW180 Flyback Diode
      const sw180Diode = createComponentWithPorts(
        760, 600, 20, 12,
        'D1\n1N4007',
        [
          { id: 'd1_cathode', group: 'top', attrs: { portLabel: { text: '+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'd1_anode', group: 'bottom', attrs: { portLabel: { text: '-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // 13. SW202 FWD Coil Flyback Diode
      const sw202FwdDiode = createComponentWithPorts(
        1260, 600, 20, 12,
        'D2\n1N4007',
        [
          { id: 'd2_cathode', group: 'top', attrs: { portLabel: { text: '+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'd2_anode', group: 'bottom', attrs: { portLabel: { text: '-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // 14. SW202 REV Coil Flyback Diode
      const sw202RevDiode = createComponentWithPorts(
        1360, 600, 20, 12,
        'D3\n1N4007',
        [
          { id: 'd3_cathode', group: 'top', attrs: { portLabel: { text: '+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'd3_anode', group: 'bottom', attrs: { portLabel: { text: '-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // ROW 4: CONTROL COMPONENTS (Bottom)

      // 15. Key Switch (20mm Ø body + panel mount ~30×30mm → 22×22px)
      const keySwitch = createComponentWithPorts(
        200, 900, 22, 22,
        'Key Switch\n3-Position',
        [
          { id: 'key_batt', group: 'top', attrs: { portLabel: { text: 'BAT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'key_acc', group: 'right', attrs: { portLabel: { text: 'ACC', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'key_run', group: 'top', attrs: { portLabel: { text: 'RUN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // 16. PB-6 Throttle Pot Box (102×60mm → 72×42px)
      const throttle = createComponentWithPorts(
        500, 900, 72, 42,
        'PB-6 Throttle\nPot Box',
        [
          { id: 'throttle_5v', group: 'top', attrs: { portLabel: { text: '5V', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_wiper', group: 'top', attrs: { portLabel: { text: 'W', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_gnd', group: 'top', attrs: { portLabel: { text: 'G', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_sw', group: 'left', attrs: { portLabel: { text: 'SW', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // 17. Direction Switch (toggle switch ~40×20mm → 28×14px)
      const dirSwitch = createComponentWithPorts(
        900, 900, 28, 14,
        'Direction\nSwitch',
        [
          { id: 'dir_in', group: 'left', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dir_fwd', group: 'top', attrs: { portLabel: { text: 'FWD', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dir_rev', group: 'top', attrs: { portLabel: { text: 'REV', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ],
        'control'
      );

      // Add all components to graph
      console.log('Adding components to graph...');
      graph.addCells([
        battery, fuse, sw180, controller, motor, sw202,
        keySwitch, dirSwitch, throttle, dcConverter, accessories,
        prechargeRes, sw180Diode, sw202FwdDiode, sw202RevDiode,
        controlFuse, accessoryFuse
      ]);
      console.log('Components added successfully');

      // Create port-to-port connections with wire gauge and color
      const createPortLink = (
        sourceElement: dia.Element,
        sourcePort: string,
        targetElement: dia.Element,
        targetPort: string,
        wireColor: string,
        wireGauge: number // AWG - smaller number = thicker wire
      ) => {
        // Map wire gauge to stroke width (thicker wires = wider lines)
        const gaugeToWidth: Record<number, number> = {
          2: 8,    // 2AWG - very thick (high current main power)
          4: 6,    // 4AWG - thick
          6: 5,    // 6AWG - medium-thick
          10: 3.5, // 10AWG - medium
          14: 2.5, // 14AWG - thinner
          18: 2,   // 18AWG - thin (control signals)
          20: 1.5, // 20AWG - very thin (low current control)
        };

        // Map colors to wire color names
        const colorNames: Record<string, string> = {
          '#DC2626': 'Red',
          '#000000': 'Black',
          '#3B82F6': 'Blue',
          '#EAB308': 'Yellow',
          '#F97316': 'Orange',
          '#22C55E': 'Green',
          '#9CA3AF': 'White/Gray',
        };

        const strokeWidth = gaugeToWidth[wireGauge] || 2;

        return new shapes.standard.Link({
          z: 1,
          source: { id: sourceElement.id, port: sourcePort },
          target: { id: targetElement.id, port: targetPort },
          attrs: {
            line: {
              stroke: wireColor,
              strokeWidth: strokeWidth,
              targetMarker: {
                d: 'M 5 2.5 0 0 5 -2.5 Z',
                fill: wireColor
              },
            }
          },
          // Store wire metadata for display
          labels: [{
            attrs: {
              text: {
                text: `${colorNames[wireColor] || 'Unknown'} ${wireGauge}AWG`,
                display: 'none' // Hidden by default, shown in popup
              }
            }
          }]
        });
      };

      // Create all connections with wire colors and gauges
      const allLinks = [
        // Main Power Path - 2AWG (Red for positive)
        createPortLink(battery, 'b_plus', fuse, 'fuse_in', '#DC2626', 2),           // Red 2AWG
        createPortLink(fuse, 'fuse_out', sw180, 'sw180_b_in', '#DC2626', 2),        // Red 2AWG
        createPortLink(sw180, 'sw180_b_out', controller, 'ctrl_b_plus', '#DC2626', 2), // Red 2AWG

        // Pre-charge Resistor - In parallel with SW180 main contacts (10AWG)
        createPortLink(fuse, 'fuse_out', prechargeRes, 'precharge_in', '#DC2626', 10),  // Red 10AWG - from fuse to resistor
        createPortLink(prechargeRes, 'precharge_out', controller, 'ctrl_b_plus', '#DC2626', 10), // Red 10AWG - resistor to controller

        // Motor Circuit - 2AWG (Red for drive IN, Black for return OUT)
        // Path: Controller M- → Motor A1 → A2 → SW202 → F1/F2 (switched) → Motor F1/F2 → COM → Battery B-
        // RED = PWM source driving INTO motor armature
        // BLACK = Return path FROM motor through field back to battery
        createPortLink(controller, 'ctrl_m_minus', motor, 'motor_a1', '#DC2626', 2), // Red 2AWG - PWM source into armature
        createPortLink(motor, 'motor_a2', sw202, 'sw202_a2', '#000000', 2),          // Black 2AWG - armature return/output
        createPortLink(sw202, 'sw202_f1', motor, 'motor_f1', '#000000', 2),          // Black 2AWG - field in return path
        createPortLink(sw202, 'sw202_f2', motor, 'motor_f2', '#000000', 2),          // Black 2AWG - field in return path
        createPortLink(sw202, 'sw202_common', battery, 'b_minus', '#000000', 2),     // Black 2AWG - final ground return

        // Ground/Negative Returns - 2AWG (Black)
        createPortLink(battery, 'b_minus', controller, 'ctrl_b_minus', '#000000', 2), // Black 2AWG

        // Control Circuit with 5A Fuse - 18AWG
        createPortLink(battery, 'b_plus', controlFuse, 'ctrl_fuse_in', '#DC2626', 18),  // Red 18AWG - Battery to fuse
        createPortLink(controlFuse, 'ctrl_fuse_out', keySwitch, 'key_batt', '#DC2626', 18), // Red 18AWG - Fuse to key switch

        // SW180 Coil Circuit with Flyback Diode - 18AWG
        createPortLink(keySwitch, 'key_run', sw180, 'sw180_coil_pos', '#3B82F6', 18),    // Blue 18AWG
        createPortLink(sw180, 'sw180_coil_neg', battery, 'b_minus', '#000000', 18),      // Black 18AWG - coil ground
        // SW180 Flyback Diode (across coil, cathode to +, anode to -)
        createPortLink(keySwitch, 'key_run', sw180Diode, 'd1_cathode', '#3B82F6', 20),   // Connect cathode to coil +
        createPortLink(sw180Diode, 'd1_anode', battery, 'b_minus', '#000000', 20),       // Connect anode to coil -

        // Controller KSI with High-Pedal Disable Interlock - 18AWG
        // KSI only energizes if throttle microswitch is closed (pedal released)
        createPortLink(keySwitch, 'key_run', throttle, 'throttle_sw', '#3B82F6', 18),    // Blue 18AWG - RUN to throttle SW
        createPortLink(throttle, 'throttle_sw', controller, 'ctrl_ksi', '#3B82F6', 18),  // Blue 18AWG - throttle SW to KSI (interlock)

        // Direction Switch Circuit - 18AWG
        createPortLink(keySwitch, 'key_acc', dirSwitch, 'dir_in', '#DC2626', 18),        // Red 18AWG - Powers direction switch

        // SW202 FWD Coil with Flyback Diode - 18AWG
        createPortLink(dirSwitch, 'dir_fwd', sw202, 'sw202_fwd_coil', '#EAB308', 18),    // Yellow 18AWG
        createPortLink(dirSwitch, 'dir_fwd', sw202FwdDiode, 'd2_cathode', '#EAB308', 20), // Diode cathode to coil +
        createPortLink(sw202FwdDiode, 'd2_anode', battery, 'b_minus', '#000000', 20),    // Diode anode to ground

        // SW202 REV Coil with Flyback Diode - 18AWG
        createPortLink(dirSwitch, 'dir_rev', sw202, 'sw202_rev_coil', '#F97316', 18),    // Orange 18AWG
        createPortLink(dirSwitch, 'dir_rev', sw202RevDiode, 'd3_cathode', '#F97316', 20), // Diode cathode to coil +
        createPortLink(sw202RevDiode, 'd3_anode', battery, 'b_minus', '#000000', 20),    // Diode anode to ground

        // Throttle Potentiometer Connections - 20AWG
        createPortLink(controller, 'ctrl_pot_high', throttle, 'throttle_5v', '#DC2626', 20),    // Red 20AWG (5V)
        createPortLink(throttle, 'throttle_wiper', controller, 'ctrl_pot_wiper', '#9CA3AF', 20), // Gray 20AWG (signal)
        createPortLink(controller, 'ctrl_pot_low', throttle, 'throttle_gnd', '#000000', 20),     // Black 20AWG (ground)
        createPortLink(controller, 'ctrl_enable', battery, 'b_minus', '#000000', 20),            // Black 20AWG - Enable to ground

        // 12V Accessory Circuit with Fuse - 10AWG input, 14AWG output
        createPortLink(battery, 'b_plus', dcConverter, 'dc_36v_pos', '#DC2626', 10),     // Red 10AWG
        createPortLink(battery, 'b_minus', dcConverter, 'dc_36v_neg', '#000000', 10),    // Black 10AWG
        createPortLink(dcConverter, 'dc_12v_pos', accessoryFuse, 'acc_fuse_in', '#DC2626', 14),  // Red 14AWG - Converter to fuse
        createPortLink(accessoryFuse, 'acc_fuse_out', accessories, 'acc_12v_pos', '#DC2626', 14), // Red 14AWG - Fuse to accessories
        createPortLink(dcConverter, 'dc_12v_neg', accessories, 'acc_12v_neg', '#000000', 14),    // Black 14AWG
      ];

      // Add all links to graph
      graph.addCells(allLinks);

      // Initialize routing (libavoid or fallback to Manhattan)
      if (useLibavoid) {
        const router = new AvoidRouter(graph, {
          shapeBufferDistance: 20,
          idealNudgingDistance: 10,
          portOverflow: PORT_RADIUS,
        });

        routerRef.current = router;

        router.addGraphListeners();
        router.routeAll();
      }

      // Unfreeze the paper to show the diagram
      console.log('Unfreezing paper and fitting to content...');
      paper.unfreeze();
      paper.fitToContent({
        useModelGeometry: true,
        padding: 100,
        allowNewOrigin: 'any',
      });
      console.log('Paper ready and diagram rendered!');

      // Add interactivity
      paper.on('element:pointerclick', (elementView) => {
        const element = elementView.model;
        const label = element.attr('label/text');
        const ports = element.getPorts();
        const portList = ports.map((p: any) => `  • ${p.attrs?.text?.text || p.id}`).join('\n');

        alert(`Component: ${label}\n\nPorts:\n${portList}\n\nClick ports to see connection details.`);
      });

      paper.on('link:pointerclick', (linkView) => {
        const link = linkView.model;
        const source = link.source();
        const target = link.target();

        if (!source.id || !target.id) return;

        const sourceEl = graph.getCell(source.id);
        const targetEl = graph.getCell(target.id);
        const sourceName = sourceEl?.attr('label/text') || 'Unknown';
        const targetName = targetEl?.attr('label/text') || 'Unknown';

        // Get wire information from label
        const wireInfo = link.labels()?.[0]?.attrs?.text?.text || 'Unknown wire';

        alert(
          `Connection Details\n\n` +
          `From: ${sourceName} [${source.port}]\n` +
          `To: ${targetName} [${target.port}]\n\n` +
          `Wire Specification:\n` +
          `• ${wireInfo}\n\n` +
          `Routing:\n` +
          `• Libavoid orthogonal algorithm\n` +
          `• Automatic obstacle avoidance\n` +
          `• 20px buffer distance from components`
        );
      });

      console.log('initDiagram completed successfully!');
    };

    console.log('About to call initDiagram()...');
    initDiagram();

    // Cleanup function
    return () => {
      if (routerRef.current) {
        routerRef.current.removeGraphListeners();
      }
      if (paper) {
        paper.remove();
      }
    };
  }, [width, height]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      {isMobile && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
          <div className="flex items-start">
            <div className="text-blue-600 text-xl mr-3">ℹ️</div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Mobile Tip</h4>
              <p className="text-xs text-blue-700 mt-1">
                Pinch to zoom and drag to pan for the best viewing experience. Consider viewing on desktop for full detail.
              </p>
            </div>
          </div>
        </div>
      )}
      {useFallback && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-start">
            <div className="text-yellow-600 text-xl mr-3">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-800 text-sm">Using Fallback Router</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Libavoid WASM failed to load. Using Manhattan router instead.
                Check browser console for details.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full overflow-x-auto overflow-y-hidden border border-gray-300 rounded-lg shadow-lg bg-white" style={{ maxWidth: '100%' }}>
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0 bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Loading routing engine...</p>
              <p className="text-xs text-gray-500 mt-2">Initializing diagram...</p>
            </div>
          </div>
        )}
        <div
          ref={paperContainer}
          className="overflow-auto"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            minWidth: isMobile ? '100%' : `${width}px`,
            touchAction: 'pan-x pan-y pinch-zoom'
          }}
        />
      </div>
      <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Interactive Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click on components to view all port definitions</li>
          <li>Click on connections to see source and destination ports</li>
          <li>Drag components to rearrange - connections automatically re-route!</li>
          <li><strong>{useFallback ? 'Manhattan Routing:' : 'Advanced Routing:'}</strong> {useFallback ? 'Orthogonal pathfinding with obstacle avoidance' : 'Libavoid orthogonal routing with obstacle avoidance'}</li>
          <li>All ports use consistent blue styling for cleaner visual design</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
          <h4 className="font-bold mb-1 text-sm">Port Naming:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>Motor:</strong> A1, A2 (armature), F1, F2 (field)</div>
            <div><strong>SW202:</strong> FWD, REV coils for direction</div>
            <div><strong>Controller:</strong> B+/B-, M-, KSI, POT, EN</div>
            <div><strong>Throttle:</strong> 5V, Wiper, GND, Microswitch</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
          <h4 className="font-bold mb-1 text-sm">{useFallback ? 'Manhattan Routing (Fallback):' : 'Libavoid Routing Engine:'}</h4>
          <div className="text-xs space-y-1">
            {useFallback ? (
              <>
                <div>• Orthogonal pathfinding with right-angle turns</div>
                <div>• Automatic obstacle detection and avoidance</div>
                <div>• 20px padding around components</div>
                <div>• Real-time re-routing when components are dragged</div>
              </>
            ) : (
              <>
                <div>• Orthogonal (horizontal/vertical only) pathfinding algorithm</div>
                <div>• WebAssembly-based high-performance routing</div>
                <div>• Automatically avoids all component obstacles</div>
                <div>• Real-time re-routing when components are dragged</div>
                <div>• 20px buffer distance prevents wire-to-component overlap</div>
                <div>• Intelligent nudging to separate overlapping paths</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
