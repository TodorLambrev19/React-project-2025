import { db } from '../firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc, 
    deleteDoc,
    updateDoc 
} from 'firebase/firestore';

const collectionName = 'products';

export async function createProduct(productData) {
    await addDoc(collection(db, collectionName), productData);
}

export async function getAllProducts() {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function getProductById(id) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Product not found");
    }
}

export async function deleteProduct(id) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

export async function updateProduct(id, productData) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, productData);
}