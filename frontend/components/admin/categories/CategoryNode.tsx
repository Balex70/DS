import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Category } from "@/types/category";
import { Input } from "@/components/ui/input";

function CategoryNode({
  node,
  level = 0,
  onSelected,
  selectedIds
}: {
    node: Category,
    level?: number,
    onSelected: (id: number) => void,
    selectedIds: number[]
  }) {
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
        </div>

        <CollapsibleContent className="ml-2 border-l">
          {node.children?.map((child) => (
              <div key={child.id} className="border-b last:border-b-0">
              <CategoryNode node={child} level={level + 1} onSelected={onSelected} selectedIds={selectedIds} />
              </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default CategoryNode;
