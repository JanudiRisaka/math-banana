import React from 'react';
import { Button } from '../Layout/Button';

const Actions = ({ onUpdateClick, onDeleteClick }) => (
  <div className="border-t border-gray-600 pt-6 mt-6 text-center">
    <div className="w-full flex gap-4 justify-center">
      <Button
        variant="primary"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={onUpdateClick}
      >
        Update Profile
      </Button>
      <Button
        variant="danger"
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        onClick={onDeleteClick}
      >
        Delete Account
      </Button>
    </div>
  </div>
);

export default Actions;
