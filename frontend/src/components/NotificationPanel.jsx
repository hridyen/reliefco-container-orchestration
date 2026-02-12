import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off('new_notification');
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-2">Notifications</h3>
      <ul className="space-y-2">
        {notifications.map((notification, index) => (
          <li key={index} className="bg-white p-2 rounded shadow">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPanel;
