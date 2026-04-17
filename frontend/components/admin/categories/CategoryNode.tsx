import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Category } from "@/types/category";
function CategoryNode({ node, level = 0 }: { node: Category, level?: number }) {
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
        </div>

        <CollapsibleContent className="ml-2 border-l">
        {node.children?.map((child) => (
            <div key={child.id} className="border-b last:border-b-0">
            <CategoryNode node={child} level={level + 1} />
            </div>
        ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default CategoryNode;
