import { CheckCircle2, Clock, Plus, Trash2, Edit2 } from 'lucide-react';
import type { ShoppingList } from '@/types/inventory.types';

interface ShoppingListHistoryProps {
  shoppingLists: ShoppingList[];
  onEdit?: (list: ShoppingList) => void;
  onDelete?: (listId: string) => void;
  onCreateNew?: () => void;
  loading?: boolean;
}

export const ShoppingListHistory: React.FC<ShoppingListHistoryProps> = ({
  shoppingLists,
  onEdit,
  onDelete,
  onCreateNew,
  loading = false,
}) => {
  const getStatusIcon = (status: ShoppingList['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: ShoppingList['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completada';
      case 'IN_PROGRESS':
        return 'En Progreso';
      default:
        return 'Pendiente';
    }
  };

  const getStatusColor = (status: ShoppingList['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCompletedItemsCount = (list: ShoppingList) => {
    return list.items.filter((item) => item.is_completed).length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Historial de Listas de Compras
        </h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Lista
          </button>
        )}
      </div>

      {shoppingLists.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-gray-600 text-lg">No hay listas de compras</p>
          <p className="text-gray-500 text-sm mt-2">
            Crea tu primera lista para comenzar
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shoppingLists.map((list) => (
            <div
              key={list.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{list.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                        list.status
                      )}`}
                    >
                      {getStatusIcon(list.status)}
                      {getStatusText(list.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Creada el {formatDate(list.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(list)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(list.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {getCompletedItemsCount(list)} de {list.items.length}{' '}
                    productos completados
                  </span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${list.items.length > 0 ? (getCompletedItemsCount(list) / list.items.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {list.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {list.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 text-sm ${
                          item.is_completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.is_completed}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span>
                          {item.quantity}x {item.product_name}
                        </span>
                      </div>
                    ))}
                    {list.items.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{list.items.length - 3} productos más
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
