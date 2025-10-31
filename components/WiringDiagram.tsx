'use client';

import { useEffect, useRef } from 'react';
import { dia, shapes } from '@joint/core';

interface WiringDiagramProps {
  title?: string;
  width?: number;
  height?: number;
}

export default function WiringDiagram({
  title = "Wiring Diagram",
  width = 1000,
  height = 700
}: WiringDiagramProps) {
  const paperContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paperContainer.current) return;

    // Create a graph and paper
    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = new dia.Paper({
      el: paperContainer.current,
      model: graph,
      width: width,
      height: height,
      gridSize: 10,
      drawGrid: true,
      background: {
        color: '#f9fafb'
      },
      cellViewNamespace: shapes,
      interactive: true,
      linkPinning: false,
      defaultConnector: { name: 'rounded' },
      defaultRouter: {
        name: 'manhattan',
        args: {
          step: 10,
          padding: 20,
          maximumLoops: 2000,
          maxAllowedDirectionChange: 90,
          perpendicular: true,
          excludeEnds: [],
          excludeTypes: ['standard.Text']
        }
      },
    });

    // Define port groups for consistent styling
    const portGroups = {
      'power-out': {
        position: 'right',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#dc2626',
            strokeWidth: 2,
            fill: '#fef2f2'
          },
          text: {
            fontSize: 10,
            fill: '#1f2937',
            fontWeight: 'bold'
          }
        },
        label: {
          position: {
            name: 'right',
            args: { y: 0 }
          }
        }
      },
      'power-in': {
        position: 'left',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#dc2626',
            strokeWidth: 2,
            fill: '#fef2f2'
          },
          text: {
            fontSize: 10,
            fill: '#1f2937',
            fontWeight: 'bold'
          }
        },
        label: {
          position: {
            name: 'left',
            args: { y: 0 }
          }
        }
      },
      'control-out': {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#3b82f6',
            strokeWidth: 2,
            fill: '#eff6ff'
          },
          text: {
            fontSize: 9,
            fill: '#1f2937'
          }
        },
        label: {
          position: {
            name: 'right',
            args: { y: 0 }
          }
        }
      },
      'control-in': {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#3b82f6',
            strokeWidth: 2,
            fill: '#eff6ff'
          },
          text: {
            fontSize: 9,
            fill: '#1f2937'
          }
        },
        label: {
          position: {
            name: 'left',
            args: { y: 0 }
          }
        }
      },
      'motor': {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#f59e0b',
            strokeWidth: 2,
            fill: '#fffbeb'
          },
          text: {
            fontSize: 10,
            fill: '#1f2937',
            fontWeight: 'bold'
          }
        },
        label: {
          position: {
            name: 'bottom',
            args: { y: 15 }
          }
        }
      }
    };

    // Helper function to create component with ports
    const createComponentWithPorts = (
      x: number,
      y: number,
      width: number,
      height: number,
      label: string,
      color: string,
      ports: any[]
    ) => {
      return new shapes.standard.Rectangle({
        position: { x, y },
        size: { width, height },
        attrs: {
          body: {
            fill: color,
            stroke: '#1e40af',
            strokeWidth: 2,
            rx: 5,
            ry: 5
          },
          label: {
            text: label,
            fill: 'white',
            fontSize: 12,
            fontWeight: 'bold',
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

    // 1. Battery Pack - 36V LiFePO4
    const battery = createComponentWithPorts(
      50, 50, 140, 80,
      '36V Battery\n100Ah LiFePO₄',
      '#10b981',
      [
        { id: 'b_plus', group: 'power-out', attrs: { text: { text: 'B+' } } },
        { id: 'b_minus', group: 'power-out', attrs: { text: { text: 'B-' } } }
      ]
    );

    // 2. 250A ANL Fuse
    const fuse = createComponentWithPorts(
      50, 180, 140, 60,
      '250A ANL Fuse',
      '#dc2626',
      [
        { id: 'fuse_in', group: 'power-in', attrs: { text: { text: 'IN' } } },
        { id: 'fuse_out', group: 'power-out', attrs: { text: { text: 'OUT' } } }
      ]
    );

    // 3. SW180 Main Contactor
    const sw180 = createComponentWithPorts(
      50, 290, 140, 80,
      'SW180\nMain Contactor',
      '#8b5cf6',
      [
        { id: 'sw180_b_in', group: 'power-in', attrs: { text: { text: 'B+' } } },
        { id: 'sw180_b_out', group: 'power-out', attrs: { text: { text: 'B+' } } },
        { id: 'sw180_coil_pos', group: 'control-in', attrs: { text: { text: '86' } } },
        { id: 'sw180_coil_neg', group: 'control-in', attrs: { text: { text: '85' } } }
      ]
    );

    // 4. Curtis 1204M Controller
    const controller = createComponentWithPorts(
      280, 180, 160, 100,
      'Curtis 1204M\nController',
      '#f59e0b',
      [
        { id: 'ctrl_b_plus', group: 'power-in', attrs: { text: { text: 'B+' } } },
        { id: 'ctrl_b_minus', group: 'power-in', attrs: { text: { text: 'B-' } } },
        { id: 'ctrl_m_minus', group: 'power-out', attrs: { text: { text: 'M-' } } },
        { id: 'ctrl_ksi', group: 'control-in', attrs: { text: { text: 'KSI' } } },
        { id: 'ctrl_pot_high', group: 'control-out', attrs: { text: { text: '5V' } } },
        { id: 'ctrl_pot_wiper', group: 'control-in', attrs: { text: { text: 'POT' } } },
        { id: 'ctrl_pot_low', group: 'control-in', attrs: { text: { text: 'GND' } } },
        { id: 'ctrl_enable', group: 'control-in', attrs: { text: { text: 'EN' } } }
      ]
    );

    // 5. DC Series Motor
    const motor = createComponentWithPorts(
      520, 80, 140, 100,
      'DC Series Motor',
      '#ef4444',
      [
        { id: 'motor_a1', group: 'motor', attrs: { text: { text: 'A1' } } },
        { id: 'motor_a2', group: 'motor', attrs: { text: { text: 'A2' } } },
        { id: 'motor_f1', group: 'motor', attrs: { text: { text: 'F1' } } },
        { id: 'motor_f2', group: 'motor', attrs: { text: { text: 'F2' } } }
      ]
    );

    // 6. SW202 Reversing Contactor
    const sw202 = createComponentWithPorts(
      520, 240, 140, 100,
      'SW202\nReversing',
      '#6366f1',
      [
        { id: 'sw202_a2', group: 'power-in', attrs: { text: { text: 'A2' } } },
        { id: 'sw202_f1', group: 'power-out', attrs: { text: { text: 'F1' } } },
        { id: 'sw202_f2', group: 'power-out', attrs: { text: { text: 'F2' } } },
        { id: 'sw202_fwd_coil', group: 'control-in', attrs: { text: { text: 'FWD' } } },
        { id: 'sw202_rev_coil', group: 'control-in', attrs: { text: { text: 'REV' } } },
        { id: 'sw202_common', group: 'control-in', attrs: { text: { text: 'COM' } } }
      ]
    );

    // 7. Key Switch (3-position)
    const keySwitch = createComponentWithPorts(
      50, 450, 120, 80,
      'Key Switch\n3-Position',
      '#06b6d4',
      [
        { id: 'key_batt', group: 'control-in', attrs: { text: { text: 'BAT' } } },
        { id: 'key_acc', group: 'control-out', attrs: { text: { text: 'ACC' } } },
        { id: 'key_run', group: 'control-out', attrs: { text: { text: 'RUN' } } }
      ]
    );

    // 8. Direction Switch
    const dirSwitch = createComponentWithPorts(
      230, 450, 120, 80,
      'Direction\nSwitch',
      '#06b6d4',
      [
        { id: 'dir_in', group: 'control-in', attrs: { text: { text: 'IN' } } },
        { id: 'dir_fwd', group: 'control-out', attrs: { text: { text: 'FWD' } } },
        { id: 'dir_rev', group: 'control-out', attrs: { text: { text: 'REV' } } }
      ]
    );

    // 9. PB-6 Throttle Pot Box
    const throttle = createComponentWithPorts(
      410, 450, 120, 80,
      'PB-6 Throttle\nPot Box',
      '#14b8a6',
      [
        { id: 'throttle_5v', group: 'control-in', attrs: { text: { text: '5V' } } },
        { id: 'throttle_wiper', group: 'control-out', attrs: { text: { text: 'W' } } },
        { id: 'throttle_gnd', group: 'control-in', attrs: { text: { text: 'G' } } },
        { id: 'throttle_sw', group: 'control-out', attrs: { text: { text: 'SW' } } }
      ]
    );

    // 10. DC-DC Converter
    const dcConverter = createComponentWithPorts(
      750, 80, 140, 80,
      '36V→12V\nConverter',
      '#ec4899',
      [
        { id: 'dc_36v_pos', group: 'power-in', attrs: { text: { text: '36+' } } },
        { id: 'dc_36v_neg', group: 'power-in', attrs: { text: { text: '36-' } } },
        { id: 'dc_12v_pos', group: 'power-out', attrs: { text: { text: '12+' } } },
        { id: 'dc_12v_neg', group: 'power-out', attrs: { text: { text: '12-' } } }
      ]
    );

    // 11. 12V Accessories
    const accessories = createComponentWithPorts(
      750, 220, 140, 60,
      '12V Accessories\nLights/Horn',
      '#a855f7',
      [
        { id: 'acc_12v_pos', group: 'power-in', attrs: { text: { text: '+' } } },
        { id: 'acc_12v_neg', group: 'power-in', attrs: { text: { text: '-' } } }
      ]
    );

    // Add all components to graph
    graph.addCells([
      battery, fuse, sw180, controller, motor, sw202,
      keySwitch, dirSwitch, throttle, dcConverter, accessories
    ]);

    // Create port-to-port connections (uses default Manhattan router)
    const createPortLink = (
      sourceElement: dia.Element,
      sourcePort: string,
      targetElement: dia.Element,
      targetPort: string,
      label: string,
      color: string = '#4b5563',
      strokeWidth: number = 3
    ) => {
      return new shapes.standard.Link({
        source: { id: sourceElement.id, port: sourcePort },
        target: { id: targetElement.id, port: targetPort },
        attrs: {
          line: {
            stroke: color,
            strokeWidth: strokeWidth,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z',
              fill: color
            }
          }
        },
        labels: label ? [{
          attrs: {
            text: {
              text: label,
              fill: '#1f2937',
              fontSize: 10,
              fontWeight: 'bold'
            },
            rect: {
              fill: 'white',
              stroke: color,
              strokeWidth: 1,
              rx: 3,
              ry: 3,
              refWidth: '100%',
              refHeight: '100%',
              refX: '-50%',
              refY: '-50%'
            }
          },
          position: {
            distance: 0.5
          }
        }] : []
      });
    };

    // Main Power Path (RED - thick)
    const powerLinks = [
      createPortLink(battery, 'b_plus', fuse, 'fuse_in', '2AWG', '#dc2626', 4),
      createPortLink(fuse, 'fuse_out', sw180, 'sw180_b_in', '250A', '#dc2626', 4),
      createPortLink(sw180, 'sw180_b_out', controller, 'ctrl_b_plus', 'B+', '#dc2626', 4),
      createPortLink(controller, 'ctrl_m_minus', motor, 'motor_a1', 'M-', '#f59e0b', 4),
      createPortLink(motor, 'motor_a2', sw202, 'sw202_a2', 'A2', '#f59e0b', 4),
      createPortLink(sw202, 'sw202_f1', motor, 'motor_f1', 'F1', '#6366f1', 3),
      createPortLink(sw202, 'sw202_f2', motor, 'motor_f2', 'F2', '#6366f1', 3),
    ];

    // Ground/Negative Returns (BLACK - thick)
    const groundLinks = [
      createPortLink(battery, 'b_minus', controller, 'ctrl_b_minus', 'B-', '#1f2937', 4),
    ];

    // Control Signals (BLUE - thin)
    const controlLinks = [
      createPortLink(keySwitch, 'key_run', sw180, 'sw180_coil_pos', 'KSI', '#3b82f6', 2),
      createPortLink(keySwitch, 'key_run', controller, 'ctrl_ksi', 'KSI', '#3b82f6', 2),
      createPortLink(dirSwitch, 'dir_fwd', sw202, 'sw202_fwd_coil', 'FWD', '#3b82f6', 2),
      createPortLink(dirSwitch, 'dir_rev', sw202, 'sw202_rev_coil', 'REV', '#3b82f6', 2),
      createPortLink(controller, 'ctrl_pot_high', throttle, 'throttle_5v', '5V', '#14b8a6', 2),
      createPortLink(throttle, 'throttle_wiper', controller, 'ctrl_pot_wiper', 'POT', '#14b8a6', 2),
      createPortLink(controller, 'ctrl_pot_low', throttle, 'throttle_gnd', 'GND', '#14b8a6', 2),
      createPortLink(throttle, 'throttle_sw', controller, 'ctrl_enable', 'EN', '#14b8a6', 2),
    ];

    // 12V Accessory Circuit (PURPLE)
    const accessoryLinks = [
      createPortLink(battery, 'b_plus', dcConverter, 'dc_36v_pos', '36V', '#8b5cf6', 3),
      createPortLink(battery, 'b_minus', dcConverter, 'dc_36v_neg', 'GND', '#8b5cf6', 3),
      createPortLink(dcConverter, 'dc_12v_pos', accessories, 'acc_12v_pos', '12V', '#a855f7', 2),
      createPortLink(dcConverter, 'dc_12v_neg', accessories, 'acc_12v_neg', 'GND', '#a855f7', 2),
    ];

    // Add all links to graph
    graph.addCells([...powerLinks, ...groundLinks, ...controlLinks, ...accessoryLinks]);

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
      const labels = link.labels();
      const labelText = labels && labels.length > 0 ? labels[0].attrs?.text?.text : 'Connection';

      if (!source.id || !target.id) return;

      const sourceEl = graph.getCell(source.id);
      const targetEl = graph.getCell(target.id);
      const sourceName = sourceEl?.attr('label/text') || 'Unknown';
      const targetName = targetEl?.attr('label/text') || 'Unknown';

      alert(
        `Connection: ${labelText}\n\n` +
        `From: ${sourceName} [${source.port}]\n` +
        `To: ${targetName} [${target.port}]\n\n` +
        `Click for wire gauge, color coding, and routing details.`
      );
    });

    // Cleanup function
    return () => {
      paper.remove();
    };
  }, [width, height]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div
        ref={paperContainer}
        className="border border-gray-300 rounded-lg shadow-lg mx-auto overflow-auto"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Interactive Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click on components to view all port definitions</li>
          <li>Click on connections to see source and destination ports</li>
          <li>Drag components to rearrange - connections automatically re-route!</li>
          <li><strong>Smart Routing:</strong> Manhattan algorithm avoids obstacles with 20px padding</li>
          <li>Port colors: Red = Power, Blue = Control signals, Orange = Motor</li>
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
          <h4 className="font-bold mb-1 text-sm">Smart Routing:</h4>
          <div className="text-xs space-y-1">
            <div>• JointJS v4 Manhattan algorithm for intelligent pathfinding</div>
            <div>• Automatically avoids all component obstacles</div>
            <div>• Real-time re-routing when components are dragged</div>
            <div>• 20px padding prevents wire-to-component overlap</div>
            <div>• Maximum 2000 routing loops for complex paths</div>
          </div>
        </div>
      </div>
    </div>
  );
}
