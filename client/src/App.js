import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [dataPerm, setDataPerm] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/data');
      const sortedData = response.data.sort((a, b) => a.sno - b.sno);
      setData(sortedData);
      setDataPerm(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function parseDateString(dateString) {
    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[1], 10);
    const month = parseInt(dateParts[0], 10) - 1; // Months are 0-indexed in JavaScript
    const year = parseInt(dateParts[2], 10);

    // Creating a new Date object
    const dateObj = new Date(year, month, day);

    return dateObj;
}

  function parseTimeString(timeString) {
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2].split(' ')[0], 10);
    const meridiem = timeParts[2].split(' ')[1];

    // Convert to 24-hour format if needed
    if (meridiem === 'pm') {
        hours = hours === 12 ? 12 : hours + 12;
    } else if (meridiem === 'am' && hours === 12) {
        hours = 0;
    }

    // Creating a new Date object
    const dateObj = new Date();
    dateObj.setHours(hours, minutes, seconds);

    return dateObj;
}

  useEffect(() => {
    let filteredData = [...dataPerm];

    // Filter by name or location
    filteredData = filteredData.filter(item =>
      item.dataValues.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dataValues.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'date') {
      filteredData.sort((a,b) => {
        if (!a.date || !b.date) return 0;
        return parseDateString(a.date) - parseDateString(b.date);
      });
    } else if (sortBy === 'time') {
      filteredData.sort((a, b) => {
        if (!a.time || !b.time) return 0; 
        return parseTimeString(a.time) - parseTimeString(b.time);
      });
    }

    setData(filteredData);
  }, [searchTerm, sortBy]);

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search by name or location"
        className="border p-2 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="border p-2 mb-4"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
      </select>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Sno</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.sno}>
              <td className="border px-4 py-2">{item.dataValues.sno}</td>
              <td className="border px-4 py-2">{item.dataValues.customer_name}</td>
              <td className="border px-4 py-2">{item.dataValues.age}</td>
              <td className="border px-4 py-2">{item.dataValues.phone}</td>
              <td className="border px-4 py-2">{item.dataValues.location}</td>
              <td className="border px-4 py-2">{item.date}</td>
              <td className="border px-4 py-2">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
