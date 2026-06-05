import fetch from 'node-fetch';

async function run() {
  const res = await fetch('https://figurinhas-copa2.lovable.app/panini-shope/combo-2000-figurinhas-revenda-atacado');
  const html = await res.text();
  const lines = html.split('\n');
  const priceLines = lines.filter(line => line.includes('R$') || line.toLowerCase().includes('price'));
  console.log(priceLines.join('\n'));
}

run();
