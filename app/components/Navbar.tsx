import { useLogoutMutation } from "@/src/Redux/features/auth/authApi";
import { logout } from "@/src/Redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/Redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleLogout = async () => {
    await logoutApi({}); // Delete refresh Token in cokiee 
    dispatch(logout());
    router.push("/login");
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <Link href="/" className="text-xl font-bold text-gray-900 cursor-pointer">LMS Pro</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/all-course" className="text-gray-700 hover:text-blue-600 transition-colors">All Course</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4 relative">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Login
                </Link>
                <Link
                  href="/all-course"
                  className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 cursor-pointer border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{ boxShadow: "0 2px 8px 0 rgba(59,130,246,0.10)" }}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <span className="mr-2">
                    {user?.email ? user.email[0].toUpperCase() : "U"}
                  </span>
                  <span className="hidden md:inline">Profile</span>
                  <svg
                    className={`ml-2 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-800">{user?.email}</div>
                      <div className="text-xs text-gray-500 capitalize">{user?.role ?? "User"}</div>
                    </div>
                    <ul className="py-1">
                      {/* Role-wise dashboard link */}
                      {user?.role === "admin" && (
                        <li>
                          <Link
                            href="/dashboard/admin"
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      {user?.role === "student" && (
                        <li>
                          <Link
                            href="/dashboard/student"
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Student Dashboard
                          </Link>
                        </li>
                      )}
                      {user?.role === "super-admin" && (
                        <li>
                          <Link
                            href="/dashboard/super-admin"
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Super Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
