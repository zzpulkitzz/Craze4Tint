import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', { name, email, phone, comment })
  }

  return (
    <div className="sm:w-[500px] w-[350px] mx-auto p-8 absolute top-[170px] left-[50vw] translate-x-[-175px] sm:translate-x-[-250px] translate-y-[10px] sm:translate-y-[10px] bg-gray-100 text-black font-raleway px-[40px] shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-6">Contact</h1>
      <div className="mb-6">
        <p className="text-sm">Email: Shynenterprises.info@gmail.com</p>
        <p className="text-sm">Phone:</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
            />
          </div>
          <div>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone" className="sr-only">
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border-gray-400 focus:border-black focus:ring-0 border-0 border-b-[1px] rounded-[0px]"
          />
        </div>
        <div>
          <Label htmlFor="comment" className="sr-only">
            Comment
          </Label>
          <Textarea
            id="comment"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border-gray-300"
          />
        </div>
        <div className='flex justify-center'>
          <Button type="submit" className="bg-black text-white hover:bg-gray-200 hover:text-black">
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}