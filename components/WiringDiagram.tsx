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

    // Battery Pack
    const battery = createComponent(50, 50, '48V Battery\nPack', '#10b981');

    // BMS (Battery Management System)
    const bms = createComponent(50, 200, 'BMS', '#8b5cf6');

    // Main Controller
    const controller = createComponent(250, 150, 'Motor\nController', '#f59e0b');

    // Motor
    const motor = createComponent(450, 150, 'DC Motor', '#ef4444');

    // Throttle
    const throttle = createComponent(250, 300, 'Throttle\nInput', '#06b6d4');

    // Dashboard
    const dashboard = createComponent(450, 50, 'Digital\nDashboard', '#ec4899');

    // Charger Port
    const charger = createComponent(50, 350, 'Charging\nPort', '#14b8a6');

    // Add components to graph
    graph.addCells([battery, bms, controller, motor, throttle, dashboard, charger]);

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
              fontSize: 12,
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

    // Create connections
    const links = [
      createLink(battery, bms, '+ / -', '#dc2626'),
      createLink(bms, controller, 'Power\n48V', '#dc2626'),
      createLink(controller, motor, 'Motor\nDrive', '#f59e0b'),
      createLink(throttle, controller, 'Control\nSignal', '#3b82f6'),
      createLink(bms, dashboard, 'Telemetry', '#8b5cf6'),
      createLink(charger, bms, 'Charging', '#14b8a6'),
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
