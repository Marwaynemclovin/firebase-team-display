import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const StaffProfile = () => {
  const { staffName } = useParams(); 
  const [staffProfile, setStaffProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch the staff profile based on the staffName
    const fetchStaffProfile = () => {
      const db = getDatabase();
      const staffRef = ref(db, 'staff');

      onValue(staffRef, (snapshot) => {
        const staffData = snapshot.val();

        if (staffData) {
          const staffArray = Object.values(staffData);
          const staffProfile = staffArray.find((profile) => profile.name === staffName);
          setStaffProfile(staffProfile);
          setLoading(false);
        }
      });
    };

    fetchStaffProfile();
  }, [staffName]);

  if (loading || !staffProfile) {
    // You can show a loading state or handle the case where the staff profile is not found
    return <div>Loading...</div>;
  }

  // Render the staff profile information here
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-indigo-800 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg p-8 mt-8 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in">
        {/* About Me Column */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold">About Me:</h3>
          <p>{staffProfile.aboutMe}</p>
        </div>

        {/* Staff Details Column */}
        <div className="col-span-1 text-center">
          <h2 className="text-2xl font-bold">{staffProfile.name}</h2>
          <p className="text-sm text-gray-500 mb-2">Company Role: {staffProfile.companyRole}</p>
          <img
            src={staffProfile.profileImageUrl}
            alt={staffProfile.name}
            className="w-24 h-24 rounded-full mx-auto mt-4"
          />
          <div className="flex justify-center mt-4">
            <a
              href={staffProfile.socialMediaLinks.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-800 mr-2"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href={staffProfile.socialMediaLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-800"
            >
              <FaTwitter size={24} />
            </a>
          </div>
          <Link to="/" className="text-blue-500 hover:text-blue-800 mt-4 block">
            Back Home
          </Link>
        </div>

        {/* Previous Projects Column */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold">Previous Projects:</h3>
          <div className="mt-2">
            {Object.values(staffProfile.previousProjects).map((project) => (
              <div key={project.projectId} className="mb-4">
                <h4 className="text-md font-semibold">{project.projectName}</h4>
                <p>{project.projectDescription}</p>
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-800 mr-2"
                >
                  {project.projectUrl}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
