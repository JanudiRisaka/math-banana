import React from 'react';
import { Button } from '../Layout/Button';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle } from 'lucide-react';

const DeleteModal = ({ showModal, onCancel, onDelete }) => (
  showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=2342&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
          <div className="flex items-center justify-center my-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white font-serif">Math Banana</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
            <p className="text-gray-300">
              Are you sure you want to delete your account?<br />
              This action cannot be undone and all data will be permanently lost.
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button
              variant="ghost"
              className="text-white hover:text-yellow-400"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="fantasy"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onDelete}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
);

export default DeleteModal;