import { useEffect } from "react";
import { useProductStore } from "../../../hooks";
import { TableProducts } from "../components/TableProduct";
import { ToolbarProduct } from "../components/ToolbarProduct";


export const ProductoPage = () => {

  const { startLoadingProducts } = useProductStore();

  useEffect(() => {
    startLoadingProducts()
  }, [])
  

  return (
    <div className="card">
      <ToolbarProduct/>
      <TableProducts/>
    </div>
  )
}
