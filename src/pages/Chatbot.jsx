import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ReactMarkdown from 'react-markdown'
import { RiSendPlaneFill, RiTimeLine } from 'react-icons/ri'
import { getTimeOfDay, formatTime, formatDate } from '../utils/timeUtils'
import { getFromLocalStorage } from '../utils/storage'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MAX_AVATAR = "https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/5926bc2a-52aa-4820-8cbb-6b0a35d522ba/Leonardo_Kino_XL_A_tall_black_and_chrome_robot_in_a_business_s_0.jpg"

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const userName = getFromLocalStorage('userName', 'User')
    const greeting = `Good ${getTimeOfDay()}, ${userName}! I'm MAX (Modular AI eXpert). How can I assist you today?`
    setMessages([{ role: 'assistant', content: greeting }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const userName = getFromLocalStorage('userName', 'User')
      const userInterests = getFromLocalStorage('userInterests', [])

      const contextPrompt = `Current time: ${formatTime()}
Current date: ${formatDate()}
Time of day: ${getTimeOfDay()}
User's name: ${userName}
User's interests: ${userInterests.join(', ')}
User message: ${input}

Please provide a personalized response that's contextually aware of the current time, date, and the user's interests when relevant. Keep the response concise and friendly.`

      const result = await model.generateContent(contextPrompt)
      const response = await result.response
      const text = response.text()

      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-dark">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-dark bg-dark-light">
        <div className="flex items-center gap-3">
          <img
            src={MAX_AVATAR}
            alt="MAX"
            className="w-10 h-10 rounded-full object-cover border border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-primary">MAX</h1>
            <p className="text-xs text-primary-dark">Modular AI eXpert</p>
          </div>
        </div>
        <div className="flex items-center text-primary-dark text-sm">
          <RiTimeLine className="mr-1" />
          {formatTime()}
        </div>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`flex items-end gap-2 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {message.role === 'assistant' && (
                <img
                  src={MAX_AVATAR}
                  alt="MAX"
                  className="w-8 h-8 rounded-full object-cover border border-primary-dark"
                />
              )}
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-dark'
                    : 'bg-dark-light text-primary border border-primary-dark'
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              {message.role === 'user' && getFromLocalStorage('userProfilePic') && (
                <img
                  src={getFromLocalStorage('userProfilePic')}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-primary-dark"
                />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="flex items-end gap-2">
              <img
                src={MAX_AVATAR}
                alt="MAX"
                className="w-8 h-8 rounded-full object-cover border border-primary-dark"
              />
              <div className="inline-block bg-dark-light text-primary border border-primary-dark p-3 rounded-lg">
                MAX is thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Fixed Input Area */}
      <div className="p-4 border-t border-primary-dark bg-dark">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MAX anything..."
            className="flex-1 p-2 rounded-lg border border-primary-dark bg-dark-light text-primary placeholder-primary-dark/50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-dark p-2 rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors"
          >
            <RiSendPlaneFill size={24} />
          </button>
        </form>
      </div>
    </div>
  )
}
