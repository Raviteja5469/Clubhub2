import React from 'react'

export default function ClubCard({ club }) {
    return (
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg">
        <h2 className="text-xl font-semibold mb-2">{club.ClubName}</h2>
        <p className="text-gray-600 text-sm mb-1"><strong>Description:</strong> {club.BriefDescription}</p>
        <p className="text-gray-600 text-sm mb-1"><strong>Advisor:</strong> {club.ClubAdvisor}</p>
        <p className="text-gray-600 text-sm mb-1"><strong>Website:</strong> <a href={club.ClubWebsite} target="_blank" className="text-blue-500 underline">{club.ClubWebsite}</a></p>
      </div>
    )
  }
