import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Layout/Button';
import helpExample from '../assets/images/helpExample.png';
import { HelpCircle, Star, Shield, Heart, Timer } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-auto flex flex-col items-center justify-center bg-cover bg-center">
    <div className="inset-0 from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm" >
    <div className="relative z-10 w-full max-w-2xl">
        <div className="p-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">

        {/* Header */}

        <div className="bg-banana-dark p-6 text-center">
          <HelpCircle className="w-12 h-12 text-white mx-auto mb-2" />
          <p className="text-banana-light text-4xl font-bold text-white">Game Rules & Instructions</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Game Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-200">
              <Star className="w-6 h-6 mr-2 text-banana-dark text-yellow-400" />
              Game Overview
            </h2>
            <p className="text-gray-200">
              Math Banana is an exciting puzzle game where you need to solve banana-themed mathematical
              puzzles. Look at the pattern in the image and determine the correct number (0-9)
              that completes the sequence.
            </p>
            {/* Help Image */}
            <div className="mt-4 flex justify-center">
              <img
                src={helpExample}  // Use imported image
                alt="Example gameplay showing banana-themed math puzzle"
                className="rounded-lg border-2 border-banana-dark w-full max-w-xs md:max-w-sm"
              />
            </div>
          </section>

          {/* Difficulty Levels */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-200">
              <Shield className="w-6 h-6 mr-2 text-banana-dark text-yellow-400" />
              Difficulty Levels
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-green-600">Easy</h3>
                <p className="text-gray-200">60 seconds per round, +5 points per correct answer</p>
              </div>
              <div>
                <h3 className="font-medium text-yellow-600">Medium</h3>
                <p className="text-gray-200">45 seconds per round, +10 points per correct answer</p>
              </div>
              <div>
                <h3 className="font-medium text-red-600">Hard</h3>
                <p className="text-gray-200">30 seconds per round, +15 points per correct answer</p>
              </div>
            </div>
          </section>

          {/* Game Rules */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-200">
              <Heart className="w-6 h-6 mr-2 text-banana-dark text-yellow-400" />
              Game Rules
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>You start with 3 lives</li>
              <li>Wrong answers cost 1 life</li>
              <li>Game ends when you run out of lives or time</li>
              <li>Enter numbers between 0-9 only</li>
              <li>Try to achieve the highest score possible!</li>
            </ul>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-200">
              <Timer className="w-6 h-6 mr-2 text-banana-dark text-yellow-400" />
              Tips
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Look for patterns in the images</li>
              <li>Take your time on easier levels to learn the patterns</li>
              <li>Practice makes perfect - play regularly to improve</li>
              <li>Keep track of your high scores and try to beat them</li>
            </ul>
          </section>
        </div>

        {/* Back Button */}
        <div className="border-t text-gray-500 bg-amber-300 rounded text-center mr-30 ml-30">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/')}
          >
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Help;