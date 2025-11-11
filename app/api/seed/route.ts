import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';
import Review from '@/models/Review';
import Offer from '@/models/Offer';
import Transaction from '@/models/Transaction';
import Ticket from '@/models/Ticket';
import { seedCategories, seedProducts, seedOffers } from '@/lib/seed-data';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Offer.deleteMany({}),
      Transaction.deleteMany({}),
      Ticket.deleteMany({}),
    ]);

    // Seed categories
    const categories = seedCategories.map((cat, index) => ({
      ...cat,
      id: `cat_${index + 1}`,
      parent_id: index >= 15 ? `cat_${(index % 3) + 1}` : null,
      created_at: new Date(),
    }));
    await Category.insertMany(categories);

    // Seed products
    const categoryMap: Record<string, string> = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id;
    });

    const products = seedProducts(categoryMap).map((prod, index) => ({
      ...prod,
      id: `prod_${index + 1}`,
      is_featured: prod.is_featured || false,
      is_new_arrival: prod.is_new_arrival || false,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await Product.insertMany(products);

    // Seed offers
    const offers = seedOffers.map((offer, index) => ({
      ...offer,
      id: `offer_${index + 1}`,
    }));
    await Offer.insertMany(offers);

    // Seed users
    const users = [
      {
        id: 'user_1',
        email: 'admin@example.com',
        full_name: 'Admin User',
        avatar_url: null,
        phone: null,
        is_admin: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'user_2',
        email: 'user@example.com',
        full_name: 'Regular User',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'user_3',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'user_4',
        email: 'jane.smith@example.com',
        full_name: 'Jane Smith',
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await User.insertMany(users);

    // Seed orders
    const orders = [
      {
        id: 'order_1',
        user_id: 'user_2',
        total: 299.99,
        status: 'delivered',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        items: [
          {
            id: 'item_1',
            order_id: 'order_1',
            product_id: 'prod_1',
            quantity: 1,
            price: 299.99,
          },
        ],
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
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        items: [
          {
            id: 'item_2',
            order_id: 'order_2',
            product_id: 'prod_2',
            quantity: 2,
            price: 74.99,
          },
        ],
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
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        items: [
          {
            id: 'item_3',
            order_id: 'order_3',
            product_id: 'prod_3',
            quantity: 1,
            price: 89.99,
          },
        ],
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
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          {
            id: 'item_4',
            order_id: 'order_4',
            product_id: 'prod_4',
            quantity: 1,
            price: 199.99,
          },
        ],
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
    await Order.insertMany(orders);

    // Seed reviews
    const reviews = [
      {
        id: 'rev_1',
        product_id: 'prod_1',
        user_id: 'user_2',
        rating: 5,
        comment: 'Excellent product! Highly recommend it.',
        status: 'Approved',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev_2',
        product_id: 'prod_1',
        user_id: 'user_3',
        rating: 4,
        comment: 'Good quality, but delivery was a bit slow.',
        status: 'Approved',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev_3',
        product_id: 'prod_2',
        user_id: 'user_4',
        rating: 3,
        comment: 'Average product. Nothing special.',
        status: 'Pending',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev_4',
        product_id: 'prod_3',
        user_id: 'user_2',
        rating: 1,
        comment: 'Very disappointed with this purchase.',
        status: 'Flagged',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'rev_5',
        product_id: 'prod_4',
        user_id: 'user_3',
        rating: 5,
        comment: 'Amazing! Exceeded my expectations.',
        status: 'Approved',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reply: 'Thank you for your kind words! We\'re glad you loved it.',
        reply_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];
    await Review.insertMany(reviews);

    // Seed transactions
    const transactions = [
      {
        id: 'txn_1',
        order_id: 'order_1',
        amount: 299.99,
        currency: 'INR',
        status: 'completed',
        payment_method: 'Credit Card',
        transaction_id: 'txn_123456789',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'txn_2',
        order_id: 'order_2',
        amount: 149.98,
        currency: 'INR',
        status: 'completed',
        payment_method: 'PayPal',
        transaction_id: 'txn_987654321',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'txn_3',
        order_id: 'order_3',
        amount: 89.99,
        currency: 'INR',
        status: 'failed',
        payment_method: 'Credit Card',
        transaction_id: 'txn_456789123',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'txn_4',
        order_id: 'order_4',
        amount: 199.99,
        currency: 'INR',
        status: 'pending',
        payment_method: 'Debit Card',
        transaction_id: 'txn_789123456',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'txn_5',
        order_id: 'order_2',
        amount: 149.98,
        currency: 'INR',
        status: 'refunded',
        payment_method: 'PayPal',
        transaction_id: 'txn_321654987',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    await Transaction.insertMany(transactions);

    // Seed tickets
    const tickets = [
      {
        id: 'ticket_1',
        user_id: 'user_2',
        order_id: 'order_1',
        subject: 'Order not delivered',
        description: 'I placed an order 2 weeks ago but haven\'t received it yet. Can you please check the status?',
        priority: 'High',
        status: 'Open',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        attachments: ['screenshot1.jpg'],
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
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: ['wrong_item.jpg', 'order_invoice.pdf'],
      },
      {
        id: 'ticket_3',
        user_id: 'user_4',
        subject: 'Refund request',
        description: 'I want to return the product I received. It\'s not working as expected.',
        priority: 'Medium',
        status: 'Resolved',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        attachments: [],
      },
      {
        id: 'ticket_4',
        user_id: 'user_2',
        subject: 'Account login issue',
        description: 'I\'m unable to login to my account. It says invalid credentials but I\'m sure the password is correct.',
        priority: 'Low',
        status: 'Closed',
        assigned_admin_id: 'user_1',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        attachments: [],
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
        created_at: new Date(),
        updated_at: new Date(),
        attachments: ['payment_error.png'],
      },
    ];
    await Ticket.insertMany(tickets);

    // Get stats
    const stats = {
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      users: await User.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments(),
      offers: await Offer.countDocuments(),
      transactions: await Transaction.countDocuments(),
      tickets: await Ticket.countDocuments(),
    };

    return NextResponse.json({
      message: 'MongoDB seeded successfully',
      stats,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
