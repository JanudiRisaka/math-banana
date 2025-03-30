import { Check, X } from "lucide-react";
import { useMemo } from 'react';

const PasswordCriteria = ({ password }) => {
  const criteria = useMemo(() => [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Special character (@$!%*?&)", met: /[@$!%*?&]/.test(password) },
  ], [password]);

  return (
    <div className="mt-3 space-y-2">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-sm">
          {item.met ? (
            <Check className="w-4 h-4 text-green-500 mr-2" />
          ) : (
            <X className="w-4 h-4 text-red-500 mr-2" />
          )}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const { strength, strengthText, strengthColor } = useMemo(() => {
    let strength = 0;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (hasMinLength) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;

    const getStrengthDetails = () => {
      if (strength <= 1) return { text: "Very Weak", color: "bg-red-500" };
      if (strength === 2) return { text: "Weak", color: "bg-orange-500" };
      if (strength === 3) return { text: "Fair", color: "bg-yellow-500" };
      if (strength === 4) return { text: "Good", color: "bg-green-500" };
      return { text: "Strong", color: "bg-green-600" };
    };

    const { text, color } = getStrengthDetails();

    return {
      strength,
      strengthText: text,
      strengthColor: color
    };
  }, [password]);

  return (
    <div className="mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">Password Strength</span>
        <span className={`text-sm font-medium ${strengthColor.replace('bg', 'text')}`}>
          {strengthText}
        </span>
      </div>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-full rounded-full transition-all duration-300 ${
              index < strength ? strengthColor : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;