// frontend/src/components/Header.jsx
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 bg-[#0B0F1A] shadow border-b border-white/10">
    <div className="flex items-center gap-2 text-[#3B82F6] font-bold text-xl">
      <BarChart3 className="w-6 h-6" />
      <span className="text-[#E6E8EE]">RiskSim Enterprise</span>
    </div>
    <nav className="flex gap-6 text-[#9CA3B0]">
      <Link to="/" className="hover:text-[#3B82F6] transition-colors">
        Home
      </Link>
      <Link to="/scenarios" className="hover:text-[#3B82F6] transition-colors">
        Scenarios
      </Link>
      <Link to="/dashboard" className="hover:text-[#3B82F6] transition-colors">
        Dashboard
      </Link>
      <Link to="/register" className="hover:text-[#3B82F6] transition-colors">
        Sign Up
      </Link>
      <Link to="/login" className="hover:text-[#3B82F6] transition-colors">
        Login
      </Link>
    </nav>
  </header>
);

export default Header;