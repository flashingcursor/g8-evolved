import { AvoidLib } from 'libavoid-js';
import { g, util, mvc, dia } from '@joint/core';

const defaultPin = 1;

export class AvoidRouter {
    graph: dia.Graph;
    avoidRouter: any;
    connDirections: Record<string, any>;
    shapeRefs: Record<string, any>;
    edgeRefs: Record<string, any>;
    pinIds: Record<string, number>;
    linksByPointer: Record<string, dia.Link>;
    avoidConnectorCallback: (connRefPtr: any) => void;
    id: number;
    commitTransactions: boolean;
    margin!: number;
    portOverflow!: number;
    graphListener?: any;

    static async load() {
        // Note: load() accepts a filepath to the libavoid.wasm file.
        // The WASM file must be served from the public directory
        await AvoidLib.load('/libavoid.wasm');
    }

    constructor(graph: dia.Graph, options: any = {}) {
        const Avoid = AvoidLib.getInstance();

        this.graph = graph;

        this.connDirections = {
            top: Avoid.ConnDirUp,
            right: Avoid.ConnDirRight,
            bottom: Avoid.ConnDirDown,
            left: Avoid.ConnDirLeft,
            all: Avoid.ConnDirAll,
        };

        this.shapeRefs = {};
        this.edgeRefs = {};
        this.pinIds = {};
        this.linksByPointer = {};

        this.avoidConnectorCallback = this.onAvoidConnectorChange.bind(this);

        this.id = 100000;

        this.commitTransactions = options.commitTransactions ?? true;

        this.createAvoidRouter(options);
    }

    createAvoidRouter(options: any = {}) {
        const {
            shapeBufferDistance = 0,
            portOverflow = 0,
            idealNudgingDistance = 10,
        } = options;

        this.margin = shapeBufferDistance;
        this.portOverflow = portOverflow;

        const Avoid = AvoidLib.getInstance();

        const router = new Avoid.Router(Avoid.OrthogonalRouting);

        router.setRoutingParameter(
            Avoid.idealNudgingDistance,
            idealNudgingDistance
        );

        router.setRoutingParameter(
            Avoid.shapeBufferDistance,
            shapeBufferDistance
        );

        router.setRoutingOption(
            Avoid.nudgeOrthogonalTouchingColinearSegments,
            false
        );

        router.setRoutingOption(
            Avoid.performUnifyingNudgingPreprocessingStep,
            true
        );

        router.setRoutingOption(Avoid.nudgeSharedPathsWithCommonEndPoint, true);

        router.setRoutingOption(
            Avoid.nudgeOrthogonalSegmentsConnectedToShapes,
            true
        );

        this.avoidRouter = router;
    }

    getAvoidRectFromElement(element: dia.Element) {
        const Avoid = AvoidLib.getInstance();
        const { x, y, width, height } = element.getBBox();
        return new Avoid.Rectangle(
            new Avoid.Point(x, y),
            new Avoid.Point(x + width, y + height)
        );
    }

    getVerticesFromAvoidRoute(route: any) {
        const vertices = [];
        for (let i = 1; i < route.size() - 1; i++) {
            const { x, y } = route.get_ps(i);
            vertices.push({ x, y });
        }
        return vertices;
    }

    updateShape(element: dia.Element) {
        const Avoid = AvoidLib.getInstance();
        const { shapeRefs, avoidRouter } = this;
        const elementId = String(element.id);
        const shapeRect = this.getAvoidRectFromElement(element);
        if (shapeRefs[elementId]) {
            const shapeRef = shapeRefs[elementId];
            avoidRouter.moveShape(shapeRef, shapeRect);
            return;
        }

        const shapeRef = new Avoid.ShapeRef(avoidRouter, shapeRect);

        shapeRefs[elementId] = shapeRef;

        const centerPin = new Avoid.ShapeConnectionPin(
            shapeRef,
            defaultPin,
            0.5,
            0.5,
            true,
            0,
            Avoid.ConnDirAll
        );
        centerPin.setExclusive(false);

        // Add pins to each port of the element.
        element.getPortGroupNames().forEach((group) => {
            const portsPositions = element.getPortsPositions(group);
            const { width, height } = element.size();
            const rect = new g.Rect(0, 0, width, height);
            Object.keys(portsPositions).forEach((portId) => {
                const { x, y } = portsPositions[portId];
                const side = rect.sideNearestToPoint({ x, y });
                const pin = new Avoid.ShapeConnectionPin(
                    shapeRef,
                    this.getConnectionPinId(elementId, portId),
                    x / width,
                    y / height,
                    true,
                    0,
                    this.connDirections[side]
                );
                pin.setExclusive(false);
            });
        });
    }

