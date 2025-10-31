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
  width = 1000,
  height = 700
}: WiringDiagramProps) {
  const paperContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const routerRef = useRef<AvoidRouter | null>(null);

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

      // Define port groups with consistent styling (libavoid-style)
      const PORT_RADIUS = 8;
      const portAttrs = {
        circle: {
          cursor: 'crosshair',
          fill: '#4D64DD',
          stroke: '#F4F7F6',
          magnet: 'active',
          r: PORT_RADIUS,
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
              args: { y: -15 }
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
              args: { y: 15 }
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
              args: { x: 15 }
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
              args: { x: -15 }
            },
            markup: portLabelMarkup
          }
        },
      };

      // Helper function to create component with ports (libavoid-style)
      const createComponentWithPorts = (
        x: number,
        y: number,
        width: number,
        height: number,
        label: string,
        ports: any[]
      ) => {
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
              fill: 'rgba(70,101,229,0.15)',
              stroke: '#4665E5',
              strokeWidth: 1,
              rx: 2,
              ry: 2,
            },
            label: {
              text: label,
              fill: '#1e40af',
              fontSize: 11,
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
        [
          { id: 'b_plus', group: 'right', attrs: { portLabel: { text: 'B+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'b_minus', group: 'right', attrs: { portLabel: { text: 'B-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 2. 250A ANL Fuse
      const fuse = createComponentWithPorts(
        50, 180, 140, 60,
        '250A ANL Fuse',
        [
          { id: 'fuse_in', group: 'top', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'fuse_out', group: 'bottom', attrs: { portLabel: { text: 'OUT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 3. SW180 Main Contactor
      const sw180 = createComponentWithPorts(
        50, 290, 140, 80,
        'SW180\nMain Contactor',
        [
          { id: 'sw180_b_in', group: 'top', attrs: { portLabel: { text: 'B+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_b_out', group: 'right', attrs: { portLabel: { text: 'B+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_coil_pos', group: 'left', attrs: { portLabel: { text: '86', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw180_coil_neg', group: 'left', attrs: { portLabel: { text: '85', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 4. Curtis 1204M Controller
      const controller = createComponentWithPorts(
        280, 180, 160, 100,
        'Curtis 1204M\nController',
        [
          { id: 'ctrl_b_plus', group: 'left', attrs: { portLabel: { text: 'B+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_b_minus', group: 'left', attrs: { portLabel: { text: 'B-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_m_minus', group: 'right', attrs: { portLabel: { text: 'M-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_ksi', group: 'bottom', attrs: { portLabel: { text: 'KSI', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_high', group: 'bottom', attrs: { portLabel: { text: '5V', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_wiper', group: 'bottom', attrs: { portLabel: { text: 'POT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_pot_low', group: 'bottom', attrs: { portLabel: { text: 'GND', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'ctrl_enable', group: 'bottom', attrs: { portLabel: { text: 'EN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 5. DC Series Motor
      const motor = createComponentWithPorts(
        520, 80, 140, 100,
        'DC Series Motor',
        [
          { id: 'motor_a1', group: 'left', attrs: { portLabel: { text: 'A1', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_a2', group: 'bottom', attrs: { portLabel: { text: 'A2', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_f1', group: 'bottom', attrs: { portLabel: { text: 'F1', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'motor_f2', group: 'bottom', attrs: { portLabel: { text: 'F2', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 6. SW202 Reversing Contactor
      const sw202 = createComponentWithPorts(
        520, 240, 140, 100,
        'SW202\nReversing',
        [
          { id: 'sw202_a2', group: 'top', attrs: { portLabel: { text: 'A2', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_f1', group: 'top', attrs: { portLabel: { text: 'F1', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_f2', group: 'top', attrs: { portLabel: { text: 'F2', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_fwd_coil', group: 'left', attrs: { portLabel: { text: 'FWD', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_rev_coil', group: 'left', attrs: { portLabel: { text: 'REV', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'sw202_common', group: 'left', attrs: { portLabel: { text: 'COM', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 7. Key Switch (3-position)
      const keySwitch = createComponentWithPorts(
        50, 450, 120, 80,
        'Key Switch\n3-Position',
        [
          { id: 'key_batt', group: 'left', attrs: { portLabel: { text: 'BAT', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'key_acc', group: 'right', attrs: { portLabel: { text: 'ACC', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'key_run', group: 'top', attrs: { portLabel: { text: 'RUN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 8. Direction Switch
      const dirSwitch = createComponentWithPorts(
        230, 450, 120, 80,
        'Direction\nSwitch',
        [
          { id: 'dir_in', group: 'left', attrs: { portLabel: { text: 'IN', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dir_fwd', group: 'top', attrs: { portLabel: { text: 'FWD', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dir_rev', group: 'right', attrs: { portLabel: { text: 'REV', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 9. PB-6 Throttle Pot Box
      const throttle = createComponentWithPorts(
        410, 450, 120, 80,
        'PB-6 Throttle\nPot Box',
        [
          { id: 'throttle_5v', group: 'top', attrs: { portLabel: { text: '5V', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_wiper', group: 'top', attrs: { portLabel: { text: 'W', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_gnd', group: 'top', attrs: { portLabel: { text: 'G', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'throttle_sw', group: 'right', attrs: { portLabel: { text: 'SW', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 10. DC-DC Converter
      const dcConverter = createComponentWithPorts(
        750, 80, 140, 80,
        '36V→12V\nConverter',
        [
          { id: 'dc_36v_pos', group: 'left', attrs: { portLabel: { text: '36+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_36v_neg', group: 'left', attrs: { portLabel: { text: '36-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_12v_pos', group: 'bottom', attrs: { portLabel: { text: '12+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'dc_12v_neg', group: 'bottom', attrs: { portLabel: { text: '12-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // 11. 12V Accessories
      const accessories = createComponentWithPorts(
        750, 220, 140, 60,
        '12V Accessories\nLights/Horn',
        [
          { id: 'acc_12v_pos', group: 'top', attrs: { portLabel: { text: '+', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } },
          { id: 'acc_12v_neg', group: 'top', attrs: { portLabel: { text: '-', fontSize: 10, fill: '#1f2937', fontWeight: 'bold' } } }
        ]
      );

      // Add all components to graph
      console.log('Adding components to graph...');
      graph.addCells([
        battery, fuse, sw180, controller, motor, sw202,
        keySwitch, dirSwitch, throttle, dcConverter, accessories
      ]);
      console.log('Components added successfully');

      // Create port-to-port connections (libavoid-style)
      const createPortLink = (
        sourceElement: dia.Element,
        sourcePort: string,
        targetElement: dia.Element,
        targetPort: string
      ) => {
        return new shapes.standard.Link({
          z: 1,
          source: { id: sourceElement.id, port: sourcePort },
          target: { id: targetElement.id, port: targetPort },
          attrs: {
            line: {
              stroke: '#464454',
              strokeWidth: 1,
              targetMarker: { d: 'M 5 2.5 0 0 5 -2.5 Z' },
            }
          }
        });
      };

      // Create all connections
      const allLinks = [
        // Main Power Path
        createPortLink(battery, 'b_plus', fuse, 'fuse_in'),
        createPortLink(fuse, 'fuse_out', sw180, 'sw180_b_in'),
        createPortLink(sw180, 'sw180_b_out', controller, 'ctrl_b_plus'),
        createPortLink(controller, 'ctrl_m_minus', motor, 'motor_a1'),
        createPortLink(motor, 'motor_a2', sw202, 'sw202_a2'),
        createPortLink(sw202, 'sw202_f1', motor, 'motor_f1'),
        createPortLink(sw202, 'sw202_f2', motor, 'motor_f2'),
        // Ground/Negative Returns
        createPortLink(battery, 'b_minus', controller, 'ctrl_b_minus'),
        // Control Signals
        createPortLink(keySwitch, 'key_run', sw180, 'sw180_coil_pos'),
        createPortLink(keySwitch, 'key_run', controller, 'ctrl_ksi'),
        createPortLink(dirSwitch, 'dir_fwd', sw202, 'sw202_fwd_coil'),
        createPortLink(dirSwitch, 'dir_rev', sw202, 'sw202_rev_coil'),
        createPortLink(controller, 'ctrl_pot_high', throttle, 'throttle_5v'),
        createPortLink(throttle, 'throttle_wiper', controller, 'ctrl_pot_wiper'),
        createPortLink(controller, 'ctrl_pot_low', throttle, 'throttle_gnd'),
        createPortLink(throttle, 'throttle_sw', controller, 'ctrl_enable'),
        // 12V Accessory Circuit
        createPortLink(battery, 'b_plus', dcConverter, 'dc_36v_pos'),
        createPortLink(battery, 'b_minus', dcConverter, 'dc_36v_neg'),
        createPortLink(dcConverter, 'dc_12v_pos', accessories, 'acc_12v_pos'),
        createPortLink(dcConverter, 'dc_12v_neg', accessories, 'acc_12v_neg'),
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

        alert(
          `Connection Details\n\n` +
          `From: ${sourceName} [${source.port}]\n` +
          `To: ${targetName} [${target.port}]\n\n` +
          `Wire routing uses libavoid orthogonal algorithm:\n` +
          `• Automatic obstacle avoidance\n` +
          `• 20px buffer distance from components\n` +
          `• Real-time rerouting when dragging components`
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
      <h2 className="text-2xl font-bold">{title}</h2>
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
      <div style={{ position: 'relative', width: `${width}px`, height: `${height}px`, margin: '0 auto' }}>
        {isLoading && (
          <div className="flex items-center justify-center border border-gray-300 rounded-lg shadow-lg absolute inset-0 bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading routing engine...</p>
              <p className="text-xs text-gray-500 mt-2">Initializing diagram...</p>
            </div>
          </div>
        )}
        <div
          ref={paperContainer}
          className="border border-gray-300 rounded-lg shadow-lg overflow-auto"
          style={{ width: `${width}px`, height: `${height}px` }}
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
