export type Review = {
  index: number;
  name: string;
  avatar: string;
  stars: number;
  text: string;
  images: string[];
};

export function getReviewDateString(index: number): string {
  const date = new Date();
  // Subtract days to spread reviews across the current week.
  // Review 0-1 get today, 2-3 get yesterday, 4-5 get 2 days ago, etc.
  const daysAgo = Math.floor(index / 2);
  date.setDate(date.getDate() - daysAgo);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  // Stable hours/minutes based on review index so they represent realistic times that look perfect
  const hh = String((10 + (index * 3)) % 12 + 8).padStart(2, '0'); // hours between 08:00 and 20:00
  const min = String((15 + (index * 7)) % 60).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export const REVIEWS: Review[] = [
  {
    "index": 0,
    "name": "Luana Alves",
    "avatar": "https://down-br.img.susercontent.com/file/br-11134233-7r98o-m37a72h9hovpae_tn",
    "stars": 5,
    "text": "Amei demais a calça, caimento maravilhoso e o tecido é super encorpado. Não fica transparente de jeito nenhum! Podem comprar sem medo.",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lztowhuhz6ed7a@resize_w72_nl.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lztowhuhz72t73.webp"
    ]
  },
  {
    "index": 1,
    "name": "Ariele Lemens",
    "avatar": "https://down-br.img.susercontent.com/file/br-11134233-81ztc-mjoiyp481wqpdf_tn",
    "stars": 5,
    "text": "Gente, que perfeição de calça! Modela o corpo super bem e a Cintura é bem alta, segura tudo. Com certeza comprarei de novo nessa loja. Chegou super rápido!",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lynt35t1qcnpcf.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lynt35t1qbz90e.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lynt35wxknc57f.webp"
    ]
  },
  {
    "index": 2,
    "name": "Larissa Souza",
    "avatar": "https://down-br.img.susercontent.com/file/ee82454f11a1f909f3eb7370d74dd1f7_tn",
    "stars": 5,
    "text": "A calça é super quentinha por dentro, perfeita para usar no frio. O material é excelente e a costura é muito bem feita. Recomendo muito!",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-ly47goko0uv430.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-ly47goko29fk85.webp"
    ]
  },
  {
    "index": 3,
    "name": "Fernanda Lima",
    "avatar": "https://down-br.img.susercontent.com/file/br-11134233-7r98o-ltfkx0vnpx4v28_tn",
    "stars": 5,
    "text": "Muito confortável e tecido super grosso. O modelo boca de sino flare fica super elegante. Fiquei muito satisfeita com a compra.",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-m169viyedff2d1.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-m169viyeetzic6.webp"
    ]
  },
  {
    "index": 4,
    "name": "Luana Abagio",
    "avatar": "https://down-br.img.susercontent.com/file/br-11134233-820m5-moiryegipds081_tn",
    "stars": 5,
    "text": "Uso tamanho G e serviu perfeitamente. O cós é maravilhoso e valoriza muito silhueta, e o envio foi imediato. Nota 10!",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lx2mb7nbiitb5b.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lx2mb7nbjxdrfc.webp"
    ]
  },
  {
    "index": 5,
    "name": "Pamela Limeira",
    "avatar": "https://down-br.img.susercontent.com/file/br-11134233-7r98o-m5ej5dsyc52qb7_tn",
    "stars": 5,
    "text": "Estou apaixonada! A modelagem boca de sino flare é um charme, super estilosa. Parabéns pelo ótimo atendimento.",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lz4yfyhgzdph25.webp"
    ]
  },
  {
    "index": 6,
    "name": "Luciana",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=LucianaS",
    "stars": 5,
    "text": "Excelente aquisição. Já lavei e continuou intacta, o tecido não pega bolinha e veste super bem. Voltarei a comprar com certeza.",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lyr8cmz85we9c0.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lyr8cmzi5hud0a.webp",
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-lyr8cmzi6wet7f.webp"
    ]
  },
  {
    "index": 7,
    "name": "Lais Alves",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Lais",
    "stars": 5,
    "text": "Maravilhosa! A calça veste super bem e é quentinha. Chegou muito antes do prazo esperado.",
    "images": [
      "https://down-br.img.susercontent.com/file/br-11134103-7r98o-m1rbz9x84ykod0.webp"
    ]
  },
  {
    "index": 8,
    "name": "Isabela N.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Isabela",
    "stars": 5,
    "text": "Estou utilizando a calça há dez dias e além de ser linda, até agora superou minhas expectativas. O tecido é ótimo, a espessura é muito boa, zero transparência no uso diário…estou gostando.",
    "images": []
  },
  {
    "index": 9,
    "name": "Camila S.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Camila",
    "stars": 5,
    "text": "A calça é maravilhosa. Veio em perfeito estado e muito bem embalada. Ainda não a preparei para sair. Assim que usar volto para dar um melhor feedback.",
    "images": []
  },
  {
    "index": 10,
    "name": "Fernanda M.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Fernanda",
    "stars": 5,
    "text": "Produto excelente, recomendo!",
    "images": []
  },
  {
    "index": 11,
    "name": "Juliana R.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Juliana",
    "stars": 5,
    "text": "Demorei muito pra achar a cor, diz que pode usar no dia a dia, porém acho que ela é para academia, não estragou no treino… eu não vou pra academia mas realmente o modelo é lindo, me serviu maravilhosamente!",
    "images": []
  },
  {
    "index": 12,
    "name": "Patrícia L.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Patricia",
    "stars": 5,
    "text": "Material muito bom, e são lindas também, amei!",
    "images": []
  },
  {
    "index": 13,
    "name": "Ana Clara D.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Ana",
    "stars": 5,
    "text": "São maravilhosas, bem grossas e bem bonitas. A cor então é show amei amei.",
    "images": []
  },
  {
    "index": 14,
    "name": "Beatriz C.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Beatriz",
    "stars": 5,
    "text": "Lindas, chic no último!!!! Maravilhosas!!!",
    "images": []
  },
  {
    "index": 15,
    "name": "Larissa T.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Larissa",
    "stars": 5,
    "text": "Elas são lindas, pesadas! ainda n usei mas tenho a frigideira delas e já amo! vale mt a pena.",
    "images": []
  },
  {
    "index": 16,
    "name": "Mariana F.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Mariana",
    "stars": 5,
    "text": "De boa qualidade.",
    "images": []
  },
  {
    "index": 17,
    "name": "Renata G.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Renata",
    "stars": 5,
    "text": "Adorei o produto, muito bonito!",
    "images": []
  },
  {
    "index": 18,
    "name": "Gabriela P.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Gabriela",
    "stars": 5,
    "text": "Produto chegou rápido e em perfeito estado!",
    "images": []
  },
  {
    "index": 19,
    "name": "Amanda K.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Amanda",
    "stars": 5,
    "text": "Super recomendo, qualidade excelente!",
    "images": []
  },
  {
    "index": 20,
    "name": "Carolina V.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Carolina",
    "stars": 5,
    "text": "Lindas, material super bom, fácil de limpar, porém a parte de fora, as laterais já estão manchados e não sai.",
    "images": []
  },
  {
    "index": 21,
    "name": "Daniela A.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Daniela",
    "stars": 5,
    "text": "Perfeita 😍",
    "images": []
  },
  {
    "index": 22,
    "name": "Luciana B.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Luciana",
    "stars": 5,
    "text": "A calça é muito boa, serve demais pra ir pra academia.",
    "images": []
  },
  {
    "index": 23,
    "name": "Sandra O.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Sandra",
    "stars": 5,
    "text": "Lindo amei, era meu sonho quando pagar vou comprar mais obrigada.",
    "images": []
  },
  {
    "index": 24,
    "name": "Viviane H.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Viviane",
    "stars": 5,
    "text": "Genteeeee, que perfeição, ela é grossa, não marca nada. Linda amei amei.",
    "images": []
  },
  {
    "index": 25,
    "name": "Thais J.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Thais",
    "stars": 5,
    "text": "Produto lindo e de qualidade!",
    "images": []
  },
  {
    "index": 26,
    "name": "Michele R.",
    "avatar": "https://api.dicebear.com/7.x/notionists/svg?seed=Michele",
    "stars": 5,
    "text": "Eu estou apaixonada pela minha calça legging. Veste muito bem, material resistente e tem ótimo caimento.",
    "images": []
  }
];

