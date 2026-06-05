export interface Review {
  index: number;
  name: string;
  avatar: string;
  stars: number;
  text: string;
  images: string[];
}

export interface StoreModalData {
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
  sales: string;
  responseRate: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  time: string;
  sender: 'me' | 'them';
  text: string;
}
