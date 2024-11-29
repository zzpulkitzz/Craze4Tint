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
        className="bg-gray-700 hover:bg-black text-white font-bold py-2 px-4 rounded"
      >
        Add to Cart
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
