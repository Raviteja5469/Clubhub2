import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [duplicates, setDuplicates] = useState([]); // New state for duplicates

  const schema = [
    { name: 'College Name', required: true, example: 'MIT-WPU' },
    { name: 'Club Name', required: true, example: 'Coding Club' },
    { name: 'Brief Description', required: false, example: 'Learn coding and build projects' },
    { name: 'Club Advisor', required: false, example: 'Prof. John Doe' },
    { name: 'Meeting Schedule', required: false, example: 'Weekly on Fridays' },
    { name: 'Club Meeting Location', required: false, example: 'Room 101' },
    { name: 'Club Meeting Time', required: false, example: '5:00 PM' },
    { name: 'Club Website', required: false, example: 'https://codingclub.com' },
    { name: 'Contact Email', required: false, example: 'club@example.com' },
    { name: 'Phone Number', required: false, example: '+1234567890' },
    { name: 'Social Media Links', required: false, example: 'https://instagram.com/codingclub' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setError('Please upload a CSV file');
      setFile(null);
    } else {
      setFile(selectedFile);
      setError('');
      setSuccess('');
      setDuplicates([]); // Clear duplicates on new file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await fetch('https://clubhub2-backend.onrender.com/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(`Successfully added ${result.added} clubs. Skipped ${result.skipped} duplicates.`);
        setDuplicates(result.duplicates || []); // Store duplicates
        setError('');
        setFile(null);
      } else {
        throw new Error(result.message || 'Failed to upload clubs');
      }
    } catch (err) {
      console.error('Error uploading CSV:', err);
      setError(err.message);
      setSuccess('');
      setDuplicates([]);
    }
  };

  const handleDownloadDuplicates = () => {
    if (duplicates.length === 0) return;

    const headers = [
      'College Name',
      'Club Name',
      'Brief Description',
      'Club Advisor',
      'Meeting Schedule',
      'Club Meeting Location',
      'Club Meeting Time',
      'Club Website',
      'Contact Email',
      'Phone Number',
      'Social Media Links',
    ];

    const csvContent = [
      headers.join(','),
      ...duplicates.map((club) => [
        `"${club['College Name'] || ''}"`,
        `"${club['Club Name'] || ''}"`,
        `"${club['Brief Description'] || ''}"`,
        `"${club['Club Advisor'] || ''}"`,
        `"${club['Meeting Schedule'] || ''}"`,
        `"${club['Club Meeting Location'] || ''}"`,
        `"${club['Club Meeting Time'] || ''}"`,
        `"${club['Club Website'] || ''}"`,
        `"${club['Contact Email'] || ''}"`,
        `"${club['Phone Number'] || ''}"`,
        `"${club['Social Media Links'] || ''}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'duplicate_clubs.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900">Bulk Upload Clubs</h1>
            <p className="mt-2 text-lg text-gray-600">
              Upload a CSV file to add multiple clubs at once
            </p>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">CSV Schema</h2>
              <p className="mt-2 text-gray-600">
                Your CSV file must follow this structure. Required fields are marked with *.
                Download a{' '}
                <a
                  href="/sample-clubs.csv"
                  download
                  className="text-primary-600 hover:text-primary-800 underline"
                >
                  sample CSV
                </a>{' '}
                to get started.
              </p>
              <table className="mt-4 min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Field
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Required
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schema.map((field) => (
                    <tr key={field.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.required ? 'Yes *' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={!file}
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
                  Upload Clubs
                </button>
                <Link
                  to="/dashboard"
                  className="btn btn-secondary flex items-center gap-2"
                >
                  Back to Dashboard
                </Link>
              </div>
            </form>
            {duplicates.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900">Duplicate Clubs</h2>
                <p className="mt-2 text-gray-600">
                  The following clubs were not added because they already exist in the database.
                </p>
                <button
                  onClick={handleDownloadDuplicates}
                  className="mt-4 btn btn-primary flex items-center gap-2"
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
                  Download Duplicates CSV
                </button>
                <table className="mt-4 min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Club Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brief Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Club Advisor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meeting Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Website
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Social Media
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {duplicates.map((club, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {club['College Name']}
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
                          {club['Contact Email']}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {club['Phone Number']}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}