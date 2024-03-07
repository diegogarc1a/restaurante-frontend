import { useEffect } from "react";
import { useProductStore } from "../../../hooks";
import { TableProducts } from "../components/TableProducts";


export const ProductoPage = () => {

  const { startLoadingProducts } = useProductStore();

  useEffect(() => {
    startLoadingProducts()
  }, [])
  

  return (
    <div className="card">
      <TableProducts/>
    </div>
  )
}
