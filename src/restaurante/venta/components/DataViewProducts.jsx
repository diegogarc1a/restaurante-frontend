import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Badge } from "primereact/badge";
import { useCategoryStore, useProductStore, useVentaStore } from "../../../hooks";
import { DialogDetalleVenta } from "./DialogDetalleVenta";
import { DataViewCart } from "./DataViewCart";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const FiltroPorDefecto = {'id':0, 'nombre': 'Todo'};

export const DataViewProducts = () => {

    const toastRef = useRef(null);
    const { products, setActiveProduct } = useProductStore();
    const { categories } = useCategoryStore();
    const { openVentaModal, detalleVentas } = useVentaStore();
    const [layout, setLayout] = useState('grid');
    const [cartVisible, setCartVisible] = useState(false);
    const [productDetalle, setProductDetalle] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(FiltroPorDefecto);
    

    const onSelectProduct = (product) => {
        return () => {
          setProductDetalle(product);
          openVentaModal();
        };
      };
    
      const filterProducts = (productos) => {
        if (selectedCategory.id === 0) return products;
        return productos.filter((producto) => producto.categoria.nombre === selectedCategory.nombre);
      };

    const gridItem = (product) => {
        return (
            <div className="col-6 sm:col-4 lg:col-4 xl:col-4 p-1" key={product.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.categoria.nombre}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {/* <img className="w-9 shadow-2 border-round" src={`${import.meta.env.VITE_API_URL}recursos/${product.foto}`} alt={product.descripcion} width="200" /> */}
                        <img
                        className="w-9 shadow-2 border-round"
                        src={`${import.meta.env.VITE_API_URL}recursos/${product.foto}`}
                        alt={product.descripcion}
                        style={{
                            width: '100%', // ancho del contenedor
                            height: 'auto', // alto automático para mantener proporción
                            objectFit: 'contain', // ajusta la imagen al contenedor sin recortar
                            maxHeight: '150px', // alto máximo para evitar que la imagen sea demasiado alta
                        }}
                        />
                        <div className="text-lg font-bold">{product.nombre}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-lg font-semibold">${product.precio.toFixed(2)}</span>
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

    const header = () => {
        return (
          <>
            <div className="flex justify-content-between p-1 bg-primary border-round m-2">
              <div>
                <p className="ml-2 text-center">Modulo de Ventas</p>
              </div>
              <div className="mr-2">
                <Button className="p-button-rounded" icon="pi pi-shopping-cart" size="large" severity="success" onClick={() => setCartVisible(true)}>
                  <Badge value={detalleVentas.reduce((acc, curr) => acc + curr.cantidad, 0)}></Badge>
                </Button>
              </div>
            </div>
            <div className="flex flex justify-content-start mt-3">
            <span className="mr-2 mt-3">Categorías:</span>
            <Dropdown
                value={selectedCategory}
                options={[FiltroPorDefecto, ...categories]}
                onChange={(e) => setSelectedCategory(e.value)}
                optionLabel="nombre"
                placeholder="Seleccione una categoría"
                />
            </div>
          </>
        );
      };


    return (
        <div className="grid flex justify-content-center flex-wrap">
            <Toast ref={toastRef} position="bottom-right" />
            <div className="col-12">
            <DataView value={filterProducts(products)} listTemplate={listTemplate} layout={layout} header={header()}/>
            </div>
            <DialogDetalleVenta productoDetalle={productDetalle} toastRef={toastRef} />
            <DataViewCart cartVisible={cartVisible} setCartVisible={setCartVisible} toastRef={toastRef}/>
        </div>
    )
}
        