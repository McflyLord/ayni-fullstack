import { createPortal } from "react-dom";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Backpack,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Coins,
  Compass,
  Cross,
  Drill,
  Droplets,
  Dumbbell,
  Eye,
  EyeOff,
  Flashlight,
  Flower2,
  Gift,
  Hammer,
  HandHeart,
  Handshake,
  HeartHandshake,
  HelpCircle,
  Home,
  Landmark,
  Leaf,
  LockKeyhole,
  LogOut,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  MoonStar,
  Package,
  Pause,
  Play,
  Plus,
  Recycle,
  Ruler,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  Sprout,
  Star,
  Store,
  Target,
  Trophy,
  User,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { StoreProvider, addMovement, addNotification, useStore } from "./core/store";
import type { AyniState } from "./core/types";

const PHOTO =
  "https://images.unsplash.com/photo-1568805778734-f0a5a77d7272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=82&w=1080";
const COAST = "/video-explicativo.mp4";
const ZONES = [
  "Casco Urbano",
  "Miraflores",
  "Bellamar",
  "Trapecio",
  "Florida",
  "Pensacola",
  "21 de Abril",
  "Buenos Aires",
  "Bolívar",
  "Nuevo Chimbote",
];
const DEMO = <span className="demo">Demostrativo</span>;

/* ============================================================
   Imágenes de personas (fotos reales para servicios, favores, trueques)
   ============================================================ */
const PERSON_PHOTOS: Record<string, string> = {
  "Don José Pérez": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80",
  "Elena Torres": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "Marco Ríos": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  "Lucía Mendoza": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "Diego Salazar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "Patricia Huamán": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "Wilder Cruz": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "Mariela León": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  "Juan Pérez": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "Rosa Calderón": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "Carlos Villanueva": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80",
  "Ana Reyes": "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80",
  "María Quispe": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  "Familia Sánchez": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80",
  "Vecina de Bellamar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
};

/* ============================================================
   Imágenes referenciadas al juego/categoría (retos)
   ============================================================ */
const CHALLENGE_IMG: Record<string, string> = {
  herramienta: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
  ecoayni: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
  hogar: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
  mochila: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  seguridad: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
  sismo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=600&q=80",
  agua: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80",
  memoria: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80",
};

/** Icono y color de respaldo si una foto no carga (demo sin internet). */
const CHALLENGE_VISUAL: Record<string, { icon: LucideIcon; tint: string }> = {
  herramienta: { icon: Wrench, tint: "var(--oro)" },
  ecoayni: { icon: Recycle, tint: "var(--ichu)" },
  hogar: { icon: Home, tint: "var(--terracota)" },
  mochila: { icon: Backpack, tint: "var(--turquesa)" },
  seguridad: { icon: ShieldCheck, tint: "var(--malva)" },
  sismo: { icon: Siren, tint: "var(--terracota)" },
  agua: { icon: Droplets, tint: "var(--turquesa)" },
  memoria: { icon: Landmark, tint: "var(--uva)" },
};
const CHALLENGE_CAT_COLOR: Record<string, string> = {
  Solidaridad: "var(--malva)",
  Medioambiente: "var(--ichu)",
  Finanzas: "var(--oro)",
  Prevención: "var(--terracota)",
  Habilidades: "var(--lavanda)",
  "Apoyo vecinal": "var(--turquesa)",
  "En familia": "var(--uva)",
};
const OPTION_TINTS = ["var(--turquesa)", "var(--terracota)", "var(--uva)"];

/* ============================================================
   Preguntas de los retos: escena, alternativas y resultado
   ============================================================ */
type ChallengeQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
};

type ChallengeScript = {
  icon: LucideIcon;
  sceneTitle: string;
  mission: string;
  lines: { who: string; text: string }[];
  questions: ChallengeQuestion[];
  winPhrase: string;
  loseTip: string;
};

const GENERIC_GAME: ChallengeScript = {
  icon: Sprout,
  sceneTitle: "Un reto de comunidad",
  mission: "Aprende jugando y luego comparte lo aprendido.",
  lines: [
    {
      who: "Guía AYNI",
      text: "Cada reto empieza con una pequeña decisión que ayuda a tu barrio.",
    },
    {
      who: "Tú",
      text: "Estoy listo. Quiero aprender para ayudar mejor a mis vecinos.",
    },
    {
      who: "Guía AYNI",
      text: "Responde con calma: lo importante es pensar en el bien común.",
    },
  ],
  questions: [
    {
      prompt: "¿Qué actitud fortalece más a una comunidad?",
      options: ["Escuchar y colaborar", "Ignorar a los vecinos", "Competir por todo"],
      correct: 0,
      explanation: "Escuchar y colaborar construye confianza y reciprocidad.",
    },
    {
      prompt: "Antes de ayudar, lo mejor es…",
      options: ["Preguntar qué necesita la otra persona", "Decidir por ella", "Publicarlo en redes"],
      correct: 0,
      explanation: "Preguntar respeta la autonomía y evita malentendidos.",
    },
    {
      prompt: "Un acuerdo claro incluye…",
      options: ["Qué, cuándo y cómo se hará", "Solo un saludo", "Nada por escrito"],
      correct: 0,
      explanation: "Los acuerdos claros protegen a ambas personas.",
    },
  ],
  winPhrase: "¡Cada gesto suma a la comunidad!",
  loseTip: "Escucha, pregunta y acuerda con claridad antes de actuar.",
};

const CHALLENGE_GAMES: Record<string, ChallengeScript> = {
  herramienta: {
    icon: Wrench,
    sceneTitle: "Un favor entre vecinos",
    mission: "Presta una herramienta de forma segura y responsable.",
    lines: [
      {
        who: "Doña Rosa",
        text: "¡Hola, vecina! Mi silla está coja y necesito un taladro para arreglarla.",
      },
      {
        who: "Tú",
        text: "Claro que sí. Acordemos a qué hora te lo presto y cuándo me lo devuelves.",
      },
      {
        who: "Narradora",
        text: "Un préstamo claro, con fecha y cuidado, mantiene la confianza en el barrio.",
      },
    ],
    questions: [
      {
        prompt: "Doña Rosa necesita un taladro. ¿Cuál es la mejor forma de ayudarla?",
        options: [
          "Prestárselo acordando fecha y hora de devolución",
          "Dejarlo en su puerta sin avisar",
          "Decirle que mejor compre uno",
        ],
        correct: 0,
        explanation:
          "Prestar con un acuerdo claro cuida la herramienta y la relación entre vecinos.",
      },
      {
        prompt: "¿Qué dato NO hace falta compartir para coordinar el préstamo?",
        options: [
          "El estado de la herramienta",
          "El día y la hora de devolución",
          "Tu dirección exacta y tus horarios de casa",
        ],
        correct: 2,
        explanation:
          "La dirección exacta y los horarios personales no son necesarios para coordinar un préstamo.",
      },
      {
        prompt: "Al devolver la herramienta, lo correcto es…",
        options: [
          "Revisar juntos que funciona y agradecer",
          "Dejarla en la puerta sin avisar",
          "Quedártela si todavía te sirve",
        ],
        correct: 0,
        explanation: "Revisar y agradecer cierra el acuerdo con confianza y reciprocidad.",
      },
    ],
    winPhrase: "¡Compartir también es cuidar!",
    loseTip: "Acuerda siempre el estado, la fecha y la devolución de lo que prestas.",
  },
  ecoayni: {
    icon: Recycle,
    sceneTitle: "Campaña en Bellamar",
    mission: "Clasifica los residuos de la jornada comunitaria.",
    lines: [
      {
        who: "Elena, promotora ambiental",
        text: "¡Llegó la campaña de reciclaje! Cada residuo en su contenedor hace la diferencia.",
      },
      {
        who: "Tú",
        text: "Listo. Revisaré que los envases estén limpios antes de clasificarlos.",
      },
      {
        who: "Narradora",
        text: "Tres residuos, tres decisiones. ¡Demuestra lo que sabes!",
      },
    ],
    questions: [
      {
        prompt: "¿Dónde va una botella de plástico limpia?",
        options: ["Contenedor de plástico", "Contenedor de orgánico", "Contenedor de vidrio"],
        correct: 0,
        explanation: "Las botellas plásticas limpias van al contenedor de plástico para reciclarse.",
      },
      {
        prompt: "¿Dónde va la cáscara de plátano?",
        options: ["Contenedor orgánico", "Contenedor de vidrio", "Contenedor de papel"],
        correct: 0,
        explanation: "Los restos de frutas y verduras son residuos orgánicos y pueden compostarse.",
      },
      {
        prompt: "¿Dónde va una caja de cartón desarmada?",
        options: ["Papel y cartón", "No reciclable", "Plástico"],
        correct: 0,
        explanation: "El cartón limpio y seco se recicla en el contenedor de papel y cartón.",
      },
    ],
    winPhrase: "¡Chimbote más limpio gracias a ti!",
    loseTip: "Separa plástico, papel/cartón y orgánico; enjuaga los envases antes de reciclar.",
  },
  hogar: {
    icon: Home,
    sceneTitle: "La semana de la familia Sánchez",
    mission: "Distribuye un presupuesto familiar de S/ 300 con equilibrio.",
    lines: [
      {
        who: "Sra. Sánchez",
        text: "Esta semana tenemos S/ 300. Necesito que me ayudes a distribuir el presupuesto.",
      },
      {
        who: "Tú",
        text: "Primero cubramos comida y servicios; después pensemos en los gustos y el ahorro.",
      },
      {
        who: "Narradora",
        text: "Cada decisión cuenta para que el hogar esté tranquilo toda la semana.",
      },
    ],
    questions: [
      {
        prompt: "Con S/ 300 para la semana, ¿qué orden protege mejor la economía del hogar?",
        options: [
          "Primero comida y servicios, luego ahorro y gustos",
          "Primero gustos y después lo que alcance",
          "Gastar todo el primer día",
        ],
        correct: 0,
        explanation:
          "Cubrir lo esencial y separar un pequeño ahorro evita sustos a fin de semana.",
      },
      {
        prompt: "¿Cuál de estos gastos es imprescindible?",
        options: ["Pagar el agua y la luz", "Comprar un videojuego", "Un segundo postre"],
        correct: 0,
        explanation: "Los servicios básicos mantienen el hogar seguro y saludable.",
      },
      {
        prompt: "¿Cómo ahorrar sin dejar de comer bien?",
        options: [
          "Planificar el menú semanal y comprar con lista",
          "Comprar al paso sin lista",
          "Botar las sobras para comprar más",
        ],
        correct: 0,
        explanation:
          "Planificar el menú y comprar con lista reduce gastos y desperdicios.",
      },
    ],
    winPhrase: "¡Un hogar ordenado también es un hogar feliz!",
    loseTip: "Prioriza lo esencial, planifica el menú y guarda un pequeño ahorro semanal.",
  },
  mochila: {
    icon: Backpack,
    sceneTitle: "Simulacro de prevención",
    mission: "Prepara una mochila de emergencia para 72 horas.",
    lines: [
      {
        who: "Comité de prevención",
        text: "Vecina, este sábado haremos un simulacro. ¿Ya tienes tu mochila de emergencia?",
      },
      {
        who: "Tú",
        text: "La estoy preparando. Quiero que tenga lo esencial y sea fácil de llevar.",
      },
      {
        who: "Narradora",
        text: "Una mochila bien armada puede ayudar a tu familia durante tres días.",
      },
    ],
    questions: [
      {
        prompt: "¿Qué debe ir primero en una mochila de emergencia?",
        options: [
          "Agua, botiquín y linterna",
          "Consola de videojuegos y audífonos",
          "Ropa de fiesta",
        ],
        correct: 0,
        explanation: "Agua, botiquín y linterna son básicos para atender y orientarte.",
      },
      {
        prompt: "¿Cuánta agua se recomienda por persona para 72 horas?",
        options: ["3 litros", "Una botella pequeña", "No hace falta agua"],
        correct: 0,
        explanation: "Se recomienda alrededor de 3 litros por persona para cubrir tres días.",
      },
      {
        prompt: "¿Dónde conviene guardar la mochila?",
        options: [
          "Cerca de la salida y en un lugar conocido",
          "En un sótano cerrado con llave",
          "En el techo de la casa",
        ],
        correct: 0,
        explanation: "Debe ser de fácil acceso y conocida por toda la familia.",
      },
    ],
    winPhrase: "¡Prepararte es cuidar a quienes quieres!",
    loseTip: "Agua, botiquín, linterna y documentos: lo esencial debe estar listo para salir.",
  },
  seguridad: {
    icon: ShieldCheck,
    sceneTitle: "Vecinos que se cuidan",
    mission: "Resuelve situaciones cotidianas de seguridad doméstica.",
    lines: [
      {
        who: "Don Luis",
        text: "Me voy de viaje y me preocupa dejar la casa sola. ¿Qué me recomiendas?",
      },
      {
        who: "Tú",
        text: "Cerrar bien, avisar solo a alguien de confianza y no publicar que estarás fuera.",
      },
      {
        who: "Narradora",
        text: "La seguridad empieza por no compartir más datos de los necesarios.",
      },
    ],
    questions: [
      {
        prompt: "Sales de viaje. ¿Qué es más seguro?",
        options: [
          "Cerrar con llave y pedir a un vecino de confianza que revise la casa",
          "Dejar la puerta abierta para que circule aire",
          "Publicar en redes que estarás fuera",
        ],
        correct: 0,
        explanation: "Un vecino de confianza puede revisar la casa sin exponerla en redes.",
      },
      {
        prompt: "Un desconocido pide entrar diciendo que revisa la luz. ¿Qué haces?",
        options: [
          "Pedir identificación y confirmar con la empresa antes de abrir",
          "Abrir de inmediato para no ser descortés",
          "Darle tu llave para que revise",
        ],
        correct: 0,
        explanation: "Verificar la identidad y confirmar con la empresa evita un posible engaño.",
      },
      {
        prompt: "¿Qué dato evitas publicar en redes sociales?",
        options: [
          "Fotos de tu casa y horarios de viaje",
          "Una receta de cocina",
          "Un paisaje de Chimbote",
        ],
        correct: 0,
        explanation: "Los horarios y datos de tu casa te ponen en riesgo cuando no estás.",
      },
    ],
    winPhrase: "¡La seguridad empieza por cuidar tus datos!",
    loseTip: "Comparte lo justo y confirma siempre con fuentes oficiales antes de abrir.",
  },
  sismo: {
    icon: Siren,
    sceneTitle: "Alerta sísmica en el barrio",
    mission: "Actúa antes, durante y después de un sismo.",
    lines: [
      {
        who: "Alarma vecinal",
        text: "¡Atención, simulacro sísmico en Miraflores! Mantén la calma y dirígete a una zona segura.",
      },
      {
        who: "Tú",
        text: "Me ubico lejos de ventanas, protejo la cabeza y espero las indicaciones.",
      },
      {
        who: "Narradora",
        text: "La calma y la previsión salvan vidas. ¡Demuestra lo que sabes!",
      },
    ],
    questions: [
      {
        prompt: "Durante un sismo, lo primero es…",
        options: [
          "Ubicarte en una zona segura lejos de ventanas",
          "Correr al ascensor",
          "Salir gritando a la calle",
        ],
        correct: 0,
        explanation:
          "Ubicarte lejos de ventanas y proteger la cabeza reduce el riesgo de golpes.",
      },
      {
        prompt: "¿Qué debes tener a mano después del sismo?",
        options: [
          "Linterna, radio y botiquín",
          "Solo el celular sin batería",
          "Velas encendidas",
        ],
        correct: 0,
        explanation: "Linterna, radio y botiquín sirven sin electricidad y sin abrir fuego.",
      },
      {
        prompt: "Después del sismo, ¿qué haces?",
        options: [
          "Revisar fugas de gas y seguir las indicaciones oficiales",
          "Encender fósforos para ver",
          "Volver a casa aunque esté dañada",
        ],
        correct: 0,
        explanation:
          "Revisar fugas y atender las indicaciones oficiales evita accidentes mayores.",
      },
    ],
    winPhrase: "¡La prevención es el mejor escudo!",
    loseTip: "Agáchate, protégete y sujétate; después revisa fugas y sigue las indicaciones.",
  },
  agua: {
    icon: Droplets,
    sceneTitle: "El cuidado del agua en Miraflores",
    mission: "Encuentra las mejores acciones para ahorrar agua.",
    lines: [
      {
        who: "Junta vecinal",
        text: "Vecinos, este mes el agua vino con menos presión. ¿Cómo podemos cuidarla entre todos?",
      },
      {
        who: "Tú",
        text: "Empiezo por casa: cierro el caño mientras me cepillo y reparo las fugas.",
      },
      {
        who: "Narradora",
        text: "Pequeñas acciones diarias suman miles de litros ahorrados.",
      },
    ],
    questions: [
      {
        prompt: "¿Qué acción ahorra más agua en casa?",
        options: [
          "Reparar fugas y cerrar el caño mientras te cepillas",
          "Dejar el caño abierto mientras te cepillas",
          "Lavar la vereda con manguera",
        ],
        correct: 0,
        explanation: "Una fuga pequeña puede perder cientos de litros al mes.",
      },
      {
        prompt: "¿Cómo regar las plantas con menos agua?",
        options: [
          "Regar temprano y reutilizar agua de lavado de verduras",
          "Regar al mediodía con manguera abierta",
          "Inundar la maceta hasta el borde",
        ],
        correct: 0,
        explanation: "Regar temprano reduce la evaporación y reutilizar alarga el agua.",
      },
      {
        prompt: "Si ves una fuga en la calle, ¿qué haces?",
        options: [
          "Reportarla con la junta vecinal o la empresa de agua",
          "Ignorarla porque no es tu casa",
          "Abrir más el caño",
        ],
        correct: 0,
        explanation: "Reportar una fuga permite repararla y evita más pérdidas.",
      },
    ],
    winPhrase: "¡Cada gota cuidada vuelve a la comunidad!",
    loseTip: "Repara fugas, cierra el caño y reutiliza el agua siempre que puedas.",
  },
  memoria: {
    icon: Landmark,
    sceneTitle: "Historias de la abuela Carmen",
    mission: "Recuerda datos de nuestra cultura peruana.",
    lines: [
      {
        who: "Abuela Carmen",
        text: "Cuando era joven, viajábamos en familia a conocer nuestro Perú. ¿Qué recuerdas tú?",
      },
      {
        who: "Tú",
        text: "¡Me encanta aprender! Nuestro país tiene historia, danzas y comidas únicas.",
      },
      {
        who: "Narradora",
        text: "La memoria también es comunidad: compartirla nos une.",
      },
    ],
    questions: [
      {
        prompt: "¿Qué plato es parte de la gastronomía peruana?",
        options: ["Ceviche", "Sushi", "Paella"],
        correct: 0,
        explanation: "El ceviche es un plato tradicional peruano reconocido en el mundo.",
      },
      {
        prompt: "Machu Picchu se encuentra en…",
        options: ["Cusco", "Lima", "Piura"],
        correct: 0,
        explanation: "Machu Picchu está en la región Cusco, en los Andes peruanos.",
      },
      {
        prompt: "¿Qué danza es tradicional del Perú?",
        options: ["Marinera", "Samba", "Tango"],
        correct: 0,
        explanation: "La marinera es una danza tradicional y símbolo de nuestra costa.",
      },
    ],
    winPhrase: "¡Nuestra cultura se comparte y se celebra!",
    loseTip: "Pregunta a tus abuelos y vecinos: la memoria oral también enseña.",
  },
};

/* ============================================================
   Imágenes reales tipo beneficios UTP (puntos/recompensas)
   ============================================================ */
const REWARD_IMG: Record<string, string> = {
  "Kit escolar básico": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
  "Kit de geometría": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
  "Canasta de víveres básica": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "Menestras y granos": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  "Clase de reforzamiento 1 h": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "Asesoría digital 1 h": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  "Taller familiar de reciclaje": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
  "Cine comunitario en familia": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
  "Cupón 10 % librería": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
  "Cupón menú del día": "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80",
  "Mochila de emergencia": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  "Kit de huerto urbano": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
};

function Logo({
  compact = false,
  light = false,
  size = "md",
}: {
  compact?: boolean;
  light?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const dims = compact
    ? "size-10"
    : size === "xl"
      ? "size-24 md:size-36"
      : size === "lg"
        ? "size-16 md:size-20"
        : "size-14 md:size-16";
  return (
    <img
      src="/ayni-logo-v2.png"
      alt="AYNI — Hoy por ti, mañana por mí"
      width={160}
      height={160}
      decoding="async"
      className={`${dims} shrink-0 object-contain ${light ? "logo-badge" : ""}`}
    />
  );
}

/** Iniciales del vecino a partir de su nombre real en el estado. */
function initials(name: string, surname: string) {
  return `${name.trim().charAt(0)}${surname.trim().charAt(0)}`.toUpperCase() || "AY";
}

/* ============================================================
   Fondos animados de los retos
   ============================================================ */
type BackdropPalette = {
  sky1: string;
  sky2: string;
  hill: string;
  ground1: string;
  ground2: string;
  sun: string;
};

const BACKDROP_PALETTES: Record<string, BackdropPalette> = {
  herramienta: {
    sky1: "#F3CF9E",
    sky2: "#FFF1D9",
    hill: "#E2B47C",
    ground1: "#C98B5A",
    ground2: "#8E5A38",
    sun: "#FFE1A3",
  },
  ecoayni: {
    sky1: "#B9E8D4",
    sky2: "#F1FAE7",
    hill: "#9CD08A",
    ground1: "#7DBE6C",
    ground2: "#4D8C51",
    sun: "#FFE38C",
  },
  hogar: {
    sky1: "#F6D5C3",
    sky2: "#FFF3E8",
    hill: "#B8DCA9",
    ground1: "#91CC84",
    ground2: "#5D9C62",
    sun: "#FFE0A2",
  },
  mochila: {
    sky1: "#9DD7EA",
    sky2: "#E8F6F8",
    hill: "#A9C8D6",
    ground1: "#8FC17B",
    ground2: "#5A8D5B",
    sun: "#FFE08C",
  },
  seguridad: {
    sky1: "#CBB9DE",
    sky2: "#F3EAF8",
    hill: "#A995BB",
    ground1: "#897898",
    ground2: "#59476A",
    sun: "#E9D9FF",
  },
  sismo: {
    sky1: "#F4C5A1",
    sky2: "#FCEBDA",
    hill: "#D9A37C",
    ground1: "#C28760",
    ground2: "#875437",
    sun: "#FFD08A",
  },
  agua: {
    sky1: "#B6E8EE",
    sky2: "#ECFAF7",
    hill: "#9CD4C6",
    ground1: "#8BCE85",
    ground2: "#569C60",
    sun: "#FFE38C",
  },
  memoria: {
    sky1: "#D8C0E7",
    sky2: "#F7EBF8",
    hill: "#B48BA8",
    ground1: "#C9A46F",
    ground2: "#8B6845",
    sun: "#FFD98B",
  },
};

function ParkBin({ color, delay }: { color: string; delay: number }) {
  return (
    <span
      className="tb-bin"
      style={{ "--bin": color, animationDelay: `${delay}s` } as CSSProperties}
    >
      <span className="tb-bin-lid" style={{ animationDelay: `${delay}s` }} />
      <Recycle size={17} strokeWidth={2.6} />
    </span>
  );
}

function EcoBackdrop() {
  return (
    <>
      <span className="tb-sign">
        <Recycle size={14} strokeWidth={2.8} /> ECOAYNI
      </span>
      <div className="tb-tree tb-tree-left">
        <span className="tb-tree-trunk" />
        <span className="tb-tree-crown tb-tree-crown-a" />
        <span className="tb-tree-crown tb-tree-crown-b" />
        <span className="tb-tree-crown tb-tree-crown-c" />
      </div>
      <div className="tb-tree tb-tree-right">
        <span className="tb-tree-trunk" />
        <span className="tb-tree-crown tb-tree-crown-a" />
        <span className="tb-tree-crown tb-tree-crown-b" />
        <span className="tb-tree-crown tb-tree-crown-c" />
      </div>
      <div className="tb-bins tb-bins-left">
        <ParkBin color="#E6C94A" delay={0} />
        <ParkBin color="#4F8FD8" delay={0.28} />
      </div>
      <div className="tb-bins tb-bins-right">
        <ParkBin color="#D96A5E" delay={0.56} />
        <ParkBin color="#5FAF6B" delay={0.84} />
      </div>
      <Leaf size={17} className="tb-particle tb-leaf-1" />
      <Leaf size={13} className="tb-particle tb-leaf-2" />
      <Leaf size={15} className="tb-particle tb-leaf-3" />
      <Flower2 size={25} className="tb-particle tb-flower-1" />
      <Flower2 size={20} className="tb-particle tb-flower-2" />
    </>
  );
}

function ToolsBackdrop() {
  return (
    <>
      <div className="tb-pegboard">
        <Wrench size={34} className="tb-tool tb-tool-1" />
        <Hammer size={34} className="tb-tool tb-tool-2" />
        <Drill size={36} className="tb-tool tb-tool-3" />
        <Ruler size={32} className="tb-tool tb-tool-4" />
      </div>
      <div className="tb-workbench" />
      <Wrench size={32} className="tb-icon-prop tb-bob tb-float-tool-1" />
      <Hammer size={28} className="tb-icon-prop tb-float tb-float-tool-2" />
      <Flower2 size={22} className="tb-particle tb-flower-1" />
    </>
  );
}

function HomeBackdrop() {
  return (
    <>
      <div className="tb-house">
        <span className="tb-house-roof" />
        <span className="tb-house-body">
          <span className="tb-house-window tb-window-a" />
          <span className="tb-house-window tb-window-b" />
          <span className="tb-house-door" />
        </span>
      </div>
      <div className="tb-jar" />
      <span className="tb-coin tb-coin-1">S/</span>
      <span className="tb-coin tb-coin-2">S/</span>
      <span className="tb-coin tb-coin-3">S/</span>
      <span className="tb-bush tb-bush-1" />
      <span className="tb-bush tb-bush-2" />
      <Flower2 size={25} className="tb-particle tb-flower-1" />
    </>
  );
}

function PackBackdrop() {
  return (
    <>
      <span className="tb-mountain tb-mountain-left" />
      <span className="tb-mountain tb-mountain-right" />
      <div className="tb-tent" />
      <Backpack size={102} className="tb-icon-prop tb-bob tb-pack" />
      <span className="tb-kit tb-kit-pack">
        <Cross size={22} />
      </span>
      <Flashlight size={30} className="tb-icon-prop tb-float tb-pack-light" />
      <Droplets size={27} className="tb-icon-prop tb-float tb-pack-water" />
      <span className="tb-lantern" />
    </>
  );
}

function SafetyBackdrop() {
  return (
    <>
      <Home size={76} className="tb-icon-prop tb-bob tb-safe-house-1" />
      <Home size={58} className="tb-icon-prop tb-bob tb-safe-house-2" />
      <ShieldCheck size={96} className="tb-icon-prop tb-pulse tb-shield" />
      <span className="tb-lamp">
        <span className="tb-lamp-glow" />
      </span>
      <LockKeyhole size={28} className="tb-icon-prop tb-float tb-lock" />
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`tb-star tb-star-${i}`} />
      ))}
    </>
  );
}

