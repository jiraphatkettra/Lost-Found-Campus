import { Item, User } from "@prisma/client";

export type { Item, User };

export type SafeUser = Omit<User, "role"> & {
  role: string;
};

export type ItemWithOwner = Item & {
  owner: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export type ItemCardData = {
  id: string;
  type: string;
  title: string;
  category: string;
  location: string;
  date: Date | string;
  description: string;
  contact?: string;
  imageUrl?: string | null;
  status: string;
  ownerId: string;
  createdAt: Date | string;
  owner?: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
}
