import { seedCategories, seedProducts, seedOffers } from './seed-data';

// Types based on Supabase schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  base_price: number;
  actual_MRP?: number;
  discounted_price?: number;
  percentage_discount?: number;
  images: string[];
  tags: string[];
  rating: number;
  review_count: number;
  stock_quantity: number;
  variants: any;
  specifications: any;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_hot_deal?: boolean;
  has_offer?: boolean;
  sku?: string;
  brand?: string;
  tax_percentage?: number;
  offer_label?: string;
  video_url?: string;
  is_active?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  threshold?: number;
  created_at: string;
  updated_at: string;
  // Additional fields for enhanced product detail
  title?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  discountPercentage?: number;
  highlights?: string[];
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
    image?: string;
  }[];
  offers?: string[];
  stock?: number;
  codAvailable?: boolean;
  returnPolicy?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;    
  type: string;
  discount_type: string;
  discount_value: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  image_url?: string;
  code?: string;
  min_purchase?: number;
  usage_limit?: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  profile?: User;
  shipping_address?: Address;
  payment_method?: string;
  delivery_method?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'Approved' | 'Pending' | 'Flagged';
  created_at: string;
  updated_at: string;
  reply?: string;
  reply_date?: string;
  product?: Product;
  user?: User;
}

export interface Ticket {
  id: string;
  user_id: string;
  order_id?: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_admin_id?: string;
  created_at: string;
  updated_at: string;
  attachments?: string[];
  replies?: TicketReply[];
  user?: User;
  order?: Order;
  assigned_admin?: User;
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachments?: string[];
  created_at: string;
  user?: User;
}

export interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// In-memory data storage
let categories: Category[] = [];
let products: Product[] = [];
let offers: Offer[] = [];
let users: User[] = [];
let orders: Order[] = [];
let addresses: Address[] = [];
let cartItems: CartItem[] = [];
let reviews: Review[] = [];
let tickets: Ticket[] = [];
let ticketReplies: TicketReply[] = [];
let stockHistory: StockAdjustment[] = [];
let transactions: Transaction[] = [];

export interface StockAdjustment {
  id: string;
  product_id: string;
  adjustment: number;
  reason: string;
  created_at: string;
  created_by?: string;
}

