import { Button } from "primereact/button";
import { useProductStore } from "../../../hooks";
import { Toolbar } from "primereact/toolbar";


export const ToolbarProduct = () => {

    const { isProductModalOpen, openProductModal } = useProductStore();

    const onClickNew = () => {
      openProductModal();
    }
  
      const leftToolbarTemplate = () => {
          return (
              <div className="flex flex-wrap gap-2">
                  <Button label="New" icon="pi pi-plus" severity="success" onClick={onClickNew} />
              </div>
          );
      };
  
      const centerContent = (
        <div className="flex flex-wrap align-items-center gap-3">
          <p className="text-center text-2xl">
              Modulo de Producto
          </p>
        </div>
    );
  
    return (
      <div className="grid flex justify-content-center flex-wrap">
        <div className="col-10">
          <Toolbar start={leftToolbarTemplate} center={centerContent}  className="bg-blue-500 shadow-2" style={{ borderRadius: '3rem', backgroundImage: 'linear-gradient(to right, var(--blue-500), var(--blue-300))' }}></Toolbar>
          </div>
        </div>
              
    )
  }
  