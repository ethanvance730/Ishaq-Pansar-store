import { Product, Category, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'pure-herbs',
    name: 'Pure Herbs & Roots',
    urduName: 'خالص جڑی بوٹیاں',
    slug: 'pure-herbs',
    description: 'Raw, dried, organic medicinal roots, leaves, and whole herbs sourced directly from northern Pakistan and natural reserves.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    itemCount: 4
  },
  {
    id: 'essential-oils',
    name: 'Cold-Pressed Oils (Roghan)',
    urduName: 'خالص روغنیات و تیل',
    slug: 'essential-oils',
    description: '100% natural, unrefined wooden-pressed (Kohlu) and cold-pressed essential oils for hair, skin, and wellness.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    itemCount: 4
  },
  {
    id: 'herbal-powders',
    name: 'Organic Powders & Safoof',
    urduName: 'نامیاتی سفوف جات',
    slug: 'herbal-powders',
    description: 'Freshly pulverized herbs, fine safoof, and triple-sifted botanicals for herbal concoctions and masks.',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  },
  {
    id: 'natural-honey',
    name: 'Wild Forest Honey & Salajeet',
    urduName: 'جنگلی شہد اور سلاجیت',
    slug: 'natural-honey',
    description: 'Pure Skardu Himalayan Shilajit and raw Sidr (Beri) wild forest honey tested for uncompromised natural purity.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  },
  {
    id: 'seeds-nuts',
    name: 'Herbal Seeds & Gond',
    urduName: 'تخم و گوند جات',
    slug: 'seeds-nuts',
    description: 'Premium Gond Katira, Tukhm-e-Balanga, Chia seeds, and therapeutic botanical gums.',
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
    itemCount: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'himalayan-salajeet-shilajit',
    name: 'Pure Himalayan Salajeet (Gold Grade)',
    urduName: 'خالص ہمالیائی سلاجیت (گولڈ گریڈ)',
    slug: 'himalayan-salajeet-shilajit',
    category: 'natural-honey',
    description: 'Sourced from the pristine altitudes of Skardu (over 16,000 ft in the Karakoram range), our Pure Shilajit is sun-dried and traditionally purified via the centuries-old Shodhan water method. Rich in 84+ ionic minerals, natural fulvic acid, and humic acid to boost vitality, testosterone, mental clarity, and cellular energy.',
    shortDescription: '100% natural, lab-tested purified resin from Skardu Karakoram mountains.',
    benefits: [
      'Boosts physical energy, stamina, and mitochondrial vitality',
      'Contains 70%+ Fulvic Acid for optimal cellular nutrient absorption',
      'Supports joint health, anti-inflammatory balance, and longevity',
      'Traditionally revered Rasayana for immunity and vitality'
    ],
    usageInstructions: 'Dissolve a pea-sized amount (300mg-500mg) in warm milk, green tea, or warm water once daily in the morning.',
    ingredients: ['100% Purified Himalayan Shilajit (Salajeet) Resin'],
    price: 1850,
    salePrice: 1550,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    sku: 'ISP-SLJ-001',
    featured: true,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'slj-15g',
        name: '15 Grams Jar',
        type: 'weight',
        price: 1850,
        salePrice: 1550,
        sku: 'ISP-SLJ-15G',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'slj-30g',
        name: '30 Grams Jar',
        type: 'weight',
        price: 3400,
        salePrice: 2850,
        sku: 'ISP-SLJ-30G',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'slj-50g',
        name: '50 Grams Family Pack',
        type: 'weight',
        price: 5200,
        salePrice: 4400,
        sku: 'ISP-SLJ-50G',
        stock: 5,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'organic-kalonji-oil',
    name: 'Pure Cold-Pressed Kalonji Oil (Black Seed)',
    urduName: 'خالص کلونجی کا تیل (کولڈ پریسڈ)',
    slug: 'organic-kalonji-oil',
    category: 'essential-oils',
    description: 'Extracted using traditional slow wooden press cold-extraction methods from select Nigella Sativa seeds. No solvents, chemical bleaching, or artificial preservatives. Contains naturally concentrated Thymoquinone (TQ) for respiratory relief, joint nourishment, and immune fortification.',
    shortDescription: 'Virgin cold-pressed Nigella Sativa oil packed with high Thymoquinone.',
    benefits: [
      'Natural immune booster and cardiovascular support',
      'Soothes respiratory inflammation and seasonal allergies',
      'Deeply conditions scalp, prevents dandruff, and combats hair fall',
      'Promotes digestive wellness and gut comfort'
    ],
    usageInstructions: 'Take half teaspoon with warm water or raw honey in the morning. For hair, gently massage warmed oil into scalp 2 hours before washing.',
    ingredients: ['100% Virgin Cold-Pressed Nigella Sativa (Kalonji) Seed Oil'],
    price: 850,
    salePrice: 720,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    sku: 'ISP-KLN-002',
    featured: true,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'kln-120ml',
        name: '120 ml Glass Bottle',
        type: 'packaging',
        price: 850,
        salePrice: 720,
        sku: 'ISP-KLN-120ML',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'kln-250ml',
        name: '250 ml Glass Bottle',
        type: 'packaging',
        price: 1550,
        salePrice: 1300,
        sku: 'ISP-KLN-250ML',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'sidr-beri-honey',
    name: 'Wild Sidr (Beri) Honey - Potohar Range',
    urduName: 'خالص چھوٹی مکھی بیر کا شہد',
    slug: 'sidr-beri-honey',
    category: 'natural-honey',
    description: 'Raw, unpasteurized monofloral honey harvested by tribal beekeepers from wild Jujube (Beri/Sidr) trees flowering in the Potohar and Karak mountains. Characterized by an amber hue, buttery rich undertone, and potent antibacterial qualities.',
    shortDescription: '100% Raw, unfiltered floral honey harvested from wild Sidr (Jujube) blossom.',
    benefits: [
      'Natural antibacterial, antimicrobial, and wound-healing compound',
      'Instant non-glycemic energy without sugar crashes',
      'Relieves persistent dry cough, sore throat, and sinus congestion',
      'Aids digestion and liver revitalization'
    ],
    usageInstructions: 'Take 1 to 2 tablespoons daily on an empty stomach or blend into warm herbal infusions.',
    ingredients: ['100% Unprocessed Wild Beri (Sidr) Honey'],
    price: 1950,
    salePrice: 1750,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    sku: 'ISP-SDR-003',
    featured: true,
    bestSeller: false,
    inStock: true,
    variations: [
      {
        id: 'sdr-500g',
        name: '500 Grams Glass Jar',
        type: 'weight',
        price: 1950,
        salePrice: 1750,
        sku: 'ISP-SDR-500G',
        stock: 18
      },
      {
        id: 'sdr-1kg',
        name: '1 Kilogram Glass Jar',
        type: 'weight',
        price: 3600,
        salePrice: 3200,
        sku: 'ISP-SDR-1KG',
        stock: 12
      }
    ]
  },
  {
    id: 'ashwagandha-asgandh-nagori',
    name: 'Asgandh Nagori (Organic Ashwagandha Powder)',
    urduName: 'اصلی اسگندھ ناگوری سفوف',
    slug: 'ashwagandha-asgandh-nagori',
    category: 'herbal-powders',
    description: 'Authentic Indian ginseng root (Withania Somnifera) cultivated organically and shade-dried before stone grinding. Recognized globally as the foremost adaptogenic herb to reduce cortisol, combat anxiety, boost physical strength, and foster restorative sleep.',
    shortDescription: 'Stone-ground adaptogenic root powder for stress relief and vigor.',
    benefits: [
      'Promotes calm mindset by balancing cortisol stress hormones',
      'Improves sleep latency and deep REM cycles',
      'Supports lean muscle synthesis, endurance, and stamina',
      'Enhances cognitive focus and memory retention'
    ],
    usageInstructions: 'Mix 1 level teaspoon (3-5 grams) in warm milk with a pinch of nutmeg and raw honey before bedtime.',
    ingredients: ['100% Pure Shade-Dried Ashwagandha (Withania Somnifera) Root'],
    price: 650,
    salePrice: 550,
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    sku: 'ISP-ASH-004',
    featured: true,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'ash-150g',
        name: '150 Grams Kraft Pouch',
        type: 'weight',
        price: 650,
        salePrice: 550,
        sku: 'ISP-ASH-150G',
        stock: 30
      },
      {
        id: 'ash-300g',
        name: '300 Grams Kraft Pouch',
        type: 'weight',
        price: 1150,
        salePrice: 950,
        sku: 'ISP-ASH-300G',
        stock: 20
      }
    ]
  },
  {
    id: 'gond-katira-tragacanth',
    name: 'Premium Gond Katira (Tragacanth Gum)',
    urduName: 'گوند کتیرا اعلیٰ کوالٹی',
    slug: 'gond-katira-tragacanth',
    category: 'seeds-nuts',
    description: 'Crystal-clear, all-natural cooling resin sourced from wild Astragalus gummifer bushes. Swells tremendously in cold water to form a refreshing cooling jelly. Renowned in traditional Unani medicine for internal cooling, heat relief, and gastrointestinal hydration.',
    shortDescription: 'Natural herbal cooling crystals for summer drinks and digestive soothing.',
    benefits: [
      'Outstanding natural internal body coolant during hot Pakistani summers',
      'Soothes heartburn, gastritis, and acidic digestion',
      'High natural soluble dietary fiber',
      'Strengthens joints and alleviates fatigue'
    ],
    usageInstructions: 'Soak 1 teaspoon in a glass of drinking water overnight. Next morning, blend with milk, almond drink, or Rooh Afza/Sharbat.',
    ingredients: ['100% Pure Tragacanth Gum (Gond Katira) Crystals'],
    price: 550,
    salePrice: 480,
    images: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 75,
    sku: 'ISP-GND-005',
    featured: false,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'gnd-200g',
        name: '200 Grams Resealable Kraft Bag',
        type: 'weight',
        price: 550,
        salePrice: 480,
        sku: 'ISP-GND-200G',
        stock: 45
      },
      {
        id: 'gnd-500g',
        name: '500 Grams Resealable Kraft Bag',
        type: 'weight',
        price: 1200,
        salePrice: 1050,
        sku: 'ISP-GND-500G',
        stock: 30
      }
    ]
  },
  {
    id: 'moringa-oleifera-powder',
    name: 'Sohanjna (Organic Moringa Oleifera Powder)',
    urduName: 'سوہانجنا (مورنگا) نامیاتی پاؤڈر',
    slug: 'moringa-oleifera-powder',
    category: 'herbal-powders',
    description: 'Known as the miracle tree of Multan and southern Punjab, our Moringa leaves are hand-picked, washed in demineralized water, and shade-dried to protect delicate chlorophyll, amino acids, and high Vitamin C content.',
    shortDescription: 'Green superfood powder loaded with 46 antioxidants and 9 essential amino acids.',
    benefits: [
      'High in plant iron, calcium, Vitamin A, and Vitamin C',
      'Aids healthy blood sugar balance and metabolic rate',
      'Boosts milk supply for nursing mothers',
      'Protects skin radiance and neutralizes oxidative stress'
    ],
    usageInstructions: 'Take 1 teaspoon stirred into smoothies, fresh juice, or warm water daily with meals.',
    ingredients: ['100% Shade-Dried Moringa Oleifera Leaf Powder'],
    price: 490,
    salePrice: 420,
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    sku: 'ISP-MOR-006',
    featured: false,
    bestSeller: false,
    inStock: true,
    variations: [
      {
        id: 'mor-150g',
        name: '150 Grams Kraft Pouch',
        type: 'weight',
        price: 490,
        salePrice: 420,
        sku: 'ISP-MOR-150G',
        stock: 25
      },
      {
        id: 'mor-300g',
        name: '300 Grams Kraft Pouch',
        type: 'weight',
        price: 890,
        salePrice: 750,
        sku: 'ISP-MOR-300G',
        stock: 15
      }
    ]
  },
  {
    id: 'wooden-pressed-almond-oil',
    name: 'Roghan-e-Badam Shireen (Sweet Almond Oil)',
    urduName: 'روغن بادام شیریں (خالص بادام کا تیل)',
    slug: 'wooden-pressed-almond-oil',
    category: 'essential-oils',
    description: 'Cold-pressed exclusively from premium sweet Mamra and Kagzi Pakistani almonds. Unrefined, cosmetic and edible grade. Gentle and hypoallergenic, perfect for baby massages, brain nourishment, dry skin rejuvenation, and eye circle recovery.',
    shortDescription: 'Edible-grade cold-pressed sweet almond oil for brain, skin & hair.',
    benefits: [
      'Enhances memory, cognitive reflexes, and nervous system health',
      'Deep cellular nourishment for dry skin and dark under-eye circles',
      'Natural lubricant for mild chronic constipation relief',
      'Safe and softening massage oil for infants and delicate skin'
    ],
    usageInstructions: 'Consume 1 teaspoon mixed in warm milk at night, or massage 4-5 drops onto cleansed skin or hair roots.',
    ingredients: ['100% Cold-Pressed Sweet Almond (Prunus Dulcis) Kernels'],
    price: 950,
    salePrice: 850,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    sku: 'ISP-BDM-007',
    featured: true,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'bdm-60ml',
        name: '60 ml Amber Dropper Bottle',
        type: 'packaging',
        price: 550,
        salePrice: 490,
        sku: 'ISP-BDM-60ML',
        stock: 20
      },
      {
        id: 'bdm-120ml',
        name: '120 ml Amber Dropper Bottle',
        type: 'packaging',
        price: 950,
        salePrice: 850,
        sku: 'ISP-BDM-120ML',
        stock: 15
      }
    ]
  },
  {
    id: 'ispaghol-musallam-husk',
    name: 'Chilka Ispaghol (Premium Psyllium Husk)',
    urduName: 'چھلکا اسپغول مصفیٰ (قدرتی فائبر)',
    slug: 'ispaghol-musallam-husk',
    category: 'seeds-nuts',
    description: 'Triple-sifted, unbleached, high-density Plantago ovata husks. Free from grit, stones, and dust. Creates natural bulk in the digestive system to relieve constipation, reduce bad LDL cholesterol, and assist healthy weight management.',
    shortDescription: 'Pure triple-cleaned natural psyllium husk fiber for optimal digestive wellness.',
    benefits: [
      'Regulates bowel movements without cramping or laxative dependency',
      'Helps maintain healthy gut microbiome flora',
      'Supports healthy heart by assisting healthy cholesterol clearance',
      'Keeps you feeling full longer for effective appetite control'
    ],
    usageInstructions: 'Stir 1 tablespoon quickly into a full glass of water, yogurt, or juice and drink immediately, followed by another glass of water.',
    ingredients: ['100% Pure Triple-Cleaned Psyllium Husk (Chilka Ispaghol)'],
    price: 480,
    salePrice: 390,
    images: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 80,
    sku: 'ISP-ISP-008',
    featured: false,
    bestSeller: true,
    inStock: true,
    variations: [
      {
        id: 'isp-100g',
        name: '100 Grams Pack',
        type: 'weight',
        price: 480,
        salePrice: 390,
        sku: 'ISP-ISP-100G',
        stock: 50
      },
      {
        id: 'isp-250g',
        name: '250 Grams Pack',
        type: 'weight',
        price: 1050,
        salePrice: 890,
        sku: 'ISP-ISP-250G',
        stock: 30
      }
    ]
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Ishaq Pansar Store',
  tagline: 'Authentic Traditional Pakistani Herbs & Pure Natural Remedies',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  email: 'support@ishaqpansar.pk',
  address: 'Shop # 14-18, Pansari Market, Bano Bazaar, Lahore, Pakistan',
  city: 'Lahore',
  standardShippingRate: 200,
  freeShippingThreshold: 2500,
  announcementText: '🌿 Free Nationwide Cash on Delivery on Orders Above Rs. 2,500! 100% Pure & Lab Tested Herbs.',
  isCodEnabled: true
};

export const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Abbottabad',
  'Sahiwal',
  'Rahim Yar Khan',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Dera Ghazi Khan',
  'Muzaffarabad',
  'Mirpur (AJK)',
  'Skardu',
  'Gilgit',
  'Wah Cantt',
  'Jhelum',
  'Chiniot',
  'Sheikhupura'
];
