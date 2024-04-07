import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createSchedule } from '../hooks/api';
import {useAuth} from '../hooks/authContext';
import { format } from 'date-fns';
import { getAllClassroomNames } from '../hooks/api';
import { useEffect } from 'react';

const Schedule = () => {
  const [formData, setFormData] = useState({
    title: '',
    start_date: new Date(),
    start_time: '',
    end_time: '',
    type: '',
    location: '',
    description: '',
    number_of_instances: 1,
    frequency_per_week: 1,
    day_of_week: 1,
    color: '#ffffff',
    classroom: '',
  });
  const { userToken } = useAuth();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const classroomNames = await getAllClassroomNames(userToken);
        setClassrooms(classroomNames);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };
    fetchClassrooms();
    console.log('classasldc;asrooms', classrooms);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'number_of_instances' || name === 'frequency_per_week' || name === 'day_of_week' || name === 'classroom'
    ? parseInt(value, 10)
    : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setFormData({ ...formData, start_date: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSchedule(userToken, formData);
      console.log('Schedule created successfully!');
    } catch (error) {
      
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
  <h2 className="text-2xl font-bold mb-4">Create Schedule</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
      <input type="text" id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
      <DatePicker id="start_date" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" selected={formData.start_date} onChange={handleDateChange} />
    </div>
    <div className="mb-4">
      <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
      <input type="time" id="start_time" name="start_time" value={formData.start_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
      <input type="time" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
      <input type="text" id="type" name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
      <input type="text" id="location" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
      <textarea id="description" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
    </div>
    <div className="mb-4">
      <label htmlFor="number_of_instances" className="block text-sm font-medium text-gray-700">Number of Instances</label>
      <input type="number" id="number_of_instances" name="number_of_instances" value={formData.number_of_instances} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="frequency_per_week" className="block text-sm font-medium text-gray-700">Frequency per Week</label>
      <input type="number" id="frequency_per_week" name="frequency_per_week" value={formData.frequency_per_week} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <div className="mb-4">
      <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">Day of Week</label>
      <select id="day_of_week" name="day_of_week" value={parseInt(formData.day_of_week)} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      <option value={0}>Sunday</option>
    <option value={1}>Monday</option>
    <option value={2}>Tuesday</option>
    <option value={3}>Wednesday</option>
    <option value={4}>Thursday</option>
    <option value={5}>Friday</option>
    <option value={6}>Saturday</option>
      </select>
    </div>
    <div className="mb-4">
          <label htmlFor="selectedClass" className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            id="selectedClass"
            name="classroom"
            value={formData.classroom}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option key="" value="">Select a class</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>
    <div className="mb-4">
      <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
      <input type="color" id="color" name="color" value={formData.color} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
    <button type="submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Schedule</button>
  </form>
</div>

  );
};

export default Schedule;
