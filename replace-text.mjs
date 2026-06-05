import fs from 'fs';

const filePath = './src/components/Checkout.tsx';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/Ditalia Oficial/g, 'Panini Shopee');
content = content.replace(/calca-legging/g, 'combo-2000-fig');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed pix');
