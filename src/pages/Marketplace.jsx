import Layout from "../components/layout/Layout";
import ProductGrid from "../components/marketplace/ProductGrid";
import Particles from "react-tsparticles";

export default function Marketplace() {
  return (
    <Layout>
      {/* Container with background gradient and particles */}
      <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 overflow-hidden flex items-start justify-center">

        {/* Particles background */}
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: false },
            particles: {
              number: { value: 60 },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.2, random: true },
              size: { value: 3, random: true },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outMode: "out",
              },
            },
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
              },
            },
          }}
          className="absolute inset-0"
        />

        {/* Content with animations */}
        <div className="max-w-7xl mx-auto py-12 px-4 relative z-10 text-center">

          {/* Animated Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg animate-slideInFromTop">
            Marketplace
          </h1>

          {/* Product Grid */}
          <div className="relative z-10 animate-fadeIn">
            <ProductGrid />
          </div>
        </div>
      </div>
    </Layout>
  );
}