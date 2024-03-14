import { useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { DataViewLayoutOptions, DataView } from "primereact/dataview";
import { Badge } from "primereact/badge";
import { useProductStore, useVentaStore } from "../../../hooks";
import { DialogDetalleVenta } from "./DialogDetalleVenta";
import { DataViewCart } from "./DataViewCart";

export const DataViewProducts = () => {

    const { products, setActiveProduct } = useProductStore();
    const { openVentaModal, detalleVentas } = useVentaStore();

    const [layout, setLayout] = useState('grid');
    const [cartVisible, setCartVisible] = useState(false);
    const [productDetalle, setProductDetalle] = useState(null);
    
    const onSelectProduct = (product) => () =>  {
        setProductDetalle(product);
        openVentaModal();
    };

    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${import.meta.env.VITE_API_URL}recursos/${product.foto}`} alt={product.descripcion} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.nombre}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.categoria.nombre}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">${product.precio}</span>
                            <Button icon="pi pi-shopping-cart" className="p-button-rounded"></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (product) => {
        return (
            <div className="sm:col-3 col-12 p-1 " key={product.id}>
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

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product, index);
        else if (layout === 'grid') return gridItem(product);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter flex flex-wrap justify-content-center">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end m-2">
                <div>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
                <div className="ml-2">
                    <Button className="p-button-rounded" icon="pi pi-shopping-cart" size="large" severity="success" onClick={()=> setCartVisible(true)}>
                        <Badge value={detalleVentas.reduce((acc, curr) => acc + curr.cantidad, 0)}
                        ></Badge>
                    </Button>
                </div>
            </div>
        );
    };


    return (
        <div className="grid flex justify-content-center flex-wrap">
            <div className="col-12">
            <DataView value={products} listTemplate={listTemplate} layout={layout} header={header()}/>
            </div>
            <DialogDetalleVenta productoDetalle={productDetalle} />
            <DataViewCart cartVisible={cartVisible} setCartVisible={setCartVisible}/>
        </div>
    )
}
        