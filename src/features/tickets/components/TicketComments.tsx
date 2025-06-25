import React, { useState } from 'react';
import { 
  RiSendPlaneLine, 
  RiUserLine,
  RiTimeLine,
  RiMessageLine 
} from 'react-icons/ri';
import { useTicketComments, useCreateComment } from '../../../hooks/api';
import { useAuth } from '../../../contexts/AuthContext';
import type { Comment } from '../../../types/api';

interface TicketCommentsProps {
  ticketId: number;
}

const TicketComments: React.FC<TicketCommentsProps> = ({ ticketId }) => {
  const { user } = useAuth();
  const { data: commentsData, isLoading, error } = useTicketComments(ticketId);
  
  // Handle both array and paginated response formats
  const comments = React.useMemo(() => {
    if (!commentsData) return [];
    
    // If it's an array, return as-is
    if (Array.isArray(commentsData)) {
      return commentsData;
    }
    
    // If it's paginated response, return results
    if (commentsData.results && Array.isArray(commentsData.results)) {
      return commentsData.results;
    }
    
    return [];
  }, [commentsData]);
  
  const createCommentMutation = useCreateComment();
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createCommentMutation.mutateAsync({
        ticketId,
        commentData: { message: newComment.trim() }
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <RiMessageLine className="w-5 h-5 mr-2" />
          Comments
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <RiMessageLine className="w-5 h-5 mr-2" />
          Comments
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading comments: {(error as any)?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <RiMessageLine className="w-5 h-5 mr-2" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Add a comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Type your comment here..."
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <RiSendPlaneLine className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <RiMessageLine className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to add a comment to this ticket.
            </p>
          </div>
        ) : (
          comments.map((comment: Comment) => {
            const isCurrentUser = user && comment.author_details.id === user.id;
            
            return (
              <div key={comment.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                  <div className={`rounded-lg p-4 ${
                    isCurrentUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <p className={`text-sm font-medium ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                          {comment.author_details.first_name} {comment.author_details.last_name}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isCurrentUser 
                            ? 'bg-blue-400 text-blue-100' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {comment.author_details.role}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className={`text-sm whitespace-pre-wrap ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
                        {comment.message}
                      </p>
                    </div>
                    <div className={`flex items-center text-xs ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                      <RiTimeLine className="w-3 h-3 mr-1" />
                      {formatDate(comment.created_at)}
                    </div>
                  </div>
                </div>
                <div className={`flex-shrink-0 ${isCurrentUser ? 'order-2 ml-3' : 'order-1 mr-3'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrentUser 
                      ? 'bg-blue-500' 
                      : 'bg-gray-500'
                  }`}>
                    <RiUserLine className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketComments;