export const PRODUCT_IMAGES = [
  'https://i.ibb.co/k6v0H9TW/a-clean-brightly-lit-high-resolution-product-adv-1-batch-1.png',
  'https://i.ibb.co/wZ893qTx/bright-white-studio-product-photo-scene-overall-4-batch-4.png',
  'https://i.ibb.co/tPZcJmM0/studio-product-photo-on-white-background-showing-a-5-batch-5.png',
  'https://i.ibb.co/1fh00pvv/a-clean-white-studio-product-photo-commercial-imag-8-batch-8.png',
  'https://i.ibb.co/XZYk9BSS/studio-product-fashion-composite-on-white-backgrou-7-batch-7.png',
  'https://i.ibb.co/S49kk2z6/studio-product-fashion-photo-on-white-background-6-batch-6.png',
  'https://i.ibb.co/6Rsk4yQr/a-clean-bright-white-studio-product-advertising-i-3-batch-3.png',
  'https://i.ibb.co/Z6p5d1gR/a-clean-studio-product-photo-on-a-white-background-2-batch-2.png'
];

export const DESCR_IMAGES = [];

export const STORE_DATA = {
  name: "OxeanJeans",
  logo: "https://down-br.img.susercontent.com/file/br-11134216-7r98o-lyy2tgctp2tx6a@resize_w80_nl.webp",
  verified: true,
  rating: 4.9,
  sales: "70mil+",
  description: "Loja verificada com mais de 70 mil calças e leggings vendidas. Alta qualidade, envio em até 24 horas para todo o Brasil e atendimento rápido via chat."
};

