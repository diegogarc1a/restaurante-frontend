import { useState } from "react";
import { useProductStore, useVentaStore } from "../../../hooks";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DialogDetalleVenta } from "../../venta/components/DialogDetalleVenta";

export const DialogDataViewProducts = ({ visible, setVisible }) => {


    const { products, setActiveProduct } = useProductStore();
    const { openVentaModal } = useVentaStore();
    const [layout, setLayout] = useState('grid');
    const [productDetalle, setProductDetalle] = useState(null);

    const onSelectProduct = (product) => {
        return () => {
          setProductDetalle(product);
          openVentaModal();
        };
      };

      const handleHide = () => {
        setVisible(false);
      }
    

    const gridItem = (product) => {
        return (
            <div className="sm:col-4 col-12 p-1" key={product.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.categoria.nombre}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`${import.meta.env.VITE_API_URL}recursos/${product.foto}`} alt={product.descripcion} width="200" />
                        <div className="text-lg font-bold">{product.nombre}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-lg font-semibold">${product.precio}</span>
                        <Button icon="pi pi-plus" className="p-button-rounded" onClick={onSelectProduct(product)}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product) => {
        if (!product) {
            return;
        }
      return gridItem(product);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter flex flex-wrap justify-content-center">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };


  return (
    <Dialog header='Lista productos' visible={visible} draggable={false} onHide={handleHide}
     breakpoints={{ '960px': '85', '641px': '85vw' }} modal className="p-fluid">
    <div className="grid flex justify-content-center flex-wrap">
    <div className="col-12">
            <DataView value={products} listTemplate={listTemplate} layout={layout}/>
    </div>
    </div>
    <DialogDetalleVenta productoDetalle={productDetalle} />
    </Dialog>
    
  )
}
