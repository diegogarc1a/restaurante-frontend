import { useEffect } from "react";
import { useCategoryStore } from "../../../hooks"
import { TableCategories, ToolbarCategories } from "../";


export const CategoriaPage = () => {

  const { categories, startLoadingCategories, setActiveCategory  } = useCategoryStore();

  useEffect(() => {
    startLoadingCategories();
  }, [])

  

  return (
    <>
    <div className="card">
      <ToolbarCategories/>
      <TableCategories categories={categories} setActiveCategory={setActiveCategory} />

    </div>
    </>
    
  )
}
