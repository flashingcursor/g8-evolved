'use client';

import { useEffect, useRef } from 'react';
import { dia, shapes, linkTools } from '@joint/core';

interface WiringDiagramProps {
  title?: string;
  width?: number;
  height?: number;
}

export default function WiringDiagram({
  title = "Wiring Diagram",
  width = 800,
  height = 600
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
      defaultLink: () => new shapes.standard.Link({
        attrs: {
          line: {
            stroke: '#4b5563',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z'
            }
          }
        }
      }),
    });

    // Create custom component shapes for electrical components
    const createComponent = (
      x: number,
      y: number,
      label: string,
      color: string = '#3b82f6'
    ) => {
      return new shapes.standard.Rectangle({
        position: { x, y },
        size: { width: 120, height: 60 },
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
            fontSize: 14,
            fontWeight: 'bold'
          }
        }
      });
    };

    // Power System
    const battery = createComponent(50, 50, '36V Battery\n100Ah LiFePO₄', '#10b981');
    const fuse = createComponent(50, 150, '250A ANL\nFuse', '#dc2626');
    const sw180 = createComponent(50, 250, 'SW180\nMain Contactor', '#8b5cf6');

    // Curtis Controller
    const controller = createComponent(250, 150, 'Curtis 1204M\nController', '#f59e0b');

    // Motor & Reversing
    const sw202 = createComponent(450, 250, 'SW202\nReversing', '#6366f1');
    const motor = createComponent(450, 100, 'DC Series\nMotor', '#ef4444');

    // Control Circuit
    const keySwitch = createComponent(50, 400, 'Key Switch\n3-Position', '#06b6d4');
    const dirSwitch = createComponent(200, 400, 'Direction\nSwitch', '#06b6d4');
    const throttle = createComponent(350, 400, 'PB-6 Throttle\nPot Box', '#14b8a6');

    // Accessories
    const dcConverter = createComponent(600, 50, '36V→12V\nConverter', '#ec4899');
    const accessories = createComponent(600, 200, '12V Acc.\nLights/Horn', '#a855f7');

    // Add components to graph
    graph.addCells([
      battery, fuse, sw180, controller, sw202, motor,
      keySwitch, dirSwitch, throttle, dcConverter, accessories
    ]);

    // Create links with labels
    const createLink = (
      source: dia.Cell,
      target: dia.Cell,
      label: string,
      color: string = '#4b5563'
    ) => {
      return new shapes.standard.Link({
        source: { id: source.id },
        target: { id: target.id },
        attrs: {
          line: {
            stroke: color,
            strokeWidth: 3,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z',
              fill: color
            }
          }
        },
        labels: [{
          attrs: {
            text: {
              text: label,
              fill: '#374151',
              fontSize: 11,
              fontWeight: 'bold'
            },
            rect: {
              fill: 'white',
              stroke: color,
              strokeWidth: 1,
              rx: 3,
              ry: 3
            }
          }
        }]
      });
    };

    // Create connections - Power Path (thick red)
    const links = [
      createLink(battery, fuse, 'B+\n2AWG', '#dc2626'),
      createLink(fuse, sw180, '250A\nProtected', '#dc2626'),
      createLink(sw180, controller, 'B+\nWhen RUN', '#dc2626'),
      createLink(controller, motor, 'M-\nArmature', '#f59e0b'),
      createLink(motor, sw202, 'Field\nF1/F2', '#6366f1'),

      // Control Signals (blue)
      createLink(keySwitch, sw180, 'Coil\n36V', '#3b82f6'),
      createLink(dirSwitch, sw202, 'FWD/REV\nCoils', '#3b82f6'),
      createLink(throttle, controller, '0-5kΩ\nThrottle', '#14b8a6'),

      // Accessories (purple)
      createLink(battery, dcConverter, '36V In', '#8b5cf6'),
      createLink(dcConverter, accessories, '12V Out\n20-25A', '#a855f7'),
    ];

    graph.addCells(links);

    // Add interactivity - show connection details on hover
    paper.on('element:pointerclick', (elementView) => {
      const element = elementView.model;
      const label = element.attr('label/text');
      alert(`Component: ${label}\n\nClick to view detailed specifications and wiring instructions.`);
    });

    paper.on('link:pointerclick', (linkView) => {
      const link = linkView.model;
      const labels = link.labels();
      if (labels && labels.length > 0) {
        const labelText = labels[0].attrs?.text?.text;
        alert(`Connection: ${labelText}\n\nClick to view wire gauge, color coding, and connection details.`);
      }
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
        className="border border-gray-300 rounded-lg shadow-lg mx-auto"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Interactive Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click on components to view detailed specifications</li>
          <li>Click on connections to see wire details</li>
          <li>Drag components to rearrange the diagram</li>
          <li>Hover over connections to highlight them</li>
        </ul>
      </div>
    </div>
  );
}
