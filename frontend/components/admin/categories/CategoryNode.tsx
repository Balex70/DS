import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Category } from "@/types/category";
import { Input } from "@/components/ui/input";
import { CategoryActions } from "./CategoryActions";
import { EditCategoryDrawer } from "./EditCategoryDrawer";

function CategoryNode({
  node,
  level = 0,
  onSelected,
  selectedIds,
  fetchCategories
}: {
    node: Category,
    level?: number,
    onSelected: (id: number) => void,
    selectedIds: number[],
    fetchCategories: () => void
  }) {
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const hasChildren = (node.children?.length && node.children?.length > 0)? true : false;

  return (
    <div style={{ paddingLeft: level * 24 }}>
      <Collapsible>
        <div className="flex items-center gap-2 py-1">
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <button>▶</button>
            </CollapsibleTrigger>
          )}

          <span>{node.name}</span>
          <div className="flex items-center gap-2">
            <Input className="h-8 w-full max-w-xs" id="active" type="checkbox" checked={selectedIds.includes(node.id)} onChange={() => onSelected(node.id)}/>
          </div>
          <CategoryActions
            category={node}
            onEdit={(category) => {
                setSelectedCategory(category)
                setEditOpen(true)
            }}
        />
        </div>

        <CollapsibleContent className="ml-2 border-l">
          {node.children?.map((child) => (
              <div key={child.id} className="border-b last:border-b-0">
              <CategoryNode node={child} level={level + 1} onSelected={onSelected} selectedIds={selectedIds} fetchCategories={fetchCategories} />
              </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <EditCategoryDrawer
          open={editOpen}
          onOpenChange={setEditOpen}
          category={selectedCategory}
          onSuccess={fetchCategories}
      />
    </div>
  );
}

export default CategoryNode;
