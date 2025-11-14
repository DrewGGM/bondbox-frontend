import React, { useEffect, useState } from 'react';
import { GroupsServiceImp } from '@/api/services/groupService';
import type { UsersGroupInformation } from '@/types/groups.types';
import credentialManager from '@/utils/credentialManager';

interface GroupUsersModalProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
  onStartDirectChat: (userId: string, userName: string) => void;
}

export const GroupUsersModal: React.FC<GroupUsersModalProps> = ({
  groupId,
  groupName,
  isOpen,
  onClose,
  onStartDirectChat,
}) => {
  const [users, setUsers] = useState<UsersGroupInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const groupService = new GroupsServiceImp();
  const currentUserId = credentialManager.getUserId();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, groupId]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const groupUsers = await groupService.getUsersGroup(groupId);
      setUsers(groupUsers);
    } catch (err) {
      setError('Error al cargar usuarios del grupo');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-800">Miembros del grupo</h3>
            <p className="text-xs text-gray-500">{groupName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No hay usuarios en este grupo</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                return (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">
                          {user.full_name}
                          {isCurrentUser && (
                            <span className="text-xs text-gray-500 ml-2">(Tú)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    {!isCurrentUser && (
                      <button
                        onClick={() => {
                          onStartDirectChat(user.id, user.full_name);
                          onClose();
                        }}
                        className="ml-2 px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary-dark transition-colors flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {users.length} {users.length === 1 ? 'miembro' : 'miembros'}
          </p>
        </div>
      </div>
    </div>
  );
};
