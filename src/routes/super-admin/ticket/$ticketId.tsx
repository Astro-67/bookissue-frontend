import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTicket, useDeleteTicket, useUpdateTicket, useUsers } from '../../../hooks/api';
import TicketComments from '../../../features/tickets/components/TicketComments';
import { getMediaUrl } from '../../../utils/media';
import { 
  RiArrowLeftLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine,
  RiDeleteBinLine,
  RiEditLine
} from 'react-icons/ri';

function SuperAdminTicketDetail() {
  const { ticketId } = Route.useParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  
  const { data: ticket, isLoading, error } = useTicket(parseInt(ticketId));
  const { data: usersResponse } = useUsers();
  const deleteTicketMutation = useDeleteTicket();
  const updateTicketMutation = useUpdateTicket();

  // Handle different API response formats for users
  const users = Array.isArray(usersResponse) 
    ? usersResponse 
    : usersResponse?.results || usersResponse?.data || [];

  React.useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setSelectedAssignee(ticket.assigned_to?.id?.toString() || '');
    }
  }, [ticket]);

  const handleDelete = () => {
    deleteTicketMutation.mutate(parseInt(ticketId), {
      onSuccess: () => {
        // Navigate back to tickets list
        window.location.href = '/super-admin/tickets';
      }
    });
  };

  const handleUpdate = () => {
    const updateData: any = {};
    
    if (selectedStatus !== ticket?.status) {
      updateData.status = selectedStatus;
    }
    
    if (selectedAssignee !== (ticket?.assigned_to?.id?.toString() || '')) {
      updateData.assigned_to = selectedAssignee ? parseInt(selectedAssignee) : undefined;
    }

    if (Object.keys(updateData).length > 0) {
      updateTicketMutation.mutate({
        ticketId: parseInt(ticketId),
        data: updateData
      }, {
        onSuccess: () => {
          setIsEditing(false);
        }
      });
    } else {
      setIsEditing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <RiAlertLine className="h-5 w-5 text-red-500" />;
      case 'IN_PROGRESS':
        return <RiTimeLine className="h-5 w-5 text-yellow-500" />;
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="h-5 w-5 text-green-500" />;
      default:
        return <RiAlertLine className="h-5 w-5 text-gray-500" />;
    }
  };

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800">Ticket Not Found</h3>
          <p className="text-red-700 mt-1">
            {error?.message || 'The ticket you are looking for does not exist or you do not have permission to view it.'}
          </p>
          <div className="mt-4">
            <Link
              to="/super-admin/tickets"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RiArrowLeftLine className="mr-2 h-4 w-4" />
              Back to Tickets
            </Link>
          </div>
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
            to="/super-admin/tickets"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <RiArrowLeftLine className="mr-2 h-4 w-4" />
            Back to All Tickets
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RiEditLine className="mr-2 h-4 w-4" />
              Edit Ticket
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={updateTicketMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {updateTicketMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RiDeleteBinLine className="mr-2 h-4 w-4" />
            Delete Ticket
          </button>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(ticket.status)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="text-sm text-gray-500">Ticket #{ticket.id}</p>
              </div>
            </div>
            {!isEditing ? (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            ) : (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            )}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <RiFileTextLine className="mr-2 h-5 w-5" />
                  Description
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {ticket.screenshot && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Screenshot</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={getMediaUrl(ticket.screenshot) || ''} 
                      alt="Issue screenshot"
                      className="max-w-full h-auto rounded-md cursor-pointer"
                      onClick={() => {
                        const fullUrl = getMediaUrl(ticket.screenshot);
                        if (fullUrl) window.open(fullUrl, '_blank');
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', ticket.screenshot);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Ticket Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                      <RiUserLine className="mr-1 h-3 w-3" />
                      Created by
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {ticket.created_by ? 
                        `${ticket.created_by.first_name || ''} ${ticket.created_by.last_name || ''}`.trim() || 
                        ticket.created_by.email : 'Unknown'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                      <RiUserLine className="mr-1 h-3 w-3" />
                      Assigned to
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {!isEditing ? (
                        ticket.assigned_to ? 
                          `${ticket.assigned_to.first_name || ''} ${ticket.assigned_to.last_name || ''}`.trim() || 
                          ticket.assigned_to.email : 'Unassigned'
                      ) : (
                        <select
                          value={selectedAssignee}
                          onChange={(e) => setSelectedAssignee(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="">Unassigned</option>
                          {users.filter((u: any) => u.role === 'staff' || u.role === 'ict').map((user: any) => (
                            <option key={user.id} value={user.id}>
                              {`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}
                            </option>
                          ))}
                        </select>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                      <RiCalendarLine className="mr-1 h-3 w-3" />
                      Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'Unknown'}
                    </dd>
                  </div>

                  {ticket.updated_at && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                        <RiCalendarLine className="mr-1 h-3 w-3" />
                        Last Updated
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(ticket.updated_at).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <TicketComments ticketId={parseInt(ticketId)} />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <RiDeleteBinLine className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Ticket</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteTicketMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleteTicketMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/super-admin/ticket/$ticketId')({
  component: SuperAdminTicketDetail,
});
