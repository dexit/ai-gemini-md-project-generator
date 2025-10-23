
import React from 'react';

interface FormFieldProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, description, children }) => {
  return (
    <div>
      <label className="block text-md font-medium text-gray-300">{label}</label>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      {children}
    </div>
  );
};

export default FormField;
