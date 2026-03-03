export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'editor' | 'contributor';
  companyId: number;
  permissions: string[];
}

export interface Company {
  id: number;
  name: string;
  subdomain: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  imageUrl?: string;
  isFeatured: boolean;
}

export interface DashboardStats {
  pages: number;
  posts: number;
  products: number;
  revenue: number;
}