// Initialize data
function initializeData() {
  if (categories.length === 0) {
    categories = seedCategories.map((cat, index) => ({
      ...cat,
      id: `cat_${index + 1}`,
      parent_id: index >= 15 ? `cat_${(index % 3) + 1}` : null, // Assign parent categories to subcategories
      created_at: new Date().toISOString(),
    }));
  }

  if (products.length === 0) {
    const categoryMap: Record<string, string> = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id;
    });

    products = seedProducts(categoryMap).map((prod, index) => ({
      ...prod,
      id: `prod_${index + 1}`,
      is_featured: prod.is_featured || false,
      is_new_arrival: prod.is_new_arrival || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  if (offers.length === 0) {
    offers = seedOffers.map((offer, index) => ({
      ...offer,
      id: `offer_${index + 1}`,
    }));
  }

  if (users.length === 0) {
    // Add some dummy users
    users = [
      {
        id: 'user_1',
        email: 'admin@example.com',
        full_name: 'Admin User',
        avatar_url: null,
        phone: null,
        is_admin: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'user_2',
        email: 'user@example.com',
        full_name: 'Regular User',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'user_3',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'user_4',
        email: 'jane.smith@example.com',
        full_name: 'Jane Smith',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }

  if (orders.length === 0) {
    // Add some dummy orders
    orders = [
      {
        id: 'order_1',
        user_id: 'user_2',
        total: 299.99,
        status: 'delivered',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'item_1',
            order_id: 'order_1',
            product_id: 'prod_1',
            quantity: 1,
            price: 299.99,
            product: products.find(p => p.id === 'prod_1')!,
          },
        ],
        profile: users.find(u => u.id === 'user_2'),
        shipping_address: {
          id: 'addr_1',
          user_id: 'user_2',
          full_name: 'Regular User',
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA',
          phone: '+1234567890',
          is_default: true,
        },
        payment_method: 'Credit Card',
        delivery_method: 'Standard',
      },
      {
        id: 'order_2',
        user_id: 'user_3',
        total: 149.98,
        status: 'shipped',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'item_2',
            order_id: 'order_2',
            product_id: 'prod_2',
            quantity: 2,
            price: 74.99,
            product: products.find(p => p.id === 'prod_2')!,
          },
        ],
        profile: users.find(u => u.id === 'user_3'),
        shipping_address: {
          id: 'addr_2',
          user_id: 'user_3',
          full_name: 'John Doe',
          street_address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90210',
          country: 'USA',
          phone: '+1987654321',
          is_default: true,
        },
        payment_method: 'PayPal',
        delivery_method: 'Express',
      },
      {
        id: 'order_3',
        user_id: 'user_4',
        total: 89.99,
        status: 'processing',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 'item_3',
            order_id: 'order_3',
            product_id: 'prod_3',
            quantity: 1,
            price: 89.99,
            product: products.find(p => p.id === 'prod_3')!,
          },
        ],
        profile: users.find(u => u.id === 'user_4'),
        shipping_address: {
          id: 'addr_3',
          user_id: 'user_4',
          full_name: 'Jane Smith',
          street_address: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          postal_code: '60601',
          country: 'USA',
          phone: '+1555123456',
          is_default: true,
        },
        payment_method: 'Credit Card',
        delivery_method: 'Standard',
      },
      {
        id: 'order_4',
        user_id: 'user_2',
        total: 199.99,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
          {
            id: 'item_4',
            order_id: 'order_4',
            product_id: 'prod_4',
            quantity: 1,
            price: 199.99,
            product: products.find(p => p.id === 'prod_4')!,
          },
        ],
        profile: users.find(u => u.id === 'user_2'),
        shipping_address: {
          id: 'addr_1',
          user_id: 'user_2',
          full_name: 'Regular User',
          street_address: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA',
          phone: '+1234567890',
          is_default: true,
        },
        payment_method: 'Debit Card',
        delivery_method: 'Standard',
      },
    ];
  }

  if (reviews.length === 0) {
    // Add some dummy reviews
    reviews = [
      {
        id: 'rev_1',
        product_id: 'prod_1',
        user_id: 'user_2',
        rating: 5,
        comment: 'Excellent product! Highly recommend it.',
        status: 'Approved',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rev_2',
        product_id: 'prod_1',
        user_id: 'user_3',
        rating: 4,
        comment: 'Good quality, but delivery was a bit slow.',
        status: 'Approved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rev_3',
        product_id: 'prod_2',
        user_id: 'user_4',
        rating: 3,
        comment: 'Average product. Nothing special.',
        status: 'Pending',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rev_4',
        product_id: 'prod_3',
        user_id: 'user_2',
        rating: 1,
        comment: 'Very disappointed with this purchase.',
        status: 'Flagged',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rev_5',
        product_id: 'prod_4',
        user_id: 'user_3',
        rating: 5,
        comment: 'Amazing! Exceeded my expectations.',
        status: 'Approved',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        reply: 'Thank you for your kind words! We\'re glad you loved it.',
        reply_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  if (tickets.length === 0) {
    // Add some dummy tickets
    tickets = [
      {
        id: 'ticket_1',
        user_id: 'user_2',
        order_id: 'order_1',
        subject: 'Order not delivered',
        description: 'I placed an order 2 weeks ago but haven\'t received it yet. Can you please check the status?',
        priority: 'High',
        status: 'Open',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: ['screenshot1.jpg'],
        replies: [],
        user: users.find(u => u.id === 'user_2'),
        order: orders.find(o => o.id === 'order_1'),
        assigned_admin: users.find(u => u.id === 'user_1'),
      },
      {
        id: 'ticket_2',
        user_id: 'user_3',
        order_id: 'order_2',
        subject: 'Wrong item received',
        description: 'I received a different product than what I ordered. The product ID is different.',
        priority: 'Medium',
        status: 'In Progress',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: ['wrong_item.jpg', 'order_invoice.pdf'],
        replies: [],
        user: users.find(u => u.id === 'user_3'),
        order: orders.find(o => o.id === 'order_2'),
        assigned_admin: users.find(u => u.id === 'user_1'),
      },
      {
        id: 'ticket_3',
        user_id: 'user_4',
        subject: 'Refund request',
        description: 'I want to return the product I received. It\'s not working as expected.',
        priority: 'Medium',
        status: 'Resolved',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        replies: [],
        user: users.find(u => u.id === 'user_4'),
        order: undefined,
        assigned_admin: users.find(u => u.id === 'user_1'),
      },
      {
        id: 'ticket_4',
        user_id: 'user_2',
        subject: 'Account login issue',
        description: 'I\'m unable to login to my account. It says invalid credentials but I\'m sure the password is correct.',
        priority: 'Low',
        status: 'Closed',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        attachments: [],
        replies: [],
        user: users.find(u => u.id === 'user_2'),
        order: undefined,
        assigned_admin: users.find(u => u.id === 'user_1'),
      },
      {
        id: 'ticket_5',
        user_id: 'user_3',
        order_id: 'order_3',
        subject: 'Payment not processed',
        description: 'I tried to pay for my order but the payment failed. Can you help me complete the transaction?',
        priority: 'Urgent',
        status: 'Open',
        assigned_admin_id: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        attachments: ['payment_error.png'],
        replies: [],
        user: users.find(u => u.id === 'user_3'),
        order: orders.find(o => o.id === 'order_3'),
        assigned_admin: undefined,
      },
    ];
  }

  if (transactions.length === 0) {
    // Add some dummy transactions
    transactions = [
      {
        id: 'txn_1',
        order_id: 'order_1',
        amount: 299.99,
        currency: 'INR',
        status: 'completed',
        payment_method: 'Credit Card',
        transaction_id: 'txn_123456789',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'txn_2',
        order_id: 'order_2',
        amount: 149.98,
        currency: 'INR',
        status: 'completed',
        payment_method: 'PayPal',
        transaction_id: 'txn_987654321',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'txn_3',
        order_id: 'order_3',
        amount: 89.99,
        currency: 'INR',
        status: 'failed',
        payment_method: 'Credit Card',
        transaction_id: 'txn_456789123',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'txn_4',
        order_id: 'order_4',
        amount: 199.99,
        currency: 'INR',
        status: 'pending',
        payment_method: 'Debit Card',
        transaction_id: 'txn_789123456',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'txn_5',
        order_id: 'order_2',
        amount: 149.98,
        currency: 'INR',
        status: 'refunded',
        payment_method: 'PayPal',
        transaction_id: 'txn_321654987',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}

// API-like functions
export const dummyData = {
  // Categories
  getCategories: async (limit?: number): Promise<Category[]> => {
    initializeData();
    return limit ? categories.slice(0, limit) : categories;
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    initializeData();
    return categories.find(cat => cat.slug === slug) || null;
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat_${categories.length + 1}`,
      created_at: new Date().toISOString(),
    };
    categories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const categoryIndex = categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) return null;

    categories[categoryIndex] = { ...categories[categoryIndex], ...updates };
    return categories[categoryIndex];
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    const categoryIndex = categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) return false;

    // Check if category has subcategories or products
    const hasSubcategories = categories.some(c => c.parent_id === id);
    const hasProducts = products.some(p => p.category_id === id);

    if (hasSubcategories || hasProducts) {
      return false; // Cannot delete category with dependencies
    }

    categories.splice(categoryIndex, 1);
    return true;
  },

  getCategoryHierarchy: async (): Promise<Category[]> => {
    initializeData();
    return categories.sort((a, b) => a.display_order - b.display_order);
  },

  // Products
  getProducts: async (filters?: {
    category_id?: string;
    is_featured?: boolean;
    is_new_arrival?: boolean;
    limit?: number;
  }): Promise<Product[]> => {
    initializeData();
    let filtered = products;

    if (filters?.category_id) {
      filtered = filtered.filter(p => p.category_id === filters.category_id);
    }
    if (filters?.is_featured !== undefined) {
      filtered = filtered.filter(p => p.is_featured === filters.is_featured);
    }
    if (filters?.is_new_arrival !== undefined) {
      filtered = filtered.filter(p => p.is_new_arrival === filters.is_new_arrival);
    }

    return filters?.limit ? filtered.slice(0, filters.limit) : filtered;
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    initializeData();
    return products.find(p => p.slug === slug) || null;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    initializeData();
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Offers
  getOffers: async (type?: string): Promise<Offer[]> => {
    initializeData();
    let filtered = offers.filter(o => o.is_active);
    if (type) {
      filtered = filtered.filter(o => o.type === type);
    }
    return filtered;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    initializeData();
    return users;
  },

  getUserById: async (id: string): Promise<User | null> => {
    initializeData();
    return users.find(u => u.id === id) || null;
  },

  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: `user_${users.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return users[userIndex];
  },

  // Orders
  getOrders: async (userId?: string): Promise<Order[]> => {
    initializeData();
    let filtered = orders;
    if (userId) {
      filtered = filtered.filter(o => o.user_id === userId);
    }
    return filtered;
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    initializeData();
    return orders.find(o => o.id === id) || null;
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${orders.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    orders.push(newOrder);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order | null> => {
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return null;

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updated_at: new Date().toISOString(),
    };
    return orders[orderIndex];
  },

  // Addresses
  getAddresses: async (userId: string): Promise<Address[]> => {
    initializeData();
    return addresses.filter(a => a.user_id === userId);
  },

  createAddress: async (addressData: Omit<Address, 'id'>): Promise<Address> => {
    const newAddress: Address = {
      ...addressData,
      id: `addr_${addresses.length + 1}`,
    };
    addresses.push(newAddress);
    return newAddress;
  },

  updateAddress: async (id: string, updates: Partial<Address>): Promise<Address | null> => {
    const addrIndex = addresses.findIndex(a => a.id === id);
    if (addrIndex === -1) return null;

    addresses[addrIndex] = { ...addresses[addrIndex], ...updates };
    return addresses[addrIndex];
  },

  deleteAddress: async (id: string): Promise<boolean> => {
    const addrIndex = addresses.findIndex(a => a.id === id);
    if (addrIndex === -1) return false;

    addresses.splice(addrIndex, 1);
    return true;
  },

  // Cart
  getCartItems: async (userId: string): Promise<CartItem[]> => {
    initializeData();
    return cartItems.filter(c => c.user_id === userId);
  },

  addToCart: async (userId: string, productId: string, quantity: number): Promise<CartItem> => {
    const existing = cartItems.find(c => c.user_id === userId && c.product_id === productId);
    const product = products.find(p => p.id === productId);

    if (!product) throw new Error('Product not found');

    if (existing) {
      existing.quantity += quantity;
      return existing;
    } else {
      const newItem: CartItem = {
        id: `cart_${cartItems.length + 1}`,
        user_id: userId,
        product_id: productId,
        quantity,
        product,
      };
      cartItems.push(newItem);
      return newItem;
    }
  },

  updateCartItem: async (id: string, quantity: number): Promise<CartItem | null> => {
    const itemIndex = cartItems.findIndex(c => c.id === id);
    if (itemIndex === -1) return null;

    cartItems[itemIndex].quantity = quantity;
    return cartItems[itemIndex];
  },

  removeFromCart: async (id: string): Promise<boolean> => {
    const itemIndex = cartItems.findIndex(c => c.id === id);
    if (itemIndex === -1) return false;

    cartItems.splice(itemIndex, 1);
    return true;
  },

  clearCart: async (userId: string): Promise<void> => {
    cartItems = cartItems.filter(c => c.user_id !== userId);
  },

  // Reviews
  getReviews: async (productId?: string): Promise<Review[]> => {
    initializeData();
    let filtered = reviews;
    if (productId) {
      filtered = filtered.filter(r => r.product_id === productId);
    }
    // Populate product and user data
    return filtered.map(review => ({
      ...review,
      product: products.find(p => p.id === review.product_id),
      user: users.find(u => u.id === review.user_id),
    }));
  },

  getAllReviews: async (): Promise<Review[]> => {
    return dummyData.getReviews();
  },

  updateReviewStatus: async (id: string, status: 'Approved' | 'Pending' | 'Flagged'): Promise<Review | null> => {
    const reviewIndex = reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) return null;

    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      status,
      updated_at: new Date().toISOString(),
    };
    return reviews[reviewIndex];
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const reviewIndex = reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) return false;

    reviews.splice(reviewIndex, 1);
    return true;
  },

  replyToReview: async (id: string, reply: string): Promise<Review | null> => {
    const reviewIndex = reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) return null;

    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      reply,
      reply_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return reviews[reviewIndex];
  },

  // Stats
  getStats: async () => {
    initializeData();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;
    return {
      products: products.length,
      orders: orders.length,
      users: users.length,
      revenue: totalRevenue,
      lowStockAlerts: lowStockProducts,
    };
  },

  // Additional admin data
  getRecentOrders: async (limit: number = 5) => {
    initializeData();
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  getSalesTrends: async (from?: Date, to?: Date, categoryId?: string, region?: string, productId?: string) => {
    // Mock sales data for the last 30 days or specified range
    const days = from && to ? Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) : 30;
    const salesData = [];
    const startDate = from || new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      salesData.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 5000) + 1000,
        revenue: Math.floor(Math.random() * 10000) + 2000,
        orders: Math.floor(Math.random() * 50) + 10,
        customers: Math.floor(Math.random() * 20) + 5,
      });
    }
    return salesData;
  },

  getRevenueBreakdown: async (from?: Date, to?: Date, categoryId?: string) => {
    initializeData();
    const categorySales = categories.map(cat => {
      const categoryProducts = products.filter(p => p.category_id === cat.id);
      const totalRevenue = categoryProducts.reduce((sum, prod) => sum + (prod.discounted_price || prod.base_price) * prod.stock_quantity, 0);
      return {
        name: cat.name,
        revenue: totalRevenue,
      };
    });
    return categorySales.sort((a, b) => b.revenue - a.revenue);
  },

  getCustomerGrowth: async (from?: Date, to?: Date) => {
    // Mock customer growth data for the last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const customerGrowthData = months.map((month, index) => ({
      month,
      newUsers: Math.floor(Math.random() * 100) + 20,
    }));
    return customerGrowthData;
  },

  getTopCategories: async () => {
    initializeData();
    const categorySales = categories.map(cat => {
      const categoryProducts = products.filter(p => p.category_id === cat.id);
      const totalSales = categoryProducts.reduce((sum, prod) => sum + (prod.discounted_price || prod.base_price) * prod.stock_quantity, 0);
      return {
        name: cat.name,
        sales: totalSales,
      };
    });
    return categorySales.sort((a, b) => b.sales - a.sales).slice(0, 5);
  },

  // Product management
  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${products.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    products.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return products[productIndex];
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;

    products.splice(productIndex, 1);
    return true;
  },

  // Offer management
  createOffer: async (offerData: Omit<Offer, 'id'>): Promise<Offer> => {
    const newOffer: Offer = {
      ...offerData,
      id: `offer_${offers.length + 1}`,
    };
    offers.push(newOffer);
    return newOffer;
  },

  updateOffer: async (id: string, updates: Partial<Offer>): Promise<Offer | null> => {
    const offerIndex = offers.findIndex(o => o.id === id);
    if (offerIndex === -1) return null;

    offers[offerIndex] = { ...offers[offerIndex], ...updates };
    return offers[offerIndex];
  },

  deleteOffer: async (id: string): Promise<boolean> => {
    const offerIndex = offers.findIndex(o => o.id === id);
    if (offerIndex === -1) return false;

    offers.splice(offerIndex, 1);
    return true;
  },

  // User management
  updateUserStatus: async (id: string, isActive: boolean): Promise<User | null> => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };
    return users[userIndex];
  },

  getUserOrderHistory: async (userId: string) => {
    initializeData();
    return orders.filter(o => o.user_id === userId);
  },

  getUserAddresses: async (userId: string) => {
    initializeData();
    return addresses.filter(a => a.user_id === userId);
  },

  getUserOrderCount: async (userId: string): Promise<number> => {
    initializeData();
    return orders.filter(o => o.user_id === userId).length;
  },

  // Inventory management
  getLowStockProducts: async (threshold: number = 10): Promise<Product[]> => {
    initializeData();
    return products.filter(p => p.stock_quantity <= threshold);
  },

  updateStock: async (productId: string, newStock: number): Promise<Product | null> => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      stock_quantity: newStock,
      updated_at: new Date().toISOString(),
    };
    return products[productIndex];
  },

  bulkUpdateStock: async (updates: { productId: string; newStock: number }[]): Promise<Product[]> => {
    const updatedProducts: Product[] = [];
    for (const update of updates) {
      const product = await dummyData.updateStock(update.productId, update.newStock);
      if (product) updatedProducts.push(product);
    }
    return updatedProducts;
  },

  exportInventory: async (): Promise<string> => {
    initializeData();
    const csvHeaders = 'Product Name,SKU,Category,Stock Quantity,Stock Status,Price\n';
    const csvRows = products.map(product => {
      const category = categories.find(cat => cat.id === product.category_id);
      const stockStatus = product.stock_quantity === 0 ? 'Out of Stock' :
                         product.stock_quantity < 10 ? 'Low Stock' : 'In Stock';
      return `"${product.name}","${product.id}","${category?.name || 'N/A'}","${product.stock_quantity}","${stockStatus}","₹${product.base_price.toFixed(2)}"`;
    }).join('\n');
    return csvHeaders + csvRows;
  },

  setReorderThreshold: async (threshold: number): Promise<void> => {
    // In a real implementation, this would save to database
    // For dummy data, we just acknowledge the setting
    console.log(`Reorder threshold set to ${threshold}`);
  },

  // Stock adjustments and history
  adjustStock: async (productId: string, adjustment: number, reason: string, createdBy?: string): Promise<StockAdjustment | null> => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return null;

    const newStock = products[productIndex].stock_quantity + adjustment;
    if (newStock < 0) return null; // Prevent negative stock

    products[productIndex] = {
      ...products[productIndex],
      stock_quantity: newStock,
      updated_at: new Date().toISOString(),
    };

    const adjustmentRecord: StockAdjustment = {
      id: `adj_${stockHistory.length + 1}`,
      product_id: productId,
      adjustment,
      reason,
      created_at: new Date().toISOString(),
      created_by: createdBy,
    };

    stockHistory.push(adjustmentRecord);
    return adjustmentRecord;
  },

  getStockHistory: async (productId?: string, limit: number = 50): Promise<StockAdjustment[]> => {
    initializeData();
    let filtered = stockHistory;
    if (productId) {
      filtered = filtered.filter(h => h.product_id === productId);
    }
    return filtered
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  getRecentStockMovements: async (limit: number = 10): Promise<StockAdjustment[]> => {
    initializeData();
    return stockHistory
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  getInventoryStats: async () => {
    initializeData();
    const totalSKUs = products.length;
    const inStockSKUs = products.filter(p => p.stock_quantity > 0).length;
    const lowStockSKUs = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
    const outOfStockSKUs = products.filter(p => p.stock_quantity === 0).length;
    const recentMovements = await dummyData.getRecentStockMovements(5);

    return {
      totalSKUs,
      inStockSKUs,
      lowStockSKUs,
      outOfStockSKUs,
      recentMovements,
    };
  },

  // Ticket management
  getTickets: async (filters?: {
    userId?: string;
    status?: string;
    priority?: string;
    assignedAdminId?: string;
  }): Promise<Ticket[]> => {
    initializeData();
    let filtered = tickets;

    if (filters?.userId) {
      filtered = filtered.filter(t => t.user_id === filters.userId);
    }
    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    if (filters?.assignedAdminId) {
      filtered = filtered.filter(t => t.assigned_admin_id === filters.assignedAdminId);
    }

    // Populate user, order, and assigned admin data
    return filtered.map(ticket => ({
      ...ticket,
      user: users.find(u => u.id === ticket.user_id),
      order: ticket.order_id ? orders.find(o => o.id === ticket.order_id) : undefined,
      assigned_admin: ticket.assigned_admin_id ? users.find(u => u.id === ticket.assigned_admin_id) : undefined,
    }));
  },

  getTicketById: async (id: string): Promise<Ticket | null> => {
    initializeData();
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return null;

    return {
      ...ticket,
      user: users.find(u => u.id === ticket.user_id),
      order: ticket.order_id ? orders.find(o => o.id === ticket.order_id) : undefined,
      assigned_admin: ticket.assigned_admin_id ? users.find(u => u.id === ticket.assigned_admin_id) : undefined,
      replies: ticketReplies.filter(r => r.ticket_id === id).map(reply => ({
        ...reply,
        user: users.find(u => u.id === reply.user_id),
      })),
    };
  },

  createTicket: async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'replies' | 'user' | 'order' | 'assigned_admin'>): Promise<Ticket> => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `ticket_${tickets.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: [],
      user: users.find(u => u.id === ticketData.user_id),
      order: ticketData.order_id ? orders.find(o => o.id === ticketData.order_id) : undefined,
      assigned_admin: ticketData.assigned_admin_id ? users.find(u => u.id === ticketData.assigned_admin_id) : undefined,
    };
    tickets.push(newTicket);
    return newTicket;
  },

  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
    const ticketIndex = tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) return null;

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Re-populate related data
    const updatedTicket = tickets[ticketIndex];
    return {
      ...updatedTicket,
      user: users.find(u => u.id === updatedTicket.user_id),
      order: updatedTicket.order_id ? orders.find(o => o.id === updatedTicket.order_id) : undefined,
      assigned_admin: updatedTicket.assigned_admin_id ? users.find(u => u.id === updatedTicket.assigned_admin_id) : undefined,
    };
  },

  deleteTicket: async (id: string): Promise<boolean> => {
    const ticketIndex = tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) return false;

    // Delete associated replies
    ticketReplies = ticketReplies.filter(r => r.ticket_id !== id);

    tickets.splice(ticketIndex, 1);
    return true;
  },

  // Ticket reply management
  getTicketReplies: async (ticketId: string): Promise<TicketReply[]> => {
    initializeData();
    return ticketReplies
      .filter(r => r.ticket_id === ticketId)
      .map(reply => ({
        ...reply,
        user: users.find(u => u.id === reply.user_id),
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  createTicketReply: async (replyData: Omit<TicketReply, 'id' | 'created_at' | 'user'>): Promise<TicketReply> => {
    const newReply: TicketReply = {
      ...replyData,
      id: `reply_${ticketReplies.length + 1}`,
      created_at: new Date().toISOString(),
      user: users.find(u => u.id === replyData.user_id),
    };
    ticketReplies.push(newReply);

    // Update ticket's updated_at
    const ticketIndex = tickets.findIndex(t => t.id === replyData.ticket_id);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].updated_at = new Date().toISOString();
    }

    return newReply;
  },

  updateTicketReply: async (id: string, updates: Partial<TicketReply>): Promise<TicketReply | null> => {
    const replyIndex = ticketReplies.findIndex(r => r.id === id);
    if (replyIndex === -1) return null;

    ticketReplies[replyIndex] = { ...ticketReplies[replyIndex], ...updates };
    return {
      ...ticketReplies[replyIndex],
      user: users.find(u => u.id === ticketReplies[replyIndex].user_id),
    };
  },

  deleteTicketReply: async (id: string): Promise<boolean> => {
    const replyIndex = ticketReplies.findIndex(r => r.id === id);
    if (replyIndex === -1) return false;

    ticketReplies.splice(replyIndex, 1);
    return true;
  },

  // Transaction management
  getTransactions: async (filters?: {
    order_id?: string;
    status?: string;
    payment_method?: string;
  }): Promise<Transaction[]> => {
    initializeData();
    let filtered = transactions;

    if (filters?.order_id) {
      filtered = filtered.filter(t => t.order_id === filters.order_id);
    }
    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters?.payment_method) {
      filtered = filtered.filter(t => t.payment_method === filters.payment_method);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getTransactionById: async (id: string): Promise<Transaction | null> => {
    initializeData();
    return transactions.find(t => t.id === id) || null;
  },

  createTransaction: async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `txn_${transactions.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction | null> => {
    const transactionIndex = transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return null;

    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return transactions[transactionIndex];
  },

  deleteTransaction: async (id: string): Promise<boolean> => {
    const transactionIndex = transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) return false;

    transactions.splice(transactionIndex, 1);
    return true;
  },
};
