import React, { Suspense, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

function NovaDevice({ scrollProgress }) {
  const group = useRef();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    target.set(
      Math.sin(t * 0.35) * 0.12,
      scrollProgress * 0.55,
      Math.cos(t * 0.28) * 0.1
    );
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.x, 0.045);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, scrollProgress * Math.PI * 1.25 + Math.sin(t * 0.3) * 0.12, 0.045);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, target.z, 0.045);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -scrollProgress * 0.55, 0.045);
  });

  return (
    <group ref={group}>
      <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.3}>
        <RoundedBox args={[2.9, 0.62, 4.7]} radius={0.26} smoothness={5}>
          <meshPhysicalMaterial color="#111821" metalness={0.82} roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.14} />
        </RoundedBox>
        <RoundedBox args={[2.62, 0.08, 4.42]} radius={0.16} smoothness={4} position={[0, 0.34, 0]}>
          <meshPhysicalMaterial color="#dce7f3" metalness={0.15} roughness={0.16} transmission={0.18} thickness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.39, 0]} scale={[0.94, 0.01, 0.94]}>
          <planeGeometry args={[2.55, 4.3]} />
          <meshBasicMaterial color="#07101a" />
        </mesh>
        <mesh position={[0, 0.405, -0.1]}>
          <torusGeometry args={[0.78, 0.018, 16, 96]} />
          <meshBasicMaterial color="#68d8ff" transparent opacity={0.55} />
        </mesh>
      </Float>
    </group>
  );
}

function ProductCanvas({ progress }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [5.2, 2.8, 6.4], fov: 36 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
      aria-label="Interactive 3D NOVA ONE product model"
    >
      <color attach="background" args={['#03060b']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={3.4} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 1, 2]} intensity={8} color="#52c9ff" distance={10} />
      <pointLight position={[3, -2, -3]} intensity={4} color="#9c7bff" distance={8} />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.35} />
        <NovaDevice scrollProgress={progress} />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.42} scale={8} blur={2.8} far={6} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.0} maxPolarAngle={2.05} />
    </Canvas>
  );
}

const features = [
  ['01', 'Spatial intelligence', 'A responsive interaction layer that stays out of the way until you need it.'],
  ['02', 'Adaptive interface', 'Context-aware controls designed to feel immediate instead of overwhelming.'],
  ['03', 'All-day presence', 'A compact, efficient system engineered around quiet consistency.'],
];

export default function App() {
  const [progress, setProgress] = React.useState(0);
  const [visibleFeatures, setVisibleFeatures] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const node = document.querySelector('.feature-grid');
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisibleFeatures(entry.isIntersecting),
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <header className="nav glass">
        <a className="brand" href="#top" aria-label="NOVA ONE home">NOVA ONE</a>
        <nav aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#features">Features</a>
          <a href="#cta">Discover</a>
        </nav>
        <a className="nav-cta" href="#cta">Explore</a>
      </header>

      <section id="top" className="hero section">
        <div className="hero-copy">
          <span className="eyebrow">THE NEXT PERSONAL DEVICE</span>
          <h1>NOVA<br/><span>ONE</span></h1>
          <p>A quiet interface for a louder future.</p>
          <div className="hero-actions">
            <a className="button primary" href="#product">Meet NOVA ONE</a>
            <a className="text-link" href="#features">Scroll to explore <span>↓</span></a>
          </div>
        </div>
        <div className="hero-orb" aria-hidden="true" />
        <div className="canvas-wrap">
          <ProductCanvas progress={progress} />
        </div>
        <div className="scroll-indicator" aria-hidden="true"><span />SCROLL</div>
      </section>

      <section id="product" className="product section">
        <div className="section-kicker">01 / PRODUCT</div>
        <div className="product-grid">
          <div>
            <h2>Designed to disappear into your life.</h2>
            <p>NOVA ONE combines precision hardware, spatial interaction and a calm interface into one compact system.</p>
          </div>
          <div className="spec-card glass">
            <span>FORM / 01</span>
            <strong>Precision body</strong>
            <p>Machined surfaces, softened geometry and a deliberately restrained visual language.</p>
          </div>
        </div>
      </section>

      <section id="features" className="features section">
        <div className="section-kicker">02 / FEATURES</div>
        <h2>Built around what matters.</h2>
        <div className={`feature-grid ${visibleFeatures ? "is-visible" : ""}`}>
          {features.map(([num, title, text]) => (
            <article className="feature-card glass" key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="card-line" />
            </article>
          ))}
        </div>
      </section>

      <section id="cta" className="cta section">
        <div className="cta-glow" aria-hidden="true" />
        <span className="eyebrow">THE FUTURE IS QUIET</span>
        <h2>Meet the new default.</h2>
        <p>Experience NOVA ONE in motion.</p>
        <a className="button primary" href="#top">Discover NOVA ONE</a>
      </section>

      <footer className="footer">
        <span>NOVA ONE</span>
        <span>Fictional product concept / 2026</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
