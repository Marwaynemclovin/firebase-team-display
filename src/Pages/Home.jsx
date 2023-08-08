import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const Home = () => {
  const [staffProfiles, setStaffProfiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStaff = () => {
      const db = getDatabase();
      const staffRef = ref(db, 'staff');

      onValue(staffRef, (snapshot) => {
        const staffData = snapshot.val();

        if (staffData) {
          const staffArray = Object.values(staffData);
          setStaffProfiles(staffArray);
          setLoading(false);
        }
      });
    };

    fetchStaff();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome to Our Website</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {staffProfiles.map((staffProfile) => (
            <div
              key={staffProfile.id}
              className="bg-white rounded-lg shadow-md flex flex-col p-4 transition-transform hover:scale-105"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <img src={staffProfile.profileImageUrl} alt={staffProfile.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center">
                <h2 className="text-xl font-bold text-blue-800 mb-2">{staffProfile.name}</h2>
                <p className="text-sm text-gray-500 mb-2">Company Role: {staffProfile.companyRole}</p>
                {/* View Past Projects Link */}
                <Link
                  to={`/staff/${staffProfile.name}`}
                  className="text-blue-800 underline cursor-pointer mt-4"
                >
                  More About Me
                </Link>
                <div className="mt-4 flex justify-center">
                  <a href={staffProfile.socialMediaLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-800 mx-2">
                    <FaLinkedin size={24} />
                  </a>
                  <a href={staffProfile.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-800 mx-2">
                    <FaTwitter size={24} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <nav className="text-white text-center py-4">
        <Link to="/signin" className="text-white font-medium underline focus:outline-none">
          Sign In
        </Link>
      </nav>

      <Outlet />
    </div>
  );
};

export default Home;
