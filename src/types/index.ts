export type GameName = 'Brutal Age';
export type ListingStatus = 'Available' | 'Sold' | 'Reserved';

export interface Listing {
  _id: string;
  id?: string;
  title: string;
  game_name: GameName;
  images: string[];
  rank: string; // e.g. "POWERFUL ACCOUNTS / T7 Troops"
  level: string; // e.g. "Leadership LEVEL 350"
  resources: string; // e.g. "resource service | clan coin service | account/partner service"
  login_details_note?: string;
  price: number; // in USD $
  description: string;
  status: ListingStatus;
  contact_link?: string;
  posted_date?: string;
  createdAt?: string;
}

export interface FilterState {
  search: string;
  maxLeadershipLevel: number;
  maxPrice: number;
  status: 'All' | 'Available' | 'Sold';
}

export interface AdminUser {
  _id: string;
  username: string;
  token: string;
}

export interface BuyerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface CartItem {
  listing: Listing;
  addedAt: string;
}
