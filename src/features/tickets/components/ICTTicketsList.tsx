import React, { useState } from 'react';
import { useRealTimeTickets, useAssignTicket, useUpdateTicket, useRealTimeNotifications, usePrefetchTicket } from '../../../hooks/api';
import { useAuth } from '../../../contexts/AuthContext';
import Table from '../../../ui/Table';
import { Link } from '@tanstack/react-router';
import { 
  RiEyeLine,
  RiUserAddLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiAlertLine,
  RiChat1Line,
  RiRefreshLine
} from 'react-icons/ri';
import type { Ticket } from '../../../types/api';

const ICTTicketsList: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  const { data: ticketsData, isLoading, error, isUpdating, lastUpdated } = useRealTimeTickets(filters);
  const assignTicketMutation = useAssignTicket();
  const updateTicketMutation = useUpdateTicket();
  const prefetchTicket = usePrefetchTicket();
  
  // Enable real-time notifications for ICT users
  useRealTimeNotifications();

  // Handle both array and paginated response
  const tickets = React.useMemo(() => {
    if (!ticketsData) return [];
    
    // If it's an array, return as-is
    if (Array.isArray(ticketsData)) {
      return ticketsData;
    }
    
    // If it's paginated response, return results
    if (ticketsData.results && Array.isArray(ticketsData.results)) {
      return ticketsData.results;
    }
    
    return [];
  }, [ticketsData]);

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
        return <RiAlertLine className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <RiTimeLine className="w-4 h-4" />;
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="w-4 h-4" />;
      default:
        return <RiTimeLine className="w-4 h-4" />;
    }
  };

  const handleAssignToSelf = async (ticketId: number) => {
    if (!user) return;
    
    try {
      // Assign ticket to current ICT user
      await assignTicketMutation.mutateAsync({
        ticketId,
        assignedToId: user.id
      });
      
      // Update status to IN_PROGRESS
      await updateTicketMutation.mutateAsync({
        ticketId,
        data: { status: 'IN_PROGRESS' }
      });
      
      // No need to manually refetch - real-time updates will handle it
    } catch (error) {
      // Error handling is now done in the mutation hooks with toast
    }
  };

  const handleMarkResolved = async (ticketId: number) => {
    try {
      await updateTicketMutation.mutateAsync({
        ticketId,
        data: { status: 'RESOLVED' }
      });
      // No need to manually refetch - real-time updates will handle it
    } catch (error) {
      // Error handling is now done in the mutation hooks with toast
    }
  };

  const columns = [
    {
      title: 'Status',
      key: 'status' as keyof Ticket,
      render: (_: any, ticket: Ticket) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
          {getStatusIcon(ticket.status)}
          <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
        </span>
      )
    },
    {
      title: 'Issue',
      key: 'title' as keyof Ticket,
      render: (_: any, ticket: Ticket) => (
        <div>
          <div className="font-medium text-gray-900">{ticket.title}</div>
          <div className="text-sm text-gray-500">by {ticket.created_by.full_name}</div>
        </div>
      )
    },
    {
      title: 'Assigned To',
      key: 'assigned_to' as keyof Ticket,
      render: (_: any, ticket: Ticket) => (
        ticket.assigned_to ? (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{ticket.assigned_to.full_name}</div>
            <div className="text-gray-500">{ticket.assigned_to.role.toUpperCase()}</div>
          </div>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        )
      )
    },
    {
      title: 'Comments',
      key: 'comments_count' as keyof Ticket,
      render: (_: any, ticket: Ticket) => (
        <div className="flex items-center text-gray-600">
          <RiChat1Line className="w-4 h-4 mr-1" />
          <span>{ticket.comments_count || 0}</span>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'id' as keyof Ticket,
      render: (_: any, ticket: Ticket) => (
        <div className="flex items-center space-x-2">
          <Link
            to="/ict/ticket/$ticketId"
            params={{ ticketId: ticket.id.toString() }}
            onMouseEnter={() => prefetchTicket(ticket.id)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View Details"
          >
            <RiEyeLine className="w-4 h-4" />
          </Link>
          
          {!ticket.assigned_to && (
            <button
              onClick={() => handleAssignToSelf(ticket.id)}
              disabled={assignTicketMutation.isPending || updateTicketMutation.isPending}
              className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
              title="Assign to Me"
            >
              <RiUserAddLine className="w-4 h-4" />
            </button>
          )}
          
          {ticket.assigned_to?.id === user?.id && ticket.status !== 'RESOLVED' && (
            <button
              onClick={() => handleMarkResolved(ticket.id)}
              disabled={updateTicketMutation.isPending}
              className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50"
              title="Mark as Resolved"
            >
              <RiCheckboxCircleLine className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading tickets: {(error as any)?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">All Support Tickets</h1>
          {isUpdating && (
            <div className="flex items-center text-sm text-blue-600">
              <RiRefreshLine className="w-4 h-4 mr-1 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table
          data={tickets}
          columns={columns}
          emptyMessage="No tickets found"
        />
      </div>
    </div>
  );
};

export default ICTTicketsList;
