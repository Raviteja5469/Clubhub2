import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddClubForm from '../components/AddClubForm';

export default function Dashboard() {
  const [clubs, setClubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('');

  const fetchClubs = () => {
    fetch('https://clubhub2-backend.onrender.com/clubs')
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error('Failed to fetch clubs:', err));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  // Get unique college names
  const collegeNames = [...new Set(clubs.map((club) => club['College Name']).filter(Boolean))].sort();

  const handleDelete = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        const response = await fetch(`https://clubhub2-backend.onrender.com/deleteclub/${clubId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchClubs();
          alert('Club deleted successfully!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete club');
        }
      } catch (error) {
        console.error('Error deleting club:', error.message);
        alert(`Failed to delete club: ${error.message}`);
      }
    }
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setShowForm(true);
  };

  const handleFormSubmit = (isEdit = false) => {
    fetchClubs();
    setShowForm(false);
    setEditingClub(null);
    if (isEdit) {
      alert('Club updated successfully!');
    } else {
      alert('Club added successfully!');
    }
  };

  const handleDownload = () => {
    const headers = [
      'College Name',
      'Club Name',
      'Brief Description',
      'Club Advisor',
      'Meeting Schedule',
      'Club Meeting Location',
      'Club Meeting Time',
      'Club Website',
      'Contact Email of Club Coordinator/Leader',
      'Phone Number of Club Coordinator/Leader',
      'Social Media Links',
      'Created At',
    ];

    const csvContent = [
      headers.join(','),
      ...clubs.map((club) => [
        `"${club['College Name'] || ''}"`,
        `"${club['Club Name']}"`,
        `"${club['Brief Description']}"`,
        `"${club['Club Advisor']}"`,
        `"${club['Meeting Schedule']}"`,
        `"${club['Club Meeting Location']}"`,
        `"${club['Club Meeting Time']}"`,
        `"${club['Club Website']}"`,
        `"${club['Contact Email of Club Coordinator/Leader']}"`,
        `"${club['Phone Number of Club Coordinator/Leader']}"`,
        `"${club['Social Media Links']}"`,
        `"${club.createdAt ? new Date(club.createdAt).toLocaleString() : ''}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clubs_data.csv';
    link.click();
  };

  // Filter clubs based on selected college
  const filteredClubs = selectedCollege
    ? clubs.filter((club) => club['College Name'] === selectedCollege)
    : clubs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Club Directory</h1>
                <p className="mt-2 text-lg text-gray-600">Explore all the clubs and Add the Clubs</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Colleges</option>
                  {collegeNames.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {showForm ? 'Hide Form' : 'Add New Club'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download CSV
                  </button>
                  <Link
                    to="/bulk-upload"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Bulk Upload
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="p-6 border-b border-gray-200">
              <AddClubForm
                onAddClub={handleFormSubmit}
                editingClub={editingClub}
                onCancel={() => {
                  setShowForm(false);
                  setEditingClub(null);
                }}
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Advisor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Social Media
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClubs.length === 0 && selectedCollege && (
                  <tr>
                    <td colSpan="13" className="px-6 py-4 text-center text-sm text-gray-500">
                      No clubs found for {selectedCollege}.
                    </td>
                  </tr>
                )}
                {filteredClubs.length === 0 && !selectedCollege && (
                  <tr>
                    <td colSpan="13" className="px-6 py-4 text-center text-sm text-gray-500">
                      No clubs available.
                    </td>
                  </tr>
                )}
                {filteredClubs.map((club) => (
                  <tr key={club._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {club['College Name'] || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {club['Club Name']}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="line-clamp-2">{club['Brief Description']}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Club Advisor']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Meeting Schedule']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Club Meeting Location']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Club Meeting Time']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Club Website'] && (
                        <a
                          href={club['Club Website']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 truncate block max-w-xs"
                        >
                          {club['Club Website'].replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Contact Email of Club Coordinator/Leader']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Phone Number of Club Coordinator/Leader']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club['Social Media Links'] && (
                        <a
                          href={club['Social Media Links']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 truncate block max-w-xs"
                        >
                          {club['Social Media Links'].replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {club.createdAt ? new Date(club.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(club)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(club._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}