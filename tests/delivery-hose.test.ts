import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { MODEL_TANKER } from "@/components/three/scene/tanker-model";
import { customerTankDims, HOSE_RADIUS, hoseCurve, LAYOUT } from "@/components/three/scene/world";

// Same geometry as world.ts / journey.ts: filler neck 0.9 m from the tank axis towards the road, 0.3 m tall.
const tank = LAYOUT.customerTank;
const PARKED_X = LAYOUT.customerX - 3;
const LANE_Z = -1.6;

// Procedural tanker's discharge port (tanker.ts) and the generated tanker's (tanker-model.ts), each with its tank.
const variants = [
  { name: "procedural scene", model: false, port: new THREE.Vector3(-0.4, 0.95, -1.2) },
  { name: "generated models", model: true, port: new THREE.Vector3(...MODEL_TANKER.dischargePort) },
];

describe.each(variants)("delivery hose ($name)", ({ model, port }) => {
  const { height, base, radius } = customerTankDims(model);
  const top = height + base;
  const inlet = new THREE.Vector3(tank.x, top + 0.3 + 0.02, tank.z + 0.9);
  const approach = [
    new THREE.Vector3(tank.x, top - 1.0, tank.z + radius + 0.55),
    new THREE.Vector3(tank.x, top + 0.3 + 0.6, tank.z + radius - 0.1),
  ];
  const from = port.clone().add(new THREE.Vector3(PARKED_X, 0, LANE_Z));
  const points = hoseCurve(from, inlet, approach).getSpacedPoints(600);

  it("never passes through the customer tank", () => {
    for (const p of points) {
      const radial = Math.hypot(p.x - tank.x, p.z - tank.z);
      const insideBody = radial < radius + HOSE_RADIUS && p.y < top + HOSE_RADIUS;
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
