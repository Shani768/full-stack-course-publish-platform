import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdAdd, MdExitToApp } from 'react-icons/md';
import SearchBar from '../../components/Search/SearchBar';
import { useSearchStore } from '../../store/searchStore';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
interface HeaderProps {
  isCreatePage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isCreatePage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [userData, setUserData] = useState<{ username?: string; email?: string; image?: string } | null>(null);
  const { searchTerm, setSearchTerm } = useSearchStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data.");
        const data = await response.json();
        setUserData(data?.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('token');
  toast.success('Logged out successfully');
  navigate('/'); // 👈 redirect to home or login page
};

  const toggleDetails = () => setShowDetails(prev => !prev);

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-10 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 w-full sm:w-auto">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black flex items-center space-x-2">
          <span>{isCreatePage ? 'Create Course' : 'Courses'}</span>
        </div>

        {/* ✅ Show SearchBar only on /dashboard */}
        {location.pathname === '/dashboard' && (
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search courses..."
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(isCreatePage ? '/dashboard' : '/dashboard/create')}
          className="bg-gray-700 hover:bg-gray-800 font-medium px-4 py-2 rounded shadow transition flex items-center space-x-2 text-sm sm:text-base"
        >
          {isCreatePage ? (
            <>
              <MdExitToApp className="text-white" />
              <span className="text-white">Exit</span>
            </>
          ) : (
            <>
              <MdAdd className="text-white" />
              <span className="text-white">Add Course</span>
            </>
          )}
        </button>

        {!loading && userData && (
          <div className="relative">
            <div
              onClick={toggleDetails}
              className="cursor-pointer flex items-center space-x-3 bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm hover:shadow-md transition"
            >
              {userData.image ? (
                <img src={userData.image} alt="User" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
                  {userData.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            {showDetails && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                <div className="flex items-center space-x-3 mb-3">
                  {userData.image ? (
                    <img src={userData.image} alt="User" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase">
                      {userData.username?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-600">{userData.username}</div>
                    <div className="text-sm text-gray-600">{userData.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 mt-2 w-full px-2 py-1 rounded-md hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
