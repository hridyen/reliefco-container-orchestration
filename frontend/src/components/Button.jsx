import React from 'react';
import { Link } from 'react-router-dom';

function Button({ text, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
    >
      {text}
    </Link>
  );
}

export default Button;
