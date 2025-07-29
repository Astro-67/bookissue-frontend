import React, { useState } from 'react';
import { useCreateTicket } from '../../../hooks/api';
import type { CreateTicketData } from '../../../types/api';
import { RiSendPlaneLine, RiCloseLine } from 'react-icons/ri';

interface CreateTicketFormProps {
  onSuccess?: () => void;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onSuccess }) => {
  const createTicketMutation = useCreateTicket();

  const [formData, setFormData] = useState<CreateTicketData>({
    title: '',
    description: '',
    screenshot: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createTicketMutation.mutate(formData, {
      onSuccess: () => {
        // Reset form
        setFormData({ title: '', description: '', screenshot: undefined });
        setErrors({});
        onSuccess?.();
      },
      onError: (error: any) => {
        console.error('Failed to create ticket:', error);
        console.error('Error response:', error?.response?.data);
        
        // Handle validation errors
        if (error?.response?.data) {
          const serverErrors = error.response.data;
          if (typeof serverErrors === 'object') {
            setErrors(prev => ({
              ...prev,
              ...serverErrors
            }));
          }
        }
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      // File was cleared/removed
      setFormData(prev => ({
        ...prev,
        screenshot: undefined
      }));
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        screenshot: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
      }));
      // Clear the file input
      e.target.value = '';
      return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        screenshot: 'File size must be less than 5MB'
      }));
      // Clear the file input
      e.target.value = '';
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      screenshot: file
    }));
    
    // Clear error if file is valid
    if (errors.screenshot) {
      setErrors(prev => ({
        ...prev,
        screenshot: ''
      }));
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({ title: '', description: '', screenshot: undefined });
    setErrors({});
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Issue Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Please provide more details about the issue..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Screenshot Field */}
      <div>
        <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-1">
          Screenshot (Optional)
        </label>
        <input
          type="file"
          id="screenshot"
          name="screenshot"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.screenshot 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {formData.screenshot && (
          <p className="mt-1 text-sm text-green-600">
            Selected: {formData.screenshot.name} ({(formData.screenshot.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        {errors.screenshot && (
          <p className="mt-1 text-sm text-red-600">{errors.screenshot}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Accepted formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RiCloseLine className="w-4 h-4 inline mr-1" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={createTicketMutation.isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTicketMutation.isPending ? (
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating...
            </div>
          ) : (
            <>
              <RiSendPlaneLine className="w-4 h-4 inline mr-1" />
              Create Issue
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