function QuakeBackdrop() {
  return (
    <>
      <span className="tb-building tb-building-left" />
      <span className="tb-building tb-building-right" />
      <Siren size={68} className="tb-icon-prop tb-pulse tb-siren" />
      <span className="tb-kit tb-kit-quake">
        <Cross size={22} />
      </span>
      <AlertTriangle size={26} className="tb-icon-prop tb-float tb-quake-warning" />
      <span className="tb-crack tb-crack-1" />
      <span className="tb-crack tb-crack-2" />
      <span className="tb-dust tb-dust-1" />
      <span className="tb-dust tb-dust-2" />
      <span className="tb-dust tb-dust-3" />
    </>
  );
}

function WaterBackdrop() {
  return (
    <>
      <div className="tb-water">
        <span className="tb-ripple tb-ripple-1" />
        <span className="tb-ripple tb-ripple-2" />
      </div>
      <div className="tb-reed tb-reed-1" />
      <div className="tb-reed tb-reed-2" />
      <Flower2 size={24} className="tb-particle tb-water-flower-1" />
      <Flower2 size={19} className="tb-particle tb-water-flower-2" />
      <Droplets size={62} className="tb-icon-prop tb-bob tb-water-icon" />
      <span className="tb-drop tb-drop-1" />
      <span className="tb-drop tb-drop-2" />
      <span className="tb-drop tb-drop-3" />
    </>
  );
}

function MemoryBackdrop() {
  return (
    <>
      <span className="tb-mountain tb-mountain-left" />
      <span className="tb-mountain tb-mountain-right" />
      <div className="tb-textile" />
      <span className="tb-photo tb-photo-1" />
      <span className="tb-photo tb-photo-2" />
      <Flower2 size={20} className="tb-particle tb-petal-1" />
      <Flower2 size={15} className="tb-particle tb-petal-2" />
      <Flower2 size={17} className="tb-particle tb-petal-3" />
    </>
  );
}

