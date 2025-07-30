import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { useTickets } from '../../../hooks/api';

export const AssignedTickets: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tickets assigned to the current user
  const { data: ticketsData, isLoading, error } = useTickets({
    assigned_to: user?.id,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const tickets = ticketsData?.results || [];

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide";
    switch (status) {
      case 'open':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'in_progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
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

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 text-red-400">⚠️</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading tickets</h3>
        <p className="mt-1 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search tickets
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(statusFilter || searchTerm) && (
              <div className="sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:invisible">
                  Actions
                </label>
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-900">
              {tickets.length} assigned ticket{tickets.length !== 1 ? 's' : ''} found
            </span>
          </div>
          {(statusFilter || searchTerm) && (
            <div className="text-xs text-blue-700">
              Filtered results
            </div>
          )}
        </div>
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
                        {ticket.status.replace('_', ' ').toUpperCase()}
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
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
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