    getConnectionPinId(elementId: string, portId: string) {
        const pinKey = `${elementId}:${portId}`;
        if (pinKey in this.pinIds) return this.pinIds[pinKey];
        const pinId = this.id++;
        this.pinIds[pinKey] = pinId;
        return pinId;
    }

    updateConnector(link: dia.Link) {
        const Avoid = AvoidLib.getInstance();
        const { shapeRefs, edgeRefs } = this;

        const source = link.source();
        const target = link.target();

        const sourceId = String((source as any).id || '');
        const targetId = String((target as any).id || '');
        const sourcePortId = (source as any).port || null;
        const targetPortId = (target as any).port || null;

        if (!sourceId || !targetId) {
            this.deleteConnector(link);
            return null;
        }

        let connRef;

        const sourceConnEnd = new Avoid.ConnEnd(
            shapeRefs[sourceId],
            sourcePortId ? this.getConnectionPinId(sourceId, sourcePortId) : defaultPin
        );
        const targetConnEnd = new Avoid.ConnEnd(
            shapeRefs[targetId],
            targetPortId ? this.getConnectionPinId(targetId, targetPortId) : defaultPin
        );

        if (edgeRefs[link.id]) {
            connRef = edgeRefs[link.id];
        } else {
            connRef = new Avoid.ConnRef(this.avoidRouter);
            this.linksByPointer[(connRef as any).g] = link;
        }

        connRef.setSourceEndpoint(sourceConnEnd);
        connRef.setDestEndpoint(targetConnEnd);

        if (edgeRefs[link.id]) {
            return connRef;
        }

        edgeRefs[link.id] = connRef;

        connRef.setCallback(this.avoidConnectorCallback, connRef);

        return connRef;
    }

    deleteConnector(link: dia.Link) {
        const connRef = this.edgeRefs[link.id];
        if (!connRef) return;
        this.avoidRouter.deleteConnector(connRef);
        delete this.linksByPointer[(connRef as any).g];
        delete this.edgeRefs[link.id];
    }

    deleteShape(element: dia.Element) {
        const elementId = String(element.id);
        const shapeRef = this.shapeRefs[elementId];
        if (!shapeRef) return;
        this.avoidRouter.deleteShape(shapeRef);
        delete this.shapeRefs[elementId];
    }

    getLinkAnchorDelta(element: dia.Element, portId: string | null, point: g.Point) {
        let anchorPosition;
        const bbox = element.getBBox();
        if (portId) {
            const port = element.getPort(portId);
            if (port && port.group) {
                const portPosition = element.getPortsPositions(port.group)[portId];
                anchorPosition = element.position().offset(portPosition);
            } else {
                anchorPosition = bbox.center();
            }
        } else {
            anchorPosition = bbox.center();
        }
        return point.difference(anchorPosition);
    }

    routeLink(link: dia.Link) {
        const connRef = this.edgeRefs[link.id];
        if (!connRef) return;

        const route = connRef.displayRoute();
        const sourcePoint = new g.Point(route.get_ps(0));
        const targetPoint = new g.Point(route.get_ps(route.size() - 1));

        const source = link.source();
        const target = link.target();

        const sourceId = (source as any).id;
        const targetId = (target as any).id;
        const sourcePortId = (source as any).port || null;
        const targetPortId = (target as any).port || null;

        const sourceElement = link.getSourceElement();
        const targetElement = link.getTargetElement();

        if (!sourceElement || !targetElement) return;

        const sourceAnchorDelta = this.getLinkAnchorDelta(
            sourceElement,
            sourcePortId,
            sourcePoint
        );
        const targetAnchorDelta = this.getLinkAnchorDelta(
            targetElement,
            targetPortId,
            targetPoint
        );

        const linkAttributes: any = {
            source: {
                id: sourceId,
                port: sourcePortId || null,
                anchor: {
                    name: 'modelCenter',
                },
            },
            target: {
                id: targetId,
                port: targetPortId || null,
                anchor: {
                    name: 'modelCenter',
                },
            },
        };

        if (
            this.isRouteValid(
                route,
                sourceElement,
                targetElement,
                sourcePortId,
                targetPortId
            )
        ) {
            linkAttributes.source.anchor.args = {
                dx: sourceAnchorDelta.x,
                dy: sourceAnchorDelta.y,
            };
            linkAttributes.target.anchor.args = {
                dx: targetAnchorDelta.x,
                dy: targetAnchorDelta.y,
            };
            linkAttributes.vertices = this.getVerticesFromAvoidRoute(route);
            linkAttributes.router = null;
        } else {
            linkAttributes.vertices = [];
            linkAttributes.router = {
                name: 'rightAngle',
                args: {
                    margin: this.margin - this.portOverflow,
                },
            };
        }

        link.set(linkAttributes, { avoidRouter: true });
    }

