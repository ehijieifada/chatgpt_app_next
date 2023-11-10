import { useState, useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue }])

    sendMessage(inputValue);
    
    setInputValue('');
  }

  const sendMessage = (message) => {
    const url = 'https://api.openai.com/v1/chat/completions'   
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": message }]
    };

    setIsLoading(true);
 
    axios.post(url, data, {headers: headers}).then((response) => {
      console.log(response);
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: response.data.choices[0].message.content }])
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    })
  }

  return (
    <div className="container">
      <div className="flex flex-col h-screen overflow-scroll">
        <h1 className="text-white py-3 px-3 text-center font-bold">Welcome! I am your assistant</h1>

         <div className="flex-grow p-6">
          <div className="flex flex-col space-y-4">
          {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.type === 'user' ? 'bg-orange-500' : 'bg-gray-100'
            } rounded-lg p-2 text-black max-w-4xl`}>
            {message.message}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="  p-2 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
      </div>
        </div> 
        <form onSubmit={handleSubmit} className=" flex justify-center p-6">
          <div className=" px-2" id="form">  
        <input type="text" className="flex-grow  py-2 " id="input" placeholder=" Type your message " value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className=" bg-orange-500  py-3 px-4 float-right text-white font-semibold focus:outline-none hover:bg-gray-900 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
</div>

  )
}