function ThemeBackdrop({ id }: { id: string }) {
  const palette = BACKDROP_PALETTES[id] ?? BACKDROP_PALETTES.ecoayni;
  return (
    <div
      className={`theme-backdrop theme-backdrop-${id}`}
      style={
        {
          "--tb-sky-1": palette.sky1,
          "--tb-sky-2": palette.sky2,
          "--tb-hill": palette.hill,
          "--tb-ground-1": palette.ground1,
          "--tb-ground-2": palette.ground2,
          "--tb-sun": palette.sun,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="tb-sun" />
      <span className="tb-cloud tb-cloud-a" />
      <span className="tb-cloud tb-cloud-b" />
      <span className="tb-hills" />
      <span className="tb-ground" />
      {id === "herramienta" && <ToolsBackdrop />}
      {id === "ecoayni" && <EcoBackdrop />}
      {id === "hogar" && <HomeBackdrop />}
      {id === "mochila" && <PackBackdrop />}
      {id === "seguridad" && <SafetyBackdrop />}
      {id === "sismo" && <QuakeBackdrop />}
      {id === "agua" && <WaterBackdrop />}
      {id === "memoria" && <MemoryBackdrop />}
    </div>
  );
}

/** Escena del reto: fondo animado temático + vecinos ilustrados + pregunta. */
function ComicStage({
  id,
  text,
  compact = false,
}: {
  id: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={`comic-stage ${compact ? "comic-stage-compact" : ""}`}>
      <ThemeBackdrop id={id} />
      <img
        src="/retos/comic-characters.svg"
        alt=""
        aria-hidden="true"
        className="comic-characters"
        decoding="async"
      />
      <div className="comic-bubble comic-bubble-question">
        <p>{text}</p>
      </div>
    </div>
  );
}

/** Foto del reto con respaldo ilustrado si la imagen no carga. */
function ChallengeArt({
  id,
  title,
  className = "",
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const visual = CHALLENGE_VISUAL[id] ?? { icon: Sprout, tint: "var(--ichu)" };
  const VisualIcon = visual.icon;
  return (
    <div
      className={`challenge-art ${className}`}
      style={{ ["--scene" as string]: visual.tint }}
    >
      <span className="challenge-art-fallback" aria-hidden="true">
        <VisualIcon size={54} strokeWidth={1.5} />
      </span>
      {!failed && (
        <img
          src={CHALLENGE_IMG[id]}
          alt={`Imagen referencial del reto ${title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}

// Mantiene el bloqueo de desplazamiento mientras haya al menos un modal abierto.
// El contador evita que un modal anidado reactive el scroll antes de tiempo.
let activeModalScrollLocks = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";

function lockPageScroll() {
  if (activeModalScrollLocks === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  activeModalScrollLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeModalScrollLocks = Math.max(0, activeModalScrollLocks - 1);

    if (activeModalScrollLocks === 0) {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    }
  };
}

function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const titleId = useId();
  const sheetRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const releaseScrollLock = lockPageScroll();

    const focusables = () =>
      Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => focusables()[0]?.focus(), 70);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
      releaseScrollLock();
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    createPortal(
      <div
      className="modal-backdrop fixed inset-0 z-[80] grid place-items-center overflow-hidden overscroll-contain bg-[color-mix(in_srgb,var(--ciruela)_58%,transparent)] p-3 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`modal-sheet flex w-full flex-col overflow-hidden overscroll-contain rounded-[26px] border border-[var(--line)] bg-[var(--marfil)] px-5 pt-3 shadow-[var(--shadow-lg)] md:rounded-[30px] md:px-7 md:pt-7 ${wide ? "max-w-4xl" : "max-w-xl"}`}
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-[var(--line-strong)] md:hidden"
        />
        <header className="modal-header mb-5 flex shrink-0 items-start justify-between gap-4">
          <h2 id={titleId} className="font-editorial text-2xl font-bold md:text-[1.7rem]">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <div className="modal-content min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6 md:pb-7">
          {children}
        </div>
      </section>
      </div>,
      document.body,
    )
  );
}

function Toast() {
  const { state, clearToast } = useStore();
  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(clearToast, 3400);
    return () => clearTimeout(timer);
  }, [state.toast, clearToast]);
  if (!state.toast) return null;
  return (
    <div
      aria-live="polite"
      role="status"
      className="toast fixed bottom-24 left-1/2 z-[100] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[color-mix(in_srgb,var(--ciruela)_94%,transparent)] py-2 pl-2 pr-5 font-semibold text-white shadow-[var(--shadow-lg)] backdrop-blur md:bottom-8"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--oro)] text-[var(--ciruela)]">
        <Check size={16} strokeWidth={3} />
      </span>
      <span className="text-sm">{state.toast}</span>
    </div>
  );
}

function Carousel() {
  const { navigate, state } = useStore();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const slides = [
    {
      tag: "Reto de la semana",
      title: "Clasifica y gana ECOAYNI",
      text: "Aprende jugando y luego ayuda a un vecino.",
      bg: "linear-gradient(135deg, #E0B15A 0%, #D9954A 100%)",
      route: "/app/retos",
      icon: <Leaf />,
    },
    {
      tag: "Coincidencia 94 %",
      title: "Una cadena que conecta",
      text: "Juan repara tu computadora y Rosa comparte matemáticas.",
      bg: "linear-gradient(135deg, #7A4B7F 0%, #482D4D 100%)",
      light: true,
      route: "/app/conecta",
      icon: <HeartHandshake />,
    },
    {
      tag: "Cerca de ti",
      title: "Ayuda que sí se mueve",
      text: "Tres vecinos coordinan recursos de agua en Miraflores.",
      bg: "linear-gradient(135deg, #94B5BA 0%, #6F9AA1 100%)",
      route: "/app/faro",
      icon: <MapPin />,
    },
    {
      tag: "Comunidad",
      title: "Jornada de reciclaje",
      text: "Súmate a una actividad demostrativa en Bellamar.",
      bg: "linear-gradient(135deg, #6B8F6B 0%, #4F7351 100%)",
      light: true,
      route: "/app/comunidad",
      icon: <Users />,
    },
  ];
  const auto = playing && !hover && !state.settings.reducedMotion;
  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setActive((v) => (v + 1) % slides.length), 5000);
    return () => clearTimeout(timer);
  }, [auto, active, slides.length]);
  const move = (n: number) => setActive((v) => (v + n + slides.length) % slides.length);
  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Oportunidades destacadas"
      onKeyDown={(e) => (e.key === "ArrowRight" ? move(1) : e.key === "ArrowLeft" && move(-1))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
      tabIndex={0}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((slide, i) => (
          <article
            key={slide.title}
            className={`carousel-slide pattern-light ${slide.light ? "text-white" : "text-[var(--ciruela)]"}`}
            style={{ background: slide.bg }}
            aria-hidden={i !== active}
            aria-label={`Diapositiva ${i + 1} de ${slides.length}`}
          >
            <span className="carousel-mark" aria-hidden="true">
              {slide.icon}
            </span>
            <div className="relative flex items-center justify-between gap-3 z-10">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.08em] ${
                  slide.light
                    ? "border-white/25 bg-white/15 text-white"
                    : "border-[var(--ciruela)]/15 bg-white/45 text-[var(--ciruela)]"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current opacity-70" />
                {slide.tag}
              </span>
              <span
                className={`grid size-12 place-items-center rounded-2xl ${
                  slide.light ? "bg-white/20" : "bg-white/40"
                } backdrop-blur-sm`}
              >
                {slide.icon}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="font-editorial max-w-xl text-[1.65rem] font-bold leading-[1.05] md:text-[2.15rem]">
                {slide.title}
              </h3>
              <p className="mt-2 max-w-md text-[0.95rem] font-medium leading-6 opacity-90">
                {slide.text}
              </p>
            </div>
            <div className="relative z-10">
              <button
                tabIndex={i === active ? 0 : -1}
                className={`group ${slide.light ? "btn-action" : "btn-primary"}`}
                onClick={() => navigate(slide.route)}
              >
                Ver oportunidad
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className={`carousel-controls ${slides[active].light ? "" : "on-light"}`}>
        <div className="carousel-nav-dots" role="tablist" aria-label="Elegir diapositiva">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              role="tab"
              aria-selected={i === active}
              aria-label={`Ir a ${slide.title}`}
              className="carousel-dot"
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <div className="carousel-actions">
          <button
            aria-label={playing ? "Pausar carrusel" : "Reproducir carrusel"}
            className="carousel-btn"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            aria-label="Anterior"
            className="carousel-btn"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label="Siguiente"
            className="carousel-btn"
            onClick={() => move(1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      {auto && (
        <span
          key={active}
          className={`carousel-progress ${slides[active].light ? "" : "on-light"}`}
        />
      )}
    </div>
  );
}



function Landing() {
  const { navigate } = useStore();
  const [menu, setMenu] = useState(false);
  const [ecosystem, setEcosystem] = useState<string | null>(null);
  const [faq, setFaq] = useState(0);
  const [video, setVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nav = ["Inicio", "Cómo funciona", "Ecosistema", "Impacto", "Comunidad"];
  const ecosystemItems = [
    ["AYNI Conecta", "Intercambia lo que sabes y tienes.", "var(--malva)", HeartHandshake, true],
    ["Servicios Cercanos", "Encuentra talento recomendado por vecinos.", "var(--turquesa)", Wrench, false],
    ["Cadena de Favores", "Haz circular ayuda útil.", "var(--arena)", HandHeart, false],
    ["Donaciones", "Da una segunda vida a lo que compartes.", "var(--ichu)", Gift, true],
    ["Retos Ayni", "Aprende jugando y ponlo en práctica.", "var(--oro)", Trophy, false],
    ["Horas Vecinales", "Reconoce el tiempo que dedicas.", "var(--uva)", Clock, true],
    ["Modo Faro", "Coordina apoyo vecinal con claridad.", "var(--terracota)", AlertTriangle, true],
    ["Mapa Comunitario", "Descubre recursos por zona aproximada.", "var(--oliva)", Map, true],
  ];
  const faqs = [
    [
      "¿Qué es AYNI?",
      "Una experiencia demostrativa de reciprocidad, aprendizaje y colaboración comunitaria para Chimbote.",
    ],
    [
      "¿Cómo funciona el trueque?",
      "Publicas qué ofreces y qué necesitas; el sistema propone coincidencias y cadenas de tres personas.",
    ],
    [
      "¿Cómo ofrezco ayuda?",
      "Puedes responder una necesidad en Cadena de Favores y seguir el proceso hasta su validación bilateral.",
    ],
    [
      "¿Qué son los puntos?",
      "Reconocen retos y ayudas validadas; en esta demo sirven para explorar el catálogo de recompensas ficticias.",
    ],
    [
      "¿Las horas son dinero?",
      "No. Las horas vecinales son una estadística de participación y no se gastan ni se convierten.",
    ],
    [
      "¿Las recompensas son reales?",
      "No. Todo el catálogo y los códigos son demostrativos, sin convenios comerciales.",
    ],
    [
      "¿Modo Faro llama a autoridades?",
      "No. Solo coordina avisos dentro de esta demostración. Para emergencias debes llamar directamente.",
    ],
    [
      "¿Cómo cuidan mis datos?",
      "Se usan zonas aproximadas, nunca direcciones ni coordenadas exactas. Los datos se guardan localmente en tu navegador.",
    ],
  ];
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--marfil)]">
      <header className="glass sticky top-0 z-40">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <button
            aria-label="Ir al inicio"
            className="rounded-2xl transition hover:opacity-90"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo />
          </button>
          <nav aria-label="Secciones" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="rounded-full px-3.5 py-2 text-[0.92rem] font-semibold text-[var(--ink-2)] transition hover:bg-white hover:text-[var(--terracota)]"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
            <button className="btn-action" onClick={() => navigate("/registro")}>
              Comenzar ahora
              <ArrowRight size={17} />
            </button>
          </div>
          <button
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            className="grid size-11 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] lg:hidden"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menu && (
          <nav
            aria-label="Menú móvil"
            className="border-t border-[var(--line)] bg-[var(--marfil)] px-4 pb-4 pt-2 lg:hidden"
          >
            {nav.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMenu(false)}
                className="block rounded-xl px-4 py-3 font-semibold text-[var(--ink-2)] hover:bg-white"
              >
                {item}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
              <button className="btn-action" onClick={() => navigate("/registro")}>
                Comenzar
              </button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden">
          <div aria-hidden="true" className="pattern-light absolute inset-0 opacity-80" />
          <div
            aria-hidden="true"
            className="hero-glow -left-32 top-16 size-[420px] bg-[var(--oro)]/45"
          />
          <div
            aria-hidden="true"
            className="hero-glow -right-24 -top-24 size-[520px] bg-[var(--lavanda)]/55"
          />
          <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <Sparkles size={14} /> Economía colaborativa para todos
              </span>
              <h1 className="display-hero mt-6 font-extrabold">
                Tu comunidad tiene todo lo que{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[var(--terracota)]">necesitas.</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-2 z-0 h-[0.16em] rounded-full bg-[var(--oro)]/55"
                  />
                </span>
              </h1>
              <p className="lede mt-6 max-w-xl">
                Conecta con tus vecinos, intercambia habilidades, comparte recursos y construye una
                comunidad donde todos pueden ayudar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="btn-action" onClick={() => navigate("/registro")}>
                  Comenzar ahora <ArrowRight size={18} />
                </button>
                <a className="btn-secondary" href="#ecosistema">
                  Explorar AYNI
                </a>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="flex -space-x-2.5">
                  {["MQ", "JP", "RC", "CV"].map((x, i) => (
                    <span
                      key={x}
                      className="grid size-10 place-items-center rounded-full border-[3px] border-[var(--marfil)] text-[11px] font-extrabold text-white shadow-sm"
                      style={{
                        background: [
                          "var(--malva)",
                          "var(--ichu)",
                          "var(--terracota)",
                          "var(--turquesa)",
                        ][i],
                      }}
                    >
                      {x}
                    </span>
                  ))}
                </div>
                <div className="text-sm leading-tight">
                  <p className="font-extrabold text-[var(--ink)]">Vecinos de Chimbote</p>
                  <p className="flex items-center gap-1.5 text-[var(--muted)]">
                    <Star size={13} className="fill-[var(--oro)] text-[var(--oro)]" />
                    Reciprocidad, aprendizaje y ayuda real
                  </p>
                </div>
                {DEMO}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[540px] lg:mx-0">
              <div
                aria-hidden="true"
                className="absolute -left-6 top-10 size-44 rounded-full bg-[var(--oro)]/45 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-6 bottom-2 top-6 rounded-[46%_54%_36%_64%/30%_42%_58%_70%] border border-[var(--oro)]/40"
              />
              <img
                src="/chimbote.jpg"
                alt="Imagen de Chimbote, Áncash"
                loading="eager"
                className="organic relative h-[440px] w-full border-4 border-white/70 object-cover shadow-[var(--shadow-lg)] md:h-[540px]"
              />
              <div className="card absolute -right-2 top-6 w-[9.5rem] p-4 md:-right-4">
                <Coins className="text-[var(--terracota)]" size={22} />
                <strong className="mt-2 block text-2xl leading-none tracking-tight">680</strong>
                <p className="mt-1 text-xs font-semibold text-[var(--muted)]">puntos Ayni</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--arena)]/40">
                  <span className="block h-full w-2/3 rounded-full bg-[var(--oro)]" />
                </div>
              </div>
              <div className="card absolute -left-2 bottom-14 max-w-[13.5rem] p-4 md:-left-6">
                <span className="demo">Demostrativo</span>
                <p className="mt-2 flex items-center gap-2 font-extrabold leading-tight">
                  <HeartHandshake size={16} className="text-[var(--malva)]" />
                  Intercambio encontrado
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">a 1.2 km de ti</p>
              </div>
              <div className="absolute -bottom-3 right-2 flex items-center gap-2 rounded-full bg-[var(--ciruela)] px-4 py-2.5 text-xs font-bold text-white shadow-lg md:right-6">
                <MapPin size={14} className="text-[var(--oro)]" /> Chimbote, Áncash
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--surface-3)] px-5 py-20 md:py-24">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
            <div>
              <span className="eyebrow">Nuestra esencia</span>
              <h2 className="section-title mt-5">
                La reciprocidad en{" "}
                <em className="not-italic text-[var(--terracota)]">movimiento.</em>
              </h2>
              <p className="lede mt-5 max-w-lg">
                AYNI convierte el “hoy por ti” en conexiones sencillas: aprender, compartir y
                devolver el gesto a la comunidad.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  [BookOpen, "Aprender", "Retos breves y útiles."],
                  [Gift, "Compartir", "Lo que sabes y tienes."],
                  [HeartHandshake, "Devolver", "Ayuda que circula."],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof BookOpen;
                  return (
                    <li key={t as string} className="surface p-4">
                      <I size={18} className="text-[var(--malva)]" />
                      <strong className="mt-2 block text-sm">{t as string}</strong>
                      <span className="text-xs leading-snug text-[var(--muted)]">
                        {d as string}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="group relative aspect-[16/11] overflow-hidden rounded-[30px] border border-white/60 text-left shadow-[var(--shadow)]"
              aria-label="Video explicativo de AYNI"
            >
              <video
                ref={videoRef}
                src={COAST}
                className="h-full w-full object-cover relative z-10"
                controls
                playsInline
                preload="auto"
                onPlay={() => setVideo(true)}
                onPause={() => setVideo(false)}
                onEnded={() => setVideo(false)}
              />
              {/* Overlays decorativos sin bloquear interacción del video */}
              <span
                className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--ciruela)_60%,transparent)] via-transparent to-transparent pointer-events-none z-20"
              />
              <span
                className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.07em] text-[var(--ciruela)] backdrop-blur pointer-events-none z-30"
              >
                {video ? <Pause size={11} /> : <Play size={11} />} Presentación · 01:24
              </span>
              <span
                className="absolute inset-0 grid place-items-center pointer-events-none z-20"
              >
                <span
                  className="grid size-[74px] place-items-center rounded-full bg-[var(--oro)] text-[var(--ciruela)] shadow-[var(--shadow-gold)] transition-transform duration-300 group-hover:scale-105"
                >
                  {video ? <Pause size={26} /> : <Play size={26} className="translate-x-0.5" />}
                </span>
              </span>
              <span
                className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white pointer-events-none z-30"
              >
                <span>
                  <strong className="font-editorial block text-xl leading-tight md:text-2xl">
                    {video ? "Presentación en reproducción" : "Ver cómo funciona"}
                  </strong>
                  <small className="mt-1 block text-xs text-white/75">
                    Video explicativo de AYNI
                  </small>
                </span>
                <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                  Demo
                </span>
              </span>
            </div>
          </div>
        </section>

        <section id="cómo-funciona" className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="eyebrow">En cuatro pasos</span>
              <h2 className="section-title mt-5">
                Compartir cambia la forma de vivir la{" "}
                <em className="not-italic text-[var(--malva)]">ciudad.</em>
              </h2>
            </div>
            <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--muted)]">
              Un recorrido simple: descubres, ofreces, coordinas y vuelves a empezar. Sin trámites y
              sin compartir datos exactos.
            </p>
          </div>
          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-[26px] hidden h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent lg:block"
            />
            <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "01",
                  "Encuentra lo que necesitas",
                  "Explora servicios, conocimientos y recursos cercanos.",
                  Search,
                ],
                [
                  "02",
                  "Comparte lo que tienes",
                  "Publica habilidades, objetos o tiempo disponible.",
                  Gift,
                ],
                [
                  "03",
                  "Conecta con tu comunidad",
                  "Coordina con personas de tu zona aproximada.",
                  Users,
                ],
                [
                  "04",
                  "Construye beneficios para todos",
                  "Gana reconocimiento y fortalece redes vecinales.",
                  Sparkles,
                ],
              ].map(([n, t, d, I]) => {
                const Icon = I as typeof Search;
                return (
                  <article key={t as string} className="card interactive p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid size-13 place-items-center rounded-2xl bg-[var(--surface-3)] text-[var(--ciruela)]">
                        <Icon size={20} />
                      </span>
                      <span className="font-editorial text-3xl font-extrabold text-[var(--terracota)]/85">
                        {n as string}
                      </span>
                    </div>
                    <h3 className="mt-6 text-[1.06rem] font-extrabold leading-snug">{t as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{d as string}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="ecosistema" className="relative overflow-hidden bg-[var(--lavanda)]/25 px-5 py-24">
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-2xl">
                <span className="eyebrow">Todo un ecosistema</span>
                <h2 className="section-title mt-5">
                  Una forma más humana de{" "}
                  <em className="not-italic text-[var(--terracota)]">conectar.</em>
                </h2>
              </div>
              {DEMO}
            </div>
            <div className="mt-12 grid auto-rows-[210px] gap-4 md:grid-cols-2 lg:grid-cols-4">
              {ecosystemItems.map(([title, desc, color, I, light], i) => {
                const Icon = I as typeof Search;
                return (
                  <button
                    key={title as string}
                    className={`group interactive pattern-light relative flex flex-col items-start justify-between overflow-hidden rounded-[26px] p-6 text-left ${i === 0 || i >= 5 ? "lg:col-span-2" : ""}`}
                    style={{
                      background: color as string,
                      color: light ? "#fff" : "var(--ciruela)",
                    }}
                    onClick={() => setEcosystem(title as string)}
                  >
                    <span
                      className={`grid size-12 place-items-center rounded-2xl ${light ? "bg-white/20" : "bg-white/45"}`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="block w-full">
                      <h3 className="font-editorial text-[1.35rem] font-bold leading-tight">
                        {title as string}
                      </h3>
                      <p className={`mt-1 text-sm leading-6 ${light ? "text-white/85" : "opacity-80"}`}>
                        {desc as string}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold">
                        Conocer más
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="impacto"
          className="relative overflow-hidden bg-[var(--ciruela)] px-5 py-24 text-white"
        >
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-[420px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 size-[420px] rounded-full border border-[var(--oro)]/25"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 size-[380px] rounded-full bg-[var(--malva)]/30 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-xl">
                <span className="eyebrow">Datos demostrativos</span>
                <h2 className="section-title mt-5">
                  Pequeños gestos. Un impacto que se{" "}
                  <em className="not-italic text-[var(--oro)]">multiplica.</em>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/65">
                Cifras de referencia de esta experiencia; no representan métricas reales del
                servicio.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["240+", "Conexiones creadas"],
                ["1,480", "Horas compartidas"],
                ["92%", "Intercambios completados"],
                ["10", "Zonas conectadas"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-3xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm"
                >
                  <strong className="font-editorial tabular block text-[2.9rem] leading-none text-[var(--oro)]">
                    {n}
                  </strong>
                  <p className="mt-3 font-bold">{l}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/45">
                    <span className="size-1.5 rounded-full bg-[var(--oro)]/70" /> Demostrativo
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comunidad" className="mx-auto max-w-7xl px-5 py-24">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
            <div>
              <span className="eyebrow">Voces de la comunidad</span>
              <h2 className="section-title mt-5">
                Cuando compartimos, todos{" "}
                <em className="not-italic text-[var(--terracota)]">crecemos.</em>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
                Testimonios escritos para esta experiencia demostrativa.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["“Pude aprender a reciclar y después ayudar a mi vecina.”", "María Q.", "mq"],
                ["“El intercambio hizo visible algo que yo sabía hacer.”", "Juan P.", "jp"],
                ["“La cadena de favores nos organizó con claridad.”", "Rosa C.", "rc"],
              ].map(([q, n, key], i) => (
                <blockquote key={n} className="card flex flex-col p-6">
                  <div className="flex items-center gap-1 text-[var(--oro)]">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 font-editorial text-[1.12rem] font-semibold leading-snug">
                    {q}
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                    <span
                      className="grid size-9 place-items-center rounded-full text-[11px] font-extrabold uppercase text-white"
                      style={{
                        background: ["var(--malva)", "var(--ichu)", "var(--terracota)"][i],
                      }}
                    >
                      {key}
                    </span>
                    <span className="text-sm">
                      <strong className="block leading-tight">{n}</strong>
                      <small className="text-[var(--muted)]">Testimonio ficticio</small>
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--turquesa)]/30 px-5 py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2 className="section-title mt-5">
                Todo lo que necesitas{" "}
                <em className="not-italic text-[var(--terracota)]">saber.</em>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">
                Si tu duda no está aquí, la Guía de Ayuda dentro de la app explica cada módulo paso a
                paso.
              </p>
            </div>
            <div className="space-y-2.5">
              {faqs.map(([q, a], i) => {
                const open = faq === i;
                return (
                  <div
                    key={q}
                    className={`overflow-hidden rounded-2xl border bg-white transition-colors ${open ? "border-[var(--malva)]/40 shadow-[var(--shadow-soft)]" : "border-[var(--line)]"}`}
                  >
                    <button
                      className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.97rem] font-extrabold"
                      onClick={() => setFaq(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                    >
                      {q}
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-[var(--malva)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <p
                        id={`faq-${i}`}
                        className="border-t border-[var(--line)] px-5 py-4 text-sm leading-7 text-[var(--ink-2)]"
                      >
                        {a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative mx-4 my-16 overflow-hidden rounded-[34px] bg-[var(--terracota)] px-5 py-16 text-center text-white md:mx-8 md:py-20">
          <div aria-hidden="true" className="pattern absolute inset-0 opacity-70" />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[var(--oro)]/25 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.08em] backdrop-blur">
              <Sparkles size={13} /> Únete
            </span>
            <h2 className="font-editorial mt-5 text-[2.2rem] font-extrabold leading-[1.03] md:text-[3.4rem]">
              Tu comunidad tiene mucho para compartir.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1.02rem] text-white/85">
              Descubre lo que ocurre cuando todos aportamos algo.
            </p>
            <button
              className="btn-primary mt-8 bg-[var(--oro)]! text-[var(--ciruela)]! shadow-[var(--shadow-gold)]"
              onClick={() => navigate("/registro")}
            >
              Forma parte de AYNI <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--ciruela)] px-5 pb-9 pt-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]">
            <div>
              <Logo light />
              <p className="mt-4 font-editorial text-xl leading-snug">Hoy por ti, mañana por mí</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">
                Experiencia demostrativa de economía colaborativa para Chimbote, Áncash.
              </p>
            </div>
            <nav aria-label="Explorar">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-white/40">
                Explorar
              </p>
              <div className="mt-4 grid gap-2.5 text-sm">
                <a className="text-white/75 transition hover:text-[var(--oro)]" href="#cómo-funciona">
                  Cómo funciona
                </a>
                <a className="text-white/75 transition hover:text-[var(--oro)]" href="#ecosistema">
                  Ecosistema
                </a>
                <a className="text-white/75 transition hover:text-[var(--oro)]" href="#impacto">
                  Impacto
                </a>
                <a className="text-white/75 transition hover:text-[var(--oro)]" href="#comunidad">
                  Comunidad
                </a>
              </div>
            </nav>
            <nav aria-label="Cuenta y legales">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-white/40">
                Cuenta
              </p>
              <div className="mt-4 grid gap-2.5 text-sm">
                <button
                  className="text-left text-white/75 transition hover:text-[var(--oro)]"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
                <button
                  className="text-left text-white/75 transition hover:text-[var(--oro)]"
                  onClick={() => navigate("/registro")}
                >
                  Crear cuenta
                </button>
                <button
                  className="text-left text-white/75 transition hover:text-[var(--oro)]"
                  onClick={() => navigate("/privacidad")}
                >
                  Privacidad
                </button>
                <button
                  className="text-left text-white/75 transition hover:text-[var(--oro)]"
                  onClick={() => navigate("/terminos")}
                >
                  Términos
                </button>
              </div>
            </nav>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
            <p>© 2026 AYNI · Chimbote, Áncash</p>
            <p className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--oro)]" />
              Demostrativo · Sin convenios reales
            </p>
          </div>
        </div>
      </footer>
      <Modal open={!!ecosystem} onClose={() => setEcosystem(null)} title={ecosystem || ""}>
        <div className="rounded-2xl bg-[var(--lavanda)]/30 p-5">
          <p>
            Conoce este módulo dentro de la experiencia AYNI. Todos sus datos y acciones son
            demostrativos.
          </p>
          {DEMO}
        </div>
        <button className="btn-action mt-5 w-full" onClick={() => navigate("/registro")}>
          Crear cuenta para probarlo
        </button>
      </Modal>
    </div>
  );
}

function Legal({ kind }: { kind: "Privacidad" | "Términos" }) {
  const { navigate } = useStore();
  const other = kind === "Privacidad" ? "Términos" : "Privacidad";
  return (
    <main className="min-h-screen bg-[var(--marfil)]">
      <div className="mx-auto max-w-4xl px-5 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} aria-label="Ir al inicio" className="rounded-2xl">
            <Logo />
          </button>
          <button className="btn-ghost text-sm" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Volver al inicio
          </button>
        </div>

        <article className="card mt-8 p-6 md:p-10">
          <span className="eyebrow">
            <ShieldCheck size={14} /> Documento breve
          </span>
          <h1 className="section-title mt-5">{kind}</h1>
          <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--muted-2)]">
            Experiencia demostrativa · Sin validez legal
          </p>

          <div className="mt-6 space-y-5 text-[0.97rem] leading-7 text-[var(--ink-2)]">
            <p>
              {kind === "Privacidad"
                ? "AYNI guarda la información de esta demostración únicamente en el almacenamiento local de este navegador. Usa zonas aproximadas y no solicita direcciones exactas. Puedes restablecer todos los datos desde Configuración."
                : "AYNI es una experiencia demostrativa. Los puntos, recompensas, usuarios, actividades y coordinaciones no representan servicios, convenios ni beneficios reales. Modo Faro no llama ni avisa a autoridades."}
            </p>
            <p>
              Al continuar aceptas usar esta experiencia de forma respetuosa y no compartir
              información sensible.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [ShieldCheck, "Datos locales", "Nada se envía a un servidor."],
              [MapPin, "Zona aproximada", "Sin coordenadas ni direcciones."],
              [AlertTriangle, "Sin servicios reales", "Todo es demostrativo."],
            ].map(([Icon, title, text]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div key={title as string} className="rounded-2xl bg-[var(--surface-2)] p-4">
                  <span className="grid size-9 place-items-center rounded-xl bg-white text-[var(--malva)] shadow-sm">
                    <I size={16} />
                  </span>
                  <strong className="mt-3 block text-sm">{title as string}</strong>
                  <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">{text as string}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => navigate("/")}>
              Entendido <Check size={16} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate(other === "Privacidad" ? "/privacidad" : "/terminos")}
            >
              Ver {other}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

function Auth({ register = false, recover = false }: { register?: boolean; recover?: boolean }) {
  const { navigate, loginDemo, update } = useStore();
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    surname: "",
    occupation: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    terms: false,
    remember: true,
    code: "",
  });
  const set = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });
  const passwordId = useId();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (recover) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Ingresa un correo válido.";
      if (step === 2 && !/^\d{6}$/.test(form.code))
        next.code = "Ingresa el código de 6 dígitos mostrado.";
    } else if (register && step === 1) {
      if (form.name.trim().length < 2) next.name = "Escribe tu nombre.";
      if (form.surname.trim().length < 2) next.surname = "Escribe tus apellidos.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Ingresa un correo válido.";
      if (!/^9\d{8}$/.test(form.phone)) next.phone = "Debe tener 9 dígitos y empezar en 9.";
      if (!form.occupation.trim()) next.occupation = "Ingresa tu ocupación.";
    } else {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Ingresa un correo válido.";
      if (form.password.length < 8)
        next.password = "La contraseña debe tener al menos 8 caracteres.";
      if (register && form.password !== form.confirm)
        next.confirm = "Las contraseñas no coinciden.";
      if (register && !form.terms) next.terms = "Debes aceptar los términos.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    if ((register && step === 1) || (recover && step === 1)) return setStep(2);
    if (recover) {
      update(() => {}, "Contraseña restablecida en modo demostrativo");
      return navigate("/login");
    }
    if (register) {
      update((s) => {
        s.session = true;
        s.welcomed = false;
        s.user = {
          ...s.user,
          name: form.name,
          surname: form.surname,
          occupation: form.occupation,
          email: form.email,
          phone: form.phone,
        };
      });
      navigate("/bienvenida");
    } else loginDemo();
  };
  return (
    <main className="grid min-h-screen bg-[var(--marfil)] lg:grid-cols-[1fr_1.04fr]">
      <section className="relative flex items-center justify-center px-5 py-10 md:px-10">
        <div className="w-full max-w-[27rem]">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate("/")}
              aria-label="Volver a inicio"
              className="rounded-2xl"
            >
              <Logo />
            </button>
            <button className="btn-ghost text-sm" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Inicio
            </button>
          </div>

          <div className="mt-10">
            <span className="eyebrow">
              {recover
                ? "Recuperación demostrativa"
                : register
                  ? `Registro · Paso ${step} de 2`
                  : "Qué bueno verte"}
            </span>
            <h1 className="font-editorial mt-4 text-[2.1rem] font-extrabold leading-[1.04] md:text-[2.45rem]">
              {recover
                ? "Recupera tu acceso"
                : register
                  ? "Construyamos comunidad."
                  : "Bienvenida de vuelta."}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {recover
                ? "No se envía ningún correo real. Usa el código que verás aquí."
                : register
                  ? "Unos datos breves y estarás dentro de AYNI."
                  : "Hoy por ti, mañana por mí."}
            </p>
          </div>

          {register && (
            <div className="mt-6 flex items-center gap-2" aria-hidden="true">
              {[1, 2].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? "bg-[var(--terracota)]" : "bg-[var(--arena)]/45"}`}
                />
              ))}
            </div>
          )}

          {recover && step === 2 && (
            <div className="mt-5 rounded-2xl border border-[var(--oro)]/50 bg-[var(--oro)]/25 p-4">
              <strong className="flex items-center gap-2 text-sm">
                <Sparkles size={15} /> Código demostrativo: 246810
              </strong>
              <p className="mt-1 text-xs text-[var(--ink-2)]">No se envía ningún correo real.</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
            {register && step === 1 && (
              <>
                <Field
                  label="Nombres"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                />
                <Field
                  label="Apellidos"
                  value={form.surname}
                  onChange={(v) => set("surname", v)}
                  error={errors.surname}
                />
                <Field
                  label="Ocupación"
                  value={form.occupation}
                  onChange={(v) => set("occupation", v)}
                  error={errors.occupation}
                  placeholder="Ej. Diseñadora, fontanero, profesora, carpintero…"
                />
              </>
            )}
            {(!register || step === 1) && !((recover || register) && step === 2) && (
              <Field
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
              />
            )}
            {register && step === 1 && (
              <Field
                label="Teléfono peruano"
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                placeholder="9 dígitos, empieza en 9"
              />
            )}
            {recover && step === 2 && (
              <Field
                label="Código de 6 dígitos"
                value={form.code}
                onChange={(v) => set("code", v)}
                error={errors.code}
              />
            )}
            {!recover && (!register || step === 2) && (
              <div>
                <label className="label" htmlFor={passwordId}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    className="field pr-12"
                    type={show ? "text" : "password"}
                    value={form.password}
                    autoComplete={register ? "new-password" : "current-password"}
                    aria-invalid={!!errors.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
                {register && form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="progress">
                      <span style={{ width: `${Math.min(100, form.password.length * 12)}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] font-bold text-[var(--muted)]">
                      {form.password.length < 8 ? "Mínimo 8 caracteres" : "Longitud suficiente"}
                    </p>
                  </div>
                )}
              </div>
            )}
            {recover && step === 2 && (
              <Field
                label="Nueva contraseña"
                type="password"
                value={form.password}
                onChange={(v) => set("password", v)}
                error={errors.password}
              />
            )}
            {register && step === 2 && (
              <>
                <Field
                  label="Confirmar contraseña"
                  type="password"
                  value={form.confirm}
                  onChange={(v) => set("confirm", v)}
                  error={errors.confirm}
                />
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    className="mt-1 size-5"
                  />
                  <span>
                    Acepto los{" "}
                    <button
                      type="button"
                      className="underline"
                      onClick={() => navigate("/terminos")}
                    >
                      términos demostrativos
                    </button>
                    .
                  </span>
                </label>
                {errors.terms && <ErrorText>{errors.terms}</ErrorText>}
              </>
            )}
            {!register && !recover && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => set("remember", e.target.checked)}
                    className="size-5"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  className="font-bold underline"
                  onClick={() => navigate("/recuperar")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
            <button className="btn-action w-full" type="submit">
              {recover
                ? step === 1
                  ? "Mostrar código"
                  : "Restablecer contraseña"
                : register
                  ? step === 1
                    ? "Continuar"
                    : "Crear mi cuenta"
                  : "Iniciar sesión"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>

          {!register && !recover && (
            <>
              <div className="my-5 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--muted-2)]">
                <span className="h-px flex-1 bg-[var(--line-strong)]" /> o
                <span className="h-px flex-1 bg-[var(--line-strong)]" />
              </div>
              <button className="btn-secondary w-full" onClick={loginDemo}>
                <Sparkles size={17} className="text-[var(--oro)]" /> Entrar con usuario de
                demostración
              </button>
            </>
          )}

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            {register ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
            <button
              className="font-extrabold text-[var(--ciruela)] underline decoration-[var(--oro)] decoration-2 underline-offset-4"
              onClick={() => navigate(register ? "/login" : "/registro")}
            >
              {register ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden lg:block">
        <img
          src={PHOTO}
          alt="Mujer peruana en vestimenta tradicional, fotografía referencial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--ciruela)_94%,transparent)] via-[color-mix(in_srgb,var(--ciruela)_35%,transparent)] to-transparent" />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-16 size-80 rounded-full border border-[var(--oro)]/30"
        />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
            <ShieldCheck size={15} className="text-[var(--oro)]" />
            Zonas aproximadas, sin direcciones exactas
          </span>
          <div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-7 backdrop-blur-md">
              <Sparkles className="text-[var(--oro)]" />
              <p className="font-editorial mt-4 text-[1.7rem] font-bold leading-[1.15]">
                “Cuando compartimos lo que sabemos, toda la comunidad avanza.”
              </p>
              <p className="mt-4 text-sm text-white/55">Testimonio ficticio · Demostrativo</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ["10", "zonas de Chimbote"],
                ["8", "retos Ayni"],
                ["12", "recompensas"],
              ].map(([n, l]) => (
                <span
                  key={l}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur"
                >
                  <strong className="mr-1.5 text-lg font-extrabold text-[var(--oro)]">{n}</strong>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-[var(--muted)]">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}
function ErrorText({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[var(--danger)]"
    >
      <AlertTriangle size={14} className="shrink-0" />
      {children}
    </p>
  );
}

function Welcome() {
  const { state, update, navigate } = useStore();
  const [step, setStep] = useState(1);
  const [zone, setZone] = useState(state.user.zone);
  const [interests, setInterests] = useState(state.user.interests);
  const options = [
    "Reciclaje",
    "Tecnología",
    "Apoyo vecinal",
    "Prevención",
    "Clases",
    "Mascotas",
    "Donaciones",
  ];
  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      update((s) => {
        s.welcomed = true;
        s.user.zone = zone;
        s.user.interests = interests;
      }, "Tu experiencia está lista");
      navigate("/app/inicio");
    }
  };
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--marfil)] p-4 md:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-[var(--oro)]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 size-96 rounded-full bg-[var(--lavanda)]/35 blur-3xl"
      />
      <div className="card relative w-full max-w-4xl overflow-hidden">
        <div className="relative overflow-hidden bg-[image:var(--grad-ciruela)] px-5 py-4 text-white md:px-7">
          <div aria-hidden="true" className="pattern absolute inset-0 opacity-50" />
          <div className="relative flex items-center justify-between gap-4">
            <Logo light compact />
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? "w-7 bg-[var(--oro)]" : s < step ? "w-4 bg-[var(--oro)]/70" : "w-4 bg-white/25"
                  }`}
                />
              ))}
            </div>
            <button
              className="text-xs font-extrabold text-white/70 transition hover:text-white"
              onClick={() => {
                update((s) => {
                  s.welcomed = true;
                });
                navigate("/app/inicio");
              }}
            >
              Omitir
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.1fr_.9fr]">
          <div className="p-6 md:p-9">
            {step === 1 && (
              <div>
                <span className="eyebrow">
                  <Sparkles size={14} /> Bienvenida
                </span>
                <h1 className="font-editorial mt-4 text-[1.9rem] font-extrabold leading-[1.05] md:text-[2.5rem]">
                  Encuentra, comparte y gana.
                </h1>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-2)]">
                  AYNI te ayuda a aprender, intercambiar y colaborar con vecinos de Chimbote. Todo
                  en esta experiencia está marcado como demostrativo.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    [Trophy, "Aprende con retos cortos y gana puntos."],
                    [HeartHandshake, "Intercambia habilidades sin dinero."],
                    [ShieldCheck, "Tu ubicación siempre es aproximada."],
                  ].map(([Icon, text]) => {
                    const I = Icon as typeof Trophy;
                    return (
                      <li key={text as string} className="flex items-start gap-3 text-sm font-semibold">
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[var(--oro)]/30 text-[var(--ciruela)]">
                          <I size={16} />
                        </span>
                        <span className="pt-1.5 leading-5">{text as string}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === 2 && (
              <div>
                <span className="eyebrow">Personaliza tu inicio</span>
                <h1 className="font-editorial mt-4 text-[1.9rem] font-extrabold leading-[1.05] md:text-[2.4rem]">
                  ¿Qué te interesa?
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Elige una o más opciones. Puedes cambiarlas después.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {options.map((x) => (
                    <button
                      key={x}
                      aria-pressed={interests.includes(x)}
                      className={`chip ${interests.includes(x) ? "active" : ""}`}
                      onClick={() =>
                        setInterests(
                          interests.includes(x)
                            ? interests.filter((i) => i !== x)
                            : [...interests, x],
                        )
                      }
                    >
                      {interests.includes(x) && <Check size={13} />} {x}
                    </button>
                  ))}
                </div>
                <label className="label mt-6" htmlFor="welcome-zone">
                  Zona de Chimbote
                </label>
                <select
                  id="welcome-zone"
                  className="field"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  {ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 3 && (
              <div>
                <span className="eyebrow">
                  <ShieldCheck size={14} /> Privacidad primero
                </span>
                <h1 className="font-editorial mt-4 text-[1.9rem] font-extrabold leading-[1.05] md:text-[2.4rem]">
                  Ubicación aproximada.
                </h1>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-2)]">
                  AYNI guarda únicamente tu zona, nunca coordenadas ni una dirección exacta.
                </p>
                <div className="mt-5 rounded-2xl border border-[var(--turquesa)]/50 bg-[var(--turquesa)]/30 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-white text-[var(--ciruela)]">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <strong className="block text-sm">{zone}, Chimbote</strong>
                      <p className="text-[11px] text-[var(--ink-2)]">Zona aproximada · Demostrativo</p>
                    </div>
                  </div>
                </div>
                <button
                  className="btn-secondary mt-3 w-full"
                  onClick={() => update(() => {}, "Permiso simulado: solo guardaremos la zona")}
                >
                  <MapPin size={17} /> Permitir ubicación
                </button>
              </div>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                className="btn-ghost"
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={17} /> Atrás
              </button>
              <button className="btn-action" onClick={next}>
                {step === 3 ? "Ir a Inicio" : "Continuar"}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <aside className="relative hidden overflow-hidden md:block">
            <img
              src={PHOTO}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,31,74,0.15)_0%,rgba(42,19,52,0.9)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur">
                <Users size={12} /> Comunidad AYNI
              </span>
              <p className="font-editorial mt-3 text-xl font-extrabold leading-tight">
                “Hoy por ti, mañana por mí.”
              </p>
              <p className="mt-1.5 text-xs leading-5 text-white/70">
                Vecinos de Chimbote que comparten tiempo, oficio y cuidado.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const NAV = [
  ["/app/inicio", "Inicio", Home],
  ["/app/explorar", "Explorar", Compass],
  ["/app/retos", "Retos Ayni", Trophy],
  ["/app/puntos", "Puntos", Coins],
  ["/app/servicios", "Servicios Cercanos", Wrench],
  ["/app/conecta", "AYNI Conecta", HeartHandshake],
  ["/app/favores", "Cadena de Favores", HandHeart],
  ["/app/donaciones", "Donaciones", Gift],
  ["/app/mapa", "Mapa Comunitario", Map],
  ["/app/comunidad", "Comunidad", Users],
  ["/app/faro", "Modo Faro", AlertTriangle],
  ["/app/mensajes", "Mensajes", MessageCircle],
  ["/app/guia", "Guía de Ayuda", CircleHelp],
  ["/app/perfil", "Mi perfil", User],
  ["/app/configuracion", "Configuración", Settings],
] as const;

const NAV_GROUPS: Array<[string, string[]]> = [
  ["Principal", ["/app/inicio", "/app/explorar", "/app/retos", "/app/puntos"]],
  [
    "Comunidad",
    [
      "/app/servicios",
      "/app/conecta",
      "/app/favores",
      "/app/donaciones",
      "/app/mapa",
      "/app/comunidad",
      "/app/faro",
      "/app/mensajes",
    ],
  ],
  ["Mi cuenta", ["/app/perfil", "/app/guia", "/app/configuracion"]],
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

function AppShell() {
  const { state, navigate, update, logout } = useStore();
  const [drawer, setDrawer] = useState(false);
  const [explore, setExplore] = useState(false);
  const [publish, setPublish] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const isDesktop = useIsDesktop();
  const unread = state.notifications.filter((n) => !n.read).length;
  const unreadMessages = state.messages.filter((m) => !m.read).length;
  const level = getLevel(state.user.totalEarned);
  const avatar = initials(state.user.name, state.user.surname);
  const routeName =
    NAV.find(([r]) => state.route === r)?.[1] ||
    state.route
      .split("?")[0]
      .split("/")
      .at(-1)
      ?.replace("-", " ") ||
    "AYNI";

  useEffect(() => setDrawer(false), [state.route]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)
      )
        return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/app/explorar?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="app-bg min-h-screen pb-24 md:pb-0 lg:pl-[284px]">
      {drawer && (
        <button
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--ciruela)_55%,transparent)] backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setDrawer(false)}
        />
      )}

      <aside
        inert={!isDesktop && !drawer ? true : undefined}
        className={`sidebar-bg fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col text-white shadow-[var(--shadow-lg)] transition-transform duration-300 ease-out lg:translate-x-0 ${
          drawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
          <button
            className="rounded-2xl"
            aria-label="Ir al inicio"
            onClick={() => navigate("/app/inicio")}
          >
            <span className="self-center"><Logo light compact /></span>
          </button>
          <button
            className="grid size-10 place-items-center rounded-full bg-white/10 text-white lg:hidden"
            onClick={() => setDrawer(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_GROUPS.map(([group, routes]) => (
            <div key={group}>
              <p className="nav-label">{group}</p>
              <div className="space-y-0.5">
                {routes.map((route) => {
                  const item = NAV.find(([r]) => r === route);
                  if (!item) return null;
                  const [r, label, Icon] = item;
                  const active = state.route.split("?")[0] === r;
                  return (
                    <button
                      key={r}
                      onClick={() => navigate(r)}
                      aria-current={active ? "page" : undefined}
                      className="nav-item"
                    >
                      <Icon size={18} className={active ? "text-[var(--oro)]" : ""} />
                      <span className="truncate">{label}</span>
                      {label === "Mensajes" && unreadMessages > 0 && (
                        <span className="ml-auto rounded-full bg-[var(--terracota)] px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                          {unreadMessages}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => navigate("/app/perfil")}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-left transition hover:bg-white/[0.11]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--oro)] text-sm font-extrabold text-[var(--ciruela)]">
              {avatar}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm">
                {state.user.name} {state.user.surname}
              </strong>
              <small className="block truncate text-[11px] text-white/55">{level.name}</small>
            </span>
            <ChevronRight size={16} className="shrink-0 text-white/40" />
          </button>
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/50">
              <Coins size={13} className="text-[var(--oro)]" /> {state.user.points} pts
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[.14em] text-white/30">
              Sesión demo
            </span>
          </div>
          <button
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--oro)]/45 bg-[var(--oro)]/15 px-3 py-2.5 text-xs font-extrabold text-[var(--oro)] transition hover:border-[var(--oro)] hover:bg-[var(--oro)] hover:text-[var(--ciruela)]"
            onClick={logout}
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="glass sticky top-0 z-30">
        <div className="flex h-[74px] items-center gap-2 px-3 md:gap-3 md:px-6">
          <button
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white lg:hidden"
            onClick={() => setDrawer(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <form className="hidden max-w-xl flex-1 md:block" onSubmit={searchSubmit} role="search">
            <label className="relative block">
              <span className="sr-only">Buscar en AYNI</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                size={18}
              />
              <input
                ref={searchRef}
                className="field pl-11 pr-12"
                placeholder="Buscar retos, servicios, recompensas…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--line)] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)] lg:block">
                /
              </kbd>
            </label>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="grid size-11 place-items-center rounded-full border border-[var(--line)] bg-white md:hidden"
              onClick={() => navigate("/app/explorar")}
              aria-label="Buscar"
            >
              <Search size={19} />
            </button>

            <label className="relative hidden sm:block" title="Seleccionar zona aproximada">
              <span className="sr-only">Seleccionar zona aproximada</span>
              <MapPin
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--malva)]"
              />
              <select
                aria-label="Seleccionar zona aproximada"
                className="min-h-11 max-w-52 appearance-none rounded-full border border-[var(--line)] bg-white py-2 pl-9 pr-8 text-sm font-bold text-[var(--ink-2)] transition hover:border-[var(--malva)] focus:border-[var(--malva)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                value={state.user.zone}
                onChange={(event) => {
                  const selectedZone = event.currentTarget.value;
                  update((s) => {
                    s.user.zone = selectedZone;
                  }, "Zona aproximada actualizada");
                }}
              >
                {ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
            </label>

            <button
              className="relative grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink-2)] transition hover:border-[var(--malva)]"
              onClick={() => navigate("/app/notificaciones")}
              aria-label={`${unread} notificaciones sin leer`}
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-[var(--terracota)] text-[10px] font-extrabold text-white ring-2 ring-[var(--marfil)]">
                  {unread}
                </span>
              )}
            </button>

            <button
              className="hidden items-center gap-2 rounded-full pl-1 pr-3 transition hover:bg-white md:flex"
              onClick={() => navigate("/app/perfil")}
            >
              <span className="grid size-10 place-items-center rounded-full bg-[var(--lavanda)] text-sm font-extrabold text-[var(--ciruela)]">
                {avatar}
              </span>
              <strong className="max-w-24 truncate text-sm">{state.user.name}</strong>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-7 md:py-8">
        {state.route !== "/app/inicio" && (
          <nav aria-label="Ruta actual" className="mb-5 flex items-center gap-2 text-sm font-bold">
            <button
              className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink-2)]"
              onClick={() => window.history.back()}
              aria-label="Volver"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className="text-[var(--malva)] transition hover:text-[var(--ciruela)]"
              onClick={() => navigate("/app/inicio")}
            >
              AYNI
            </button>
            <ChevronRight size={14} className="text-[var(--muted-2)]" />
            <span className="capitalize text-[var(--ink-2)]">{routeName}</span>
          </nav>
        )}
        <div key={state.route.split("?")[0]} className="page-enter page-transition">
          <PageRouter openPublish={() => setPublish(true)} />
        </div>
      </div>

      {state.route !== "/app/inicio" && (
        <button
          aria-label="Publicar"
          className="fixed bottom-8 right-8 z-20 hidden size-16 place-items-center rounded-full bg-[image:var(--grad-terracota)] text-white shadow-[0_14px_34px_rgba(198,90,62,.42)] transition-transform hover:scale-105 active:scale-95 lg:grid"
          onClick={() => setPublish(true)}
        >
          <Plus size={26} />
        </button>
      )}

      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-30 grid h-[74px] grid-cols-5 items-center border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--marfil)_92%,transparent)] px-2 backdrop-blur-xl md:hidden"
      >
        <MobileNav icon={<Home size={20} />} label="Inicio" active={state.route === "/app/inicio"} onClick={() => navigate("/app/inicio")} />
        <MobileNav icon={<Compass size={20} />} label="Explorar" active={state.route === "/app/explorar"} onClick={() => navigate("/app/explorar")} />
        <button
          className="-mt-8 mx-auto grid size-[58px] place-items-center rounded-full border-4 border-[var(--marfil)] bg-[image:var(--grad-terracota)] text-white shadow-[0_10px_24px_rgba(198,90,62,.45)] transition active:scale-95"
          onClick={() => setPublish(true)}
          aria-label="Publicar"
        >
          <Plus size={26} />
        </button>
        <MobileNav
          icon={
            <span className="relative">
              <MessageCircle size={20} />
              {unreadMessages > 0 && (
                <span className="absolute -right-1.5 -top-1 size-2 rounded-full bg-[var(--terracota)]" />
              )}
            </span>
          }
          label="Mensajes"
          active={state.route === "/app/mensajes"}
          onClick={() => navigate("/app/mensajes")}
        />
        <MobileNav icon={<User size={20} />} label="Perfil" active={state.route === "/app/perfil"} onClick={() => navigate("/app/perfil")} />
      </nav>

      <PublishModal open={publish} onClose={() => setPublish(false)} />
      <ExploreModal open={explore} onClose={() => setExplore(false)} />
    </div>
  );
}

function MobileNav({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10.5px] font-extrabold transition-colors ${
        active
          ? "text-[var(--ciruela)]"
          : "text-[var(--muted)] hover:text-[var(--ink-2)]"
      }`}
      onClick={onClick}
    >
      <span
        className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
          active ? "bg-[var(--oro)]/35" : ""
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function PageRouter({ openPublish }: { openPublish: () => void }) {
  const { state } = useStore();
  const path = state.route.split("?")[0];
  if (path === "/app/inicio") return <HomePage openPublish={openPublish} />;
  if (path === "/app/explorar") return <ExplorePage />;
  if (path === "/app/retos") return <Challenges />;
  if (path === "/app/puntos") return <Rewards />;
  if (path === "/app/perfil") return <Profile />;
  if (path === "/app/servicios") return <Services />;
  if (path === "/app/conecta") return <Swaps />;
  if (path === "/app/favores") return <Favors />;
  if (path === "/app/donaciones") return <Donations />;
  if (path === "/app/faro") return <Faro />;
  if (path === "/app/mapa") return <MapPage />;
  if (path === "/app/comunidad") return <Community />;
  if (path === "/app/mensajes") return <Messages />;
  if (path === "/app/notificaciones") return <Notifications />;
  if (path === "/app/guia") return <Guide />;
  if (path === "/app/configuracion") return <SettingsPage />;
  return <NotFound app />;
}

/** Los seis niveles de la comunidad, con su meta de puntos y su icono. */
const LEVELS: Array<[number, string, LucideIcon]> = [
  [0, "Semilla", Sprout],
  [100, "Brote", Leaf],
  [250, "Vecino activo", Handshake],
  [450, "Colaboradora", Dumbbell],
  [750, "Guardiana comunitaria", ShieldCheck],
  [1100, "Faro de la comunidad", Star],
];

function getLevel(total: number) {
  let index = 0;
  LEVELS.forEach((l, i) => {
    if (total >= l[0]) index = i;
  });
  const result = LEVELS[index];
  const next = LEVELS[index + 1];
  return {
    name: result[1],
    icon: result[2],
    number: index + 1,
    total: LEVELS.length,
    start: result[0],
    progress: next
      ? Math.min(100, ((total - result[0]) / (next[0] - result[0])) * 100)
      : 100,
    next: next?.[0],
    nextName: next?.[1],
  };
}

/** Camino de niveles estilo Duolingo: recorrido claro, actual y bloqueado. */
function LevelPath() {
  const { state, navigate } = useStore();
  const level = getLevel(state.user.totalEarned);
  const LevelIcon = level.icon;
  return (
    <section className="card overflow-hidden p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">
            <Map size={13} /> Tu camino en AYNI
          </span>
          <h2 className="font-editorial mt-3 text-2xl font-extrabold">Niveles de comunidad</h2>
        </div>
        <div className="rounded-2xl bg-[var(--turquesa)]/25 px-3 py-2 text-right">
          <span className="block text-[10px] font-extrabold uppercase tracking-[.1em] text-[var(--ink-2)]">
            Nivel {level.number} de {level.total}
          </span>
          <strong className="inline-flex items-center gap-1.5 text-sm">
            <LevelIcon size={15} /> {level.name}
          </strong>
        </div>
      </div>

      <div className="level-path mt-6 pt-1">
        {LEVELS.map(([points, name, NodeIcon], i) => {
          const reached = state.user.totalEarned >= points;
          const current = i + 1 === level.number;
          return (
            <div
              key={name}
              className={`level-node ${reached ? "reached" : ""} ${current ? "current" : ""}`}
              aria-current={current ? "step" : undefined}
            >
              <span className="level-node-dot" aria-hidden="true">
                {reached && !current ? (
                  <Check size={16} strokeWidth={3} />
                ) : reached ? (
                  <NodeIcon size={17} />
                ) : (
                  <LockKeyhole size={15} />
                )}
              </span>
              <span className="level-node-label">{name}</span>
              <span className="level-node-pts">{points} pts</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--surface-3)] p-4">
        <p className="text-xs font-semibold text-[var(--ink-2)]">
          {level.next
            ? `Te faltan ${level.next - state.user.totalEarned} pts para llegar a ${level.nextName}.`
            : "¡Llegaste al nivel máximo! Sigue compartiendo con tu comunidad."}
        </p>
        <button
          className="btn-secondary min-h-9 px-4 text-xs"
          onClick={() => navigate("/app/retos")}
        >
          Ganar puntos <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}

function HomePage({ openPublish }: { openPublish: () => void }) {
  const { state, navigate } = useStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const level = getLevel(state.user.totalEarned);
  const opportunities =
    state.favors.filter((f) => f.status !== "Validada").length +
    state.donations.filter((d) => d.status === "Disponible").length +
    state.swaps.filter((s) => s.status !== "Completado").length;
  const actions = [
    ["Servicios Cercanos", "Talento recomendado", "var(--turquesa)", Wrench, "/app/servicios"],
    ["AYNI Conecta", "Trueques inteligentes", "var(--malva)", HeartHandshake, "/app/conecta"],
    ["Modo Faro", "Apoyo urgente vecinal", "var(--terracota)", AlertTriangle, "/app/faro"],
    ["Gana con Retos", "Aprende y ayuda", "var(--oro)", Trophy, "/app/retos"],
    ["Donaciones", "Comparte recursos", "var(--ichu)", Gift, "/app/donaciones"],
  ];
  const kpis = [
    {
      label: "Puntos Ayni",
      value: state.user.points,
      foot: "Ver catálogo",
      icon: Coins,
      route: "/app/puntos",
      tint: "var(--terracota)",
    },
    {
      label: `Nivel ${level.number}`,
      value: level.name,
      foot: `${Math.round(level.progress)}% del siguiente nivel`,
      icon: Trophy,
      route: "/app/perfil",
      tint: "var(--oro)",
      progress: level.progress,
    },
    {
      label: "Reputación",
      value: `${state.user.reputation.toFixed(1)}`,
      foot: "Promedio de valoraciones",
      icon: Star,
      route: "/app/perfil",
      tint: "var(--malva)",
    },
  ];

  return (
    <div className="stagger space-y-7">
      <section className="relative overflow-hidden rounded-[30px] bg-[image:var(--grad-ciruela)] p-6 text-white shadow-[var(--shadow)] md:p-9">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-45" />
        <div
          aria-hidden="true"
          className="hero-glow -right-20 -top-24 size-80 bg-[var(--oro)]/35"
        />
        <div
          aria-hidden="true"
          className="hero-glow -bottom-24 left-1/3 size-64 bg-[var(--lavanda)]/40"
        />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.09em] text-white/75">
              <Sparkles size={13} className="text-[var(--oro)]" />
              {new Intl.DateTimeFormat("es-PE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date())}
            </p>
            <h1 className="font-editorial mt-4 text-[2rem] font-extrabold leading-[1.03] md:text-[2.9rem]">
              {greeting}, {state.user.name}.
            </h1>
            <p className="mt-2 text-lg font-bold text-[var(--oro)] md:text-xl">
              Tu comunidad te espera.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
              Hay <strong className="font-extrabold text-white">{opportunities} oportunidades</strong>{" "}
              activas cerca de ti, en tu zona aproximada de Chimbote.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="btn-action" onClick={() => navigate("/app/explorar")}>
                Explorar oportunidades <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary border-white/30! text-white! hover:bg-white/10!"
                onClick={openPublish}
              >
                <Plus size={17} /> Publicar algo
              </button>
            </div>
          </div>

          <div className="profile-mist w-full rounded-3xl p-5 md:w-[16.5rem]">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--ciruela)] text-base font-extrabold text-[var(--oro)] shadow-sm">
                {initials(state.user.name, state.user.surname)}
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm leading-tight text-[var(--ciruela)]">
                  {state.user.name} {state.user.surname}
                </strong>
                <small className="block truncate text-[11px] font-semibold text-[var(--ciruela)]/65">
                  {level.name}
                </small>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--ciruela)]/60">
                  Puntos Ayni
                </span>
                <strong className="tabular text-2xl leading-none text-[var(--ciruela)]">
                  {state.user.points}
                </strong>
              </div>
              <div className="progress mt-2">
                <span style={{ width: `${level.progress}%` }} />
              </div>
              <p className="mt-2 text-[11px] font-semibold leading-snug text-[var(--ciruela)]/65">
                {level.next
                  ? `Te faltan ${level.next - state.user.totalEarned} pts para el siguiente nivel`
                  : "Nivel máximo alcanzado"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {kpis.map(({ label, value, foot, icon: Icon, route, tint, progress }) => (
          <button
            key={label}
            className="card stat-card interactive p-5 text-left"
            onClick={() => navigate(route)}
          >
            <Icon style={{ color: tint }} />
            <p className="mt-3 text-[10.5px] font-extrabold uppercase tracking-[.1em] text-[var(--muted)]">
              {label}
            </p>
            <strong className="font-editorial mt-1 block text-[1.75rem] font-extrabold leading-tight">
              {value}
            </strong>
            {typeof progress === "number" ? (
              <div className="progress mt-2.5">
                <span style={{ width: `${progress}%` }} />
              </div>
            ) : (
              <span className="mt-1.5 flex items-center gap-1 text-xs font-bold text-[var(--malva)]">
                {foot} <ArrowRight size={13} />
              </span>
            )}
            {typeof progress === "number" && (
              <span className="mt-1.5 block text-[11px] font-semibold text-[var(--muted)]">
                {foot}
              </span>
            )}
          </button>
        ))}
      </section>

      <LevelPath />

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Acciones rápidas</span>
            <h2 className="font-editorial mt-3 text-2xl font-extrabold md:text-[1.75rem]">
              ¿Qué necesitas hoy?
            </h2>
          </div>
          <button
            className="text-sm font-extrabold text-[var(--malva)] transition hover:text-[var(--ciruela)]"
            onClick={() => navigate("/app/explorar")}
          >
            Ver todos los módulos →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {actions.map(([title, desc, color, I, route]) => {
            const Icon = I as typeof Wrench;
            return (
              <button
                key={title as string}
                className="action-tile interactive min-h-48 rounded-3xl p-4 text-left flex flex-col"
                style={{ ["--tile" as string]: color as string }}
                onClick={() => navigate(route as string)}
              >
                <div className="action-icon-wrap mb-3 mx-auto shrink-0">
                  <Icon size={28} />
                </div>
                <h3 className="mt-1 text-[1rem] font-extrabold leading-tight text-center">
                  {title as string}
                </h3>
                <p className="mt-1 text-xs leading-snug opacity-80 text-center line-clamp-2">
                  {desc as string}
                </p>
              </button>
            );
          })}
          <button
            className="action-tile interactive min-h-48 rounded-3xl p-4 text-left flex flex-col"
            style={{ ["--tile" as string]: "var(--arena)" }}
            onClick={openPublish}
          >
            <div className="action-icon-wrap mb-3 mx-auto shrink-0">
              <Plus size={28} />
            </div>
            <h3 className="mt-1 text-[1rem] font-extrabold leading-tight text-center">Publicar</h3>
            <p className="mt-1 text-xs leading-snug opacity-80 text-center line-clamp-2">
              Comparte en 3 pasos
            </p>
          </button>
        </div>
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-editorial text-2xl font-extrabold">Para ti en Chimbote</h2>
            {DEMO}
          </div>
          <Carousel />
        </div>
        <div className="card flex min-w-0 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-editorial text-xl font-extrabold">Actividad reciente</h2>
            <button
              className="text-xs font-extrabold text-[var(--malva)]"
              onClick={() => navigate("/app/perfil")}
            >
              Ver todo
            </button>
          </div>
          <div className="mt-4 flex-1 space-y-1">
            {state.movements.slice(0, 5).map((m) => (
              <div key={m.id} className="activity-row flex items-start gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full ${m.points > 0 ? "bg-[var(--ichu)]/25 text-[var(--ichu)]" : "bg-[var(--terracota)]/18 text-[var(--terracota)]"}`}
                >
                  <Zap size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-tight">{m.label}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                    {m.type} ·{" "}
                    <strong className={m.points > 0 ? "text-[var(--ichu)]" : "text-[var(--terracota)]"}>
                      {m.points > 0 ? "+" : ""}
                      {m.points} pts
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-[var(--line)] pt-3 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
            Demostrativo · datos locales
          </p>
        </div>
      </section>
    </div>
  );
}

function ExplorePage() {
  const { state, navigate } = useStore();
  const query = new URLSearchParams(state.route.split("?")[1] ?? "").get("q")?.trim() ?? "";
  const term = query.toLowerCase();
  const modules = [
    {
      title: "Servicios Cercanos",
      desc: "Directorio de profesionales recomendados por vecinos.",
      color: "var(--turquesa)",
      icon: Wrench,
      route: "/app/servicios",
      light: false,
    },
    {
      title: "AYNI Conecta",
      desc: "Coincidencias de trueque y cadenas de tres personas.",
      color: "var(--malva)",
      icon: HeartHandshake,
      route: "/app/conecta",
      light: true,
    },
    {
      title: "Modo Faro",
      desc: "Coordinación vecinal ante una necesidad urgente.",
      color: "var(--terracota)",
      icon: AlertTriangle,
      route: "/app/faro",
      light: true,
    },
    {
      title: "Retos Ayni",
      desc: "Aprende jugando y gana puntos.",
      color: "var(--oro)",
      icon: Trophy,
      route: "/app/retos",
      light: false,
    },
    {
      title: "Donaciones",
      desc: "Comparte recursos en tu zona.",
      color: "var(--ichu)",
      icon: Gift,
      route: "/app/donaciones",
      light: true,
    },
    {
      title: "Mapa Comunitario",
      desc: "Ubicaciones aproximadas, nunca exactas.",
      color: "var(--oliva)",
      icon: Map,
      route: "/app/mapa",
      light: true,
    },
    {
      title: "Cadena de Favores",
      desc: "Ayuda que vuelve a circular.",
      color: "var(--arena)",
      icon: HandHeart,
      route: "/app/favores",
      light: false,
    },
    {
      title: "Comunidad",
      desc: "Grupos y actividades vecinales.",
      color: "var(--lavanda)",
      icon: Users,
      route: "/app/comunidad",
      light: false,
    },
    {
      title: "Puntos Canjeables",
      desc: "Catálogo de recompensas ficticias.",
      color: "var(--uva)",
      icon: Coins,
      route: "/app/puntos",
      light: true,
    },
  ];
  const matchedModules = modules.filter((m) =>
    `${m.title} ${m.desc}`.toLowerCase().includes(term),
  );
  const results = term
    ? [
        ...state.challenges
          .filter((c) => `${c.title} ${c.description} ${c.category}`.toLowerCase().includes(term))
          .map((c) => ({
            title: c.title,
            meta: `${c.category} · ${c.difficulty}`,
            route: "/app/retos",
            kind: "Reto",
          })),
        ...state.rewards
          .filter((r) => `${r.name} ${r.description} ${r.category}`.toLowerCase().includes(term))
          .map((r) => ({
            title: r.name,
            meta: `${r.category} · ${r.points} pts`,
            route: "/app/puntos",
            kind: "Recompensa",
          })),
        ...state.favors
          .filter((f) => `${f.title} ${f.owner} ${f.status}`.toLowerCase().includes(term))
          .map((f) => ({
            title: f.title,
            meta: `${f.owner} · ${f.status}`,
            route: "/app/favores",
            kind: "Favor",
          })),
        ...state.donations
          .filter((d) => `${d.title} ${d.owner} ${d.status}`.toLowerCase().includes(term))
          .map((d) => ({
            title: d.title,
            meta: `${d.owner} · ${d.status}`,
            route: "/app/donaciones",
            kind: "Donación",
          })),
        ...state.swaps
          .filter((s) => `${s.title} ${s.partner} ${s.status}`.toLowerCase().includes(term))
          .map((s) => ({
            title: s.title,
            meta: `${s.partner} · ${s.status}`,
            route: "/app/conecta",
            kind: "Trueque",
          })),
        ...PROFESSIONALS.filter((p) => p.join(" ").toLowerCase().includes(term)).map((p) => ({
          title: p[0],
          meta: `${p[1]} · ${p[2]}`,
          route: "/app/servicios",
          kind: "Servicio",
        })),
      ]
    : [];

  return (
    <div>
      <header className="max-w-3xl">
        <span className="eyebrow">Explorar</span>
        <h1 className="section-title mt-4">
          Todo AYNI en un solo <em className="not-italic text-[var(--terracota)]">lugar.</em>
        </h1>
        <p className="lede mt-4">
          Elige una forma de aprender, compartir o colaborar en Chimbote. Todos los datos son
          demostrativos.
        </p>
        {query && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="chip active">
              {query}
              <button
                aria-label="Limpiar búsqueda"
                className="ml-1 grid size-5 place-items-center rounded-full bg-white/20"
                onClick={() => navigate("/app/explorar")}
              >
                <X size={12} />
              </button>
            </span>
            <span className="text-sm font-semibold text-[var(--muted)]">
              {results.length} {results.length === 1 ? "resultado" : "resultados"}
            </span>
          </div>
        )}
      </header>

      {query && results.length > 0 && (
        <section className="mt-9">
          <h2 className="font-editorial text-xl font-bold">Coincidencias</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {results.slice(0, 24).map((r) => (
              <button
                key={`${r.kind}-${r.title}`}
                className="surface flex items-center gap-3 p-3.5 text-left transition hover:border-[var(--malva)] hover:shadow-[var(--shadow-soft)]"
                onClick={() => navigate(r.route)}
              >
                <span className="chip shrink-0 text-[11px]">{r.kind}</span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{r.title}</strong>
                  <small className="block truncate text-[var(--muted)]">{r.meta}</small>
                </span>
                <ArrowRight size={15} className="shrink-0 text-[var(--muted-2)]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {query && !results.length && !matchedModules.length && (
        <Empty
          title="Sin resultados"
          text={`No encontramos nada para “${query}”. Prueba con otra palabra.`}
          action="Ver todos los módulos"
          onAction={() => navigate("/app/explorar")}
        />
      )}

      <section className="mt-9">
        {query && <h2 className="font-editorial text-xl font-bold">Módulos</h2>}
        <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${query ? "mt-4" : "mt-8"}`}>
          {matchedModules.map(({ title, desc, color, icon: Icon, route, light }) => (
            <button
              key={title}
              className="interactive pattern-light relative overflow-hidden rounded-[26px] p-6 text-left"
              style={{ background: color, color: light ? "#fff" : "var(--ciruela)" }}
              onClick={() => navigate(route)}
            >
              <span
                className={`grid size-12 place-items-center rounded-2xl ${light ? "bg-white/20" : "bg-white/40"}`}
              >
                <Icon size={22} />
              </span>
              <h2 className="font-editorial mt-9 text-[1.35rem] font-bold leading-tight">{title}</h2>
              <p className={`mt-1.5 text-sm leading-6 ${light ? "text-white/85" : "opacity-80"}`}>
                {desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold">
                Abrir módulo <ArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Challenges() {
  const { state } = useStore();
  const [category, setCategory] = useState("Todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [game, setGame] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("Todas");
  const cats = [
    "Todas",
    "Solidaridad",
    "Medioambiente",
    "Habilidades",
    "Prevención",
    "Apoyo vecinal",
    "Finanzas",
    "En familia",
  ];
  const filtered = state.challenges.filter(
    (c) =>
      (category === "Todas" || c.category === category) &&
      (difficulty === "Todas" || c.difficulty === difficulty) &&
      c.title.toLowerCase().includes(query.toLowerCase()),
  );
  const challenge = state.challenges.find((c) => c.id === selected);
  return (
    <div>
      <header className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#ecc274_0%,#e0b15a_48%,#d69b4d_100%)] p-6 shadow-[var(--shadow)] md:p-9">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-45" />
        <div aria-hidden="true" className="hero-glow -right-16 -top-24 size-72 bg-white/45" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="eyebrow border-white/60! bg-white/70!">
              <Trophy size={14} /> Corazón del producto
            </span>
            <h1 className="font-editorial mt-4 text-[2.05rem] font-extrabold leading-[1.02] md:text-[3rem]">
              ¿Listo para ayudar?
            </h1>
            <p className="mt-3 max-w-xl text-[0.98rem] leading-7 text-[var(--ink-2)]">
              Primero aprende jugando. Después transforma lo aprendido en una ayuda para tu
              comunidad.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--ciruela)]/12 bg-white/55 px-3 py-1.5 text-xs font-extrabold text-[var(--ciruela)]">
                {state.challenges.filter((c) => c.completed).length} de {state.challenges.length}{" "}
                retos superados
              </span>
              <span className="rounded-full border border-[var(--ciruela)]/12 bg-white/55 px-3 py-1.5 text-xs font-extrabold text-[var(--ciruela)]">
                {state.user.hours} horas vecinales
              </span>
            </div>
          </div>
          <div className="rounded-3xl bg-[var(--ciruela)] p-5 text-white shadow-[var(--shadow)] md:min-w-[12.5rem]">
            <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white/45">
              Tu saldo
            </p>
            <strong className="font-editorial tabular mt-1 block text-[2.4rem] leading-none text-[var(--oro)]">
              {state.user.points}
              <span className="ml-1 text-base">pts</span>
            </strong>
            <div className="progress mt-3">
              <span
                style={{
                  width: `${(state.challenges.filter((c) => c.completed).length / Math.max(1, state.challenges.length)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative">
          <span className="sr-only">Buscar un reto</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            size={18}
          />
          <input
            className="field pl-11"
            placeholder="Buscar un reto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          className="field sm:w-56"
          aria-label="Dificultad"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Todas">Todas las dificultades</option>
          <option value="Fácil">Fácil</option>
          <option value="Media">Media</option>
        </select>
      </div>
      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-2">
        {cats.map((c) => (
          <button
            key={c}
            className={`chip whitespace-nowrap ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c, i) => (
          <article key={c.id} className="card flex flex-col overflow-hidden">
            <ChallengeArt id={c.id} title={c.title} className="challenge-media card-rotate">
              <span className="challenge-category" style={{ background: CHALLENGE_CAT_COLOR[c.category] || "var(--malva)" }}>
                {c.category}
              </span>
            </ChallengeArt>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-editorial text-[1.2rem] font-extrabold leading-tight">
                  {c.title}
                </h2>
                {c.completed && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--ichu)]/18 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[var(--ichu)]">
                    <Check size={11} strokeWidth={3} /> Hecho
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {c.description}
              </p>
              <div className="mt-4 flex items-center gap-2.5 text-[11px] font-bold text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {c.duration}
                </span>
                <span aria-hidden="true" className="size-1 rounded-full bg-[var(--line-strong)]" />
                <span>{c.difficulty}</span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
                <span className="text-xs font-extrabold text-[var(--terracota)]">
                  +40 pts <span className="font-semibold text-[var(--muted)]">+30 al ayudar</span>
                </span>
                <button
                  className="btn-primary min-h-9 px-4 text-xs"
                  onClick={() => setSelected(c.id)}
                >
                  {c.completed ? "Practicar" : "Ver reto"} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          title="No encontramos retos"
          text="Prueba otra categoría o limpia la búsqueda."
          action="Ver todos"
          onAction={() => {
            setCategory("Todas");
            setQuery("");
          }}
        />
      )}
      <Modal
        open={!!challenge && !game}
        onClose={() => setSelected(null)}
        title={challenge?.title || ""}
      >
        <span className="eyebrow">{challenge?.category}</span>
        <p className="mt-5 text-[0.98rem] leading-7 text-[var(--ink-2)]">
          {challenge?.description}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="surface p-4">
            <Clock size={18} className="text-[var(--malva)]" />
            <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
              Duración
            </span>
            <strong className="block text-sm">{challenge?.duration}</strong>
          </div>
          <div className="surface p-4">
            <Coins size={18} className="text-[var(--terracota)]" />
            <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
              Recompensa
            </span>
            <strong className="block text-sm">Hasta 50 puntos</strong>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-[var(--lavanda)]/40 bg-[var(--lavanda)]/15 p-4 text-sm leading-6">
          <strong className="flex items-center gap-2 text-[var(--ciruela)]">
            <HelpCircle size={15} /> Cómo funciona
          </strong>
          <p className="mt-1.5 text-[var(--ink-2)]">
            Responde 3 preguntas y gana hasta 50 puntos. Necesitas 2 respuestas correctas para
            superar el reto; si no lo logras, igual sumas 10 puntos por completar el intento y
            puedes volver a intentarlo las veces que quieras.
          </p>
        </div>
        <button className="btn-action mt-5 w-full" onClick={() => setGame(challenge?.id || null)}>
          Comenzar reto <ArrowRight size={18} />
        </button>
      </Modal>
      <ChallengeGame
        key={game ?? "closed"}
        challengeId={game}
        onClose={() => {
          setGame(null);
          setSelected(null);
        }}
      />
    </div>
  );
}

const CONFETTI_COLORS = [
  "var(--oro)",
  "var(--terracota)",
  "var(--turquesa)",
  "var(--lavanda)",
  "var(--ichu)",
  "var(--malva)",
];

/** Serpentinas que brotan de las esquinas del modal y se apagan a los 4 s. */
function ConfettiBurst() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="confetti-burst" aria-hidden="true">
      {Array.from({ length: 52 }).map((_, i) => {
        const fromLeft = i % 2 === 0;
        const longStreamer = i % 5 !== 0;
        const size = longStreamer ? 5 + (i % 3) * 2 : 9 + (i % 3) * 3;
        const pieceHeight = longStreamer ? 24 + (i % 3) * 7 : 12 + (i % 3) * 3;
        const dx = (fromLeft ? 1 : -1) * (48 + ((i * 23) % 290));
        const rise = -(220 + ((i * 31) % 170));
        const duration = 2.7 + (i % 5) * 0.16;
        return (
          <span
            key={i}
            className="confetti-streamer"
            style={{
              left: fromLeft ? `${5 + ((i * 7) % 12)}%` : "auto",
              right: fromLeft ? "auto" : `${5 + ((i * 11) % 12)}%`,
              width: `${size}px`,
              height: `${pieceHeight}px`,
              borderRadius: longStreamer ? "999px" : "3px",
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              ["--dx" as string]: `${dx}px`,
              ["--rise" as string]: `${rise}px`,
              ["--rot" as string]: `${240 + (i % 7) * 90}deg`,
              ["--confetti-duration" as string]: `${duration}s`,
              animationDelay: `${(i % 10) * 0.05}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Emblema de resultado: victoria o “puedes mejorar”. */
function VictoryEmblem({ variant = "win" }: { variant?: "win" | "lose" }) {
  const isLose = variant === "lose";
  return (
    <div className={`victory-scene ${isLose ? "victory-scene-lose" : ""}`} aria-hidden="true">
      <span className="victory-rays" />
      <span className="victory-glow" />
      <span className="victory-badge-float">
        <img
          src={isLose ? "/retos/improve-badge.svg" : "/retos/victory-badge.svg"}
          alt=""
          className="victory-badge"
          decoding="async"
        />
      </span>
      <Sparkles className="victory-spark victory-spark-1" size={20} />
      <Sparkles className="victory-spark victory-spark-2" size={15} />
      <Sparkles className="victory-spark victory-spark-3" size={18} />
      <span className="victory-dot victory-dot-1" />
      <span className="victory-dot victory-dot-2" />
      <span className="victory-dot victory-dot-3" />
      <span className="victory-dot victory-dot-4" />
    </div>
  );
}

function ChallengeGame({
  challengeId,
  onClose,
}: {
  challengeId: string | null;
  onClose: () => void;
}) {
  const { state, update, navigate } = useStore();
  const challenge = state.challenges.find((c) => c.id === challengeId);
  const script = challenge ? CHALLENGE_GAMES[challenge.id] ?? GENERIC_GAME : null;
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const [earned, setEarned] = useState(0);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [opportunity, setOpportunity] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);

  if (!challenge || !script) return null;

  const total = script.questions.length;
  const current = script.questions[round];
  const correctSoFar = answers.filter(
    (value, index) => index < round && value === script.questions[index].correct,
  ).length;
  const currentDelta = checked && selected === current.correct ? 1 : 0;

  const check = () => {
    if (selected === null || checked) return;
    setChecked(true);
    setAnswers((previous) => {
      const next = [...previous];
      next[round] = selected;
      return next;
    });
  };

  const finish = () => {
    const finalAnswers = [...answers];
    finalAnswers[round] = selected ?? -1;
    const correct = finalAnswers.filter(
      (value, index) => value === script.questions[index].correct,
    ).length;
    const won = correct >= Math.ceil(total * (2 / 3));
    const perfect = correct === total;
    const points = won ? 40 + (perfect ? 10 : 0) : 10;
    const target = state.challenges.find((c) => c.id === challenge.id)!;
    const firstWin = won && !target.completed;
    const participation = !won && !target.completed && !target.attempted;
    const awarded = firstWin || participation ? points : 0;

    setOutcome(won ? "win" : "lose");
    setPhase("result");
    setEarned(awarded);
    setAlreadyDone(!!target.completed);

    update(
      (s) => {
        const c = s.challenges.find((x) => x.id === challenge.id)!;
        if (firstWin) {
          c.completed = true;
          c.score = correct;
          addMovement(s, "Reto", challenge.title, points);
          addNotification(
            s,
            "Reto superado",
            `Ganaste ${points} puntos en ${challenge.title}.`,
            "/app/retos",
            "retos",
          );
        } else if (participation) {
          c.attempted = true;
          addMovement(s, "Reto", `Intento: ${challenge.title}`, points);
          addNotification(
            s,
            "Puntos por intentarlo",
            `Sumaste ${points} puntos. Vuelve a practicar para superar el reto.`,
            "/app/retos",
            "retos",
          );
        }
      },
      firstWin
        ? `Reto superado: +${points} puntos`
        : participation
          ? `Puntos por intentarlo: +${points}`
          : won
            ? "Modo práctica: sin puntos adicionales"
            : "Casi lo logras: vuelve a intentarlo",
    );
  };

  const next = () => {
    if (round < total - 1) {
      setRound(round + 1);
      setSelected(null);
      setChecked(false);
    } else {
      finish();
    }
  };

  const retry = () => {
    setPhase("quiz");
    setRound(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setOutcome(null);
    setEarned(0);
    setOpportunity(false);
    setAccepted(false);
    setDone(false);
  };

  const validateHelp = () =>
    update((s) => {
      const c = s.challenges.find((x) => x.id === challenge.id)!;
      if (!c.helped) {
        c.helped = true;
        s.user.hours += 1;
        addMovement(s, "Ayuda", `Ayuda vecinal: ${challenge.title}`, 30);
        addNotification(
          s,
          "Ayuda validada",
          "Ganaste 30 puntos y 1 hora vecinal.",
          "/app/puntos",
          "horas",
        );
      }
    }, "Ayuda validada: +30 puntos y +1 hora vecinal");

  return (
    <Modal
      open={!!challengeId}
      onClose={onClose}
      title={opportunity ? "Oportunidad vecinal" : challenge.title}
      wide
    >
      {phase === "quiz" && !opportunity && (
        <div className="page-enter">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--muted)]">
                Pregunta {round + 1} de {total}
              </p>
              <p className="mt-0.5 text-sm font-bold">
                {correctSoFar + currentDelta} correctas
              </p>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {script.questions.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-9 rounded-full transition-colors ${
                    index < round
                      ? "bg-[var(--ichu)]"
                      : index === round
                        ? "bg-[var(--terracota)]"
                        : "bg-[var(--line-strong)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <ComicStage id={challenge.id} text={current.prompt} compact />

          <div className="comic-options mt-4">
            {current.options.map((option, index) => {
              const isCorrect = checked && index === current.correct;
              const isWrong = checked && selected === index && index !== current.correct;
              const isSelected = selected === index;
              return (
                <button
                  key={option}
                  disabled={checked}
                  aria-pressed={isSelected}
                  className={`comic-option ${isSelected && !checked ? "selected" : ""} ${
                    isCorrect ? "correct" : ""
                  } ${isWrong ? "wrong" : ""}`}
                  onClick={() => setSelected(index)}
                >
                  <span
                    className="comic-option-avatar"
                    style={{ background: OPTION_TINTS[index % OPTION_TINTS.length] }}
                    aria-hidden="true"
                  >
                    {isCorrect ? (
                      <Check size={18} strokeWidth={3} />
                    ) : isWrong ? (
                      <X size={18} strokeWidth={3} />
                    ) : (
                      <UserRound size={18} />
                    )}
                  </span>
                  <span className="comic-option-copy">
                    <span className="comic-option-label">Opción {index + 1}</span>
                    <span className="comic-option-text">{option}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {checked && (
            <div
              aria-live="polite"
              className={`mt-4 rounded-2xl border p-4 ${
                selected === current.correct
                  ? "border-[var(--ichu)]/35 bg-[var(--ichu)]/12"
                  : "border-[var(--terracota)]/30 bg-[var(--terracota)]/10"
              }`}
            >
              <strong className="flex items-center gap-2 text-sm">
                {selected === current.correct ? (
                  <Check size={16} className="text-[var(--ichu)]" />
                ) : (
                  <X size={16} className="text-[var(--terracota)]" />
                )}
                {selected === current.correct ? "¡Muy bien!" : "Aún no."}
              </strong>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-2)]">
                {current.explanation}
              </p>
            </div>
          )}

          <button
            className="btn-action mt-5 w-full"
            disabled={selected === null}
            onClick={checked ? next : check}
          >
            {checked
              ? round === total - 1
                ? "Ver mi resultado"
                : "Siguiente pregunta"
              : "Comprobar respuesta"}
          </button>
        </div>
      )}

      {phase === "result" && !opportunity && outcome === "win" && (
        <div className="page-enter relative overflow-hidden text-center">
          <ConfettiBurst />
          <VictoryEmblem />
          <p className="eyebrow justify-center">Reto superado</p>
          <h3 className="font-editorial mt-3 text-3xl font-extrabold md:text-4xl">
            {script.winPhrase}
          </h3>
          <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
            {correctSoFar + currentDelta} de {total} respuestas correctas
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--oro)]/25 px-4 py-2 text-sm font-extrabold text-[var(--ciruela)]">
            <Coins size={16} />
            {earned > 0 ? `+${earned} puntos Ayni` : "Modo práctica · sin puntos extra"}
          </div>
          {correctSoFar + currentDelta === total && (
            <p className="chip mx-auto mt-3 w-fit bg-[var(--oro)]">
              <Star size={13} /> Insignia “Reto perfecto”
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button className="btn-action" onClick={() => setOpportunity(true)}>
              Buscar oportunidad vecinal <ArrowRight size={17} />
            </button>
            <button className="btn-ghost" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {phase === "result" && !opportunity && outcome === "lose" && (
        <div className="page-enter text-center">
          <VictoryEmblem variant="lose" />
          <p className="eyebrow justify-center">Puedes mejorar</p>
          <h3 className="font-editorial mt-3 text-3xl font-extrabold md:text-4xl">
            ¡Casi lo logras!
          </h3>
          <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
            Acertaste {answers.filter((value, index) => value === script.questions[index].correct).length}{" "}
            de {total}. Necesitas 2 para superar el reto.
          </p>

          <div className="mt-5 rounded-2xl border border-[var(--turquesa)]/50 bg-[var(--turquesa)]/20 p-4 text-left">
            <strong className="flex items-center gap-2 text-sm text-[var(--ciruela)]">
              <Sparkles size={16} /> Cómo puedes mejorar
            </strong>
            <p className="mt-1.5 text-sm leading-6 text-[var(--ink-2)]">{script.loseTip}</p>
          </div>

          <ul className="mt-3 space-y-2 text-left">
            {script.questions.map((question, index) => {
              const ok = answers[index] === question.correct;
              return (
                <li
                  key={question.prompt}
                  className={`flex items-start gap-2 rounded-xl p-3 text-xs leading-5 ${
                    ok
                      ? "bg-[var(--ichu)]/12 text-[var(--ink-2)]"
                      : "bg-[var(--terracota)]/8 text-[var(--ink-2)]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white ${
                      ok ? "bg-[var(--ichu)]" : "bg-[var(--terracota)]"
                    }`}
                  >
                    {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                  </span>
                  <span>
                    <strong className="block">
                      {ok ? "¡Correcto!" : `La respuesta era: ${question.options[question.correct]}`}
                    </strong>
                    {question.explanation}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--oro)]/20 px-4 py-2 text-sm font-extrabold text-[var(--ciruela)]">
            <Coins size={16} />
            {earned > 0
              ? `+${earned} puntos por completar el intento`
              : alreadyDone
                ? "Ya completaste este reto antes"
                : "Sin puntos extra en este intento"}
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button className="btn-action" onClick={retry}>
              Volver a jugar <ArrowRight size={17} />
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Ahora no
            </button>
          </div>
        </div>
      )}

      {opportunity && !done && (
        <div className="page-enter">
          <div className="rounded-3xl bg-[var(--arena)]/55 p-6">
            <span className="demo">A 1.2 km · Demostrativo</span>
            <h3 className="font-editorial mt-4 text-3xl font-bold">
              Apoya una jornada de clasificación
            </h3>
            <p className="mt-3">
              Una familia de Miraflores necesita orientación para separar papel, plástico y
              orgánicos. Sin nombres completos ni dirección exacta.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              <li>Coordina siempre dentro de AYNI.</li>
              <li>Elige un espacio comunitario y horario seguro.</li>
              <li>No compartas datos personales.</li>
            </ul>
          </div>
          {!accepted ? (
            <button className="btn-action mt-5 w-full" onClick={() => setAccepted(true)}>
              Aceptar oportunidad
            </button>
          ) : (
            <div className="mt-5 rounded-2xl bg-[var(--turquesa)]/30 p-5">
              <strong>Pendiente de realización</strong>
              <p className="mt-2">Participante aceptó · Beneficiario pendiente</p>
              <button className="btn-primary mt-4 w-full" onClick={() => setDone(true)}>
                Ya realicé la actividad
              </button>
            </div>
          )}
          <button className="btn-ghost mt-3 w-full text-xs" onClick={() => setOpportunity(false)}>
            Volver al resultado del reto
          </button>
        </div>
      )}

      {done && (
        <div className="relative overflow-hidden text-center">
          <ConfettiBurst />
          <span className="result-badge win" aria-hidden="true">
            <HeartHandshake size={36} />
          </span>
          <h3 className="font-editorial mt-5 text-4xl font-bold">¡Ayuda confirmada!</h3>
          <p className="mt-3">
            Usa el control demostrativo para completar la confirmación bilateral.
          </p>
          <button
            className="btn-action mt-5"
            onClick={() => {
              validateHelp();
              navigate("/app/puntos");
              onClose();
            }}
          >
            Simular confirmación del beneficiario
          </button>
          <button className="btn-ghost mt-3 w-full text-xs" onClick={onClose}>
            Cerrar
          </button>
        </div>
      )}
    </Modal>
  );
}

function Rewards() {
  const { state, update, navigate } = useStore();
  const [category, setCategory] = useState("Todas");
  const [affordable, setAffordable] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const cats = [
    "Todas",
    "Kits de útiles",
    "Víveres",
    "Clases y asesorías",
    "Actividades familiares",
    "Cupones locales",
  ];
  const items = state.rewards.filter(
    (r) =>
      (category === "Todas" || r.category === category) &&
      (!affordable || r.points <= state.user.points),
  );
  const reward = state.rewards.find((r) => r.id === selected);
  const redeem = () => {
    if (!reward || state.user.points < reward.points || reward.stock < 1) return;
    const generated = `AYNI-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    update((s) => {
      const r = s.rewards.find((x) => x.id === reward.id)!;
      r.stock--;
      addMovement(s, "Canje", reward.name, -reward.points);
      s.redemptions.unshift({
        id: generated,
        reward: reward.name,
        code: generated,
        points: reward.points,
        date: new Date().toISOString(),
      });
      addNotification(
        s,
        "Canje confirmado",
        `Tu código demostrativo es ${generated}.`,
        "/app/puntos",
        "recompensas",
      );
    }, "Canje demostrativo confirmado");
    setCode(generated);
  };
  return (
    <div>
      <header className="relative overflow-hidden rounded-[30px] bg-[var(--uva)] p-6 text-white shadow-[var(--shadow)] md:p-9">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="hero-glow -right-20 -top-24 size-80 bg-[var(--oro)]/25" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="eyebrow">Puntos Canjeables</span>
            <h1 className="font-editorial mt-4 text-[2.05rem] font-extrabold leading-[1.03] md:text-[2.7rem]">
              Tu saldo:{" "}
              <span className="tabular text-[var(--oro)]">{state.user.points} pts</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
              Catálogo ficticio sin convenios ni beneficios reales. Cada canje genera un código
              demostrativo.
            </p>
          </div>
          <button className="btn-action" onClick={() => navigate("/app/retos")}>
            Ganar más puntos <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#ecc274_0%,#e0b15a_100%)] shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-5 p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/55 text-[var(--ciruela)]">
              <Gift size={26} />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[var(--ciruela)]/60">
                Recompensa destacada
              </p>
              <h2 className="font-editorial mt-1 text-2xl font-extrabold leading-tight">
                Kit escolar básico
              </h2>
              <p className="mt-1 text-sm text-[var(--ink-2)]">
                Útiles genéricos para acompañar el aprendizaje.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <strong className="tabular text-2xl font-extrabold text-[var(--ciruela)]">150 pts</strong>
            <button
              className="btn-primary"
              onClick={() => {
                const kit = state.rewards.find((r) => r.name === "Kit escolar básico");
                if (kit) {
                  setSelected(kit.id);
                  setCode("");
                }
              }}
            >
              Canjear <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="scrollbar-none flex flex-1 gap-2 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button
              key={c}
              className={`chip whitespace-nowrap ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          role="switch"
          aria-checked={affordable}
          className={`chip shrink-0 ${affordable ? "active" : ""}`}
          onClick={() => setAffordable(!affordable)}
        >
          <Check size={14} /> Puedo canjear
        </button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((r, i) => {
          const missing = Math.max(0, r.points - state.user.points);
          return (
            <article key={r.id} className="card interactive flex flex-col overflow-hidden">
              <div className="reward-media card-rotate">
                <span className="reward-fallback" aria-hidden="true">
                  <Gift size={54} strokeWidth={1.5} />
                </span>
                <img
                  src={REWARD_IMG[r.name] || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80"}
                  alt={`Imagen real del beneficio ${r.name}`}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.parentElement?.classList.add("img-failed");
                  }}
                />
                <span className="reward-tag" style={{ background: "rgba(255,255,255,0.92)" }}>
                  {r.category}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[var(--ciruela)] shadow-sm">
                  {r.stock} disp.
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[var(--muted)]">
                  {r.category}
                </span>
                <h2 className="font-editorial mt-1.5 text-[1.25rem] font-extrabold leading-tight">
                  {r.name}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {r.description}
                </p>
                <p className="mt-2 text-[11px] font-semibold text-[var(--muted-2)]">
                  Vence: {r.expiry}
                </p>
                <div className="mt-auto pt-5">
                  {missing > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <strong className="tabular text-xl text-[var(--terracota)]">
                          {r.points} pts
                        </strong>
                        <span className="text-[11px] font-bold text-[var(--muted)]">
                          Te faltan {missing}
                        </span>
                      </div>
                      <div className="progress mt-2">
                        <span style={{ width: `${(state.user.points / r.points) * 100}%` }} />
                      </div>
                      <button
                        className="btn-soft mt-3 w-full"
                        onClick={() => navigate("/app/retos")}
                      >
                        Ir a Retos <ArrowRight size={15} />
                      </button>
                    </>
                  ) : (
                    <>
                      <strong className="tabular text-xl text-[var(--terracota)]">
                        {r.points} pts
                      </strong>
                      <button
                        className="btn-primary mt-3 w-full"
                        disabled={!r.stock}
                        onClick={() => {
                          setSelected(r.id);
                          setCode("");
                        }}
                      >
                        Canjear ahora
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {state.redemptions.length > 0 && (
        <section className="card mt-8 p-6">
          <h2 className="font-editorial text-xl font-extrabold">Historial de canjes</h2>
          <div className="mt-4 grid gap-2">
            {state.redemptions.map((x) => (
              <div
                key={x.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white p-3.5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--oro)]/25 text-[var(--terracota)]">
                    <Gift size={15} />
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">{x.reward}</strong>
                    <small className="block truncate text-[11px] text-[var(--muted)]">
                      {x.code}
                    </small>
                  </span>
                </span>
                <span className="tabular text-sm font-extrabold text-[var(--terracota)]">
                  −{x.points} pts
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      <Modal
        open={!!reward}
        onClose={() => setSelected(null)}
        title={code ? "Canje confirmado" : "Confirmar canje"}
      >
        {!code ? (
          <>
            <div className="rounded-2xl border border-[var(--oro)]/50 bg-[var(--oro)]/20 p-5">
              <h3 className="font-editorial text-2xl font-extrabold">{reward?.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-2)]">
                Se descontarán <strong>{reward?.points} puntos</strong> de tu saldo. Este canje y su
                código son demostrativos.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
                <span className="text-xs font-bold text-[var(--muted)]">Saldo resultante</span>
                <strong className="tabular">{state.user.points - (reward?.points || 0)} pts</strong>
              </div>
            </div>
            <button className="btn-action mt-5 w-full" onClick={redeem}>
              Confirmar canje
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto grid size-36 grid-cols-5 gap-1 rounded-xl bg-white p-3 shadow">
              {Array.from({ length: 25 }, (_, i) => (
                <span
                  key={i}
                  className={`${[0, 1, 2, 5, 7, 10, 11, 12, 14, 17, 20, 22, 23, 24].includes(i) ? "bg-[var(--ciruela)]" : "bg-[var(--marfil)]"}`}
                />
              ))}
            </div>
            <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--muted)]">
              QR demostrativo
            </p>
            <code className="mt-2 block rounded-xl bg-[var(--ciruela)] p-3 text-base font-bold text-white">
              {code}
            </code>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              No válido en comercios ni representa un convenio real.
            </p>
            <button className="btn-primary mt-5 w-full" onClick={() => setSelected(null)}>
              Listo
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Profile() {
  const { state, update, navigate } = useStore();
  const [tab, setTab] = useState("Resumen");
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...state.user });
  const level = getLevel(state.user.totalEarned);
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return;
    update((s) => {
      s.user = { ...s.user, ...form };
    }, "Perfil actualizado");
    setEdit(false);
  };
  return (
    <div>
      <header className="relative overflow-hidden rounded-[30px] bg-[image:var(--grad-ciruela)] p-6 text-white shadow-[var(--shadow)] md:p-9">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-45" />
        <div aria-hidden="true" className="hero-glow -right-20 -top-24 size-80 bg-[var(--oro)]/25" />
        <div className="relative flex flex-wrap items-center gap-6">
          <span className="grid size-24 shrink-0 place-items-center rounded-full border-4 border-white/15 bg-[var(--oro)] text-3xl font-extrabold text-[var(--ciruela)] shadow-lg md:size-28">
            {initials(state.user.name, state.user.surname)}
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-white/70">
              <User size={12} /> Perfil · Demostrativo
            </span>
            <h1 className="font-editorial mt-3 truncate text-[1.9rem] font-extrabold leading-tight md:text-[2.5rem]">
              {state.user.name} {state.user.surname}
            </h1>
            {state.user.occupation && (
              <p className="mt-1 text-sm text-white/90">{state.user.occupation}</p>
            )}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {state.user.zone}, Chimbote
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-[var(--oro)] text-[var(--oro)]" />
                {state.user.reputation.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Trophy size={14} /> Nivel {level.number} · {level.name}
              </span>
            </p>
            <div className="mt-4 max-w-md">
              <div className="progress">
                <span style={{ width: `${level.progress}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-white/50">
                {level.next
                  ? `${Math.round(level.progress)}% hacia el siguiente nivel`
                  : "Nivel máximo alcanzado"}
              </p>
            </div>
          </div>
          <button className="btn-action" onClick={() => setEdit(true)}>
            Editar perfil
          </button>
        </div>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          className="card interactive flex items-center gap-4 p-5 text-left"
          onClick={() => setTab("Horas")}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--oro)]/25 text-[var(--terracota)]">
            <Clock size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-[.11em] text-[var(--muted)]">
              Horas vecinales
            </span>
            <strong className="font-editorial tabular block text-2xl leading-tight">
              {state.user.hours} h
            </strong>
            <small className="text-[11px] text-[var(--muted)]">No es dinero</small>
          </span>
        </button>
        <button
          className="card interactive flex items-center gap-4 p-5 text-left"
          onClick={() => navigate("/app/puntos")}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--uva)]/15 text-[var(--uva)]">
            <Coins size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-[.11em] text-[var(--muted)]">
              Puntos canjeables
            </span>
            <strong className="font-editorial tabular block text-2xl leading-tight">
              {state.user.points} pts
            </strong>
            <small className="text-[11px] text-[var(--muted)]">Ver catálogo</small>
          </span>
        </button>
        <button
          className="card interactive flex items-center gap-4 p-5 text-left"
          onClick={() => setTab("Insignias")}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--malva)]/15 text-[var(--malva)]">
            <Star size={22} />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-extrabold uppercase tracking-[.11em] text-[var(--muted)]">
              Insignias
            </span>
            <strong className="font-editorial tabular block text-2xl leading-tight">
              {state.challenges.filter((c) => c.score === 3).length}
            </strong>
            <small className="text-[11px] text-[var(--muted)]">Retos perfectos</small>
          </span>
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Secciones del perfil"
        className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {["Resumen", "Horas", "Puntos", "Insignias", "Habilidades y servicios", "Editar"].map(
          (t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`chip whitespace-nowrap ${tab === t ? "active" : ""}`}
              onClick={() => (t === "Editar" ? setEdit(true) : setTab(t))}
            >
              {t}
            </button>
          ),
        )}
      </div>

      <section className="card mt-5 p-6">
        {tab === "Resumen" && (
          <div>
            <h2 className="font-editorial text-xl font-extrabold">Sobre {state.user.name}</h2>
            {state.user.occupation && (
              <p className="mt-1 text-sm font-extrabold text-[var(--ink-2)]">
                {state.user.occupation}
              </p>
            )}
            <p className="mt-3 text-[0.97rem] leading-7 text-[var(--ink-2)]">
              {state.user.bio ||
                "Campo pendiente: agrega una descripción para que tus vecinos conozcan tus intereses."}
            </p>
            <h3 className="mt-6 text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--muted)]">
              Intereses
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {state.user.interests.map((x) => (
                <span key={x} className="chip">
                  {x}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-4">
              <div>
                <h3 className="text-sm font-extrabold">Completa tu perfil</h3>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  Habilidades y disponibilidad aún no completadas.
                </p>
              </div>
              <button className="btn-soft" onClick={() => setEdit(true)}>
                Completar <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
        {tab === "Horas" && (
          <History
            items={state.movements.filter((m) => m.type === "Ayuda")}
            empty="Todavía no hay ayudas validadas."
          />
        )}
        {tab === "Puntos" && <History items={state.movements} empty="Aún no hay movimientos." />}
        {tab === "Insignias" && (
          <div>
            {state.challenges.filter((c) => c.score === 3).length ? (
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 rounded-2xl bg-[var(--oro)]/30 px-4 py-3 text-sm font-extrabold text-[var(--ciruela)]">
                  <Star size={18} className="fill-[var(--oro)]" /> Reto perfecto
                </span>
              </div>
            ) : (
              <Empty
                title="Tu próxima insignia te espera"
                text="Completa un reto con 3/3 para ganarla."
                action="Ir a Retos"
                onAction={() => navigate("/app/retos")}
              />
            )}
          </div>
        )}
        {tab === "Habilidades y servicios" && (
          <Empty
            title="Comparte una habilidad"
            text="Publica lo que sabes hacer y conecta con tu comunidad."
            action="Explorar servicios"
            onAction={() => navigate("/app/servicios")}
          />
        )}
      </section>
      <Modal open={edit} onClose={() => setEdit(false)} title="Editar perfil">
        <form className="space-y-4" onSubmit={save}>
          <Field
            label="Nombres"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Apellidos"
            value={form.surname}
            onChange={(v) => setForm({ ...form, surname: v })}
          />
          <Field
            label="Ocupación"
            value={form.occupation}
            onChange={(v) => setForm({ ...form, occupation: v })}
            placeholder="Ej. Diseñadora, fontanero, profesora, carpintero…"
          />
          <label className="label">Zona aproximada</label>
          <select
            className="field"
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value })}
          >
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
          <label className="label">Descripción</label>
          <textarea
            className="field min-h-28"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <button className="btn-action w-full">Guardar cambios</button>
        </form>
      </Modal>
    </div>
  );
}

function History({ items, empty }: { items: AyniState["movements"]; empty: string }) {
  return (
    <div>
      {items.length ? (
        <div className="divide-y divide-[var(--line)]">
          {items.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full ${
                    m.points >= 0
                      ? "bg-[var(--ichu)]/18 text-[var(--ichu)]"
                      : "bg-[var(--terracota)]/15 text-[var(--terracota)]"
                  }`}
                >
                  <Zap size={15} />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm">{m.label}</strong>
                  <small className="text-[11px] text-[var(--muted)]">{m.type} · Demostrativo</small>
                </div>
              </div>
              <strong
                className={`tabular shrink-0 text-sm ${
                  m.points >= 0 ? "text-[var(--ichu)]" : "text-[var(--terracota)]"
                }`}
              >
                {m.points > 0 ? "+" : ""}
                {m.points} pts
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[var(--line-strong)] p-5 text-sm text-[var(--muted)]">
          {empty}
        </p>
      )}
    </div>
  );
}

const PROFESSIONALS = [
  ["Don José Pérez", "Gasfitería", "Miraflores", "4.9", "15 años"],
  ["Elena Torres", "Costura", "Bellamar", "4.8", "9 años"],
  ["Marco Ríos", "Carpintería", "Florida", "4.7", "12 años"],
  ["Lucía Mendoza", "Mascotas", "Pensacola", "4.9", "7 años"],
  ["Diego Salazar", "Cerrajería", "Casco Urbano", "4.8", "11 años"],
  ["Patricia Huamán", "Limpieza", "Trapecio", "4.7", "8 años"],
  ["Wilder Cruz", "Transporte", "Nuevo Chimbote", "4.6", "10 años"],
  ["Mariela León", "Tecnología", "21 de Abril", "4.9", "6 años"],
  ["Juan Pérez", "Reparaciones", "Miraflores", "4.9", "8 años"],
  ["Rosa Calderón", "Clases", "Buenos Aires", "5.0", "10 años"],
  ["Carlos Villanueva", "Electricidad", "Bolívar", "4.8", "14 años"],
  ["Ana Reyes", "Belleza", "Bellamar", "4.7", "5 años"],
];

function Services() {
  const { state, update } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const cats = ["Todas", ...Array.from(new Set(PROFESSIONALS.map((p) => p[1])))];
  const filtered = PROFESSIONALS.filter(
    (p) =>
      (category === "Todas" || p[1] === category) &&
      p[0].toLowerCase().includes(query.toLowerCase()),
  );
  const request = () => {
    if (note.trim().length < 8) {
      setError("Describe qué necesitas en al menos 8 caracteres.");
      return;
    }
    update((s) => {
      s.serviceRequests.unshift({
        id: Date.now().toString(),
        professional: selected!,
        status: "Solicitado",
        note,
      });
      addNotification(
        s,
        "Servicio solicitado",
        `${selected} recibió una solicitud demostrativa.`,
        "/app/servicios",
        "servicios",
      );
    }, "Solicitud enviada");
    setSelected(null);
    setNote("");
  };
  const advance = (id: string) =>
    update((s) => {
      const r = s.serviceRequests.find((x) => x.id === id)!;
      const steps = ["Solicitado", "Aceptado", "Realizado", "Valorado"];
      r.status = steps[Math.min(3, steps.indexOf(r.status) + 1)];
      if (r.status === "Valorado") s.user.reputation = 4.9;
    }, "Estado del servicio actualizado");
  return (
    <div>
      <ModuleHeader
        color="var(--turquesa)"
        icon={<Wrench />}
        eyebrow="Servicios Cercanos"
        title="Talento que vive cerca de ti."
        text="Directorio de profesionales ficticios con ubicación aproximada."
      />
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative">
          <span className="sr-only">Buscar profesional</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            size={18}
          />
          <input
            className="field pl-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre…"
          />
        </label>
        <select
          className="field sm:w-56"
          aria-label="Especialidad"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {state.serviceRequests.length > 0 && (
        <section className="card mt-5 p-5">
          <h2 className="font-editorial text-lg font-extrabold">Mis solicitudes</h2>
          <div className="mt-3 grid gap-2">
            {state.serviceRequests.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white p-3.5"
              >
                <div className="min-w-0">
                  <strong className="block truncate text-sm">{r.professional}</strong>
                  <small className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                    <span className="size-1.5 rounded-full bg-[var(--terracota)]" /> {r.status} ·
                    Demostrativo
                  </small>
                </div>
                {r.status !== "Valorado" && (
                  <button className="btn-soft min-h-9 px-4 text-xs" onClick={() => advance(r.id)}>
                    Siguiente estado <ArrowRight size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <article key={p[0]} className="card interactive flex flex-col p-5">
            <div className="flex items-center gap-3.5">
              <span className="person-photo-wrap">
                {PERSON_PHOTOS[p[0]] ? (
                  <img src={PERSON_PHOTOS[p[0]]} alt={`Foto de ${p[0]}`} loading="lazy" />
                ) : (
                  <span className="grid place-items-center text-xs font-extrabold text-[var(--ciruela)]">
                    {p[0].split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </span>
                )}
                {PERSON_PHOTOS[p[0]] && <span className="online-dot" />}
              </span>
              <div className="min-w-0">
                <h2 className="font-editorial truncate text-[1.15rem] font-extrabold leading-tight">
                  {p[0]}
                </h2>
                <p className="truncate text-xs font-semibold text-[var(--muted)]">
                  {p[1]} · {p[2]}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="chip min-h-8 px-2.5 text-[11px]">
                <Star size={13} className="fill-[var(--oro)] text-[var(--oro)]" />
                {p[3]}
              </span>
              <span className="chip min-h-8 px-2.5 text-[11px]">
                <MapPin size={13} />≈ {(i % 3) + 1}.2 km
              </span>
              <span className="chip min-h-8 px-2.5 text-[11px]">{p[4]}</span>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs font-extrabold text-[var(--ichu)]">
              <ShieldCheck size={16} /> Visto Bueno Vecinal
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">
              Recomendado por vecinos, no es certificación oficial.
            </p>
            <button
              className="btn-primary mt-auto w-full pt-3"
              onClick={() => {
                setSelected(p[0]);
                setError("");
              }}
            >
              Solicitar servicio
            </button>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <Empty
          title="Sin profesionales"
          text="Prueba con otra especialidad o limpia la búsqueda."
          action="Ver todos"
          onAction={() => {
            setQuery("");
            setCategory("Todas");
          }}
        />
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Solicitar a ${selected || ""}`}
      >
        <label className="label" htmlFor="service-note">
          ¿Qué necesitas?
        </label>
        <textarea
          id="service-note"
          className="field min-h-28"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Describe el servicio y horario aproximado"
          aria-invalid={!!error}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <p className="mt-3 rounded-xl bg-[var(--surface-3)] p-3 text-xs leading-5 text-[var(--muted)]">
          No compartas una dirección exacta. Coordina siempre por zona aproximada.
        </p>
        <button className="btn-action mt-5 w-full" onClick={request}>
          Enviar solicitud
        </button>
      </Modal>
    </div>
  );
}

function Swaps() {
  const { state, update } = useStore();
  const [tab, setTab] = useState("Coincidencias");
  const advance = (id: string, accept = true) =>
    update(
      (s) => {
        const x = s.swaps.find((y) => y.id === id)!;
        if (!accept) x.status = "Rechazado";
        else {
          const steps = ["Propuesto", "Aceptado", "En curso", "Confirmado por ambos", "Completado"];
          x.status = steps[Math.min(4, steps.indexOf(x.status) + 1)];
          if (x.status === "Completado" && !s.movements.some((m) => m.label.includes(x.title))) {
            addMovement(s, "Trueque", x.title, 15);
            addNotification(
              s,
              "Trueque completado",
              "Ganaste 15 puntos por completar el intercambio.",
              "/app/conecta",
              "intercambios",
            );
          }
        }
      },
      accept ? "Intercambio actualizado" : "Propuesta rechazada",
    );
  return (
    <div>
      <ModuleHeader
        color="var(--malva)"
        icon={<HeartHandshake />}
        eyebrow="AYNI Conecta"
        title="Lo que tú sabes completa lo que otro necesita."
        text="Motor demostrativo de coincidencias por categoría y palabras clave."
      />
      <div
        role="tablist"
        aria-label="Secciones de AYNI Conecta"
        className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {["Ofrezco", "Necesito", "Coincidencias", "Mis intercambios"].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`chip whitespace-nowrap ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {(tab === "Coincidencias" || tab === "Mis intercambios") && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {state.swaps.map((s) => (
            <article key={s.id} className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid size-14 shrink-0 place-items-center rounded-full"
                    style={{
                      background: `conic-gradient(var(--malva) ${s.match * 3.6}deg, var(--line) 0)`,
                    }}
                  >
                    <span className="tabular grid size-11 place-items-center rounded-full bg-white text-sm font-extrabold text-[var(--ciruela)]">
                      {s.match}%
                    </span>
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-[.11em] text-[var(--muted)]">
                      Coincidencia
                    </span>
                    <p
                      className={`text-xs font-extrabold ${s.status === "Rechazado" ? "text-[var(--terracota)]" : "text-[var(--ichu)]"}`}
                    >
                      {s.status}
                    </p>
                  </div>
                </div>
                {DEMO}
              </div>
              <h2 className="font-editorial mt-4 text-[1.35rem] font-extrabold leading-tight">
                {s.title}
              </h2>
              <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-[.11em] text-[var(--muted)]">
                  Cadena de intercambio
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="chain-person">
                      <span className="person-photo-small">
                        {PERSON_PHOTOS["María Quispe"] ? (
                          <img src={PERSON_PHOTOS["María Quispe"]} alt="María" loading="lazy" />
                        ) : (
                          <span className="grid place-items-center text-[10px] font-extrabold text-[var(--ciruela)]">MQ</span>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold text-[var(--ink-2)]">María</span>
                    </span>
                    <span className="chain-arrow">→</span>
                    <span className="chain-person">
                      <span className="person-photo-small">
                        {PERSON_PHOTOS["Juan Pérez"] ? (
                          <img src={PERSON_PHOTOS["Juan Pérez"]} alt="Juan" loading="lazy" />
                        ) : (
                          <span className="grid place-items-center text-[10px] font-extrabold text-[var(--ciruela)]">JP</span>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold text-[var(--ink-2)]">Juan</span>
                    </span>
                    <span className="chain-arrow">→</span>
                    <span className="chain-person">
                      <span className="person-photo-small">
                        {PERSON_PHOTOS["Rosa Calderón"] ? (
                          <img src={PERSON_PHOTOS["Rosa Calderón"]} alt="Rosa" loading="lazy" />
                        ) : (
                          <span className="grid place-items-center text-[10px] font-extrabold text-[var(--ciruela)]">RC</span>
                        )}
                      </span>
                      <span className="text-[10px] font-extrabold text-[var(--ink-2)]">Rosa</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[var(--muted-2)] uppercase tracking-wider">
                    Cadena de 3
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-[var(--muted)]">{s.partner} · Coincidencia {s.match}%</p>
              </div>
              <div className="mt-4">
                <StatusSteps
                  steps={["Propuesto", "Aceptado", "En curso", "Confirmado por ambos", "Completado"]}
                  current={s.status}
                />
              </div>
              {s.status === "Propuesto" ? (
                <div className="mt-4 flex gap-2">
                  <button className="btn-action flex-1" onClick={() => advance(s.id)}>
                    Aceptar <Check size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => advance(s.id, false)}>
                    Rechazar
                  </button>
                </div>
              ) : s.status !== "Completado" && s.status !== "Rechazado" ? (
                <button className="btn-primary mt-4 w-full" onClick={() => advance(s.id)}>
                  Simular siguiente estado <ArrowRight size={16} />
                </button>
              ) : (
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-[var(--ichu)]">
                  <Check size={16} /> Intercambio completado
                </p>
              )}
            </article>
          ))}
        </div>
      )}
      {(tab === "Ofrezco" || tab === "Necesito") && (
        <Empty
          title={`Aún no publicaste en “${tab}”`}
          text="Crea una publicación para que el motor encuentre coincidencias."
          action="Crear publicación"
          onAction={() =>
            update((s) => {
              s.swaps.push({
                id: Date.now().toString(),
                title:
                  tab === "Ofrezco"
                    ? "Ofrezco apoyo con tecnología"
                    : "Necesito aprender matemáticas",
                partner: "Por encontrar",
                status: "Propuesto",
                match: 72,
              });
            }, "Publicación creada")
          }
        />
      )}
    </div>
  );
}

const FAVOR_STEPS: string[] = ["Disponible", "Aceptada", "Coordinando", "Realizada", "Validada"];

const FAVOR_STEP_HELP: Record<string, string> = {
  Disponible: "Revisa el detalle, acepta el favor y acuerda un punto de encuentro seguro.",
  Aceptada: "Coordina los detalles por el chat de la comunidad.",
  Coordinando: "Realiza la ayuda y marca el favor como realizado.",
  Realizada: "Tú y la otra persona confirman el cumplimiento.",
  Validada: "Se suman los puntos y la hora vecinal.",
};

const FAVOR_DETAILS: Record<
  string,
  {
    category: string;
    zone: string;
    description: string;
    points: number;
    hours: number;
    need: string;
    safety: string;
  }
> = {
  f1: {
    category: "Herramientas",
    zone: "Bolívar",
    description:
      "Carlos necesita un taladro para reparar una silla y devolverlo en buen estado el mismo día.",
    points: 30,
    hours: 1,
    need: "Acordar la entrega y devolución en un punto público del barrio.",
    safety: "Revisen juntos el estado de la herramienta antes de prestarla.",
  },
  f2: {
    category: "Útiles escolares",
    zone: "Miraflores",
    description:
      "La Familia Sánchez necesita completar materiales escolares para dos niños de primaria.",
    points: 30,
    hours: 1,
    need: "Revisar juntos la lista de útiles antes de entregar la ayuda.",
    safety: "No compartan nombres de menores ni direcciones exactas.",
  },
  f3: {
    category: "Movilidad solidaria",
    zone: "Bellamar",
    description:
      "Una vecina mayor necesita acompañamiento para llegar a su cita médica y regresar a casa.",
    points: 30,
    hours: 1,
    need: "Confirmar el horario y acompañar en un punto de encuentro seguro.",
    safety: "Coordinen en lugares públicos y avisen a una persona de confianza.",
  },
};

function favorDetail(id: string, title: string) {
  return (
    FAVOR_DETAILS[id] ?? {
      category: "Apoyo vecinal",
      zone: "Miraflores",
      description: `${title}. Coordina la ayuda por el chat de la comunidad y valida el cumplimiento entre ambas partes.`,
      points: 30,
      hours: 1,
      need: "Acordar el alcance de la ayuda y un punto de encuentro seguro.",
      safety: "No compartas datos sensibles fuera de la coordinación acordada.",
    }
  );
}

const favorChatRoute = (owner: string) => `/app/comunidad?chat=${encodeURIComponent(owner)}`;

function Favors() {
  const { state, update, navigate } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const openFavor = state.favors.find((favor) => favor.id === openId) ?? null;
  const openDetail = openFavor ? favorDetail(openFavor.id, openFavor.title) : null;

  const moveTo = (id: string, status: string) =>
    update((s) => {
      const favor = s.favors.find((item) => item.id === id);
      if (!favor) return;
      favor.status = status;
      if (status === "Realizada") {
        favor.myConfirmed = false;
        favor.ownerConfirmed = false;
        addNotification(
          s,
          "Favor realizado",
          `${favor.title} · falta la confirmación bilateral para validar los puntos.`,
          "/app/favores",
          "comunidad",
        );
      }
      if (status === "Aceptada") {
        addNotification(
          s,
          "Favor aceptado",
          `${favor.title} · coordina los detalles por el chat de la comunidad.`,
          favorChatRoute(favor.owner),
          "comunidad",
        );
      }
    }, status === "Aceptada" ? "Favor aceptado. Ahora coordinen por chat." : status === "Coordinando" ? "Favor en coordinación" : "Favor marcado como realizado");

  const confirmMine = (id: string) =>
    update((s) => {
      const favor = s.favors.find((item) => item.id === id);
      if (favor) favor.myConfirmed = true;
    }, "Tu parte quedó confirmada");

  const confirmOwner = (id: string) => {
    const favor = state.favors.find((item) => item.id === id);
    if (!favor) return;
    update((s) => {
      const target = s.favors.find((item) => item.id === id);
      if (target) target.ownerConfirmed = true;
    }, `${favor.owner} confirmó la ayuda en la demo`);
  };

  const validateFavor = (id: string) =>
    update((s) => {
      const favor = s.favors.find((item) => item.id === id);
      if (!favor || favor.status === "Validada" || !favor.myConfirmed || !favor.ownerConfirmed)
        return;
      const detail = favorDetail(favor.id, favor.title);
      favor.status = "Validada";
      favor.completedAt = new Date().toISOString();
      const label = `Favor: ${favor.title}`;
      if (!s.movements.some((movement) => movement.label === label)) {
        s.user.hours += detail.hours;
        addMovement(s, "Ayuda", label, detail.points);
      }
      addNotification(
        s,
        "Cadena de favor completada",
        `+${detail.points} puntos y +${detail.hours} hora vecinal por "${favor.title}".`,
        "/app/perfil",
        "horas",
      );
    }, "Cadena de favor validada. ¡Gracias por ayudar!");

  const primaryAction = (id: string, status: string, owner: string) => {
    if (status === "Disponible" || status === "Necesita ayuda") {
      moveTo(id, "Aceptada");
      return;
    }
    if (status === "Aceptada") {
      moveTo(id, "Coordinando");
      navigate(favorChatRoute(owner));
      return;
    }
    if (status === "Coordinando") {
      moveTo(id, "Realizada");
      return;
    }
    setOpenId(id);
  };

  return (
    <div>
      <ModuleHeader
        color="var(--arena)"
        icon={<HandHeart />}
        eyebrow="Cadena de Favores"
        title="Una ayuda vuelve convertida en comunidad."
        text="Acepta, coordina por chat, confirma entre ambas partes y recibe tus puntos y horas vecinales."
      />
      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.favors.map((f, i) => {
          const detail = favorDetail(f.id, f.title);
          const displayStatus = FAVOR_STEPS.includes(f.status) ? f.status : "Disponible";
          const statusHint =
            f.status === "Validada"
              ? `Cadena completada. +${detail.points} pts y +${detail.hours} h vecinal.`
              : f.status === "Realizada"
                ? "Falta la confirmación bilateral para validar los puntos."
                : f.status === "Coordinando"
                  ? "En coordinación. Cuando terminen, marca el favor como realizado."
                  : f.status === "Aceptada"
                    ? "Ya aceptaste. Coordina los detalles por el chat de la comunidad."
                    : f.status === "Necesita ayuda"
                      ? "Una familia del barrio necesita apoyo. Revisa el detalle y acepta."
                      : "Acepta el favor y acuerden un punto de encuentro seguro.";
          return (
            <article key={f.id} className="card flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide ${
                    f.status === "Validada"
                      ? "bg-[var(--ichu)]/18 text-[var(--ichu)]"
                      : f.status === "Realizada"
                        ? "bg-[var(--malva)]/15 text-[var(--malva)]"
                        : "bg-[var(--oro)]/30 text-[var(--ciruela)]"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {f.status}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--muted-2)]">
                  Favor {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="font-editorial mt-4 text-[1.25rem] font-extrabold leading-tight">
                {f.title}
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <span className="person-photo-small">
                  {PERSON_PHOTOS[f.owner] ? (
                    <img src={PERSON_PHOTOS[f.owner]} alt={`Foto de ${f.owner}`} loading="lazy" />
                  ) : (
                    <span className="grid place-items-center text-[10px] font-extrabold text-[var(--ciruela)]">
                      {f.owner
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  )}
                </span>
                <span className="ml-1">{f.owner}</span> · Ficticio
              </p>
              <div className="mt-4">
                <StatusSteps steps={FAVOR_STEPS} current={displayStatus} />
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[var(--muted-2)]">
                  <span>{detail.category} · {detail.zone}</span>
                  <span>+{detail.points} pts · +{detail.hours} h</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">{statusHint}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <button
                  className="btn-ghost min-h-9 flex-1 px-3 text-xs"
                  onClick={() => setOpenId(f.id)}
                >
                  <Eye size={14} /> Ver detalle
                </button>
                {f.status !== "Validada" ? (
                  <button
                    className="btn-action min-h-9 flex-1 px-3 text-xs"
                    onClick={() => primaryAction(f.id, f.status, f.owner)}
                  >
                    {f.status === "Disponible" || f.status === "Necesita ayuda"
                      ? "Aceptar favor"
                      : f.status === "Aceptada"
                        ? "Coordinar"
                        : f.status === "Coordinando"
                          ? "Marcar realizada"
                          : "Completar confirmación"}
                  </button>
                ) : (
                  <button
                    className="btn-soft min-h-9 flex-1 px-3 text-xs"
                    onClick={() => setOpenId(f.id)}
                  >
                    <Check size={14} /> Completado
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={!!openFavor} onClose={() => setOpenId(null)} title="Cadena de favor" wide>
        {openFavor && openDetail && (
          <div className="space-y-5 pb-2">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[var(--oro)]/30 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--ciruela)]">
                  {openFavor.status}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[var(--muted-2)]">
                  {openDetail.category} · {openDetail.zone}
                </span>
              </div>
              <h2 className="font-editorial mt-3 text-[1.55rem] font-extrabold leading-tight">
                {openFavor.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-2">
                  <span className="person-photo-small">
                    {PERSON_PHOTOS[openFavor.owner] ? (
                      <img
                        src={PERSON_PHOTOS[openFavor.owner]}
                        alt={`Foto de ${openFavor.owner}`}
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid place-items-center text-[10px] font-extrabold text-[var(--ciruela)]">
                        {openFavor.owner
                          .split(" ")
                          .map((x) => x[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    )}
                  </span>
                  {openFavor.owner}
                </span>
                <span className="flex items-center gap-1.5 font-extrabold text-[var(--ciruela)]">
                  <Star size={13} className="text-[var(--oro)]" /> +{openDetail.points} pts
                </span>
                <span className="flex items-center gap-1.5 font-extrabold text-[var(--ciruela)]">
                  <Clock size={13} className="text-[var(--malva)]" /> +{openDetail.hours} h vecinal
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
                <h3 className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--muted-2)]">
                  Qué se necesita
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-2)]">{openDetail.description}</p>
                <p className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-[var(--muted)]">
                  <Handshake size={14} className="mt-0.5 shrink-0 text-[var(--malva)]" />
                  {openDetail.need}
                </p>
              </section>
              <section className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <h3 className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--muted-2)]">
                  Acuerdo seguro
                </h3>
                <p className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-[var(--muted)]">
                  <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--ichu)]" />
                  {openDetail.safety}
                </p>
                <p className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-[var(--muted)]">
                  <LockKeyhole size={14} className="mt-0.5 shrink-0 text-[var(--ichu)]" />
                  Usa el chat de la comunidad y evita compartir datos sensibles.
                </p>
              </section>
            </div>

            <section>
              <h3 className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--muted-2)]">
                Recorrido de la cadena
              </h3>
              <ol className="mt-2 grid gap-2">
                {FAVOR_STEPS.map((step, index) => {
                  const normalized = FAVOR_STEPS.includes(openFavor.status)
                    ? openFavor.status
                    : "Disponible";
                  const currentIndex = FAVOR_STEPS.indexOf(normalized);
                  const done = index < currentIndex || openFavor.status === "Validada";
                  const active = index === currentIndex && openFavor.status !== "Validada";
                  return (
                    <li
                      key={step}
                      className={`flex items-start gap-3 rounded-2xl border p-3 ${
                        active
                          ? "border-[var(--malva)] bg-white"
                          : done
                            ? "border-[var(--ichu)]/30 bg-[var(--ichu)]/5"
                            : "border-[var(--line)] bg-white/50"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${
                          done
                            ? "bg-[var(--ichu)] text-white"
                            : active
                              ? "bg-[var(--malva)] text-white"
                              : "bg-[var(--surface-3)] text-[var(--muted)]"
                        }`}
                      >
                        {done ? <Check size={14} /> : index + 1}
                      </span>
                      <span>
                        <strong className="block text-xs">{step}</strong>
                        <small className="mt-0.5 block text-[11px] leading-5 text-[var(--muted)]">
                          {FAVOR_STEP_HELP[step]}
                        </small>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {openFavor.status === "Realizada" && (
              <section className="rounded-2xl border border-[var(--malva)]/30 bg-[var(--malva)]/8 p-4">
                <h3 className="flex items-center gap-2 text-sm font-extrabold">
                  <Handshake size={17} className="text-[var(--malva)]" /> Confirmación bilateral
                </h3>
                <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">
                  Para validar la cadena, ambas partes deben confirmar que la ayuda se realizó. En
                  esta demo puedes simular la confirmación de la otra persona.
                </p>
                <div className="mt-3 grid gap-2">
                  <button
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition ${
                      openFavor.myConfirmed
                        ? "border-[var(--ichu)]/40 bg-[var(--ichu)]/12 text-[var(--ichu)]"
                        : "border-[var(--line)] bg-white text-[var(--ink-2)] hover:border-[var(--malva)]"
                    }`}
                    onClick={() => confirmMine(openFavor.id)}
                    disabled={openFavor.myConfirmed}
                  >
                    {openFavor.myConfirmed ? (
                      <>
                        <Check size={15} /> Tú confirmaste
                      </>
                    ) : (
                      "Confirmar mi parte"
                    )}
                  </button>
                  <button
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-extrabold transition ${
                      openFavor.ownerConfirmed
                        ? "border-[var(--ichu)]/40 bg-[var(--ichu)]/12 text-[var(--ichu)]"
                        : "border-[var(--line)] bg-white text-[var(--ink-2)] hover:border-[var(--malva)]"
                    }`}
                    onClick={() => confirmOwner(openFavor.id)}
                    disabled={openFavor.ownerConfirmed}
                  >
                    {openFavor.ownerConfirmed ? (
                      <>
                        <Check size={15} /> {openFavor.owner} confirmó
                      </>
                    ) : (
                      `Simular confirmación de ${openFavor.owner}`
                    )}
                  </button>
                </div>
                <button
                  className="btn-primary mt-3 w-full"
                  onClick={() => validateFavor(openFavor.id)}
                  disabled={!openFavor.myConfirmed || !openFavor.ownerConfirmed}
                >
                  <Check size={16} /> Validar y recibir {openDetail.points} pts
                </button>
                {(!openFavor.myConfirmed || !openFavor.ownerConfirmed) && (
                  <p className="mt-2 text-center text-[10.5px] text-[var(--muted)]">
                    Faltan ambas confirmaciones para cerrar la cadena.
                  </p>
                )}
              </section>
            )}

            {openFavor.status === "Validada" && (
              <section className="rounded-2xl border border-[var(--ichu)]/30 bg-[var(--ichu)]/8 p-5 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--ichu)] text-white">
                  <Check size={24} />
                </span>
                <h3 className="font-editorial mt-3 text-xl font-extrabold">Cadena completada</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Recibiste <strong className="text-[var(--ichu)]">+{openDetail.points} puntos</strong> y{" "}
                  <strong className="text-[var(--ichu)]">+{openDetail.hours} hora vecinal</strong>.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setOpenId(null);
                      navigate("/app/perfil");
                    }}
                  >
                    Ver mi impacto
                  </button>
                  <button className="btn-secondary" onClick={() => setOpenId(null)}>
                    Buscar otro favor
                  </button>
                </div>
              </section>
            )}

            <div className="flex flex-wrap gap-2">
              {(openFavor.status === "Disponible" || openFavor.status === "Necesita ayuda") && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => moveTo(openFavor.id, "Aceptada")}
                >
                  <HandHeart size={16} /> Aceptar favor
                </button>
              )}
              {openFavor.status === "Aceptada" && (
                <button
                  className="btn-soft flex-1"
                  onClick={() => moveTo(openFavor.id, "Coordinando")}
                >
                  <ArrowRight size={16} /> Marcar en coordinación
                </button>
              )}
              {openFavor.status === "Coordinando" && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => moveTo(openFavor.id, "Realizada")}
                >
                  <Check size={16} /> Marcar como realizada
                </button>
              )}
              {openFavor.status !== "Validada" && (
                <button
                  className="btn-secondary flex-1"
                  onClick={() => {
                    if (openFavor.status === "Aceptada") moveTo(openFavor.id, "Coordinando");
                    setOpenId(null);
                    navigate(favorChatRoute(openFavor.owner));
                  }}
                >
                  <MessageCircle size={16} /> Coordinar por chat
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Donations() {
  const { state, update } = useStore();
  const act = (id: string) =>
    update((s) => {
      const d = s.donations.find((x) => x.id === id)!;
      d.status = d.status === "Disponible" ? "Reservado" : "Entregado";
      addNotification(
        s,
        "Donación actualizada",
        `${d.title}: ${d.status}.`,
        "/app/donaciones",
        "donaciones",
      );
    }, "Estado de donación actualizado");
  return (
    <div>
      <ModuleHeader
        color="var(--ichu)"
        icon={<Gift />}
        eyebrow="Donaciones"
        title="Lo que ya no usas puede comenzar otra historia."
        text="Artículos ficticios, zonas aproximadas y coordinación segura."
      />
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.donations.map((d, i) => (
          <article key={d.id} className="card interactive flex flex-col overflow-hidden">
            <div
              className="relative h-24 overflow-hidden"
              style={{
                background: ["var(--ichu)", "var(--turquesa)", "var(--arena)"][i % 3],
              }}
            >
              <div aria-hidden="true" className="pattern-light absolute inset-0" />
              <Package
                size={96}
                strokeWidth={1.1}
                className="absolute -bottom-5 right-2 text-white/35"
                aria-hidden="true"
              />
              <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-white/60 text-[var(--ciruela)]">
                <Package size={18} />
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[var(--ciruela)]">
                {d.status}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-editorial text-[1.2rem] font-extrabold leading-tight">{d.title}</h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <User size={13} /> {d.owner} · Ficticio
              </p>
              <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-[var(--muted)]">
                <MapPin size={13} className="mt-0.5 shrink-0" /> Miraflores · Condición: coordinar por
                AYNI.
              </p>
              <div className="mt-auto pt-4">
                {d.status !== "Entregado" ? (
                  <button className="btn-primary w-full" onClick={() => act(d.id)}>
                    {d.status === "Disponible" ? "Solicitar" : "Confirmar entrega"}
                  </button>
                ) : (
                  <p className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--ichu)]/12 py-3 text-sm font-extrabold text-[var(--ichu)]">
                    <Check size={16} /> Donación entregada
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Faro() {
  const { state, update, navigate } = useStore();
  const [confirm, setConfirm] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  const recordAction = (action: string) => {
    update((s) => {
      const now = new Date().toISOString();
      s.emergency.lastAction = action;
      s.emergency.lastActionAt = now;
      if (action === "Pedir ayuda" || action === "Reportar incidente") {
        s.emergency.active = true;
        s.emergency.status = "Activo";
        s.emergency.category = action;
      } else if (action === "Estoy a salvo") {
        s.emergency.active = false;
        s.emergency.status = "A salvo";
      } else if (action === "Ofrecer ayuda") {
        s.emergency.helpers += 1;
      }
      addNotification(
        s,
        `Modo Faro: ${action}`,
        isOnline
          ? "Acción registrada en este dispositivo; AYNI intentará sincronizarla con el servidor."
          : "Acción guardada en este dispositivo. Se sincronizará cuando vuelva la conexión.",
        "/app/faro",
        "emergencias",
      );
    }, isOnline ? `${action} registrado` : `${action} guardado sin conexión`);
  };

  const activate = () => {
    update((s) => {
      const now = new Date().toISOString();
      s.emergency = {
        ...s.emergency,
        active: true,
        status: "Activo",
        category: "Necesidad de agua",
        lastAction: "Activar Modo Faro",
        lastActionAt: now,
      };
      addNotification(
        s,
        "Modo Faro activo",
        isOnline
          ? "Necesidad de agua registrada en AYNI."
          : "Necesidad de agua guardada en este dispositivo. Pendiente de sincronización.",
        "/app/faro",
        "emergencias",
      );
    }, isOnline ? "Aviso vecinal activado" : "Aviso guardado sin conexión");
    setConfirm(false);
  };

  return (
    <div>
      <ModuleHeader
        color="var(--terracota)"
        icon={<AlertTriangle />}
        eyebrow="Modo Faro · Demostrativo"
        title="Cuando algo ocurre, la claridad también ayuda."
        text="AYNI coordina vecinos. No contacta autoridades ni servicios de emergencia."
      />
      <section className="relative mt-6 overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#d4694b_0%,#c65a3e_55%,#a8452c_100%)] p-6 text-white shadow-[var(--shadow)] md:p-8">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-45" />
        <div className="relative">
          <div
            className="mb-5 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm"
            role="status"
            aria-live="polite"
          >
            <span className={`size-2.5 shrink-0 rounded-full ${isOnline ? "bg-emerald-300" : "bg-amber-300"}`} />
            <span className="font-semibold">
              {isOnline
                ? "Con internet · AYNI intentará sincronizar los cambios con el servidor."
                : "Sin conexión · Los avisos se guardan en este dispositivo y quedan pendientes de sincronización."}
            </span>
          </div>
          <div className="grid items-center gap-7 md:grid-cols-[auto_1fr]">
            <button
              className="group relative mx-auto grid size-40 place-items-center rounded-full border-4 border-white/25 bg-white/10 backdrop-blur transition hover:bg-white/15 active:scale-95"
              onClick={() => setConfirm(true)}
              aria-label="Activar Modo Faro"
            >
              <span aria-hidden="true" className="absolute inset-3 animate-ping rounded-full bg-white/10" />
              <span className="relative text-center">
                <AlertTriangle className="mx-auto" size={34} />
                <strong className="mt-2 block text-sm font-extrabold leading-tight">
                  Activar<br />Modo Faro
                </strong>
              </span>
            </button>
            <div>
              <h2 className="font-editorial text-[1.6rem] font-extrabold leading-tight md:text-[2rem]">
                Un aviso claro, una respuesta vecinal.
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
                Elige una acción. AYNI solo coordina vecinos: no contacta autoridades ni servicios de emergencia.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["Pedir ayuda", "Ofrecer ayuda", "Estoy a salvo", "Reportar incidente", "Consultar recursos", "Ver mapa"].map((x) => (
                  <button
                    key={x}
                    className="min-h-11 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-bold backdrop-blur transition hover:bg-white/20"
                    onClick={() => (x === "Ver mapa" ? navigate("/app/mapa") : recordAction(x))}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl font-bold">Necesidad de agua</h2>
            <span className="demo">{state.emergency.status}</span>
          </div>
          <p className="mt-3">
            Miraflores · ubicación aproximada · {state.emergency.helpers} vecinos ofrecen recursos.
          </p>
          {state.emergency.lastActionAt && (
            <p className="mt-2 text-sm text-[var(--muted)]">
              Última acción: {state.emergency.lastAction} · {new Date(state.emergency.lastActionAt).toLocaleString("es-PE")}
            </p>
          )}
          {state.emergency.active && (
            <button
              className="btn-primary mt-4"
              onClick={() =>
                update((s) => {
                  s.emergency.status = s.emergency.status === "Activo" ? "Con ayuda" : "Resuelto";
                  if (s.emergency.status === "Resuelto") s.emergency.active = false;
                  s.emergency.lastAction = "Actualizar estado";
                  s.emergency.lastActionAt = new Date().toISOString();
                }, "Estado de Faro actualizado")
              }
            >
              Siguiente estado
            </button>
          )}
        </section>
        <section className="rounded-[26px] bg-[var(--ciruela)] p-6 text-white">
          <h2 className="font-editorial text-2xl font-bold">Números de emergencia en Perú</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[["Policía", "105"], ["Bomberos", "116"], ["SAMU", "106"], ["INDECI", "115"]].map(([a, b]) => (
              <div key={a} className="rounded-xl bg-white/10 p-3">
                <small>{a}</small>
                <strong className="block text-2xl text-[var(--oro)]">{b}</strong>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm">Llama directamente; AYNI no llama ni avisa a autoridades.</p>
        </section>
      </div>
      <section className="mt-5 rounded-[26px] bg-[var(--oro)]/35 p-6">
        <h2 className="font-editorial text-2xl font-bold">Guía breve de sismo y tsunami</h2>
        <p className="mt-3">
          Aléjate de ventanas, identifica rutas de evacuación y sigue fuentes oficiales. Orientación educativa demostrativa para Chimbote.
        </p>
      </section>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirmar aviso">
        <div className="rounded-2xl bg-[var(--terracota)]/15 p-5">
          <AlertTriangle />
          <p className="mt-3 font-bold">
            {isOnline
              ? "Esto guardará el aviso en este dispositivo e intentará sincronizarlo con AYNI. No contacta a autoridades."
              : "Esto guardará el aviso en este dispositivo. Se intentará sincronizar al recuperar internet. No contacta a autoridades."}
          </p>
        </div>
        <button className="btn-action mt-5 w-full" onClick={activate}>
          Confirmar necesidad de agua
        </button>
      </Modal>
    </div>
  );
}

function MapPage() {
  const { update } = useStore();
  const [filter, setFilter] = useState("Todos");
  const markers = [
    ["Servicio", 22, 28, "var(--turquesa)"],
    ["Trueque", 55, 35, "var(--malva)"],
    ["Donación", 74, 62, "var(--ichu)"],
    ["Ayuda", 35, 72, "var(--terracota)"],
    ["Recurso", 82, 25, "var(--oro)"],
  ];
  return (
    <div>
      <ModuleHeader
        color="var(--oliva)"
        icon={<Map />}
        eyebrow="Mapa Comunitario"
        title="Chimbote se siente más cerca."
        text="Ubicaciones demostrativas por zona y desplazamiento aleatorio; nunca direcciones exactas."
      />
      <div
        role="tablist"
        aria-label="Filtrar el mapa"
        className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {["Todos", "Servicio", "Trueque", "Donación", "Ayuda", "Recurso"].map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`chip whitespace-nowrap ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="relative mt-5 overflow-hidden rounded-[30px] border border-[var(--line)] bg-[linear-gradient(160deg,#eaf2f1_0%,#f8f5ef_58%,#f3ece0_100%)] shadow-[var(--shadow-soft)]">
        <div className="relative h-[520px]">
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "linear-gradient(var(--ciruela) 1px,transparent 1px),linear-gradient(90deg,var(--ciruela) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <svg
            viewBox="0 0 600 400"
            className="absolute inset-0 h-full w-full opacity-50"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 70 C120 130 70 270 210 400 L0 400Z" fill="var(--turquesa)" />
            <path
              d="M120 0 C160 80 270 40 320 150 S500 240 600 170"
              fill="none"
              stroke="var(--oliva)"
              strokeWidth="22"
            />
            <path d="M180 400 Q240 220 600 280" fill="none" stroke="var(--arena)" strokeWidth="14" />
            <path d="M60 0 C90 120 190 180 600 60" fill="none" stroke="var(--arena)" strokeWidth="8" />
          </svg>

          {[
            ["Casco Urbano", "16%", "18%"],
            ["Miraflores", "58%", "14%"],
            ["Bellamar", "70%", "80%"],
            ["Florida", "26%", "64%"],
          ].map(([name, left, top]) => (
            <span
              key={name}
              className="absolute rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.1em] text-[var(--ink-2)] backdrop-blur-sm"
              style={{ left, top }}
            >
              {name}
            </span>
          ))}

          {markers
            .filter((m) => filter === "Todos" || m[0] === filter)
            .map((m) => (
              <button
                key={m[0] as string}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${m[1]}%`, top: `${m[2]}%` }}
                onClick={() => update(() => {}, `${m[0]} seleccionado · ubicación aproximada`)}
                aria-label={`${m[0]} demostrativo, zona aproximada`}
              >
                <span
                  className="grid size-11 place-items-center rounded-full border-[3px] border-white text-white shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl"
                  style={{ background: m[3] as string }}
                >
                  <MapPin size={18} />
                </span>
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold text-[var(--ciruela)] shadow-sm">
                  {m[0]}
                </span>
              </button>
            ))}

          <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--marfil)_92%,transparent)] p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[var(--ciruela)] text-white">
                <MapPin size={18} />
              </span>
              <span>
                <strong className="block text-sm">Centro aproximado: Chimbote</strong>
                <small className="block text-[11px] text-[var(--muted)]">
                  ≈ −9.07, −78.59 · Sin coordenadas de usuarios
                </small>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["Servicio", "var(--turquesa)"],
                ["Trueque", "var(--malva)"],
                ["Donación", "var(--ichu)"],
              ].map(([label, color]) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[var(--ink-2)]"
                >
                  <span className="size-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
              {DEMO}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type CommunityMember = {
  name: string;
  role: string;
  zone: string;
  online: boolean;
  color: string;
};

const COMMUNITY_MEMBERS: CommunityMember[] = [
  { name: "Rosa Calderón", role: "Clases y apoyo escolar", zone: "Buenos Aires", online: true, color: "var(--terracota)" },
  { name: "Juan Pérez", role: "Reparaciones y tecnología", zone: "Miraflores", online: true, color: "var(--malva)" },
  { name: "Lucía Mendoza", role: "Cuidado de mascotas", zone: "Pensacola", online: true, color: "var(--turquesa)" },
  { name: "Carlos Villanueva", role: "Electricidad", zone: "Bolívar", online: false, color: "var(--oro)" },
  { name: "Elena Torres", role: "Costura", zone: "Bellamar", online: true, color: "var(--ichu)" },
  { name: "Patricia Huamán", role: "Limpieza", zone: "Trapecio", online: false, color: "var(--arena)" },
  { name: "Don José Pérez", role: "Gasfitería", zone: "Miraflores", online: false, color: "var(--turquesa)" },
  { name: "Ana Reyes", role: "Belleza", zone: "Bellamar", online: true, color: "var(--terracota)" },
  { name: "Familia Sánchez", role: "Familia del barrio", zone: "Miraflores", online: false, color: "var(--malva)" },
  { name: "Vecina de Bellamar", role: "Red de apoyo", zone: "Bellamar", online: true, color: "var(--ichu)" },
];

type DemoChatMessage = {
  id: string;
  sender: string;
  text: string;
  mine: boolean;
  time: string;
};

const COMMUNITY_GROUP_SEED: DemoChatMessage[] = [
  {
    id: "demo-v1",
    sender: "Rosa Calderón",
    text: "Vecinos, mañana a las 9 hacemos la jornada de limpieza en el parque zonal. ¿Quién se suma?",
    mine: false,
    time: "9:12",
  },
  {
    id: "demo-v2",
    sender: "Juan Pérez",
    text: "Yo llevo guantes y bolsas. También puedo prestar una carretilla.",
    mine: false,
    time: "9:14",
  },
  {
    id: "demo-v3",
    sender: "Lucía Mendoza",
    text: "Perfecto. Avisemos por la Cadena de Favores para que más vecinos se enteren.",
    mine: false,
    time: "9:16",
  },
  {
    id: "demo-v4",
    sender: "Carlos Villanueva",
    text: "Cuenten conmigo para los enchufes y las conexiones del punto de acopio.",
    mine: false,
    time: "9:20",
  },
];

const COMMUNITY_DM_SEEDS: Record<string, DemoChatMessage[]> = {
  "Rosa Calderón": [
    {
      id: "demo-rosa-1",
      sender: "Rosa Calderón",
      text: "Hola María, ¿cómo va lo del presupuesto familiar? Si quieres te paso una plantilla sencilla.",
      mine: false,
      time: "Ayer",
    },
  ],
  "Carlos Villanueva": [
    {
      id: "demo-carlos-1",
      sender: "Carlos Villanueva",
      text: "Gracias por la recomendación para la instalación eléctrica. Ya coordiné una visita segura.",
      mine: false,
      time: "Ayer",
    },
  ],
  "Lucía Mendoza": [
    {
      id: "demo-lucia-1",
      sender: "Lucía Mendoza",
      text: "Te comparto el horario de la jornada de mascotas del sábado. ¿Te gustaría participar?",
      mine: false,
      time: "Lun",
    },
  ],
  "Elena Torres": [
    {
      id: "demo-elena-1",
      sender: "Elena Torres",
      text: "El taller de costura empieza a las 4. Lleva una prenda que quieras reparar.",
      mine: false,
      time: "Lun",
    },
  ],
  "Patricia Huamán": [
    {
      id: "demo-patricia-1",
      sender: "Patricia Huamán",
      text: "Hola María, ¿necesitas apoyo con la limpieza del local comunal esta semana?",
      mine: false,
      time: "Dom",
    },
  ],
  "Don José Pérez": [
    {
      id: "demo-jose-1",
      sender: "Don José Pérez",
      text: "Joven María, si necesita revisar la conexión de agua, avíseme con tiempo.",
      mine: false,
      time: "Dom",
    },
  ],
  "Ana Reyes": [
    {
      id: "demo-ana-1",
      sender: "Ana Reyes",
      text: "Gracias por sumarte a la campaña de cuidado personal. Te esperamos en Bellamar.",
      mine: false,
      time: "Sáb",
    },
  ],
  "Familia Sánchez": [
    {
      id: "demo-sanchez-1",
      sender: "Familia Sánchez",
      text: "Hola María, los útiles escolares llegaron muy bien. ¡Gracias por la ayuda!",
      mine: false,
      time: "Vie",
    },
  ],
  "Vecina de Bellamar": [
    {
      id: "demo-vecina-1",
      sender: "Vecina de Bellamar",
      text: "Gracias por coordinar la movilidad solidaria. Mi mamá llegó muy bien a su cita.",
      mine: false,
      time: "Jue",
    },
  ],
};

const dmChannel = (name: string) => `dm:${name}`;

function communityInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function communityShortName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts[0] === "Don" ? parts[1] ?? parts[0] : parts[0];
}

function CommunityAvatar({ member, size = "size-10" }: { member: CommunityMember; size?: string }) {
  const photo = PERSON_PHOTOS[member.name];
  return (
    <span
      className={`relative grid ${size} shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-extrabold text-[var(--ciruela)]`}
      style={{ background: member.color }}
    >
      {photo ? (
        <img src={photo} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        <span>{communityInitials(member.name)}</span>
      )}
      {member.online && (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[var(--ichu)]" />
      )}
    </span>
  );
}

function Community() {
  const { state, update } = useStore();
  const [channel, setChannel] = useState("vecinal");
  const [text, setText] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const requested = new URLSearchParams(state.route.split("?")[1] ?? "").get("chat");
    if (!requested) return;
    const member = COMMUNITY_MEMBERS.find((item) => item.name === requested);
    if (member) setChannel(dmChannel(member.name));
  }, [state.route]);

  const group = channel === "vecinal";
  const selectedMember = group
    ? null
    : COMMUNITY_MEMBERS.find((member) => dmChannel(member.name) === channel) ?? null;
  const onlineCount = COMMUNITY_MEMBERS.filter((member) => member.online).length;
  const filteredMembers = COMMUNITY_MEMBERS.filter((member) =>
    `${member.name} ${member.role} ${member.zone}`.toLowerCase().includes(memberQuery.toLowerCase()),
  );

  const persisted = state.messages.filter((message) =>
    group
      ? message.channel === "vecinal"
      : message.channel === channel ||
        (!message.channel && channel === dmChannel("Juan Pérez")),
  );
  const demoMessages = group
    ? COMMUNITY_GROUP_SEED
    : selectedMember
      ? COMMUNITY_DM_SEEDS[selectedMember.name] ?? []
      : [];
  const messages: DemoChatMessage[] = [
    ...demoMessages,
    ...persisted.map((message) => ({
      id: message.id,
      sender: message.sender,
      text: message.text,
      mine: message.mine,
      time: message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Ahora",
    })),
  ];

  useEffect(() => {
    const box = chatRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [channel, messages.length]);

  useEffect(() => {
    const inChannel = (message: AyniState["messages"][number]) =>
      message.channel === channel || (!message.channel && channel === dmChannel("Juan Pérez"));
    if (!state.messages.some((message) => inChannel(message) && !message.read)) return;
    update((draft) => {
      draft.messages.forEach((message) => {
        if (inChannel(message)) message.read = true;
      });
    });
  }, [channel, state.messages, update]);

  const lastMessage = (member: CommunityMember) => {
    const seeded = COMMUNITY_DM_SEEDS[member.name] ?? [];
    const direct = state.messages.filter(
      (message) =>
        message.channel === dmChannel(member.name) ||
        (!message.channel && member.name === "Juan Pérez"),
    );
    return [...seeded, ...direct].at(-1)?.text ?? "Inicia un mensaje privado";
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    const targetChannel = channel;
    update((draft) => {
      draft.messages.push({
        id: `msg-${Date.now()}`,
        sender: "María",
        text: value,
        mine: true,
        read: true,
        channel: targetChannel,
        createdAt: new Date().toISOString(),
      });
    }, group ? "Mensaje enviado al chat vecinal" : `Mensaje privado enviado a ${selectedMember?.name}`);
    setText("");

    const online = COMMUNITY_MEMBERS.filter((member) => member.online);
    const responder = group
      ? online[Math.floor(Math.random() * online.length)] ?? COMMUNITY_MEMBERS[0]
      : selectedMember;
    if (!responder) return;
    window.setTimeout(() => {
      update((draft) => {
        draft.messages.push({
          id: `msg-${Date.now()}-reply`,
          sender: responder.name,
          text: group
            ? "¡Buen aporte! Lo revisamos en la junta vecinal y te confirmamos por aquí."
            : "Gracias por escribirme. Coordinemos por este chat sin compartir datos sensibles.",
          mine: false,
          read: false,
          channel: targetChannel,
          createdAt: new Date().toISOString(),
        });
      }, group ? `${responder.name} respondió en el chat vecinal` : `${responder.name} respondió a tu mensaje`);
    }, 700);
  };

  return (
    <div>
      <ModuleHeader
        color="var(--lavanda)"
        icon={<Users />}
        eyebrow="Comunidad"
        title="La vecindad conversa y se organiza."
        text="Chat grupal y mensajes privados con miembros de tu comunidad. Información ficticia y zonas aproximadas."
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="card hidden h-fit p-4 lg:block">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-editorial text-lg font-extrabold">Mi comunidad</h2>
            <span className="rounded-full bg-[var(--ichu)]/15 px-2.5 py-1 text-[10px] font-extrabold text-[var(--ichu)]">
              {onlineCount} en línea
            </span>
          </div>
          <button
            className={`mt-4 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
              group
                ? "border-[var(--malva)] bg-[var(--surface-2)] shadow-sm"
                : "border-[var(--line)] bg-white hover:border-[var(--malva)]"
            }`}
            onClick={() => setChannel("vecinal")}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--lavanda)] text-[var(--ciruela)]">
              <Users size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm">Chat de la vecindad</strong>
              <small className="block truncate text-[10.5px] text-[var(--muted)]">
                {COMMUNITY_MEMBERS.length} miembros · Grupo general
              </small>
            </span>
            <MessageCircle size={15} className="shrink-0 text-[var(--malva)]" />
          </button>

          <label className="relative mt-4 block">
            <span className="sr-only">Buscar vecino</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              className="field pl-9 text-xs"
              value={memberQuery}
              onChange={(event) => setMemberQuery(event.target.value)}
              placeholder="Buscar vecino…"
            />
          </label>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--muted-2)]">
              Mensajes privados
            </p>
            <span className="text-[10px] font-bold text-[var(--muted-2)]">{filteredMembers.length}</span>
          </div>
          <div className="mt-2 max-h-[360px] space-y-1.5 overflow-y-auto pr-1 xl:max-h-[430px]">
            {filteredMembers.map((member) => {
              const active = channel === dmChannel(member.name);
              return (
                <button
                  key={member.name}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition ${
                    active
                      ? "border-[var(--malva)] bg-[var(--surface-2)] shadow-sm"
                      : "border-transparent hover:border-[var(--line)] hover:bg-white"
                  }`}
                  onClick={() => setChannel(dmChannel(member.name))}
                >
                  <CommunityAvatar member={member} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <strong className="truncate text-[13px]">{member.name}</strong>
                      {member.online && <span className="size-1.5 shrink-0 rounded-full bg-[var(--ichu)]" />}
                    </span>
                    <small className="block truncate text-[10.5px] text-[var(--muted)]">
                      {member.online ? "En línea" : member.zone} · {member.role}
                    </small>
                    <small className="mt-0.5 block truncate text-[10px] text-[var(--muted-2)]">
                      {lastMessage(member)}
                    </small>
                  </span>
                  <MessageCircle
                    size={14}
                    className={active ? "shrink-0 text-[var(--malva)]" : "shrink-0 text-[var(--muted-2)]"}
                  />
                </button>
              );
            })}
            {filteredMembers.length === 0 && (
              <p className="rounded-2xl border border-dashed border-[var(--line-strong)] p-4 text-center text-xs text-[var(--muted)]">
                No encontramos vecinos con ese nombre.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-3 text-[11px] leading-5 text-[var(--muted)]">
            <p className="flex items-center gap-1.5 font-extrabold text-[var(--ink-2)]">
              <LockKeyhole size={13} /> Chat seguro
            </p>
            <p className="mt-1">
              No compartas direcciones exactas ni teléfonos. Los mensajes de esta demo son ficticios.
            </p>
          </div>
        </aside>

        <section className="card flex h-[620px] flex-col overflow-hidden lg:h-[660px]">
          <div className="border-b border-[var(--line)] bg-white/60 p-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition ${
                  group
                    ? "border-[var(--malva)] bg-[var(--surface-2)]"
                    : "border-transparent hover:border-[var(--line)]"
                }`}
                onClick={() => setChannel("vecinal")}
                aria-pressed={group}
              >
                <span className="grid size-9 place-items-center rounded-full bg-[var(--lavanda)] text-[var(--ciruela)]">
                  <Users size={16} />
                </span>
                <span className="text-[9.5px] font-extrabold">Grupo</span>
              </button>
              {COMMUNITY_MEMBERS.map((member) => {
                const active = channel === dmChannel(member.name);
                return (
                  <button
                    key={member.name}
                    className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-2.5 py-2 transition ${
                      active
                        ? "border-[var(--malva)] bg-[var(--surface-2)]"
                        : "border-transparent hover:border-[var(--line)]"
                    }`}
                    onClick={() => setChannel(dmChannel(member.name))}
                    aria-pressed={active}
                  >
                    <CommunityAvatar member={member} size="size-9" />
                    <span className="max-w-[62px] truncate text-[9.5px] font-extrabold">
                      {communityShortName(member.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3 border-b border-[var(--line)] bg-white/70 p-4">
            {group ? (
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--lavanda)] text-[var(--ciruela)]">
                <Users size={20} />
              </span>
            ) : selectedMember ? (
              <CommunityAvatar member={selectedMember} size="size-11" />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="truncate text-sm">
                  {group ? "Chat de la vecindad" : selectedMember?.name}
                </strong>
                <span className="rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
                  {group ? "Grupo" : "Privado"}
                </span>
              </div>
              <p className="truncate text-[11px] text-[var(--muted)]">
                {group
                  ? `${COMMUNITY_MEMBERS.length} miembros · ${onlineCount} en línea · Chimbote`
                  : selectedMember
                    ? `${selectedMember.role} · ${selectedMember.zone} · ${
                        selectedMember.online ? "En línea" : "Disponible"
                      }`
                    : ""}
              </p>
            </div>
            {!group && selectedMember && (
              <button className="btn-ghost min-h-9 px-3 text-[11px]" onClick={() => setChannel("vecinal")}>
                Ver grupo
              </button>
            )}
            <span className="demo hidden sm:inline-flex">Demo</span>
          </div>

          {!group && selectedMember && (
            <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-2)] px-4 py-2 text-[10.5px] text-[var(--muted)]">
              <LockKeyhole size={12} /> Conversación privada entre tú y {selectedMember.name}. No
              compartas datos sensibles.
            </div>
          )}

          <div
            ref={chatRef}
            className="flex-1 space-y-4 overflow-y-auto bg-[var(--surface-3)] p-4 md:p-5"
          >
            <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted-2)]">
              Hoy
            </div>
            {messages.map((message, index) => {
              const sender = group
                ? COMMUNITY_MEMBERS.find((member) => member.name === message.sender)
                : selectedMember;
              return (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex items-end gap-2 ${message.mine ? "justify-end" : "justify-start"}`}
                >
                  {!message.mine && sender && <CommunityAvatar member={sender} size="size-8" />}
                  <div
                    className={`flex max-w-[82%] flex-col ${
                      message.mine ? "items-end" : "items-start"
                    }`}
                  >
                    {group && !message.mine && (
                      <span className="mb-1 px-1 text-[10px] font-extrabold text-[var(--muted-2)]">
                        {message.sender}
                      </span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
                        message.mine
                          ? "rounded-br-md bg-[var(--ciruela)] text-white"
                          : "rounded-bl-md bg-white text-[var(--ink)]"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div
                        className={`mt-1 flex items-center gap-1 text-[9.5px] ${
                          message.mine ? "justify-end text-white/55" : "text-[var(--muted-2)]"
                        }`}
                      >
                        {message.time}
                        {message.mine && <Check size={11} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <MessageCircle size={30} className="mx-auto text-[var(--muted-2)]" />
                  <p className="mt-2 text-sm font-bold">Aún no hay mensajes</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Escribe el primero para saludar a {selectedMember?.name ?? "la vecindad"}.
                  </p>
                </div>
              </div>
            )}
          </div>

          <form className="flex items-center gap-2 border-t border-[var(--line)] bg-white/70 p-3" onSubmit={send}>
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink-2)]"
              onClick={() => update(() => {}, "Adjunto simulado añadido")}
              aria-label="Adjuntar archivo"
            >
              <Plus size={19} />
            </button>
            <label className="flex-1">
              <span className="sr-only">Escribe un mensaje</span>
              <input
                className="field"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={
                  group
                    ? "Escribe al grupo vecinal…"
                    : `Escribe a ${selectedMember?.name ?? "un vecino"}…`
                }
              />
            </label>
            <button
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--terracota)] text-white shadow-[0_6px_16px_rgba(198,90,62,.35)] transition hover:brightness-110 active:scale-95"
              aria-label="Enviar mensaje"
            >
              <Send size={19} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Messages() {
  const { state, update } = useStore();
  const [text, setText] = useState("");
  const thread = state.messages.filter((m) => !m.channel || m.channel === "dm:Juan Pérez");
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const message = text.trim();
    update((s) => {
      s.messages.push({
        id: Date.now().toString(),
        sender: "María",
        text: message,
        mine: true,
        read: true,
        channel: "dm:Juan Pérez",
        createdAt: new Date().toISOString(),
      });
      s.messages.forEach((m) => {
        if (!m.channel || m.channel === "dm:Juan Pérez") m.read = true;
      });
    }, "Mensaje enviado en modo demostrativo");
    setText("");
    window.setTimeout(
      () =>
        update(
          (s) =>
            s.messages.push({
              id: Date.now().toString(),
              sender: "Juan Pérez",
              text: "Gracias, lo coordinamos por aquí.",
              mine: false,
              read: false,
              channel: "dm:Juan Pérez",
              createdAt: new Date().toISOString(),
            }),
          "Juan respondió en el chat demostrativo",
        ),
      700,
    );
  };
  return (
    <div>
      <ModuleHeader
        color="var(--lavanda)"
        icon={<MessageCircle />}
        eyebrow="Chat demostrativo"
        title="Conversa con claridad y cuida tus datos."
        text="No compartas direcciones ni teléfonos. No hay mensajería abierta con menores."
      />
      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--line)] bg-white/60 p-4">
          <span className="relative">
            <span className="grid size-11 place-items-center rounded-full bg-[var(--malva)] text-sm font-extrabold text-white">
              JP
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[var(--ichu)]" />
          </span>
          <div className="min-w-0">
            <strong className="block truncate text-sm">Juan Pérez</strong>
            <p className="text-[11px] text-[var(--muted)]">Soporte técnico · En línea · Ficticio</p>
          </div>
          <span className="demo ml-auto">Demo</span>
        </div>
        <div className="h-[430px] space-y-3 overflow-y-auto bg-[var(--surface-3)] p-4 md:p-5">
          {thread.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${m.mine ? "justify-end" : "justify-start"}`}
            >
              {!m.mine && (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--malva)] text-[10px] font-extrabold text-white">
                  JP
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  m.mine
                    ? "rounded-br-md bg-[var(--ciruela)] text-white"
                    : "rounded-bl-md bg-white text-[var(--ink)]"
                }`}
              >
                <p>{m.text}</p>
                <small className={m.mine ? "text-white/55" : "text-[var(--muted-2)]"}>
                  {m.mine ? "Entregado" : "Recibido"} · Demostrativo
                </small>
              </div>
            </div>
          ))}
        </div>
        <form className="flex items-center gap-2 border-t border-[var(--line)] bg-white/60 p-3" onSubmit={send}>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink-2)]"
            onClick={() => update(() => {}, "Adjunto simulado añadido")}
            aria-label="Adjuntar archivo"
          >
            <Plus size={19} />
          </button>
          <label className="flex-1">
            <span className="sr-only">Escribe un mensaje</span>
            <input
              className="field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un mensaje…"
            />
          </label>
          <button
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--terracota)] text-white shadow-[0_6px_16px_rgba(198,90,62,.35)] transition hover:brightness-110 active:scale-95"
            aria-label="Enviar mensaje"
          >
            <Send size={19} />
          </button>
        </form>
      </section>
    </div>
  );
}

const NOTIFICATION_TYPES: Record<string, [typeof Bell, string]> = {
  intercambios: [HeartHandshake, "var(--malva)"],
  servicios: [Wrench, "var(--turquesa)"],
  donaciones: [Gift, "var(--ichu)"],
  retos: [Trophy, "var(--oro)"],
  recompensas: [Coins, "var(--terracota)"],
  comunidad: [Users, "var(--lavanda)"],
  emergencias: [AlertTriangle, "var(--terracota)"],
};

function Notifications() {
  const { state, update, navigate } = useStore();
  const [filter, setFilter] = useState("Todas");
  const items = state.notifications.filter((n) => filter === "Todas" || n.type === filter);
  const unread = state.notifications.filter((n) => !n.read).length;
  const open = (id: string, route: string) => {
    update((s) => {
      s.notifications.find((n) => n.id === id)!.read = true;
    });
    navigate(route);
  };
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">
            <Bell size={15} /> Centro de avisos
          </span>
          <h1 className="section-title mt-4">Notificaciones</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {unread > 0 ? (
              <>
                Tienes <strong className="text-[var(--terracota)]">{unread} sin leer</strong>.
              </>
            ) : (
              "Estás al día con tu comunidad."
            )}{" "}
            {DEMO}
          </p>
        </div>
        <button
          className="btn-secondary"
          disabled={!unread}
          onClick={() =>
            update(
              (s) => s.notifications.forEach((n) => (n.read = true)),
              "Todas marcadas como leídas",
            )
          }
        >
          <Check size={16} /> Marcar todas leídas
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Filtrar notificaciones"
        className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {[
          "Todas",
          "intercambios",
          "servicios",
          "donaciones",
          "retos",
          "recompensas",
          "comunidad",
          "emergencias",
        ].map((f) => {
          const count =
            f === "Todas"
              ? state.notifications.length
              : state.notifications.filter((n) => n.type === f).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`chip whitespace-nowrap capitalize ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className={`tabular text-[10px] ${filter === f ? "text-white/70" : "text-[var(--muted-2)]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2.5">
        {items.map((n) => {
          const [Icon, color] = NOTIFICATION_TYPES[n.type] || [Bell, "var(--turquesa)"];
          return (
            <button
              key={n.id}
              className={`card interactive flex w-full items-start gap-4 p-4 text-left ${
                !n.read ? "border-l-[3px] border-l-[var(--terracota)]" : ""
              }`}
              onClick={() => open(n.id, n.route)}
            >
              <span
                className="grid size-11 shrink-0 place-items-center rounded-2xl text-[var(--ciruela)]"
                style={{ background: `color-mix(in srgb, ${color} 32%, white)` }}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <strong className="text-sm leading-snug">{n.title}</strong>
                  {!n.read && (
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--terracota)]"
                      aria-label="No leída"
                    />
                  )}
                </span>
                <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{n.body}</span>
                <small className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--muted)]">
                  {n.type} · Demostrativo
                </small>
              </span>
              <ChevronRight className="mt-2.5 shrink-0 text-[var(--muted-2)]" size={17} />
            </button>
          );
        })}
        {!items.length && (
          <Empty
            title="Todo al día"
            text="No hay notificaciones en esta categoría."
            action="Ver todas"
            onAction={() => setFilter("Todas")}
          />
        )}
      </div>
    </div>
  );
}

function Guide() {
  const { update } = useStore();
  const [query, setQuery] = useState("");
  const topics = [
    ["Primeros pasos", "Configura tu zona, explora módulos y publica."],
    ["Trueques seguros", "Acuerda condiciones y confirma cada paso."],
    ["Ayudar a un vecino", "Acepta, coordina y espera validación bilateral."],
    ["Modo Faro", "Recuerda: AYNI no contacta autoridades."],
    ["Puntos y horas", "Los puntos se canjean; las horas solo reconocen participación."],
    ["Privacidad", "Usa zonas aproximadas y evita datos sensibles."],
  ];
  const filtered = topics.filter(
    (t) =>
      t[0].toLowerCase().includes(query.toLowerCase()) ||
      t[1].toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <ModuleHeader
        color="var(--turquesa)"
        icon={<CircleHelp />}
        eyebrow="Guía de Ayuda"
        title="Respuestas claras, paso a paso."
        text="Guía interactiva; no es un chatbot."
      />

      <label className="relative mt-6 block">
        <span className="sr-only">Buscar en la guía</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          size={18}
        />
        <input
          className="field pl-11"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar un tema: trueques, puntos, privacidad…"
        />
      </label>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(([t, d], i) => (
          <article key={t} className="card interactive flex flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-[var(--turquesa)]/45 text-[var(--ciruela)]">
                <BookOpen size={19} />
              </span>
              <span className="tabular text-[11px] font-extrabold text-[var(--muted-2)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-editorial mt-4 text-[1.25rem] font-extrabold leading-tight">{t}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{d}</p>
            <button
              className="btn-soft mt-auto self-start pt-2"
              onClick={() => update(() => {}, `Guía abierta: ${t}`)}
            >
              Ver pasos <ArrowRight size={15} />
            </button>
          </article>
        ))}
      </div>

      {!filtered.length && (
        <Empty
          title="No encontramos ese tema"
          text={`Nada coincide con “${query}”. Prueba con otra palabra.`}
          action="Limpiar búsqueda"
          onAction={() => setQuery("")}
        />
      )}

      <section className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-[var(--line)] bg-[var(--surface-2)] p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--oro)]/35 text-[var(--ciruela)]">
            <Compass size={22} />
          </span>
          <div>
            <h2 className="font-editorial text-lg font-extrabold">¿Primera vez por aquí?</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Repite el recorrido de bienvenida en menos de un minuto.
            </p>
          </div>
        </div>
        <button
          className="btn-action"
          onClick={() => update(() => {}, "Tutorial listo para repetir")}
        >
          Repetir tutorial <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );
}

function SettingsPage() {
  const { state, update, reset, logout } = useStore();
  const toggle = (key: keyof AyniState["settings"]) =>
    update((s) => {
      s.settings[key] = !s.settings[key];
    }, "Preferencia aplicada");
  return (
    <div>
      <span className="eyebrow">
        <Settings size={15} /> Preferencias
      </span>
      <h1 className="section-title mt-4">Configuración</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
        Ajusta la experiencia a tu medida. Los cambios se aplican al instante y quedan guardados en
        este dispositivo.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--oro)]/30 text-[var(--ciruela)]">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="font-editorial text-lg font-extrabold leading-tight">Accesibilidad</h2>
              <p className="text-[11px] text-[var(--muted)]">Lectura, contraste y movimiento.</p>
            </div>
          </div>
          <div className="mt-3 divide-y divide-[var(--line)]">
            <SettingRow
              label="Texto más grande"
              hint="Aumenta el tamaño base de la interfaz."
              value={state.settings.largeText}
              onClick={() => toggle("largeText")}
            />
            <SettingRow
              label="Alto contraste"
              hint="Refuerza bordes y textos secundarios."
              value={state.settings.highContrast}
              onClick={() => toggle("highContrast")}
            />
            <SettingRow
              label="Reducir movimiento"
              hint="Desactiva animaciones y transiciones."
              value={state.settings.reducedMotion}
              onClick={() => toggle("reducedMotion")}
            />
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--malva)]/18 text-[var(--malva)]">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h2 className="font-editorial text-lg font-extrabold leading-tight">
                Cuenta y privacidad
              </h2>
              <p className="text-[11px] text-[var(--muted)]">Avisos y ubicación aproximada.</p>
            </div>
          </div>
          <div className="mt-3">
            <SettingRow
              label="Notificaciones"
              hint="Recibe avisos de trueques, favores y retos."
              value={state.settings.notifications}
              onClick={() => toggle("notifications")}
            />
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-[var(--turquesa)]/25 p-4">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--ciruela)]" />
            <div>
              <strong className="block text-sm">Ubicación aproximada</strong>
              <p className="mt-0.5 text-xs leading-5 text-[var(--ink-2)]">
                {state.user.zone}, Chimbote. Nunca guardamos coordenadas exactas.
              </p>
            </div>
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--terracota)]/15 text-[var(--terracota)]">
              <Package size={18} />
            </span>
            <div>
              <h2 className="font-editorial text-lg font-extrabold leading-tight">
                Datos de demostración
              </h2>
              <p className="text-[11px] text-[var(--muted)]">Vuelve al estado inicial.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Restablece el seed de Chimbote, el saldo, las actividades y los estados iniciales.
          </p>
          <button
            className="btn-secondary mt-4 w-full border-[var(--terracota)]/35! text-[var(--terracota)]! hover:bg-[var(--terracota)]/8!"
            onClick={() => confirm("¿Restablecer todos los datos demostrativos?") && reset()}
          >
            Restablecer datos
          </button>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--ichu)]/20 text-[var(--ichu)]">
              <Leaf size={18} />
            </span>
            <div>
              <h2 className="font-editorial text-lg font-extrabold leading-tight">Acerca de AYNI</h2>
              <p className="text-[11px] text-[var(--muted)]">Hoy por ti, mañana por mí.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Experiencia local sin backend, correos reales ni contacto con autoridades.
          </p>
          {DEMO}
          <button className="btn-ghost mt-4 w-full" onClick={logout}>
            Cerrar sesión
          </button>
        </section>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  hint,
  value,
  onClick,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className="flex w-full items-center justify-between gap-4 rounded-xl px-1 py-3.5 text-left transition-colors hover:bg-[var(--surface-2)]"
      onClick={onClick}
    >
      <span className="min-w-0">
        <span className="block text-sm font-extrabold">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[11px] leading-5 text-[var(--muted)]">{hint}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          value ? "bg-[var(--ichu)]" : "bg-[var(--line-strong)]"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${
            value ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function ModuleHeader({
  color,
  icon,
  eyebrow,
  title,
  text,
}: {
  color: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <header className="relative overflow-hidden rounded-[30px] border border-[var(--line)] bg-[linear-gradient(135deg,#ffffff_0%,#fbf8f2_100%)] p-6 shadow-[var(--shadow-soft)] md:p-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />
      <div
        aria-hidden="true"
        className="hero-glow -right-16 -top-24 size-64 opacity-30"
        style={{ background: color }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl text-[var(--ciruela)] shadow-sm"
            style={{ background: `color-mix(in srgb, ${color} 55%, white)` }}
          >
            {icon}
          </span>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--muted)]">
              {eyebrow}
            </span>
            <h1 className="font-editorial mt-1.5 max-w-3xl text-[1.75rem] font-extrabold leading-[1.05] md:text-[2.35rem]">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{text}</p>
          </div>
        </div>
        <span className="demo">Demostrativo</span>
      </div>
    </header>
  );
}

function StatusSteps({ steps, current }: { steps: string[]; current: string }) {
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {steps.map((step, i) => (
        <span
          key={step}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            idx >= 0 && i <= idx ? "bg-[var(--ichu)]" : "bg-[var(--line)]"
          }`}
        />
      ))}
    </div>
  );
}

function Empty({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="card mt-6 flex flex-col items-center p-8 text-center md:p-10">
      <span className="grid size-16 place-items-center rounded-2xl bg-[var(--lavanda)]/25 text-[var(--malva)]">
        <MoonStar size={26} />
      </span>
      <h3 className="font-editorial mt-4 text-xl font-extrabold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{text}</p>
      <button className="btn-primary mt-5" onClick={onAction}>
        {action} <ArrowRight size={16} />
      </button>
    </div>
  );
}

function PublishModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { update } = useStore();
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const titleId = useId();
  const closeAndReset = () => {
    setType("");
    setTitle("");
    setError("");
    onClose();
  };
  const types: Array<[string, typeof Wrench, string]> = [
    ["Servicio", Wrench, "var(--turquesa)"],
    ["Trueque", HeartHandshake, "var(--malva)"],
    ["Necesidad", HandHeart, "var(--arena)"],
    ["Oferta de ayuda", HandHeart, "var(--oro)"],
    ["Donación", Gift, "var(--ichu)"],
    ["Reporte comunitario", AlertTriangle, "var(--lavanda)"],
  ];
  const submit = () => {
    if (title.trim().length < 5) {
      setError("Escribe al menos 5 caracteres.");
      return;
    }
    update((s) => {
      if (type === "Donación")
        s.donations.unshift({
          id: Date.now().toString(),
          title,
          owner: `${s.user.name} ${s.user.surname}`,
          status: "Disponible",
        });
      else if (type === "Trueque")
        s.swaps.unshift({
          id: Date.now().toString(),
          title,
          partner: "Por encontrar",
          status: "Propuesto",
          match: 68,
        });
      else {
        s.communityPosts.unshift({
          id: Date.now().toString(),
          author: `${s.user.name} ${s.user.surname}`,
          text: `${type}: ${title}`,
          likes: 0,
        });
        s.messages.push({
          id: `msg-${Date.now()}`,
          sender: `${s.user.name} ${s.user.surname}`,
          text: `${type}: ${title}`,
          mine: true,
          read: true,
          channel: "vecinal",
          createdAt: new Date().toISOString(),
        });
      }
      addNotification(
        s,
        "Publicación creada",
        `${type}: ${title}`,
        type === "Donación"
          ? "/app/donaciones"
          : type === "Trueque"
            ? "/app/conecta"
            : "/app/comunidad",
        "comunidad",
      );
    }, "Publicación creada y visible");
    closeAndReset();
  };
  return (
    <Modal
      open={open}
      onClose={closeAndReset}
      title={type ? `Publicar ${type.toLowerCase()}` : "¿Qué quieres publicar?"}
    >
      <div className="mb-5 flex items-center gap-2" aria-hidden="true">
        {["Tipo", "Detalle"].map((step, i) => (
          <span key={step} className="flex flex-1 items-center gap-2">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold ${
                (i === 0 && !type) || (i === 1 && type)
                  ? "bg-[var(--ciruela)] text-white"
                  : "bg-[var(--surface-3)] text-[var(--muted)]"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                (i === 0 && !type) || (i === 1 && type)
                  ? "text-[var(--ciruela)]"
                  : "text-[var(--muted-2)]"
              }`}
            >
              {step}
            </span>
            {i === 0 && <span className="h-px flex-1 bg-[var(--line)]" />}
          </span>
        ))}
      </div>

      {!type ? (
        <div className="grid grid-cols-2 gap-2.5">
          {types.map(([t, Icon, tone]) => (
            <button
              key={t}
              type="button"
              className="group flex min-h-24 flex-col justify-between rounded-2xl border border-[var(--line)] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              style={{ background: `color-mix(in srgb, ${tone} 26%, white)` }}
              onClick={() => {
                setType(t);
                setTitle("");
                setError("");
              }}
            >
              <span
                className="grid size-9 place-items-center rounded-xl bg-white/75 text-[var(--ciruela)]"
                aria-hidden="true"
              >
                <Icon size={17} />
              </span>
              <span className="mt-3 text-[0.82rem] font-extrabold leading-tight">{t}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button className="btn-ghost mb-4 min-h-9 px-2 text-xs" onClick={() => setType("")}>
            <ArrowLeft size={15} /> Cambiar tipo
          </button>
          <label className="label" htmlFor={titleId}>
            Título o descripción breve
          </label>
          <textarea
            id={titleId}
            className="field min-h-28"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder={`Describe tu ${type.toLowerCase()}`}
            aria-invalid={!!error}
          />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            {error ? <ErrorText>{error}</ErrorText> : <span />}
            <span className="tabular text-[11px] font-semibold text-[var(--muted-2)]">
              {title.trim().length}/120
            </span>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-[var(--surface-3)] p-3 text-xs leading-5 text-[var(--muted)]">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            Zona aproximada · Todos los datos serán demostrativos.
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-secondary w-full" type="button" onClick={closeAndReset}>
              Cancelar
            </button>
            <button className="btn-action w-full" type="button" onClick={submit}>
              Publicar <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function ExploreModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate } = useStore();
  const links = [
    ["Servicios", "Talento del barrio", "/app/servicios", Wrench],
    ["Conecta", "Trueques inteligentes", "/app/conecta", HeartHandshake],
    ["Retos", "Aprende ayudando", "/app/retos", Trophy],
    ["Puntos", "Canjea recompensas", "/app/puntos", Coins],
    ["Donaciones", "Comparte recursos", "/app/donaciones", Gift],
    ["Modo Faro", "Apoyo urgente", "/app/faro", AlertTriangle],
    ["Mapa", "Zonas y recursos", "/app/mapa", Map],
    ["Comunidad", "Chat de la vecindad", "/app/comunidad", Users],
  ];
  return (
    <Modal open={open} onClose={onClose} title="Explorar AYNI">
      <div className="grid grid-cols-2 gap-2.5">
        {links.map(([l, d, r, I]) => {
          const Icon = I as typeof Wrench;
          return (
            <button
              key={l as string}
              className="flex min-h-24 flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[var(--malva)] hover:bg-white hover:shadow-[var(--shadow-soft)]"
              onClick={() => {
                navigate(r as string);
                onClose();
              }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-white text-[var(--malva)] shadow-sm">
                <Icon size={17} />
              </span>
              <span className="mt-3">
                <span className="block text-[0.85rem] font-extrabold leading-tight">{l as string}</span>
                <span className="mt-0.5 block text-[10.5px] leading-4 text-[var(--muted)]">
                  {d as string}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function NotFound({ app = false }: { app?: boolean }) {
  const { navigate } = useStore();
  return (
    <main className={`${app ? "py-16" : "min-h-screen"} grid place-items-center p-6`}>
      <div className="relative max-w-lg text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-10 select-none font-editorial text-[8rem] font-extrabold leading-none text-[var(--terracota)]/10"
        >
          404
        </span>
        <div className="relative">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--terracota)]/12 text-[var(--terracota)]">
            <Compass size={28} />
          </span>
          <span className="mt-5 block text-[11px] font-extrabold uppercase tracking-[.18em] text-[var(--muted)]">
            Error 404
          </span>
          <h1 className="font-editorial mt-2 text-[1.9rem] font-extrabold leading-tight md:text-[2.4rem]">
            Este camino aún no está trazado.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            La página que buscas no existe o cambió de lugar. Volvamos a un punto conocido de AYNI.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button className="btn-primary" onClick={() => navigate(app ? "/app/inicio" : "/")}>
              <Home size={17} /> Volver al inicio
            </button>
            {app && (
              <button className="btn-secondary" onClick={() => navigate("/app/explorar")}>
                Explorar módulos
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Router() {
  const { state, navigate } = useStore();
  useEffect(() => {
    if (state.route.startsWith("/app/") && !state.session) navigate("/login");
    if (state.route === "/bienvenida" && !state.session) navigate("/login");
  }, [state.route, state.session, navigate]);
  if (state.route === "/") return <Landing />;
  if (state.route === "/login") return <Auth />;
  if (state.route === "/registro") return <Auth register />;
  if (
    state.route === "/recuperar" ||
    state.route === "/restablecer" ||
    state.route === "/verificar"
  )
    return <Auth recover />;
  if (state.route === "/privacidad") return <Legal kind="Privacidad" />;
  if (state.route === "/terminos") return <Legal kind="Términos" />;
  if (state.route === "/bienvenida" && state.session) return <Welcome />;
  if (state.route.startsWith("/app/") && state.session) return <AppShell />;
  if (state.route.startsWith("/app/") || state.route === "/bienvenida") return null;
  return <NotFound />;
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
      <Toast />
    </StoreProvider>
  );
}
