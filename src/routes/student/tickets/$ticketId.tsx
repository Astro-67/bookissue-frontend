import { createFileRoute } from '@tanstack/react-router'
import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTicket } from '../../../hooks/api';
import TicketComments from '../../../features/tickets/components/TicketComments';
import { 
  RiArrowLeftLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiAlertLine
} from 'react-icons/ri';

const StudentTicketDetail: React.FC = () => {
  const params = useParams({ from: '/student/tickets/$ticketId' });
  const { ticketId } = params;
  
  if (!ticketId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">No ticket ID provided in URL</p>
        </div>
      </div>
    );
  }
  
  const ticketIdNumber = parseInt(ticketId);
  
  if (isNaN(ticketIdNumber)) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Invalid ticket ID: {ticketId}</p>
        </div>
      </div>
    );
  }
  
  const { data: ticket, isLoading, error } = useTicket(ticketIdNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <RiAlertLine className="w-5 h-5" />;
      case 'IN_PROGRESS':
        return <RiTimeLine className="w-5 h-5" />;
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="w-5 h-5" />;
      default:
        return <RiTimeLine className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading ticket: {(error as any)?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-gray-800">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/student/tickets"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <RiArrowLeftLine className="w-4 h-4 mr-1" />
            Back to Issues
          </Link>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                My Issue
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                <span className="ml-2">{ticket.status.replace('_', ' ')}</span>
              </span>
            </div>
          </div>
          <h2 className="mt-2 text-xl text-gray-700">{ticket.title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="max-w-4xl">
            {/* Main Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <TicketComments ticketId={ticket.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/student/tickets/$ticketId')({
  component: StudentTicketDetail,
})
