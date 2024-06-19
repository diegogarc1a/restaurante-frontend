import { useEffect } from "react";
import { DataViewProducts } from "../components/DataViewProducts";
import { useCategoryStore, useProductStore } from "../../../hooks";

export const VentaPage = () => {
  const { startLoadingProducts } = useProductStore();
  const { startLoadingCategories } = useCategoryStore();

  useEffect(() => {
    startLoadingProducts();
    startLoadingCategories();
  }, []);


  return (
  //   <div className="flex flex-column md:flex-row">
  // <div className="p-col-12 md:p-col-8 flex flex-column align-items-center justify-content-center">
      <DataViewProducts />
//   </div>
// </div>
  );
};