export const INSTANT_CHAT_MESSAGES = [
  { id: '1', time: 'Hoje, 09:14', sender: 'them', text: 'Olá! Tudo bem? Sou da Garimpo Brasil 👋' },
  { id: '2', time: 'Hoje, 09:14', sender: 'them', text: 'Posso te ajudar com alguma dúvida sobre o produto?' },
  { id: '3', time: 'Hoje, 09:15', sender: 'me', text: 'Quanto tempo leva pra entregar?' },
  { id: '4', time: 'Hoje, 09:15', sender: 'them', text: 'Em média 5 a 12 dias úteis. Para Sudeste costuma ser mais rápido. Após o pagamento, você recebe o código de rastreio em até 24h. ✅' },
  { id: '5', time: 'Hoje, 09:15', sender: 'them', text: 'Estamos com promoção relâmpago hoje, garante o seu! 🔥' }
];

export const EXTRA_REVIEWS = [
  { name: 'Patricia M.', date: 'há 2 dias', text: 'Chegou em 6 dias, super bem embalado. A calça é super grossa, dá pra ver que a qualidade é boa. Zero transparência mesmo.' },
  { name: 'Roberto S.', date: 'há 4 dias', text: 'Comprei pra minha esposa, ela amou. O tecido é maravilhoso e veste super bem.' },
  { name: 'Camila O.', date: 'há 1 semana', text: 'Já estava na 2ª compra dessa calça, primeiro pra mim e agora pra minha irmã. Recomendo demais!' },
  { name: 'Fernanda L.', date: 'há 1 semana', text: 'Cheguei até a desconfiar do preço, mas é original mesmo. Funciona super bem no dia a dia da academia.' },
  { name: 'Juliana P.', date: 'há 2 semanas', text: 'Linda, quentinha, veste perfeitamente. Vale cada centavo.' },
  { name: 'Marcos T.', date: 'há 2 semanas', text: 'Entrega rápida, produto exatamente como na foto. Minha filha adorou.' },
  { name: 'Beatriz F.', date: 'há 3 semanas', text: 'Comprei na promoção e foi um achado. Modela super bem o corpo, não fica transparente de jeito nenhum.' }
];