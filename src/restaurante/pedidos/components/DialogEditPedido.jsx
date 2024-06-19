import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog"
import { useCategoryStore, useProductStore, useVentaStore } from "../../../hooks";
import { Fragment, useEffect, useState } from "react";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { DialogDetalleVenta } from "../../venta/components/DialogDetalleVenta";
import { DialogDataViewProducts } from "./DialogDataViewProducts";
import Swal from "sweetalert2";

export const DialogEditPedido = ({ visible, setVisible }) => {
    const { activeVenta, openVentaModal, detalleVentas, deleteDetalleVenta, cleanDetalleVenta, startSavingVenta } = useVentaStore();
    const [ventaActiva, setVentaActiva] = useState([]);
    const [detalleVentaEdit, setDetalleVentaEdit] = useState(null);
    const [visibleDialogDataViewProducts, setVisibleDialogDataViewProducts] = useState(false);


    const { startLoadingProducts } = useProductStore();
    const { startLoadingCategories } = useCategoryStore();

    useEffect(() => {
      startLoadingProducts();
      startLoadingCategories();
    }, []);
    

    useEffect(() => {
        (activeVenta != null) ? setVentaActiva(activeVenta) : '';
    }, [activeVenta])


    const onSubmit = () => {
        const ventaGuardar = {...activeVenta};
        ventaGuardar.listaDetalleVenta = detalleVentas;
        console.log(detalleVentas);
        if(detalleVentas == ''){
            Swal.fire('Error','Carrito no puede estar vacio', "warning")
            setVisible(false);
            cleanDetalleVenta();
            return;
        }
        startSavingVenta(ventaGuardar);
        setVisible(false);
        cleanDetalleVenta();
    }

    const onShowDialogDataViewProducts = () => {
        setVisibleDialogDataViewProducts(true);
    }
    
    const handleHide = () => {
        setVisible(false);
        cleanDetalleVenta();
      }


      const onDelete = (detalleVenta, rowIndex) => {
        deleteDetalleVenta(detalleVenta, rowIndex)
    }
    
    const onEdit = (detalleVenta, index) => {
        detalleVenta = {...detalleVenta, index: index};
        setDetalleVentaEdit(detalleVenta);
        openVentaModal(); 
    }

      const onRowSelect = (event) => {
        const selectedRow = event.data;
        const index = detalleVentas.indexOf(selectedRow);
        onEdit(selectedRow, index);
    };

    const calculoTotalPagar = () => {
        let total = 0;
        total = detalleVentas.reduce((acc, curr) => acc + (curr.cantidad * curr.producto.precio), 0);
        return total;
    }


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const totalVenta = () => {
        let total = calculoTotalPagar();
        return formatCurrency(total);
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.producto.precio);
      };

      const isSelectable = (data) => {
        if ('estado' in data) {
          return data.estado === false;
        } else {
          return true;
        }
    }

    const isRowSelectable = (event) => (
        event.data ? isSelectable(event.data) : true
    );

    const rowClassName = (data) => (isSelectable(data) ? '' : 'p-disabled');

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total:" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={totalVenta} />
                <Column/>
            </Row>
        </ColumnGroup>
    );

    const actionBodyTemplate = (dv, {rowIndex}) => {
        return (
            <Fragment>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(dv, rowIndex)}/>
            </Fragment>
        );
    };

    const subtotalBodyTemplate = (rowData) => {
        return formatCurrency(rowData.producto.precio * rowData.cantidad);
      };
      

  return (
    <Dialog header='Editar pedido' visible={visible} draggable={false} onHide={handleHide} blockScroll='true'
    style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid">
        
        <div className="flex">
            <Button className="flex align-items-center justify-content-center font-bold border-round m-2"
                type="button" severity="info" icon="pi pi-plus" label="Agregar Productos" onClick={onShowDialogDataViewProducts}
            >
                
            </Button>
        </div>
       <DataTable value={detalleVentas} stripedRows showGridlines size="small" key="id" header="Carrito de venta" 
                isDataSelectable={isRowSelectable} rowClassName={rowClassName}
                selectionMode="single" onRowSelect={onRowSelect}
                footerColumnGroup={footerGroup}
                emptyMessage="Carrito de venta vacío..."
            >
                <Column field="producto.nombre" header="Producto"></Column>
                <Column field="cantidad" header="Cantidad" align={"center"} ></Column>
                <Column field="descripcion" header="Descripcion" ></Column>
                <Column header="Precio" body={priceBodyTemplate}  ></Column>
                <Column header="Subtotal" body={subtotalBodyTemplate}  ></Column>
                <Column header='Accion' body={actionBodyTemplate} align={"center"} exportable={false} ></Column>
            
            </DataTable>
        <div className="flex">
            <Button className="flex align-items-center justify-content-center font-bold border-round m-2"
                type="button" severity="success" icon="pi pi-save" label="Guardar cambios" onClick={onSubmit}
            >
                
            </Button>
        </div>
            <DialogDetalleVenta detalleVentaEdit={detalleVentaEdit} />
            <DialogDataViewProducts visible={visibleDialogDataViewProducts} setVisible={setVisibleDialogDataViewProducts} />
    </Dialog>
  )
}
