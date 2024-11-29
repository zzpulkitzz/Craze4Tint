import { useState } from 'react'
import Home from "./Home"
import {RouterProvider,createRoutesFromElements,createBrowserRouter,BrowserRouter , Routes,Route, Link,redirect,defer} from 'react-router-dom'
import './App.css'
import Navbar from './Navbar'
import  ScrollContextProvider  from "./contextProvider";
import Contact from "./Contact"
import Profile from "./Profile"
import Cart from "./Cart"
import Shop from "./Shop"
import Item from "./Item"
import Login from "./Login"
import Test from "./testfetch"
import ChangePass from "./ChangePass"
import MyOrders from "./MyOrders"
import MyWishlist from "./MyWishlist"
import UserInfo from "./UserInfo"
import NewAddress from "./NewAddress"
import Addresses from './Addresses'

export default function App() {
 
localStorage.setItem("currentUser","null")

  return <div>
    <ScrollContextProvider>
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(

    <Route path="/" element={<Navbar/>}>
      <Route index element={<Home/>}/>
      <Route path="/shop" element={<Shop/>}/>
      <Route path="/shop/gid://shopify/Product/:gid" element={<Item />} />
       
      
      
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/profile" loader={()=>{
        if(localStorage.getItem("currentUser")==="null"){
         let response=redirect("/login")
         return response
        }
        return null
      }} element={<Profile/>}>
          <Route index element={<UserInfo/>}/>
          <Route path="addresses" element={<Addresses/>}/>
          <Route path="newAddress" element={<NewAddress/>}/>
          <Route path="myorders" element={<MyOrders/>}/>
          <Route path="mywishlist" element={<MyWishlist/>}/>
          <Route path="changepass" element={<ChangePass/>}/>
      </Route>
      <Route path="/login" element={<Login/>}/>
      
      <Route path="/cart" element={<Cart/>}/>
      <Route  path="test" element={<Test/>}/>
    
    </Route>

))} />
  </ScrollContextProvider>
</div>

}
