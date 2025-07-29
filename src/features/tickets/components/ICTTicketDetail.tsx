import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTicket, useAssignTicket, useUpdateTicket } from '../../../hooks/api';
import { useAuth } from '../../../contexts/AuthContext';
import TicketComments from './TicketComments';
import { getMediaUrl } from '../../../utils/media';
import { 
  RiArrowLeftLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiUserAddLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine
} from 'react-icons/ri';

const ICTTicketDetail: React.FC = () => {
  const params = useParams({ from: '/ict/ticket/$ticketId' });
  const { ticketId } = params;
  const { user } = useAuth();
  
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
  
  const { data: ticket, isLoading, error, refetch } = useTicket(ticketIdNumber);
  const assignTicketMutation = useAssignTicket();
  const updateTicketMutation = useUpdateTicket();

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

  const handleAssignToSelf = async () => {
    if (!user || !ticket) return;
    
    try {
      await assignTicketMutation.mutateAsync({
        ticketId: ticket.id,
        assignedToId: user.id
      });
      
      // Also update status to IN_PROGRESS if it's currently OPEN
      if (ticket.status === 'OPEN') {
        await updateTicketMutation.mutateAsync({
          ticketId: ticket.id,
          data: { status: 'IN_PROGRESS' }
        });
      }
      
      refetch();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED') => {
    if (!ticket) return;
    
    try {
      await updateTicketMutation.mutateAsync({
        ticketId: ticket.id,
        data: { status: newStatus }
      });
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
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

  const isAssignedToMe = ticket.assigned_to?.id === user?.id;
  const canAssign = !ticket.assigned_to;
  const canChangeStatus = isAssignedToMe || user?.role === 'ict';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/ict/tickets"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <RiArrowLeftLine className="w-4 h-4 mr-1" />
            Back to All Tickets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Support Ticket #{ticket.id}
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
              <div className="space-y-6">
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
                      <img 
                        src={getMediaUrl(ticket.screenshot) || ''} 
                        alt="Issue screenshot"
                        className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => {
                          const fullUrl = getMediaUrl(ticket.screenshot);
                          if (fullUrl) window.open(fullUrl, '_blank');
                        }}
                        onError={(e) => {
                          console.error('Failed to load image:', ticket.screenshot);
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
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {canAssign && (
                  <button
                    onClick={handleAssignToSelf}
                    disabled={assignTicketMutation.isPending || updateTicketMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <RiUserAddLine className="w-4 h-4 mr-2" />
                    {assignTicketMutation.isPending ? 'Assigning...' : 'Assign to Me'}
                  </button>
                )}
                
                {canChangeStatus && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Change Status</label>
                    <div className="space-y-1">
                      {ticket.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStatusChange('IN_PROGRESS')}
                          disabled={updateTicketMutation.isPending}
                          className="w-full flex items-center justify-center px-3 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50"
                        >
                          <RiTimeLine className="w-4 h-4 mr-2" />
                          In Progress
                        </button>
                      )}
                      {ticket.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleStatusChange('RESOLVED')}
                          disabled={updateTicketMutation.isPending}
                          className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          <RiCheckboxCircleLine className="w-4 h-4 mr-2" />
                          Mark Resolved
                        </button>
                      )}
                      {ticket.status !== 'OPEN' && (
                        <button
                          onClick={() => handleStatusChange('OPEN')}
                          disabled={updateTicketMutation.isPending}
                          className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          <RiAlertLine className="w-4 h-4 mr-2" />
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Info Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <RiUserLine className="w-4 h-4 mr-1" />
                    Reported by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.created_by.full_name}
                    <span className="text-gray-500 ml-1">({ticket.created_by.role.toUpperCase()})</span>
                  </dd>
                </div>
                
                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <RiUserAddLine className="w-4 h-4 mr-1" />
                    Assigned to
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {ticket.assigned_to ? (
                      <span>
                        {ticket.assigned_to.full_name}
                        <span className="text-gray-500 ml-1">({ticket.assigned_to.role.toUpperCase()})</span>
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Unassigned</span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <RiCalendarLine className="w-4 h-4 mr-1" />
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(ticket.created_at).toLocaleString()}
                  </dd>
                </div>
                
                <div>
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <RiFileTextLine className="w-4 h-4 mr-1" />
                    Last updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(ticket.updated_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICTTicketDetail;
