export type Route = string;

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  route: string;
  read: boolean;
  createdAt: string;
};

export type Movement = {
  id: string;
  type: "Reto" | "Ayuda" | "Canje" | "Bonus" | "Trueque";
  label: string;
  points: number;
  createdAt: string;
};

export type Challenge = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  description: string;
  icon: string;
  completed: boolean;
  helped: boolean;
  score?: number;
  /** Registra que la persona ya intentó el reto y recibió los puntos por participación. */
  attempted?: boolean;
};

export type Reward = {
  id: string;
  name: string;
  category: string;
  points: number;
  stock: number;
  description: string;
  expiry: string;
};

export type AyniState = {
  session: boolean;
  welcomed: boolean;
  route: Route;
  user: {
    name: string;
    surname: string;
    occupation: string;
    email: string;
    phone: string;
    zone: string;
    bio: string;
    points: number;
    totalEarned: number;
    hours: number;
    reputation: number;
    interests: string[];
  };
  challenges: Challenge[];
  rewards: Reward[];
  movements: Movement[];
  notifications: Notification[];
  serviceRequests: { id: string; professional: string; status: string; note: string }[];
  favors: {
    id: string;
    title: string;
    owner: string;
    status: string;
    /** Confirmaciones de la cadena de favor para la validación bilateral. */
    myConfirmed?: boolean;
    ownerConfirmed?: boolean;
    completedAt?: string;
  }[];
  donations: { id: string; title: string; owner: string; status: string }[];
  swaps: { id: string; title: string; partner: string; status: string; match: number }[];
  messages: {
    id: string;
    sender: string;
    text: string;
    mine: boolean;
    read: boolean;
    /** Canal del chat comunitario: "vecinal" o "dm:<nombre>". */
    channel?: string;
    createdAt?: string;
  }[];
  communityPosts: { id: string; author: string; text: string; likes: number; joined?: boolean }[];
  emergency: {
    active: boolean;
    category: string;
    status: string;
    helpers: number;
    lastAction?: string;
    lastActionAt?: string;
  };
  redemptions: { id: string; reward: string; code: string; points: number; date: string }[];
  settings: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    notifications: boolean;
  };
  toast?: string;
};
