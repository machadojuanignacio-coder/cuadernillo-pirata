export interface PirateLetterItem {
  letter: string;
  word: string;
  emoji: string;
  description: string;
  strokeHint: string;
  category: 'barco' | 'tesoro' | 'aventura' | 'criatura' | 'navegacion';
}

export const DEFAULT_PIRATE_ALPHABET: PirateLetterItem[] = [
  {
    letter: 'A',
    word: 'ANCLA',
    emoji: '⚓',
    description: 'El ancla de hierro sujeta el barco pirata en la bahía secreta.',
    strokeHint: 'Sube en diagonal, baja y traza el puente central.',
    category: 'navegacion'
  },
  {
    letter: 'B',
    word: 'BARCO',
    emoji: '⛵',
    description: 'El barco de tres mástiles navega surcando las olas del gran océano.',
    strokeHint: 'Línea vertical recta hacia abajo y dos barriguitas a la derecha.',
    category: 'barco'
  },
  {
    letter: 'C',
    word: 'COFRE',
    emoji: '💰',
    description: 'El cofre de madera reforzada guarda doblones de oro y collares.',
    strokeHint: 'Una gran curva abierta hacia la derecha, como una luna.',
    category: 'tesoro'
  },
  {
    letter: 'D',
    word: 'DIAMANTE',
    emoji: '💎',
    description: 'Un diamante brillante que destella con la luz del sol caribeño.',
    strokeHint: 'Línea recta vertical y una sola barriga grande y redonda.',
    category: 'tesoro'
  },
  {
    letter: 'E',
    word: 'ESPADA',
    emoji: '🗡️',
    description: 'La espada de acero reluciente para defender el navío.',
    strokeHint: 'Línea vertical con tres brazos horizontales hacia la derecha.',
    category: 'aventura'
  },
  {
    letter: 'F',
    word: 'FARO',
    emoji: '🗼',
    description: 'La luz giratoria del faro guía a los marineros en las noches de tormenta.',
    strokeHint: 'Línea vertical recta con dos brazos horizontales superiores.',
    category: 'navegacion'
  },
  {
    letter: 'G',
    word: 'GARFIO',
    emoji: '🪝',
    description: 'El garfio reluciente del valiente capitán pirata.',
    strokeHint: 'Gran curva como la C y una pequeña entrada hacia la izquierda.',
    category: 'aventura'
  },
  {
    letter: 'H',
    word: 'HAMACA',
    emoji: '🛏️',
    description: 'Una cómoda hamaca colgada entre palmeras para descansar.',
    strokeHint: 'Dos columnas verticales unidas por un puente central.',
    category: 'aventura'
  },
  {
    letter: 'I',
    word: 'ISLA',
    emoji: '🏝️',
    description: 'La misteriosa isla del tesoro marcada con una gran X en el mapa.',
    strokeHint: 'Una línea vertical recta y elegante.',
    category: 'navegacion'
  },
  {
    letter: 'J',
    word: 'JOYA',
    emoji: '💍',
    description: 'Una joya encantada rescatada de las profundidades marinas.',
    strokeHint: 'Baja recto y haz una curva como un anzuelo a la izquierda.',
    category: 'tesoro'
  },
  {
    letter: 'K',
    word: 'KRAKEN',
    emoji: '🦑',
    description: 'El gigantesco kraken de tentáculos que custodia las aguas profundas.',
    strokeHint: 'Línea vertical recta y dos diagonales que tocan el centro.',
    category: 'criatura'
  },
  {
    letter: 'L',
    word: 'LORO',
    emoji: '🦜',
    description: 'El simpático loro de plumas de colores que canta ¡Tierra a la vista!',
    strokeHint: 'Línea vertical hacia abajo y una base horizontal corta.',
    category: 'criatura'
  },
  {
    letter: 'M',
    word: 'MAPA',
    emoji: '🗺️',
    description: 'El mapa de pergamino antiguo con la ruta al tesoro perdido.',
    strokeHint: 'Sube, baja al centro, vuelve a subir y baja al suelo.',
    category: 'navegacion'
  },
  {
    letter: 'N',
    word: 'NAVÍO',
    emoji: '🚢',
    description: 'Un majestuoso navío pirata con velas desplegadas al viento.',
    strokeHint: 'Línea vertical, diagonal hacia la esquina y otra vertical arriba.',
    category: 'barco'
  },
  {
    letter: 'Ñ',
    word: 'ÑAME',
    emoji: '🍠',
    description: 'El sabroso ñame que comen los piratas para tener mucha fuerza.',
    strokeHint: 'Traza la N y corona con una simpática ondeleta arriba.',
    category: 'aventura'
  },
  {
    letter: 'O',
    word: 'ORO',
    emoji: '🪙',
    description: 'Monedas y doblones de oro que relucen dentro del cofre.',
    strokeHint: 'Un círculo completo y cerrado, redondo como una moneda.',
    category: 'tesoro'
  },
  {
    letter: 'P',
    word: 'PIRATA',
    emoji: '🏴‍☠️',
    description: 'El audaz pirata con sombrero, parche y espíritu de aventura.',
    strokeHint: 'Línea vertical y una barriguita redonda en la parte superior.',
    category: 'aventura'
  },
  {
    letter: 'Q',
    word: 'QUILLA',
    emoji: '⛵',
    description: 'La fuerte quilla de madera que forma la espina dorsal del barco.',
    strokeHint: 'Dibuja una O redonda y una pequeña colita diagonal abajo.',
    category: 'barco'
  },
  {
    letter: 'R',
    word: 'REMO',
    emoji: '🚣',
    description: 'El remo de roble para cruzar la laguna en bote de remos.',
    strokeHint: 'Línea vertical, barriguita superior y una pierna diagonal de apoyo.',
    category: 'navegacion'
  },
  {
    letter: 'S',
    word: 'SIRENA',
    emoji: '🧜‍♀️',
    description: 'La mística sirena del arrecife que canta melodías del mar.',
    strokeHint: 'Curva a la izquierda, gira al centro y curva a la derecha.',
    category: 'criatura'
  },
  {
    letter: 'T',
    word: 'TESORO',
    emoji: '👑',
    description: 'El tesoro legendario de coronas doradas, gemas y rubíes.',
    strokeHint: 'Techo horizontal arriba y una columna vertical en el centro.',
    category: 'tesoro'
  },
  {
    letter: 'U',
    word: 'UBICA',
    emoji: '📍',
    description: 'Ubica el punto exacto donde cavar bajo la gran palmera.',
    strokeHint: 'Baja, curva redondeada en el fondo y sube de nuevo.',
    category: 'navegacion'
  },
  {
    letter: 'V',
    word: 'VELA',
    emoji: '⛵',
    description: 'La gran vela blanca que se infla con los vientos alisios.',
    strokeHint: 'Diagonal hacia abajo y diagonal que sube hacia la derecha.',
    category: 'barco'
  },
  {
    letter: 'W',
    word: 'WIND',
    emoji: '🏄',
    description: 'El viento favorable que impulsa a toda vela la expedición pirata.',
    strokeHint: 'Baja en diagonal, sube, vuelve a bajar y sube de nuevo.',
    category: 'navegacion'
  },
  {
    letter: 'X',
    word: 'XILO',
    emoji: '🎼',
    description: 'El xilófono pirata para celebrar las canciones de marineros.',
    strokeHint: 'Dos líneas diagonales que se cruzan justo en el centro.',
    category: 'aventura'
  },
  {
    letter: 'Y',
    word: 'YATE',
    emoji: '🛥️',
    description: 'Una embarcación rápida y ágil para explorar ensenadas poco profundas.',
    strokeHint: 'Dos brazos inclinados que se unen en un pie vertical central.',
    category: 'barco'
  },
  {
    letter: 'Z',
    word: 'ZAFIRO',
    emoji: '💎',
    description: 'Un zafiro azul marino tan profundo como las aguas del océano.',
    strokeHint: 'Línea horizontal arriba, diagonal al suelo y base horizontal.',
    category: 'tesoro'
  }
];

export interface WorkbookSettings {
  studentName: string;
  shipName: string;
  bookletTitle: string;
  subtitle: string;
  showUppercase: boolean;
  showLowercase: boolean;
  showCover: boolean;
  showDiploma: boolean;
  repeatWordTimes: number; // 3 or 4
  traceOpacity: number; // 20 to 80 %
  paperTexture: 'parchment' | 'clean' | 'sand';
  fontStyle: 'montessori' | 'casual' | 'dotted';
}

export const DEFAULT_SETTINGS: WorkbookSettings = {
  studentName: 'Capitán Santiago',
  shipName: 'El Halcón Dorado',
  bookletTitle: 'EL TESORO DE LAS LETRAS',
  subtitle: 'Cuadernillo de Práctica Pirata',
  showUppercase: true,
  showLowercase: true,
  showCover: true,
  showDiploma: true,
  repeatWordTimes: 3,
  traceOpacity: 35,
  paperTexture: 'parchment',
  fontStyle: 'montessori'
};
