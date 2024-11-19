import { useState, useEffect } from 'react'
import { RiMoonLine, RiSunLine, RiAddLine, RiCloseLine } from 'react-icons/ri'
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)
  const [name, setName] = useState(getFromLocalStorage('userName', ''))
  const [interests, setInterests] = useState(getFromLocalStorage('userInterests', []))
  const [newInterest, setNewInterest] = useState('')
  const [profilePic, setProfilePic] = useState(getFromLocalStorage('userProfilePic', ''))
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    saveToLocalStorage('userName', e.target.value)
  }

  const addInterest = (e) => {
    e.preventDefault()
    if (newInterest.trim()) {
      const updatedInterests = [...interests, newInterest.trim()]
      setInterests(updatedInterests)
      saveToLocalStorage('userInterests', updatedInterests)
      setNewInterest('')
    }
  }

  const removeInterest = (index) => {
    const updatedInterests = interests.filter((_, i) => i !== index)
    setInterests(updatedInterests)
    saveToLocalStorage('userInterests', updatedInterests)
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePic(reader.result)
        saveToLocalStorage('userProfilePic', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6 text-primary">Settings</h1>
      
      <div className="space-y-4">
        <div className="bg-dark-light rounded-lg p-4 border border-primary-dark">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">Dark Mode</h3>
              <p className="text-sm text-primary-dark">Toggle dark mode</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-dark rounded-lg text-primary hover:bg-primary hover:text-dark transition-colors"
            >
              {darkMode ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
            </button>
          </div>
        </div>

        <div className="bg-dark-light rounded-lg p-4 border border-primary-dark">
          <h3 className="font-semibold text-primary mb-4">Profile Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-primary-dark mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-dark-light flex items-center justify-center text-primary-dark">
                      No Image
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="text-sm text-primary-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-dark hover:file:bg-primary-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-primary-dark mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="w-full p-2 rounded-lg border border-primary-dark bg-dark text-primary placeholder-primary-dark/50"
              />
            </div>

            <div>
              <label className="block text-sm text-primary-dark mb-2">Interests</label>
              <form onSubmit={addInterest} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  className="flex-1 p-2 rounded-lg border border-primary-dark bg-dark text-primary placeholder-primary-dark/50"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-dark rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <RiAddLine size={20} />
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-dark rounded-full px-3 py-1 text-primary border border-primary-dark"
                  >
                    <span className="text-sm">{interest}</span>
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-primary-dark hover:text-primary"
                    >
                      <RiCloseLine size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
