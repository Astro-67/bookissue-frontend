import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useRealTimeTickets, usePrefetchTicket } from '../../../hooks/api';
import type { Ticket } from '../../../types/api';
import Table, { type TableColumn } from '../../../ui/Table';
import Modal from '../../../ui/Modal';
import CreateTicketForm from './CreateTicketForm';
import { createPortal } from 'react-dom';
import { 
  RiAddLine, 
  RiTimeLine,
  RiCheckboxCircleLine,
  RiPlayLine,
  RiEyeLine,
  RiEditLine,
  RiMore2Line,
  RiMessageLine
} from 'react-icons/ri';

// Actions Dropdown Component
interface ActionsDropdownProps {
  ticket: Ticket;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ ticket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const prefetchTicket = usePrefetchTicket();

  const handleEdit = () => {
    // TODO: Implement edit functionality
    setIsOpen(false);
  };

  const handlePrefetch = () => {
    prefetchTicket(ticket.id);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 176 // 176px is dropdown width (44 * 4)
      });
    }
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        aria-label="Actions"
      >
        <RiMore2Line className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-50 w-44 bg-white rounded-md shadow-lg border border-gray-200"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="py-1">
            <Link
              to="/staff/ticket/$ticketId"
              params={{ ticketId: ticket.id.toString() }}
              onMouseEnter={handlePrefetch}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <RiEyeLine className="w-4 h-4 mr-3" />
              View Details
            </Link>
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <RiEditLine className="w-4 h-4 mr-3" />
              Edit
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const StaffTicketsList: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  const { data: ticketsData, isLoading, error } = useRealTimeTickets(filters);

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

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Real-time updates will handle the refresh automatically
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <RiPlayLine className="w-4 h-4 text-red-600" />;
      case 'IN_PROGRESS':
        return <RiTimeLine className="w-4 h-4 text-yellow-600" />;
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="w-4 h-4 text-green-600" />;
      default:
        return <RiTimeLine className="w-4 h-4 text-gray-600" />;
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

  const columns: TableColumn<Ticket>[] = [
    {
      title: 'Title',
      key: 'title',
      render: (_, ticket) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getStatusIcon(ticket.status)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {ticket.title}
            </div>
            <div className="text-sm text-gray-500">
              Created by {ticket.created_by.first_name} {ticket.created_by.last_name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, ticket) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ')}
        </span>
      )
    },
    {
      title: 'Assigned To',
      key: 'assigned_to',
      render: (_, ticket) => (
        ticket.assigned_to ? (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {ticket.assigned_to.first_name} {ticket.assigned_to.last_name}
            </div>
            <div className="text-gray-500">{ticket.assigned_to.role.toUpperCase()}</div>
          </div>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        )
      )
    },
    {
      title: 'Comments',
      key: 'comments_count',
      render: (_, ticket) => (
        <div className="flex items-center text-gray-600">
          <RiMessageLine className="w-4 h-4 mr-1" />
          <span className="text-sm">{ticket.comments_count || 0}</span>
        </div>
      )
    },
    {
      title: 'Created',
      key: 'created_at',
      render: (_, ticket) => (
        <div className="text-sm text-gray-900">
          {new Date(ticket.created_at).toLocaleDateString()}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'id',
      render: (_, ticket) => <ActionsDropdown ticket={ticket} />
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
        <h1 className="text-2xl font-bold text-gray-900">My Issues</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RiAddLine className="w-4 h-4 mr-2" />
          Create Issue
        </button>
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
              placeholder="Search issues..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Issues Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', value: tickets.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Open', value: tickets.filter((t: Ticket) => t.status === 'OPEN').length, color: 'bg-red-50 text-red-700 border-red-200' },
          { label: 'In Progress', value: tickets.filter((t: Ticket) => t.status === 'IN_PROGRESS').length, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: 'Resolved', value: tickets.filter((t: Ticket) => t.status === 'RESOLVED').length, color: 'bg-green-50 text-green-700 border-green-200' },
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg border ${stat.color}`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table
          data={tickets}
          columns={columns}
          emptyMessage="No issues found. Create your first issue to get started."
        />
      </div>

      {/* Create Issue Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Issue"
        >
          <CreateTicketForm 
            onSuccess={handleCreateSuccess}
          />
        </Modal>
      )}
    </div>
  );
};

export default StaffTicketsList;
