import { useState } from "react"
import { CartNotification } from "./CartNotification"
export function AddToCartButton({ item }) {
  const [showNotification, setShowNotification] = useState(false)

  const handleAddToCart = () => {
    // Add your logic here to actually add the item to the cart
    console.log(`Added ${item.title} to cart`)
    setShowNotification(true)
  }

  return (
    <>
      <button
        onClick={handleAddToCart}
        className="bg-gray-900 hover:bg-black text-white font-normal py-2 px-4 rounded flex flex-row gap-2 font-raleway tracking-wider text-sm w-[100%] justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span className="flex items-center justify-center my-auto">ADD TO BAG</span>

      </button>
      {showNotification && (
        <CartNotification
          item={item}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  )
}
