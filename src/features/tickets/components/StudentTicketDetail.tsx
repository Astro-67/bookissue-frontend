import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTicket } from '../../../hooks/api';
import TicketComments from './TicketComments';
import { getMediaUrl } from '../../../utils/media';
import { 
  RiArrowLeftLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiUserLine,
  RiCalendarLine,
  RiAlertLine
} from 'react-icons/ri';

const StudentTicketDetail: React.FC = () => {
  const { ticketId } = useParams({ from: '/student/tickets/$ticketId' });
  const { data: ticket, isLoading, error } = useTicket(parseInt(ticketId));

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <p className="text-red-800">Error loading ticket: {(error as any)?.message}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Screenshot */}
              {ticket.screenshot && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Screenshot</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      console.log('StudentTicketDetail - ticket.screenshot:', ticket.screenshot);
                      console.log('StudentTicketDetail - getMediaUrl result:', getMediaUrl(ticket.screenshot));
                      return null;
                    })()}
                    <img 
                      src={getMediaUrl(ticket.screenshot) || ''} 
                      alt="Issue screenshot"
                      className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        const fullUrl = getMediaUrl(ticket.screenshot);
                        if (fullUrl) window.open(fullUrl, '_blank');
                      }}
                      onError={(e) => {
                        console.error('StudentTicketDetail - Failed to load image:', ticket.screenshot);
                        console.error('StudentTicketDetail - Attempted URL:', getMediaUrl(ticket.screenshot));
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click to view full size
                    </p>
                  </div>
                </div>
              )}
              
              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <TicketComments ticketId={ticket.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <RiCalendarLine className="w-4 h-4 mr-1" />
                        {formatDate(ticket.created_at)}
                      </div>
                    </dd>
                  </div>
                  
                  {ticket.updated_at !== ticket.created_at && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(ticket.updated_at)}
                      </dd>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                    <dd className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <RiUserLine className="w-4 h-4 mr-1" />
                        {ticket.created_by.first_name} {ticket.created_by.last_name}
                      </div>
                    </dd>
                  </div>

                  {ticket.assigned_to && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                      <dd className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <RiUserLine className="w-4 h-4 mr-1" />
                          {ticket.assigned_to.first_name} {ticket.assigned_to.last_name}
                        </div>
                      </dd>
                    </div>
                  )}

                  {ticket.resolved_at && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Resolved</dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(ticket.resolved_at)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Status Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Issue created</span>
                  </div>
                  {ticket.status !== 'OPEN' && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">In progress</span>
                    </div>
                  )}
                  {ticket.status === 'RESOLVED' && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTicketDetail;
