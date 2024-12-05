import React from "react";
import whatsApp from "./assets/wp.webp"
function WhatsAppChat() {
  const phoneNumber = "+9170537 66702"; // Replace with your number
  const message = encodeURIComponent("Hi there! I'd like to chat with you");
  const whatsappLink = `https://api.whatsapp.com/send/?phone=+917053766702&text=${message}%60&type=phone_number&app_absent=0`;

  return (
    <div className="fixed bottom-[10px] right-[10px] z-[100] hover:h-[35px] hover:w-[35px] h-[30px] w-[30px] transition-all">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
         
        }}
        className=""
      >
        <img
          src={whatsApp} // WhatsApp icon (replace with your icon)
          alt="WhatsApp"
          style={{  marginRight: "10px" }}
          className="h-[100%] hover:w-[100%]"
        />
      </a>
    </div>
  );
}

export default WhatsAppChat;