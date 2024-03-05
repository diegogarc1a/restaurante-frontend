import { useEffect } from "react";
import { useCategoryStore } from "../../../hooks"

export const CategoriaPage = () => {

  const { categories, startLoadingCategories  } = useCategoryStore();

  useEffect(() => {
    startLoadingCategories();
  }, [])
  
  return (
    <div>CategoriaPage</div>
  )
}
