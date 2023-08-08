import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const Home = () => {
  const [staffProfiles, setStaffProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState(null);
  const teamRef = useRef(null);

  useEffect(() => {
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

  const colors = ['#fca5a5', '#fcd34d', '#68d391', '#63b3ed'];
  const numCols = 4;

  const handleCardClick = (index) => {
    setFlippedCard(index === flippedCard ? null : index);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Hero component */}
      <div
        className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-16 px-8 flex flex-col items-center justify-center"
        style={{ minHeight: 'calc(100vh - 100px)' }}
      >
        <h1 className="text-5xl font-bold mb-4">RESESO</h1>
        <p className="text-lg text-center mb-8">
          A small website development firm, aims to develop a website to showcase their staff members.
          The website will provide individual pages for each team member, highlighting their role,
          social media links (LinkedIn and Twitter), goals, and past achievements/projects.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          onClick={() => {
            teamRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Meet the Team
        </button>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"
        ref={teamRef} // Attach ref to the staff profiles section
      >
        {staffProfiles.map((staffProfile, index) => (
          <div
            key={staffProfile.id}
            className={`rounded-lg p-4 transition-transform hover:scale-105 animate-fade-in-delay-${index % 4}`}
            style={{
              height: '370px',
              backgroundColor: colors[index % numCols],
              order: index >= numCols ? numCols - (index % numCols) : index,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transformStyle: 'preserve-3d',
              transform: index === flippedCard ? 'rotateY(180deg)' : 'none',
            }}
            onClick={() => handleCardClick(index)}
          >
            {/* Front Side */}
            <div className="w-40 h-40 mx-auto mb-4">
              <div
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  position: 'relative',
                  transform: index === flippedCard ? 'rotateY(180deg)' : 'none',
                }}
              >
                <img
                  src={staffProfile.profileImageUrl}
                  alt={staffProfile.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute left-0 top-0 w-full h-full bg-black opacity-0 hover:opacity-75 transition-opacity"
                  style={{ zIndex: 1 }}
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 text-center">{staffProfile.name}</h2>
              <p className="text-sm text-white mb-2 text-center">{staffProfile.companyRole}</p>
              <div className="flex justify-center pb-4">
                <a href={staffProfile.socialMediaLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mx-2">
                  <FaLinkedin size={24} />
                </a>
                <a href={staffProfile.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mx-2">
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="bg-white text-black p-4 rounded-lg absolute top-0 left-0 w-full h-full transform rotateY-180"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: index === flippedCard ? 'block' : 'none',
              }}
            >
              <p>About Me:</p>
              <p className="text-sm">{staffProfile.aboutMe}</p>
              <Link to={`/staff/${staffProfile.name}`} className="text-blue-600 underline cursor-pointer mt-4">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>

      <nav className="text-gray-800 text-center py-4">
        <Link to="/signin" className="text-gray-800 font-medium underline focus:outline-none">
          Sign In
        </Link>
      </nav>
    </div>
  );
};

export default Home;
