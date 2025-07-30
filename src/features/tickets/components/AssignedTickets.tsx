import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { useTickets } from '../../../hooks/api';

export const AssignedTickets: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tickets assigned to the current user
  const { data: ticketsData, isLoading, error } = useTickets(
    user?.id ? {
      assigned_to: user.id,
      ...(searchTerm.trim() && { search: searchTerm.trim() }),
      ...(statusFilter && { status: statusFilter }),
    } : undefined
  );

  const tickets = ticketsData?.results || [];

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border";
    
    switch (status) {
      case 'OPEN':
        return `${baseClasses} bg-red-100 text-red-800 border-red-200`;
      case 'IN_PROGRESS':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
      case 'RESOLVED':
        return `${baseClasses} bg-green-100 text-green-800 border-green-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !isLoading) {
    console.error('Tickets loading error:', error);
    return (
      <div className="text-center py-8">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load tickets</h3>
        <p className="mt-1 text-sm text-gray-500">
          There was a problem loading your assigned tickets. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              id="search"
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(statusFilter || searchTerm) && (
            <div>
              <button
                onClick={clearFilters}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
        {(statusFilter || searchTerm) && <span className="ml-2 text-blue-600">(filtered)</span>}
      </div>

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No assigned tickets</h3>
          <p className="mt-2 text-gray-500 max-w-sm mx-auto">
            {statusFilter || searchTerm 
              ? 'No tickets match your current filters. Try adjusting your search criteria.' 
              : 'You have no tickets assigned to you at the moment. New assignments will appear here.'
            }
          </p>
          {(statusFilter || searchTerm) && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                          {ticket.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(ticket.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ticket.created_by?.full_name || ticket.created_by?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={user?.role === 'ict' ? "/ict/ticket/$ticketId" : "/staff/ticket/$ticketId"}
                        params={{ ticketId: ticket.id.toString() }}
                        search={{ returnTo: '/ict/assigned-tickets' }}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-150"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
