// Database for Simone Products and Customizations

const defaultProducts = [
  // --- LÍNEA DECORATIVA ---
  {
    id: "dec-1",
    category: "decorativa",
    name: {
      es: "Bouquet Floral Grande (12oz)",
      en: "Large Floral Bouquet (12oz)"
    },
    description: {
      es: "Vela artesanal en frasco de vidrio de 12oz con un detallado arreglo floral modelado a mano en cera de soja.",
      en: "Artisan candle in a 12oz glass jar featuring a detailed hand-modeled floral arrangement in soy wax."
    },
    price: 28.00,
    image: "images/bouquet_grande.png",
    options: {
      aromas: ["Lavanda & Manzanilla", "Vainilla & Coco", "Rosas & Jazmín", "Sin Aroma"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "dec-2",
    category: "decorativa",
    name: {
      es: "Bouquet Floral Mediano (8oz)",
      en: "Medium Floral Bouquet (8oz)"
    },
    description: {
      es: "Arreglo floral en cera de soja en frasco de vidrio de 8oz. Perfecto para regalar u ornamentar mesas de centro.",
      en: "Soy wax floral arrangement in an 8oz glass jar. Perfect for gifts or decorating coffee tables."
    },
    price: 20.00,
    image: "images/bouquet_mediano.png",
    options: {
      aromas: ["Lavanda & Manzanilla", "Vainilla & Coco", "Rosas & Jazmín", "Sin Aroma"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "dec-3",
    category: "decorativa",
    name: {
      es: "Escultura Venus Premium",
      en: "Venus Premium Sculpture"
    },
    description: {
      es: "Vela escultórica de la figura clásica de Venus, vertida a mano con cera de soja pura y acabado mate satinado.",
      en: "Sculptural candle of the classic Venus figure, hand-poured with pure soy wax and a satin matte finish."
    },
    price: 35.00,
    image: "images/escultura_venus.png",
    options: {
      aromas: ["Sin Aroma", "Vainilla Suave", "Almizcle Blanco"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "dec-4",
    category: "decorativa",
    name: {
      es: "Cubo de Burbujas Moderno",
      en: "Modern Bubble Cube"
    },
    description: {
      es: "Diseño contemporáneo de burbujas geométricas. Un elemento decorativo imprescindible para espacios modernos.",
      en: "Contemporary geometric bubble design. A must-have decorative element for modern spaces."
    },
    price: 15.00,
    image: "images/cubo_burbujas.png",
    options: {
      aromas: ["Sin Aroma", "Lavanda", "Canela & Manzana", "Vainilla & Coco"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "dec-mascota",
    category: "decorativa",
    name: {
      es: "Vela Mascota Personalizada (Foto)",
      en: "Custom Pet Candle (Photo)"
    },
    description: {
      es: "Modelado a mano en cera con la figura de tu perro o gato a partir de la foto que adjuntes en tu cotización.",
      en: "Hand-modeled wax figure of your dog or cat based on the photo you attach to your quote request."
    },
    price: 45.00,
    image: "images/vela_mascota.png",
    options: {
      aromas: ["Sin Aroma", "Vainilla & Coco", "Sándalo"],
      requiresMessage: false,
      requiresPhoto: true
    }
  },
  {
    id: "dec-deseo",
    category: "decorativa",
    name: {
      es: "Caja de Velas de los Deseos (x10 uds)",
      en: "Personalized Wish Candles Box (10 pcs)"
    },
    description: {
      es: "Caja x 10 velas de deseos personalizadas con nombres, deseos (Amor, Prosperidad, Abundancia) y más de 80 plantillas navideñas a elección.",
      en: "Box of 10 personalized Christmas wish taper candles with custom names, wishes, and over 80 holiday templates to choose from."
    },
    price: 25.00,
    image: "images/carousel_navidad.jpg",
    options: {
      aromas: ["Canela & Manzana", "Pino Navideño", "Vainilla & Coco", "Sin Aroma"],
      requiresMessage: true,
      requiresPhoto: false
    }
  },

  // --- LÍNEA AROMÁTICA ---
  {
    id: "aro-1",
    category: "aromatica",
    name: {
      es: "Wax Melts Lavanda & Salvia",
      en: "Lavender & Sage Wax Melts"
    },
    description: {
      es: "Pack de 6 pastillas de cera aromática de soja para derretir en quemador. Relajación y calma instantánea.",
      en: "Pack of 6 soy wax melts for burners. Instant relaxation and calmness."
    },
    price: 8.00,
    image: "images/melts_lavanda.png",
    options: {
      aromas: ["Lavanda & Salvia"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "aro-2",
    category: "aromatica",
    name: {
      es: "Wax Melts Canela & Manzana",
      en: "Cinnamon & Apple Wax Melts"
    },
    description: {
      es: "Aroma festivo, cálido y especiado. Pack de 6 unidades listas para derretir en quemador.",
      en: "Festive, warm and spiced aroma. Pack of 6 units ready to melt in burner."
    },
    price: 8.00,
    image: "images/melts_canela.png",
    options: {
      aromas: ["Canela & Manzana"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "aro-3",
    category: "aromatica",
    name: {
      es: "Wax Melts Vainilla & Coco",
      en: "Vanilla & Coconut Wax Melts"
    },
    description: {
      es: "Pack de 6 pastillas con un aroma dulce, cremoso y exótico que abraza el hogar.",
      en: "Pack of 6 melts with a sweet, creamy and exotic scent that embraces the home."
    },
    price: 8.00,
    image: "images/melts_vainilla.png",
    options: {
      aromas: ["Vainilla & Coco"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },

  // --- AROMA AMBIENTAL ---
  {
    id: "amb-1",
    category: "ambiental",
    name: {
      es: "Sachet Aromático de Rosas",
      en: "Rose Botanical Sachet"
    },
    description: {
      es: "Pastilla de cera de soja decorada con pétalos de rosa secos, ideal para aromatizar armarios y cajones.",
      en: "Soy wax tablet decorated with dried rose petals, ideal for scenting wardrobes and drawers."
    },
    price: 10.00,
    image: "images/sachet_rosas.png",
    options: {
      aromas: ["Rosas & Jazmín"],
      requiresMessage: false,
      requiresPhoto: false
    }
  },
  {
    id: "amb-2",
    category: "ambiental",
    name: {
      es: "Sachet Aromático de Cítricos",
      en: "Citrus Botanical Sachet"
    },
    description: {
      es: "Sachet de cera decorado con rodajas de naranja deshidratadas y canela. Aporta energía y frescura sin fuego.",
      en: "Wax sachet decorated with dehydrated orange slices and cinnamon. Gives energy and freshness without fire."
    },
    price: 10.00,
    image: "images/sachet_citricos.png",
    options: {
      aromas: ["Naranja & Canela"],
      requiresMessage: false,
      requiresPhoto: false
    }
  }
];

let products = defaultProducts;
try {
  if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
    const storedProducts = window.localStorage.getItem('simone_products');
    if (storedProducts) {
      products = JSON.parse(storedProducts);
    } else {
      window.localStorage.setItem('simone_products', JSON.stringify(defaultProducts));
    }
  }
} catch (e) {
  console.error("Error loading products from localStorage:", e);
}

// Packaging options for events and records
const packagingOptions = [
  {
    id: "pkg-transparent",
    name: {
      es: "Caja de Acetato Transparente + Lazo",
      en: "Transparent Acetate Box + Ribbon"
    },
    pricePerUnit: 1.50,
    image: "images/pkg_transparente.png"
  },
  {
    id: "pkg-tul",
    name: {
      es: "Bolsa de Tul Delicado",
      en: "Delicate Tulle Bag"
    },
    pricePerUnit: 0.80,
    image: "images/pkg_tul.png"
  },
  {
    id: "pkg-yute",
    name: {
      es: "Bolsa de Yute Rústica",
      en: "Rustic Jute Bag"
    },
    pricePerUnit: 1.20,
    image: "images/pkg_yute.png"
  },
  {
    id: "pkg-saten",
    name: {
      es: "Lazo de Satén + Etiqueta Personalizada",
      en: "Satin Ribbon + Custom Tag"
    },
    pricePerUnit: 0.50,
    image: "images/pkg_saten.png"
  }
];

// Event types available for records section
const eventTypes = [
  { id: "baby-shower", name: { es: "Baby Shower & Revelación de Género", en: "Baby Shower & Gender Reveal" }, basePrice: 4.50 },
  { id: "comunion-bautizo", name: { es: "Primera Comunión y Bautizos", en: "First Communion & Baptisms" }, basePrice: 4.50 },
  { id: "matrimonio", name: { es: "Matrimonios / Bodas", en: "Weddings" }, basePrice: 5.00 },
  { id: "corporativo", name: { es: "Eventos Corporativos", en: "Corporate Events" }, basePrice: 5.50 },
  { id: "personalizada-total", name: { es: "Velas 100% Personalizadas (Diseño Libre)", en: "100% Custom Candles (Free Design)" }, basePrice: 6.00 }
];

// Scent options for events
const eventAromas = [
  { id: "lavanda", name: { es: "Lavanda & Manzanilla (Relajante)", en: "Lavender & Chamomile" } },
  { id: "vainilla", name: { es: "Vainilla & Coco (Dulce)", en: "Vanilla & Coconut" } },
  { id: "canela-manzana", name: { es: "Canela & Manzana (Especiado)", en: "Cinnamon & Apple" } },
  { id: "eucalipto", name: { es: "Eucalipto & Menta (Fresco)", en: "Eucalyptus & Mint" } },
  { id: "sin-aroma", name: { es: "Sin Aroma (Hipoalergénico)", en: "Fragrance-Free" } }
];

// Volume discount scales
// 20-50 units: 10% discount
// 51-100 units: 20% discount
// +100 units: 30% discount
const getVolumeDiscount = (quantity) => {
  if (quantity >= 100) return 0.30;
  if (quantity >= 51) return 0.20;
  if (quantity >= 20) return 0.10;
  return 0.00;
};

// Default Store Settings (Banners, Promo Modal, Notifications)
const defaultSettings = {
  promoPopup: {
    enabled: true,
    image: "images/promo_navidad.jpg",
    badge: {
      es: "Edición Especial de Navidad 🎄",
      en: "Christmas Special Edition 🎄"
    },
    title: {
      es: "Magia y Luz en <span>esta Navidad</span>",
      en: "Magic & Light <span>this Christmas</span>"
    },
    description: {
      es: "Regala calidez artesanal a tus seres queridos con nuestra colección navideña de velas de soja, pino y canela.",
      en: "Gift handcrafted warmth to your loved ones with our Christmas collection of soy, pine, and cinnamon candles."
    },
    couponCode: "NAVIDAD10",
    couponDesc: {
      es: "10% de descuento en toda nuestra colección navideña, velas y recordatorios.",
      en: "10% off our entire Christmas collection, candles, and favors."
    },
    ctaText: {
      es: "Ver Colección Navideña",
      en: "Explore Christmas Collection"
    }
  },
  banners: [
    {
      id: "slide-1",
      image: "images/hero.png",
      subtitle: { es: "Hecho a mano con cera de soja pura 🌿", en: "Handcrafted with love 🌿" },
      title: { es: "Luz que decora, <span>aromas que abrazan.</span>", en: "Light that decorates, <span>scents that embrace.</span>" },
      description: {
        es: "Velas de soja artesanales moldeadas a mano, aromatizadas con aceites botánicos para transformar tus rincones cotidianos.",
        en: "Handcrafted soy wax candles, fragranced with botanical oils to transform your daily corners."
      },
      ctaText: { es: "Explorar Catálogo", en: "Explore Catalog" },
      ctaLink: "#catalogo"
    },
    {
      id: "slide-navidad",
      image: "images/carousel_navidad.jpg",
      subtitle: { es: "Más de 80 plantillas · Caja x 10 unidades 🕯️✨", en: "Over 80 templates · Box of 10 units 🕯️✨" },
      title: { es: "Velas de los Deseos <span>Personalizadas</span>", en: "Personalized <span>Wish Candles</span>" },
      description: {
        es: "¡Haz realidad tus deseos! Personalizamos tus velas con nombres, buenos deseos y motivos navideños para iluminar tu Noche de Velitas y Navidad.",
        en: "Make your wishes come true! We personalize your candles with family names, wishes, and holiday motifs to light up your Christmas."
      },
      ctaText: { es: "Personalizar mis Velas", en: "Customize My Candles" },
      ctaLink: "#catalogo"
    },
    {
      id: "slide-2",
      image: "images/carousel_events.jpg",
      subtitle: { es: "Detalles únicos e inolvidables ✨", en: "Unique & memorable details ✨" },
      title: { es: "Recordatorios para <span>Fechas Especiales</span>", en: "Favors for <span>Special Occasions</span>" },
      description: {
        es: "Diseña a tu medida la etiqueta, el empaque y la fragancia para tus invitados de bodas, bautizos y eventos corporativos.",
        en: "Customize the tag, packaging, and scent for your wedding, baptism, or corporate event guests."
      },
      ctaText: { es: "Cotizar Recordatorios", en: "Get Favors Quote" },
      ctaLink: "#eventos"
    },
    {
      id: "slide-3",
      image: "images/carousel_pets.jpg",
      subtitle: { es: "Tu mejor amigo modelado en cera 🐾", en: "Your best friend molded in wax 🐾" },
      title: { es: "Velas de Mascota <span>Personalizadas</span>", en: "Customized <span>Pet Candles</span>" },
      description: {
        es: "Modelamos a mano la figura de tu perro o gato a partir de tu fotografía favorita. Un detalle entrañable y exclusivo.",
        en: "We mold by hand your dog or cat figure from your favorite photo. A warm and exclusive detail."
      },
      ctaText: { es: "Personalizar Vela", en: "Customize Candle" },
      ctaLink: "#catalogo"
    },
    {
      id: "slide-4",
      image: "images/carousel_aromas.jpg",
      subtitle: { es: "Aromas que abrazan el hogar 🕯️", en: "Scents that embrace the home 🕯️" },
      title: { es: "Aromaterapia & <span>Wax Melts</span>", en: "Aromatherapy & <span>Wax Melts</span>" },
      description: {
        es: "Quemadores de cerámica y pastillas de cera perfumadas para inundar de fragancias y calma tus espacios favoritos.",
        en: "Ceramic burners and scented wax melts to fill your favorite spaces with fragrance and calm."
      },
      ctaText: { es: "Explorar Aromas", en: "Explore Scents" },
      ctaLink: "#catalogo"
    },
    {
      id: "slide-5",
      image: "images/carousel_sachets.jpg",
      subtitle: { es: "Fragancia botánica sin fuego 🌸", en: "Flame-free botanical fragrance 🌸" },
      title: { es: "Sachets Aromáticos <span>para Espacios</span>", en: "Botanical <span>Wax Sachets</span>" },
      description: {
        es: "Tabletas de cera decoradas con flores y frutas deshidratadas, ideales para perfumar armarios, cajones y vehículos.",
        en: "Wax tablets decorated with dried flowers and fruits, ideal for scenting closets, drawers, and cars."
      },
      ctaText: { es: "Ver Línea Ambiental", en: "See Air Scents" },
      ctaLink: "#catalogo"
    }
  ],
  notifications: {
    whatsappPrimary: "573112547250",
    whatsappPrimaryName: "Andrea Ruiz",
    whatsappSecondary: "573203702808",
    whatsappSecondaryName: "Leonor Herrera",
    email: "contacto@simonevelas.com",
    address: "Calle 6a No 88d 60, Bogotá, Colombia"
  }
};

// Export to make it available for modules or global access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { defaultProducts, products, defaultSettings, packagingOptions, eventTypes, eventAromas, getVolumeDiscount };
} else {
  window.productsDatabase = { defaultProducts, products, defaultSettings, packagingOptions, eventTypes, eventAromas, getVolumeDiscount };
}
