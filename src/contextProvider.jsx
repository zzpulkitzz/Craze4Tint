import { createContext, useState, useEffect } from "react";
import { getFirestore, doc, setDoc ,getDoc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';

export const ScrollContext = createContext();
export const ChangeScrollContext = createContext();
export const ItemsContext = createContext();
export const AuthContext = createContext();

export default function ContextProvider({children}) {
    const [isScroll, setIsScroll] = useState(false);
    const [items, setItems] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const firebaseConfig = {
        apiKey: "AIzaSyD3AWLH7wYyVy7USofDvCLmiE3_u0q4RPo",
        authDomain: "craze4tint-d7bed.firebaseapp.com",
        projectId: "craze4tint-d7bed",
        storageBucket: "craze4tint-d7bed.firebasestorage.app",
        messagingSenderId: "786218460338",
        appId: "1:786218460338:web:02df030c31eb0f5863d5ab",
        measurementId: "G-X1J18V9CZW"
      };
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);
      
      async function handleLoginWithFirebase(email,password){
        try {
          let request=await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          
          console.log(request.user.email)
          const currentUser = auth.currentUser;
          let token=await currentUser.getIdToken()
          console.log(token)
        } catch (error) {
            console.log("firebase error:",error)
            throw new error 
        }
      }

      async function handleSignupWithFirebase(email,password){
        try{
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
        }catch(err){
            console.log(err)
            throw err
        }
      }

      async function setCartId(email,cartId){
        try{
            await setDoc(doc(db, 'userCarts', email), {
                cartId: cartId,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
              });
              console.log('Cart ID successfully stored in Firestore');
        }catch(error){
            console.log(error)
        }
      }
      const getCartIdForUser = async (email) => {
        try {
          // Get reference to the user's document
          const userCartRef = doc(db, 'userCarts', email);
          
          // Get the document
          const docSnap = await getDoc(userCartRef);
          
          if (docSnap.exists()) {
            // Document exists - return the cartId
            return docSnap.data().cartId;
          } else {
            // No document found for this email
            console.log("No cart found for this user");
            return null;
          }
        } catch (error) {
          console.error("Error fetching cart ID:", error);
          const currentUser = auth.currentUser;
          let token=await currentUser.getIdToken()
          console.log(token)
          return null;
        }
      }
    function chngIsScroll(value) {
        setIsScroll(() => {     
            return value;
        });
    }
   
    
    function changeCurrentUser(value) {
      setCurrentUser(() => {     
          return value;
      });
  }
 
    
    
    
  

    const value = {
        currentUser,
        changeCurrentUser,
        handleLoginWithFirebase,
        handleSignupWithFirebase,
        getCartIdForUser,
        setCartId
    };
     

    return (
        <AuthContext.Provider value={value}>
            <ScrollContext.Provider value={isScroll}>
                <ChangeScrollContext.Provider value={chngIsScroll}>
                    <ItemsContext.Provider value={items}>
                        {children}
                    </ItemsContext.Provider>
                </ChangeScrollContext.Provider>
            </ScrollContext.Provider>
        </AuthContext.Provider>
    );
}