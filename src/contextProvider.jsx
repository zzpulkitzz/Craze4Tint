import { createContext, useState, useEffect } from "react";


export const ScrollContext = createContext();
export const ChangeScrollContext = createContext();
export const ItemsContext = createContext();
export const AuthContext = createContext();

export default function ContextProvider({children}) {
    const [isScroll, setIsScroll] = useState(false);
    const [items, setItems] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

  
    
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
        changeCurrentUser
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