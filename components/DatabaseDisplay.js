import React, { useState, useEffect } from 'react';
import { createClient } from '@vercel/edge-config';

const DatabaseDisplay = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const client = createClient(process.env.EDGE_CONFIG);
        const usersData = await client.get('users');
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="database-display">
      <h2>Users from Database</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Lastname</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.Name}</td>
              <td>{user.Lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatabaseDisplay;