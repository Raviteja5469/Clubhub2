// No changes required; included for reference
import { useState, useEffect } from 'react';

export default function AddClubForm({ onAddClub, editingClub, onCancel }) {
  const [formData, setFormData] = useState({
    'College Name': '',
    'Club Name': '',
    'Brief Description': '',
    'Club Advisor': '',
    'Meeting Schedule': '',
    'Club Meeting Location': '',
    'Club Meeting Time': '',
    'Club Website': '',
    'Contact Email of Club Coordinator/Leader': '',
    'Phone Number of Club Coordinator/Leader': '',
    'Social Media Links': '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingClub) {
      setFormData({
        'College Name': editingClub['College Name'] || '',
        'Club Name': editingClub['Club Name'] || '',
        'Brief Description': editingClub['Brief Description'] || '',
        'Club Advisor': editingClub['Club Advisor'] || '',
        'Meeting Schedule': editingClub['Meeting Schedule'] || '',
        'Club Meeting Location': editingClub['Club Meeting Location'] || '',
        'Club Meeting Time': editingClub['Club Meeting Time'] || '',
        'Club Website': editingClub['Club Website'] || '',
        'Contact Email of Club Coordinator/Leader':
          editingClub['Contact Email of Club Coordinator/Leader'] || '',
        'Phone Number of Club Coordinator/Leader':
          editingClub['Phone Number of Club Coordinator/Leader'] || '',
        'Social Media Links': editingClub['Social Media Links'] || '',
      });
    }
  }, [editingClub]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData['College Name'] || !formData['Club Name']) {
      setError('College Name and Club Name are required');
      return;
    }

    try {
      const url = editingClub
        ? `http://localhost:3000/updateclub/${editingClub._id}`
        : 'http://localhost:3000/addclub';
      const method = editingClub ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onAddClub(!!editingClub);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save club');
      }
    } catch (error) {
      console.error('Error saving club:', error.message);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">
        {editingClub ? 'Edit Club' : 'Add New Club'}
      </h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">College Name</label>
        <input
          type="text"
          name="College Name"
          value={formData['College Name']}
          onChange={handleChange}
          placeholder="e.g., MIT-WPU"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Club Name</label>
        <input
          type="text"
          name="Club Name"
          value={formData['Club Name']}
          onChange={handleChange}
          placeholder="e.g., Coding Club"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Brief Description</label>
        <textarea
          name="Brief Description"
          value={formData['Brief Description']}
          onChange={handleChange}
          placeholder="Describe the club..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows="4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Club Advisor</label>
        <input
          type="text"
          name="Club Advisor"
          value={formData['Club Advisor']}
          onChange={handleChange}
          placeholder="e.g., Prof. John Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Meeting Schedule</label>
        <input
          type="text"
          name="Meeting Schedule"
          value={formData['Meeting Schedule']}
          onChange={handleChange}
          placeholder="e.g., Weekly on Fridays"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Club Meeting Location</label>
        <input
          type="text"
          name="Club Meeting Location"
          value={formData['Club Meeting Location']}
          onChange={handleChange}
          placeholder="e.g., Room 101"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Club Meeting Time</label>
        <input
          type="text"
          name="Club Meeting Time"
          value={formData['Club Meeting Time']}
          onChange={handleChange}
          placeholder="e.g., 5:00 PM"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Club Website</label>
        <input
          type="url"
          name="Club Website"
          value={formData['Club Website']}
          onChange={handleChange}
          placeholder="e.g., https://clubwebsite.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          name="Contact Email of Club Coordinator/Leader"
          value={formData['Contact Email of Club Coordinator/Leader']}
          onChange={handleChange}
          placeholder="e.g., club@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          name="Phone Number of Club Coordinator/Leader"
          value={formData['Phone Number of Club Coordinator/Leader']}
          onChange={handleChange}
          placeholder="e.g., +1234567890"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
        <input
          type="url"
          name="Social Media Links"
          value={formData['Social Media Links']}
          onChange={handleChange}
          placeholder="e.g., https://instagram.com/club"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex items-center gap-2"
        >
          {editingClub ? 'Update Club' : 'Add Club'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex items-center gap-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}