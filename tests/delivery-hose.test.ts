import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { HOSE_RADIUS, hoseCurve, LAYOUT } from "@/components/three/scene/world";

// Same geometry as world.ts / journey.ts: tank r 1.45 from y 0.25 to 3.45, filler neck 0.9 m towards the road.
const TANK_R = 1.45;
const TANK_TOP = 3.45;
const tank = LAYOUT.customerTank;
const inlet = new THREE.Vector3(tank.x, TANK_TOP + 0.3 + 0.02, tank.z + 0.9);
const approach = [
  new THREE.Vector3(tank.x, TANK_TOP - 1.0, tank.z + TANK_R + 0.55),
  new THREE.Vector3(tank.x, TANK_TOP + 0.3 + 0.6, tank.z + TANK_R - 0.1),
];
// Discharge port of the parked tanker (journey.ts: parked at customerX - 3, lane z -1.6, port at local (-0.4, 0.95, -1.2)).
const from = new THREE.Vector3(LAYOUT.customerX - 3 - 0.4, 0.95, -1.6 - 1.2);

describe("delivery hose", () => {
  const points = hoseCurve(from, inlet, approach).getSpacedPoints(600);

  it("never passes through the customer tank", () => {
    for (const p of points) {
      const radial = Math.hypot(p.x - tank.x, p.z - tank.z);
      const insideBody = radial < TANK_R + HOSE_RADIUS && p.y < TANK_TOP + HOSE_RADIUS;
      expect(insideBody, `hose point ${p.toArray().map((v) => v.toFixed(2)).join(", ")} is inside the tank`).toBe(false);
    }
  });

  it("ends at the filler neck, coming down from above", () => {
    const end = points[points.length - 1]!;
    const before = points[points.length - 10]!;
    expect(end.distanceTo(inlet)).toBeLessThan(1e-6);
    expect(before.y).toBeGreaterThan(end.y);
  });
});