    routeAll() {
        const { graph, avoidRouter } = this;
        graph.getElements().forEach((element) => this.updateShape(element));
        graph.getLinks().forEach((link) => this.updateConnector(link));
        avoidRouter.processTransaction();
    }

    resetLink(link: dia.Link) {
        const newAttributes = util.cloneDeep(link.attributes);
        newAttributes.vertices = [];
        newAttributes.router = null;
        delete newAttributes.source.anchor;
        delete newAttributes.target.anchor;
        link.set(newAttributes, { avoidRouter: true });
    }

    addGraphListeners() {
        this.removeGraphListeners();

        const listener = new mvc.Listener();
        listener.listenTo(this.graph, {
            remove: (cell: dia.Cell) => this.onCellRemoved(cell),
            add: (cell: dia.Cell) => this.onCellAdded(cell),
            change: (cell: dia.Cell, opt: any) => this.onCellChanged(cell, opt),
            reset: (_: any, opt: any) => this.onGraphReset(opt.previousModels),
        });

        this.graphListener = listener;
    }

    removeGraphListeners() {
        this.graphListener?.stopListening();
        delete this.graphListener;
    }

    onCellRemoved(cell: dia.Cell) {
        if (cell.isElement()) {
            this.deleteShape(cell as dia.Element);
        } else {
            this.deleteConnector(cell as dia.Link);
        }
        this.avoidRouter.processTransaction();
    }

    onCellAdded(cell: dia.Cell) {
        if (cell.isElement()) {
            this.updateShape(cell as dia.Element);
        } else {
            this.updateConnector(cell as dia.Link);
        }
        this.avoidRouter.processTransaction();
    }

    onCellChanged(cell: dia.Cell, opt: any) {
        if (opt.avoidRouter) return;
        let needsRerouting = false;
        if ('source' in cell.changed || 'target' in cell.changed) {
            if (!cell.isLink()) return;
            if (!this.updateConnector(cell as dia.Link)) {
                this.resetLink(cell as dia.Link);
            }
            needsRerouting = true;
        }
        if ('position' in cell.changed || 'size' in cell.changed) {
            if (!cell.isElement()) return;
            this.updateShape(cell as dia.Element);
            needsRerouting = true;
        }
        if (this.commitTransactions && needsRerouting) {
            this.avoidRouter.processTransaction();
        }
    }

    onGraphReset(previousModels: dia.Cell[]) {
        previousModels.forEach((cell) => {
            if (cell.isElement()) {
                this.deleteShape(cell as dia.Element);
            } else {
                this.deleteConnector(cell as dia.Link);
            }
        });

        this.routeAll();
    }

    onAvoidConnectorChange(connRefPtr: any) {
        const link = this.linksByPointer[connRefPtr];
        if (!link) return;
        this.routeLink(link);
    }

    isRouteValid(
        route: any,
        sourceElement: dia.Element,
        targetElement: dia.Element,
        sourcePortId: string | null,
        targetPortId: string | null
    ) {
        const size = route.size();
        if (size > 2) {
            return true;
        }

        const sourcePs = route.get_ps(0);
        const targetPs = route.get_ps(size - 1);
        if (sourcePs.x !== targetPs.x && sourcePs.y !== targetPs.y) {
            return false;
        }

        const margin = this.margin;

        if (
            sourcePortId &&
            targetElement.getBBox().inflate(margin).containsPoint(sourcePs)
        ) {
            return false;
        }

        if (
            targetPortId &&
            sourceElement.getBBox().inflate(margin).containsPoint(targetPs)
        ) {
            return false;
        }

        return true;
    }
}
