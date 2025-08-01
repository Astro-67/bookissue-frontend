import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useRealTimeTickets, usePrefetchTicket, useCurrentUser } from '../../../hooks/api';
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
  baseRoute: string; // e.g., '/student/tickets' or '/staff/tickets'
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ ticket, baseRoute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const prefetchTicket = usePrefetchTicket();

  const handleEdit = () => {
    // TODO: Implement edit functionality
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 160 // 160px is dropdown width
      });
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
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
        className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="More actions"
        type="button"
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
              to={baseRoute === '/staff/tickets' ? '/staff/tickets/$ticketId' : '/student/tickets/$ticketId'}
              params={{ ticketId: ticket.id.toString() }}
              onMouseEnter={() => prefetchTicket(ticket.id)}
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RiEyeLine className="w-4 h-4 mr-2 text-blue-500" />
              View Details
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit();
              }}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              type="button"
            >
              <RiEditLine className="w-4 h-4 mr-2 text-green-500" />
              Edit Issue
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const UserTicketsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get current user to filter tickets by created_by
  const { data: currentUser } = useCurrentUser();

  // Get the current route to determine the base path
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isStaff = pathname.includes('/staff/');
  const baseRoute = isStaff ? '/staff/tickets' : '/student/tickets';

  // Fetch tickets with filters - explicitly filter by current user ID to ensure
  // both students and staff only see tickets they created
  const { data: tickets, isLoading, error } = useRealTimeTickets({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    created_by: currentUser?.id, // Always filter by current user
  });

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
        return <RiTimeLine className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <RiPlayLine className="w-4 h-4" />;
      case 'RESOLVED':
        return <RiCheckboxCircleLine className="w-4 h-4" />;
      default:
        return <RiTimeLine className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sort tickets based on current sort state
  const sortedTickets = React.useMemo(() => {
    if (!tickets?.results) return [];
    
    const sorted = [...tickets.results].sort((a, b) => {
      let aValue: any = a;
      let bValue: any = b;
      
      // Handle nested properties
      const keys = sortKey.split('.');
      for (const key of keys) {
        aValue = aValue?.[key];
        bValue = bValue?.[key];
      }
      
      // Handle different types
      if (sortKey === 'created_at' || sortKey === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [tickets?.results, sortKey, sortDirection]);

  // Define table columns
  const columns: TableColumn<Ticket>[] = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value) => (
        <div className="max-w-sm">
          <div className="font-medium text-gray-900 truncate">{value}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      width: '140px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
          {getStatusIcon(value)}
          <span className="ml-1">{value.replace('_', ' ')}</span>
        </span>
      ),
    },
    {
      key: 'comments_count',
      title: 'Comments',
      sortable: true,
      width: '100px',
      render: (_, ticket) => (
        <div className="flex items-center text-sm text-gray-600">
          <RiMessageLine className="w-4 h-4 mr-1" />
          <span>{ticket.comments_count || 0}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'Created',
      sortable: true,
      width: '160px',
      render: (value) => (
        <div className="text-sm text-gray-500">
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '80px',
      render: (_, ticket) => (
        <div className="relative">
          <ActionsDropdown ticket={ticket} baseRoute={baseRoute} />
        </div>
      ),
    },
  ];

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
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
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading tickets: {(error as any)?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Issues</h1>
          <p className="text-gray-600">View and track your submitted issues</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RiAddLine className="w-4 h-4 mr-2" />
          New Issue
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <Table
            data={sortedTickets}
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            loading={isLoading}
            emptyMessage={
              searchTerm || statusFilter 
                ? 'No issues found matching your criteria'
                : 'No issues found. Create your first issue to get started.'
            }
          />
        </div>
      </div>

      {/* Results count */}
      {sortedTickets.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {sortedTickets.length} issue{sortedTickets.length !== 1 ? 's' : ''}
          {tickets?.count && tickets.count > sortedTickets.length && 
            ` of ${tickets.count} total`
          }
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Issue"
        maxWidth="lg"
      >
        <CreateTicketForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
};

export default UserTicketsList;
