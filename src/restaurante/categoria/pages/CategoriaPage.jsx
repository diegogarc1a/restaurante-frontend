import { useEffect } from "react";
import { useCategoryStore } from "../../../hooks"
import { TableCategory, ToolbarCategory } from "../";


export const CategoriaPage = () => {

  const { startLoadingCategories } = useCategoryStore();

  useEffect(() => {
    startLoadingCategories();
  }, [])

  

  return (
    <>
    <div className="card">
      <ToolbarCategory/>
      <TableCategory/>
    </div>
    </>
    
  )
}
