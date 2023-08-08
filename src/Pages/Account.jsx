import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, push, update, remove, onValue } from 'firebase/database';

const Account = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    aboutMe: '',
    companyRole: '',
    previousProjects: {
      projectId: {
        projectDescription: '',
        projectName: '',
        projectUrl: '',
      },
    },
    profileImageUrl: '',
    socialMediaLinks: {
      linkedIn: '',
      twitter: '',
    },
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileImageUrlError, setProfileImageUrlError] = useState('');
  const [linkedInError, setLinkedInError] = useState('');
  const [twitterError, setTwitterError] = useState('');
  const [projectUrlError, setProjectUrlError] = useState('');

  // Function to fetch staff from the database
  const fetchStaff = () => {
    const db = getDatabase();
    const staffRef = ref(db, 'staff');

    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the staff object into an array of staff
        const staffArray = Object.entries(data).map(([id, staff]) => ({ id, ...staff }));
        setStaffList(staffArray);
      } else {
        setStaffList([]);
      }
    });
  };

  useEffect(() => {
    // Fetch staff when the component mounts
    fetchStaff();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addStaff();
  };

  // Function to add a new staff
  const addStaff = async () => {
    const db = getDatabase();
    const staffRef = ref(db, 'staff');

    try {
      // Push the new staff to the database
      await push(staffRef, newStaff);

      // Clear the input fields after adding the staff
      setNewStaff({
        name: '',
        aboutMe: '',
        companyRole: '',
        previousProjects: {
          projectId: {
            projectDescription: '',
            projectName: '',
            projectUrl: '',
          },
        },
        profileImageUrl: '',
        socialMediaLinks: {
          linkedIn: '',
          twitter: '',
        },
      });
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  // Function to handle profile image URL change
  const handleProfileImageUrlChange = (e) => {
    const imageUrl = e.target.value;

    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      setProfileImageUrlError('Invalid URL format');
    } else {
      setProfileImageUrlError('');
    }

    // Update the profile image URL state
    setNewStaff({ ...newStaff, profileImageUrl: imageUrl });
  };

  // Function to handle LinkedIn profile URL change
  const handleLinkedInChange = (e) => {
    const linkedInUrl = e.target.value;

    if (!linkedInUrl.startsWith('http://www.linkedin.com/') && !linkedInUrl.startsWith('https://www.linkedin.com/')) {
      setLinkedInError('Invalid LinkedIn profile URL format');
    } else {
      setLinkedInError('');
    }

    // Update the LinkedIn profile URL state
    setNewStaff({ ...newStaff, socialMediaLinks: { ...newStaff.socialMediaLinks, linkedIn: linkedInUrl } });
  };

  // Function to handle Twitter profile URL change
  const handleTwitterChange = (e) => {
    const twitterUrl = e.target.value;

    if (!twitterUrl.startsWith('http://twitter.com/') && !twitterUrl.startsWith('https://twitter.com/')) {
      setTwitterError('Invalid Twitter profile URL format');
    } else {
      setTwitterError('');
    }

    // Update the Twitter profile URL state
    setNewStaff({ ...newStaff, socialMediaLinks: { ...newStaff.socialMediaLinks, twitter: twitterUrl } });
  };

  // Function to handle Project URL change
  const handleProjectUrlChange = (e) => {
    const projectUrl = e.target.value;

    if (!projectUrl.startsWith('http://') && !projectUrl.startsWith('https://')) {
      setProjectUrlError('Invalid URL format');
    } else {
      setProjectUrlError('');
    }

    // Update the Project URL state
    setNewStaff({ ...newStaff, previousProjects: { ...newStaff.previousProjects, projectId: { ...newStaff.previousProjects.projectId, projectUrl } } });
  };

  // Function to update a staff
  const updateStaff = async (staffId, updatedStaffData) => {
    const db = getDatabase();
    const staffRef = ref(db, `staff/${staffId}`);

    try {
      // Update the staff member in the database
      await update(staffRef, updatedStaffData);
    } catch (error) {
      console.error('Error updating staff member:', error);
    }
  };

  // Function to delete a staff
  const deleteStaff = async (staffId) => {
    const db = getDatabase();
    const staffRef = ref(db, `staff/${staffId}`);

    try {
      // Remove the staff from the database
      await remove(staffRef);
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Account Page!</h1>
        <div className="block md:hidden">
          <button
            onClick={() => setMenuVisible(!menuVisible)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ☰
          </button>
        </div>
        <ul className={`md:flex space-x-2 ${menuVisible ? 'block' : 'hidden'}`}>
          <li>
            <Link to="/" className="block md:inline-block bg-blue-500 text-white px-4 py-2 rounded">
              Home
            </Link>
          </li>
          <li>
            <button
              className="block md:inline-block bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Add a New Staff</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Name:</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block">About Me:</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={newStaff.aboutMe}
              onChange={(e) => setNewStaff({ ...newStaff, aboutMe: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Company Role:</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={newStaff.companyRole}
              onChange={(e) => setNewStaff({ ...newStaff, companyRole: e.target.value })}
            />
          </div>
          <div>
            <label className="block">Profile Image URL:</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                profileImageUrlError ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={newStaff.profileImageUrl}
              onChange={handleProfileImageUrlChange}
            />
            {profileImageUrlError && (
              <p className="text-red-500 text-sm mt-1">{profileImageUrlError}</p>
            )}
          </div>
          <div>
            <label className="block">LinkedIn Profile:</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                linkedInError ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={newStaff.socialMediaLinks.linkedIn}
              onChange={handleLinkedInChange}
            />
            {linkedInError && (
              <p className="text-red-500 text-sm mt-1">{linkedInError}</p>
            )}
          </div>
          <div>
            <label className="block">Twitter Profile:</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                twitterError ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={newStaff.socialMediaLinks.twitter}
              onChange={handleTwitterChange}
            />
            {twitterError && (
              <p className="text-red-500 text-sm mt-1">{twitterError}</p>
            )}
          </div>
          <div>
            <label className="block">Project Name:</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={newStaff.previousProjects.projectId.projectName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, previousProjects: { ...newStaff.previousProjects, projectId: { ...newStaff.previousProjects.projectId, projectName: e.target.value } } })
              }
            />
          </div>
          <div>
            <label className="block">Project Description:</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={newStaff.previousProjects.projectId.projectDescription}
              onChange={(e) =>
                setNewStaff({ ...newStaff, previousProjects: { ...newStaff.previousProjects, projectId: { ...newStaff.previousProjects.projectId, projectDescription: e.target.value } } })
              }
            />
          </div>
          <div>
            <label className="block">Project URL:</label>
            <input
              className={`w-full border rounded px-3 py-2 ${
                projectUrlError ? 'border-red-500' : 'border-gray-300'
              }`}
              type="text"
              value={newStaff.previousProjects.projectId.projectUrl}
              onChange={handleProjectUrlChange}
            />
            {projectUrlError && (
              <p className="text-red-500 text-sm mt-1">{projectUrlError}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Staff List</h2>
        {staffList.map((staff) => (
          <div key={staff.id} className="border rounded p-4 mb-4">
            <p className="text-xl font-bold">Name: {staff.name}</p>
            <p className="mb-4">Company Role: {staff.companyRole}</p>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => updateStaff(staff.id, staff)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => deleteStaff(staff.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;
