import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Category } from "@/types/category";
import { Input } from "@/components/ui/input";
import { CategoryActions } from "./CategoryActions";
import NextImageWithReplace from "@/components/custom/NextImageWithReplace";

function CategoryNode({
  node,
  level = 0,
  onSelected,
  selectedIds,
  fetchCategories,
  viewOpen,
  onView,
  editOpen,
  onEdit
}: {
    node: Category,
    level?: number,
    onSelected: (id: number) => void,
    selectedIds: number[],
    fetchCategories: () => void,
    viewOpen: boolean,
    onView: (category: Category) => void,
    editOpen: boolean,
    onEdit: (category: Category) => void
  }) {
  const hasChildren = (node.children?.length && node.children?.length > 0)? true : false;
  const preview = node.image

  return (
    <div style={{ paddingLeft: level * 24 }}>
      <Collapsible>
        <div className="flex items-center gap-2 py-1">
          {hasChildren && (
            <CollapsibleTrigger asChild>
              <button>▶</button>
            </CollapsibleTrigger>
          )}

          <span>{node.name} ({node.id})</span>
          <div className="flex items-center gap-2">
            <Input className="h-8 w-full max-w-xs" id="active" type="checkbox" checked={selectedIds.includes(node.id)} onChange={() => onSelected(node.id)}/>
          </div>
          <CategoryActions
            category={node}
            onView={(category) => onView(category)}
            onEdit={(category) => onEdit(category)}
          />
          {preview && (
            <NextImageWithReplace
                    src={preview}
                    alt={"name"}
                    width={24}
                    height={24}
                    imageClassName="object-cover border"
                />
          )}
        </div>

        <CollapsibleContent className="ml-2 border-l">
          {node.children?.map((child) => (
              <div key={child.id} className="border-b last:border-b-0">
              <CategoryNode
                node={child}
                level={level + 1}
                onSelected={onSelected}
                selectedIds={selectedIds}
                fetchCategories={fetchCategories}
                viewOpen={viewOpen}
                onView={onView}
                editOpen={editOpen}
                onEdit={onEdit}
                />
              </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default CategoryNode;
