import { Category } from "@/types/category";

type TreeCategory = Omit<Category, "children"> & {
  children: TreeCategory[];
};
function treeBuilder(categories: Category[]) {
  const map: Record<string, TreeCategory> = {};
  const roots: TreeCategory[] = [];

  // create all nodes and add empty children []
  categories.forEach(cat => {
    map[cat.id] = {
      ...cat,
      children: []
    };
  });

  categories.forEach(cat => {
    const node = map[cat.id];

    if (cat.parent_id && map[cat.parent_id]) {
      map[cat.parent_id]?.children.push(node); // add child to parent
    } else {
      roots.push(node); // add node to roots
    }
  });

  return roots;
}

export default treeBuilder;
