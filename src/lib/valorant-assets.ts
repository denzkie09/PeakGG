// Images are served from /public/agents and /public/maps
// Download them once by running: node scripts/download-assets.mjs

export function agentPortrait(name: string): string {
  return `/agents/${name.toLowerCase().replace(/\//g, "").replace(/\s/g, "")}.png`;
}

export function agentFullPortrait(name: string): string {
  return `/agents/${name.toLowerCase().replace(/\//g, "").replace(/\s/g, "")}.png`;
}

export function mapListView(name: string): string {
  return `/maps/${name.toLowerCase().replace(/\s/g, "")}.png`;
}

export function mapSplash(name: string): string {
  return `/maps/${name.toLowerCase().replace(/\s/g, "")}.png`;
}

export function rankIcon(_rankName: string): string {
  return "";
}