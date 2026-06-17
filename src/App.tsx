import { useState } from 'react'
import Home from './pages/Home'
import RollingMotion from './pages/RollingMotion'
import BallisticPendulum from './pages/BallisticPendulum'
import KaterPendulum from './pages/KaterPendulum'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3F0' }}>
      <header style={{ borderBottom: '2px solid #D4A96A', padding: '24px', backgroundColor: '#1D2951' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#D4A96A' }}>
          Physics Simulations Lab
        </h1>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#708090' }}>
          Interactive 2D simulations for understanding classical mechanics
        </p>
      </header>

      <div style={{ borderBottom: '2px solid #D4A96A', backgroundColor: '#FFFFFF', display: 'flex' }}>
        {['home', 'rolling', 'ballistic', 'kater'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '16px',
              borderBottom: activeTab === tab ? '2px solid #D4A96A' : 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab ? '#1D2951' : '#708090',
              fontWeight: activeTab === tab ? '600' : '400',
              borderRadius: 0,
              fontSize: '14px',
            }}
          >
            {tab === 'home' && 'Home'}
            {tab === 'rolling' && 'Rolling Motion'}
            {tab === 'ballistic' && 'Ballistic Pendulum'}
            {tab === 'kater' && 'Kater Pendulum'}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'rolling' && <RollingMotion />}
        {activeTab === 'ballistic' && <BallisticPendulum />}
        {activeTab === 'kater' && <KaterPendulum />}
      </div>
    </div>
  )
}
