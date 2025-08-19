// frontend/src/pages/Home.jsx
import { Shield, Eye, TrendingUp, Share, Zap, Database, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Hero1 from "../assets/Hero1.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="bg-[#0B0F1A] text-[#E6E8EE]">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 px-10 py-24 items-center">
          <img
            src={Hero1}
            alt="Risk Analysis Enterprise"
            className="rounded-2xl shadow-2xl w-full transform hover:scale-105 transition duration-500"
          />
          <div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-[#E6E8EE]">
              RiskSim Enterprise
            </h1>
            <p className="text-lg text-[#9CA3B0] mb-8 max-w-lg">
              Run Monte Carlo simulations on your business risks. Model cyber attacks, 
              supply disruptions, and operational failures to quantify impact and optimize defenses.
            </p>
            <div className="flex gap-4">
              <button
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white font-semibold px-6 py-3 rounded-lg transition"
                onClick={() => navigate("/scenarios")}
              >
                Start Simulation
              </button>
              <button
                className="border border-[#3B82F6] text-[#3B82F6] hover:bg-white/10 px-6 py-3 rounded-lg"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        {/* Features Row 1 */}
        <section className="px-10 py-20 bg-[#101624] grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Eye className="w-12 h-12 text-[#3B82F6]" />,
              title: "Visualize Risk Impact",
              desc: "Build Monte Carlo scenarios to quantify and calculate the financial impact of cyber attacks, operational failures, and black swan events.",
            },
            {
              icon: <TrendingUp className="w-12 h-12 text-[#22C55E]" />,
              title: "Prove Defense ROI",
              desc: "Adjust defense parameters, run simulations, and demonstrate concrete ROI figures for security investments to leadership.",
            },
            {
              icon: <Share className="w-12 h-12 text-[#60A5FA]" />,
              title: "Export & Present",
              desc: "Download analysis results as images, share with stakeholders, and present risk assessments in executive-friendly formats.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#0B0F1A] px-6 py-10 min-h-[280px] rounded-xl border border-white/30 hover:shadow-xl transition flex flex-col items-center justify-center text-center"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-[#E6E8EE] mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[#9CA3B0] max-w-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Features Row 2 */}
        <section className="px-10 py-20 bg-[#0B0F1A] grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-12 h-12 text-[#EF4444]" />,
              title: "Risk Events",
              desc: "Model cyber attacks, ransomware, supply chain disruptions, natural disasters, and operational failures with probability distributions.",
            },
            {
              icon: <Database className="w-12 h-12 text-[#60A5FA]" />,
              title: "Business Assets",
              desc: "Define critical systems, data centers, manufacturing plants, key personnel, and intellectual property with accurate valuations.",
            },
            {
              icon: <Shield className="w-12 h-12 text-[#22C55E]" />,
              title: "Defense Systems",
              desc: "Configure firewalls, backup systems, insurance policies, and security controls—measure effectiveness and optimize spending.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#101624] px-6 py-10 min-h-[280px] rounded-xl border border-white/30 hover:shadow-xl transition flex flex-col items-center justify-center text-center"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-[#E6E8EE] mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[#9CA3B0] max-w-sm">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Monte Carlo Simulation Section */}
        <section className="px-10 py-20 bg-[#101624]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#E6E8EE] mb-4">
              Monte Carlo Risk Analysis
            </h2>
            <p className="text-lg text-[#9CA3B0] max-w-2xl mx-auto">
              Run thousands of simulations to understand your risk exposure, 
              calculate Value at Risk (VaR), and optimize your defense investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "P50 Median Impact",
                value: "$125K",
                desc: "50% of scenarios",
                color: "text-[#3B82F6]"
              },
              {
                title: "P90 Severe Impact", 
                value: "$480K",
                desc: "10% probability",
                color: "text-[#F59E0B]"
              },
              {
                title: "Expected Annual Loss",
                value: "$205K",
                desc: "Average exposure",
                color: "text-[#EF4444]"
              },
              {
                title: "Security ROI",
                value: "23.4%",
                desc: "Defense investment",
                color: "text-[#22C55E]"
              }
            ].map((metric, i) => (
              <div key={i} className="bg-[#0B0F1A] rounded-lg p-6 border border-white/20">
                <h3 className="text-sm text-[#9CA3B0] mb-2">{metric.title}</h3>
                <p className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
                <p className="text-xs text-[#9CA3B0]">{metric.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-10 py-20 bg-[#0B0F1A] text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#E6E8EE] mb-6">
              Ready to Quantify Your Risk?
            </h2>
            <p className="text-lg text-[#9CA3B0] mb-8">
              Start building Monte Carlo risk scenarios and get quantitative insights 
              into your organization's risk exposure and defense effectiveness.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white font-semibold px-8 py-4 rounded-lg transition text-lg"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </button>
              <button
                className="border border-[#3B82F6] text-[#3B82F6] hover:bg-white/10 px-8 py-4 rounded-lg text-lg"
                onClick={() => navigate("/scenarios")}
              >
                View Demo
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;