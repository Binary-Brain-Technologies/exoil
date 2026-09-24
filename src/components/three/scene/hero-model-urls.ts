import manifest from "./hero-models.json";

/**
 * URLs of the generated hero models, in two download groups. Kept free of Three.js so the page shell can preload the
 * vehicle while the 3D chunk is still on its way.
 */
export const VEHICLE_MODEL_URLS = [manifest["exoil-tractor"], manifest["exoil-trailer"]] as const;
export const SITE_MODEL_URLS = [manifest["fuel-gantry"], manifest["storage-tank"], manifest["customer-tank"], manifest["customer-hall"]] as const;
