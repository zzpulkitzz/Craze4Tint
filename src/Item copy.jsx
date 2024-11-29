import { useState } from 'react'
import { Share2, Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import tshirt5 from "./assets/tshirt5.png"
import size from "./assets/size.png"
export default function Item() {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')

  const sizes = ['S', 'M', 'L', 'XL']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 absolute top-[195px] font-roboto">
      <div className="flex flex-row ">
        {/* Left column */}
        <div className="flex flex-col-reverse justify-end">
          {/* Image selector */}
          <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <div className="flex flex-row" aria-orientation="horizontal" role="tablist">
              {[1, 2, 3, 4].map((img) => (
                <button
                  key={img}
                  className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                >
                  <span className="sr-only">Thumbnail {img}</span>
                  <span className="absolute inset-0 rounded-md overflow-hidden">
                    <img src={`/placeholder.svg?height=96&width=96`} alt="" className="w-full h-full object-center object-cover" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main image */}
          <div className="w-full aspect-w-1 aspect-h-1">
            <img src={tshirt5} alt="Main product image" className="w-[50vw] object-center object-cover sm:rounded-lg" />
          </div>
        </div>

        {/* Right column */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 ml-[45px]">
          <div className="flex justify-between">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">BLOOMS COFFEE BROWN OVERSIZED T-SHIRT</h1>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <div className="mt-3 font-light">
            <h2 className="sr-only">Product information</h2>
            <p className="text-lg text-gray-900">
              <span className="line-through text-gray-500 mr-2">Rs. 1,599.00</span>
              Rs. 799.00
            </p>
          </div>

          {/* Size picker */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-600">Size</h3>
            <div className="mt-2">
              <div className="flex items-center space-x-3">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="w-9 h-9 rounded-full"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity picker */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-600">Quantity</h3>
            <div className="flex items-center mt-2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                className="mx-2 w-16 text-center border-gray-300 rounded-md"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart and Buy now buttons */}
          <div className="mt-6 font-light">
            <Button className="w-full mb-3">ADD TO BAG</Button>
            <Button  className="w-full">BUY IT NOW</Button>
          </div>

          {/* Product features */}
          <div className="mt-6 font-light ">
            <h3 className="text-sm font-light text-gray-900">Features</h3>
            <ul className="mt-2 list-disc pl-4 text-sm text-gray-600">
              <li>Printed Oversized T-shirts</li>
              <li>Made from soft, breathable fabric for maximum comfort</li>
              <li>Perfect for any occasion - dress up or keep it casual</li>
              <li>Available in Small, Medium, Large, and Extra Large sizes</li>
              <li>Relaxed fit designed to flatter every body type</li>
              <li>Wear Your Confidence with this versatile wardrobe staple</li>
            </ul>
          </div>

          {/* Size chart */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">OVERSIZED T-SHIRT GARMENT MEASUREMENT IN INCHES.</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['SIZE', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map((header) => (
                      <th key={header} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">CHEST</td>
                    {[40, 42, 44, 46, 48, 50, 52, 54, 56].map((size, index) => (
                      <td key={index} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{size}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">LENGTH</td>
                    {[27, 28, 29, 30, 31, 32, 33, 34, 35].map((size, index) => (
                      <td key={index} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{size}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to measure */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">HOW TO MEASURE?</h3>
            <div className="mt-2 flex items-center">
              <img src={size} alt="How to measure diagram" className="w-24 h-24 object-contain" />
              <div className="ml-4 text-xs text-gray-600">
                <p><strong>CHEST:</strong> Measure from armpit to armpit and then multiply by 2.</p>
                <p><strong>LENGTH:</strong> Measure from the top of the shoulder to the bottom hem.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}