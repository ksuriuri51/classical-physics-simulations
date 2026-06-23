import { Button } from '../components/Button'

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#1D2951' }}>
          Welcome to Physics Simulations Lab
        </h2>
        <p style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.6', color: '#6F4E37' }}>
          This educational application provides interactive 2D simulations to help you understand fundamental concepts in classical mechanics. this website was originally created by a pysics student for theri physics lab project.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#6F4E37' }}>
          you will be able to Adjust parameters in real-time.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#1D2951' }}>
           Simulations
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card" style={{ border: '2px solid #D4A96A' }}>
            <div style={{ marginBottom: '16px', height: '96px', borderRadius: '8px', backgroundColor: '#708090', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '32px' }}>⚙️</div>
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold', color: '#1D2951' }}>
              Rolling Motion
            </h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.6', color: '#708090' }}>
              Observe how different object shapes (solid cylinder, hollow cylinder, sphere) roll down an incline. Adjust angle and mass to see their effects on acceleration and velocity.
            </p>
            <Button label="Launch Simulation" />
          </div>

          <div className="card" style={{ border: '2px solid #6F4E37' }}>
            <div style={{ marginBottom: '16px', height: '96px', borderRadius: '8px', backgroundColor: '#708090', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '32px' }}>🎯</div>
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold', color: '#1D2951' }}>
              Ballistic Pendulum
            </h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.6', color: '#708090' }}>
              Watch a projectile embed into a suspended bob and observe momentum transfer. Adjust projectile mass and velocity to see how they affect the pendulum swing.
            </p>
            <Button label="Launch Simulation" />
          </div>

          <div className="card" style={{ border: '2px solid #592720' }}>
            <div style={{ marginBottom: '16px', height: '96px', borderRadius: '8px', backgroundColor: '#708090', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '32px' }}>📐</div>
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 'bold', color: '#1D2951' }}>
              Kater Pendulum
            </h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.6', color: '#708090' }}>
              Explore a reversible compound pendulum that measures gravitational acceleration. Adjust pivot distance and mass distribution to calculate g.
            </p>
            <Button label="Launch Simulation" />
            <p style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#1D2951' }}>
              Amir Kabir University of Technology
          </div>
        </div>
      </section>
    </div>
  )
}
