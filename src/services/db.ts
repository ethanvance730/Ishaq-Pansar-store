import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Product, Category, Order, StoreSettings, ProductVariation } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_STORE_SETTINGS } from '../data/initialData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';

export async function initializeDatabaseIfEmpty(): Promise<void> {
  try {
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnapshot.empty) {
      console.log('Seeding initial products into Firestore...');
      const batch = writeBatch(db);

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
        batch.set(catRef, {
          ...cat,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        batch.set(prodRef, {
          ...prod,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Seed settings
      const settingsRef = doc(db, SETTINGS_COLLECTION, 'general');
      batch.set(settingsRef, {
        ...INITIAL_STORE_SETTINGS,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      console.log('Firestore seed completed successfully.');
    } else {
      // If products exist, check if general settings exist or need updating
      const settingsRef = doc(db, SETTINGS_COLLECTION, 'general');
      const settingsSnap = await getDoc(settingsRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsRef, {
          ...INITIAL_STORE_SETTINGS,
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.warn('Database initialization check error (fallback will use local data if network/rules restricted):', error);
  }
}

// PRODUCT OPERATIONS
export async function getProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      return INITIAL_PRODUCTS;
    }
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
    });
    return products;
  } catch (err) {
    console.warn('Error fetching products from Firestore, using initial fallback:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) };
    }
    // Fallback to initial
    const fallback = INITIAL_PRODUCTS.find((p: Product) => p.id === id || p.slug === id);
    return fallback || null;
  } catch (err) {
    console.warn('Error fetching product by id, using fallback:', err);
    return INITIAL_PRODUCTS.find((p: Product) => p.id === id || p.slug === id) || null;
  }
}

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<string> {
  const id = product.id || (product.slug ? product.slug : `prod-${Date.now()}`);
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const dataToSave = {
      ...product,
      id,
      updatedAt: serverTimestamp()
    };
    if (!product.id) {
      dataToSave.createdAt = serverTimestamp();
    }
    await setDoc(docRef, dataToSave, { merge: true });
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

// CATEGORY OPERATIONS
export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (snapshot.empty) {
      return INITIAL_CATEGORIES;
    }
    const categories: Category[] = [];
    snapshot.forEach((docSnap) => {
      categories.push({ id: docSnap.id, ...(docSnap.data() as Omit<Category, 'id'>) });
    });
    return categories;
  } catch (err) {
    console.warn('Error fetching categories from Firestore:', err);
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(docRef, {
    ...category,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// ORDER OPERATIONS
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  try {
    const orderDocRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update stock in products collection for placed items
    for (const item of orderData.items) {
      try {
        const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const pData = prodSnap.data() as Product;
          const currentStock = pData.stock ?? 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          let updatedVariations = pData.variations;
          if (updatedVariations && item.variationSku) {
            updatedVariations = updatedVariations.map((v: ProductVariation) => {
              if (v.sku === item.variationSku) {
                return { ...v, stock: Math.max(0, v.stock - item.quantity) };
              }
              return v;
            });
          }

          await updateDoc(prodRef, {
            stock: newStock,
            inStock: newStock > 0,
            variations: updatedVariations || null,
            updatedAt: serverTimestamp()
          });
        }
      } catch (stockErr) {
        console.warn('Could not update product stock upon order creation:', stockErr);
      }
    }

    return {
      id: orderDocRef.id,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error creating order in Firestore:', err);
    throw err;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
      } as Order);
    });
    return orders;
  } catch (err) {
    console.warn('Error fetching orders with query, trying simple fetch:', err);
    try {
      const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
        } as Order);
      });
      return orders;
    } catch (finalErr) {
      console.warn('No orders retrieved or network error:', finalErr);
      return [];
    }
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

// STORE SETTINGS
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...INITIAL_STORE_SETTINGS, ...docSnap.data() } as StoreSettings;
    }
    return INITIAL_STORE_SETTINGS;
  } catch (err) {
    console.warn('Error fetching store settings:', err);
    return INITIAL_STORE_SETTINGS;
  }
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'general');
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/general`);
  }
}
