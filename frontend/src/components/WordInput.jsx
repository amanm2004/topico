import axios from 'axios'
import { useState } from 'react'

export default function WordInput() {
  const [word, setWord] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!word.trim()) return
    try {
      await axios.post('http://localhost:5000/submit-word', { word })
      setWord('')
    } catch (error) {
      console.error('Error submitting word:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter your secret word"
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
      />
      <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', background: '#2563eb', color: 'white', border: 'none' }}>
        Submit
      </button>
    </form>
  )
}
