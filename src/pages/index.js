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
    const url = '/api/chat';
  
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": message }]
    };

    setIsLoading(true);
 
    axios.post(url, data).then((response) => {
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
            } rounded-lg p-4 text-black max-w-sm`}>
            {message.message}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="  p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
      </div>
        </div> 
        <form onSubmit={handleSubmit} className=" flex justify-center p-6">
          <div className="w-1/2 px-2  bg-gray-900" id="form">  
        <input type="text" className=" flex-grow  py-2 bg-transparent text-white focus:outline-none" placeholder="Type your message " value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className=" bg-orange-500  py-3 px-4 justify-end float-right text-white font-semibold focus:outline-none hover:bg-gray-900 transition-colors duration-300">Send</button>
            </div>
        </form>
        </div>
</div>

  )
}