export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  old?: number;
  image: string;
  badge: string;
  size: string;
  description: string;
  ingredients: string;
};
export const products: Product[] = [
  {
    id: "serum-eclat",
    name: "Sérum Éclat Botanique",
    category: "Visage",
    price: 29,
    old: 36,
    image: "serum",
    badge: "BEST-SELLER",
    size: "30 ml",
    description:
      "Un geste lumineux pour votre rituel du matin. Ce sérum à la texture légère s’intègre simplement à votre routine, avant votre crème.",
    ingredients: "Formule illustrative : eau, glycérine, extrait botanique, vitamine C.",
  },
  {
    id: "creme-douceur",
    name: "Crème Douceur Absolue",
    category: "Visage",
    price: 32,
    old: 40,
    image: "cream",
    badge: "-20 %",
    size: "50 ml",
    description:
      "Une texture onctueuse, un parfum délicat et un instant pour soi. Notre crème enveloppe la peau et complète le rituel quotidien.",
    ingredients: "Formule illustrative : eau, beurre de karité, glycérine, huile d’amande.",
  },
  {
    id: "huile-lumiere",
    name: "Huile Lumière Précieuse",
    category: "Corps",
    price: 26,
    old: 32,
    image: "amber",
    badge: "COUP DE CŒUR",
    size: "100 ml",
    description:
      "Quelques gouttes suffisent pour transformer votre soin du corps en un moment de douceur. À masser délicatement sur la peau.",
    ingredients: "Formule illustrative : huile de jojoba, huile d’amande, tocophérol.",
  },
  {
    id: "rituel-equilibre",
    name: "Le Rituel Équilibre",
    category: "Coffrets",
    price: 59,
    old: 74,
    image: "green",
    badge: "LE DUO PARFAIT",
    size: "2 soins",
    description:
      "Deux essentiels réunis dans un rituel simple : un nettoyant doux et une crème. Une jolie attention à offrir ou à s’offrir.",
    ingredients: "Coffret illustratif contenant un nettoyant et une crème.",
  },
  {
    id: "baume-velours",
    name: "Baume Velours",
    category: "Corps",
    price: 24,
    image: "balm",
    badge: "NOUVEAU",
    size: "50 ml",
    description:
      "Un baume riche pour les instants où la peau réclame un peu de douceur. Une texture fondante à réchauffer entre les mains.",
    ingredients: "Formule illustrative : beurre de karité, huile de coco, cire végétale.",
  },
  {
    id: "nettoyant-doux",
    name: "Nettoyant Doux Purifiant",
    category: "Visage",
    price: 19,
    image: "cleanser",
    badge: "ESSENTIEL",
    size: "150 ml",
    description:
      "Le premier geste d’un rituel tout en douceur. À appliquer sur peau humide puis à rincer, matin ou soir.",
    ingredients: "Formule illustrative : eau, glycérine, agents lavants doux.",
  },
  {
    id: "huile-cheveux",
    name: "Huile de Soin Sublime",
    category: "Cheveux",
    price: 28,
    image: "oil",
    badge: "NOUVEAU",
    size: "50 ml",
    description:
      "Une huile à appliquer sur les longueurs pour accompagner votre rituel capillaire. Un petit geste, un grand moment pour soi.",
    ingredients: "Formule illustrative : huiles végétales d’argan et de jojoba.",
  },
  {
    id: "coffret-essentiels",
    name: "Les Essentiels Botanica",
    category: "Coffrets",
    price: 69,
    old: 85,
    image: "collection",
    badge: "ÉDITION BOTANIQUE",
    size: "3 soins",
    description:
      "Une sélection de trois soins pour imaginer votre routine complète. Notre univers botanique réuni dans un coffret.",
    ingredients: "Coffret illustratif : sérum, crème et baume.",
  },
];
export const categories = ["Tous les soins", "Visage", "Corps", "Cheveux", "Coffrets"];
export const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
export const articles = [
  {
    id: "rituel-matin",
    image: "ritual",
    tag: "RITUELS",
    title: "Les 3 gestes d’un matin tout en douceur",
    text: "Une routine de soin n’a pas besoin d’être compliquée pour devenir un moment précieux. Le matin, commencez par un nettoyage doux adapté à votre peau. Appliquez ensuite votre sérum, puis votre crème. Complétez avec une protection solaire adaptée lorsque vous vous exposez. Prenez le temps de masser votre visage du bout des doigts, sans frotter. L’essentiel est de choisir des produits que votre peau tolère et de garder une routine régulière. En cas de doute ou de réaction, demandez conseil à un professionnel de santé.",
  },
  {
    id: "ingredients",
    image: "green",
    tag: "INGRÉDIENTS",
    title: "La nature au cœur de votre routine",
    text: "Les huiles végétales, les extraits de plantes et les textures inspirées de la nature offrent une multitude de possibilités pour votre routine. Mais naturel ne signifie pas forcément adapté à toutes les peaux. Consultez toujours la liste des ingrédients et effectuez un test sur une petite zone avant une première utilisation. Privilégiez une routine simple, avec des produits choisis selon vos besoins, plutôt que de multiplier les étapes.",
  },
  {
    id: "moment-pour-soi",
    image: "spa",
    tag: "BIEN-ÊTRE",
    title: "Et si vous preniez un moment pour vous ?",
    text: "Couper les notifications, ralentir et s’accorder quelques minutes de calme : un rituel de beauté peut aussi être une pause dans la journée. Préparez un espace agréable, respirez et prenez le temps d’appliquer vos soins. Il ne s’agit pas d’une obligation supplémentaire, mais d’un moment choisi. Un massage délicat des mains, une douche tiède ou simplement une tasse de thé peuvent suffire à créer votre propre rituel.",
  },
];
