import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useEntityList } from '../hooks/useEntityList';
import EntityEditModal from './EntityEditModal';
import ConfirmDialog from './ConfirmDialog';
import { CONTENT_ENTITIES } from '../config/contentEntities';

// One content tab (Programs, Coaches, Events, ...): fetches the list, renders
// it in a grid via the caller-supplied `renderCard`, and owns the add/edit
// modal. `renderCard(item, { onEdit, onDelete })` returns the entity-specific
// card body — the visual layout differs enough per entity that a fully
// generic card isn't worth the complexity, but everything else here is shared.
export default function CrudSection({ entityKey, authToken, gridClassName, renderCard, addLabel }) {
  const entityConfig = CONTENT_ENTITIES[entityKey];
  const { items, loading, error, save, remove } = useEntityList(entityKey, authToken);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    setDeleteError('');
    try {
      await remove(id);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const handleSave = async (formData) => {
    await save(formData);
    setEditingItem(null);
  };

  if (loading) return <div className="text-xs text-primary p-4">Loading {entityConfig.label}s...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditingItem(entityConfig.newItem())}
          className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel || `Add New ${entityConfig.label}`}</span>
        </button>
      </div>

      {(error || deleteError) && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || deleteError}</span>
        </div>
      )}

      <div className={gridClassName || 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {items.map((item) => renderCard(item, { onEdit: () => setEditingItem(item), onDelete: () => setPendingDeleteId(item.id) }))}
      </div>

      {editingItem && (
        <EntityEditModal
          entityKey={entityKey}
          entityConfig={entityConfig}
          item={editingItem}
          authToken={authToken}
          onCancel={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}

      {pendingDeleteId !== null && (
        <ConfirmDialog
          title={`Delete this ${entityConfig.label.toLowerCase()}?`}
          message="This can't be undone."
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
