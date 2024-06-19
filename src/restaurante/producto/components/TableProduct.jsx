import { Tag } from "primereact/tag";
import { useCategoryStore, useProductStore } from "../../../hooks";
import { Fragment, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";
import { Image } from "primereact/image";
import { DialogProduct } from "./DialogProduct";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";


export const TableProducts = () => {

    const { products, startDeletingProduct, setActiveProduct, openProductModal } = useProductStore();
    const { categories } = useCategoryStore();

    const [filters] = useState({
      'categoria.nombre': { value: null, matchMode: FilterMatchMode.EQUALS },
  });

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-center">
            <h4 className="m-2">Administrar Productos</h4>
        </div>
    );
    
      const getSeverity = (value) => {
        switch (value) {
          case true:
            return "success";
    
          case false:
            return "warning";
    
          default:
            return null;
        }
      };
    
      const statusBodyTemplate = (rowData) => {
        return (
          <Tag
            value={rowData.estado ? "ACTIVO" : "INACTIVO"}
            severity={getSeverity(rowData.estado)}
          ></Tag>
        );
      };
    
      const onEditCategory = (product) => () =>  {
        setActiveProduct(product);
        openProductModal();
    };
    
    const onDeleteCategory = (product) => () =>  {
      Swal.fire({
        title: "Estas seguro?",
        text: "No puedes revertir este cambio",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          startDeletingProduct( product )
        }
      });
      
    }
    
      const actionBodyTemplate = (product) => {
        return (
            <Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={onEditCategory(product)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={onDeleteCategory(product)}/>
            </Fragment>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <Image imageClassName="shadow-2 border-round" 
                src={`${import.meta.env.VITE_API_URL}recursos/${rowData.foto}`} 
                alt={rowData.descripcion} width="200" 
                preview
                /> 
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.precio);
      };

      const categoryBodyTemplate = (rowData) => {
        const category = rowData.categoria.nombre;
        
        return (
            <div className="flex align-items-center gap-2">
                <span>{category}</span>
            </div>
        );
    };

    const categoryFilterTemplate = (options) => {
      return (
        <Dropdown
          value={options.value}
          options={categories.map((category) => ({ label: category.nombre, value: category.nombre }))}
          onChange={(e) => options.filterApplyCallback(e.value)}
          itemTemplate={categoryItemTemplate}
          placeholder="Seleccione..."
          className="p-column-filter"
          showClear
          style={{ minWidth: '12rem' }}
        />
      );
    };

  const categoryItemTemplate = (option) => {
    return (
        <div className="flex align-items-center gap-2">
         <span>{option.label}</span>
        </div>
    );
};
    
    
      return (
        <div className="grid flex justify-content-center flex-wrap">
          <div className="col-10">

              <DataTable
                header={header}
                filters={filters}
                filterDisplay="row"
                value={products}
                dataKey="id"
                tableStyle={{ minWidth: "50rem" }}
                stripedRows
                showGridlines 
              >
                <Column field="nombre" header="Nombre" ></Column>
                <Column field="descripcion" header="Descripcion"></Column>
                <Column field="foto" header="Image" align={"center"} body={imageBodyTemplate}></Column>
                <Column field="tipo" header="Tipo"></Column>
                <Column field="categoria.nombre" body={categoryBodyTemplate} showFilterMenu={false} filter filterElement={categoryFilterTemplate} header="Categoria"></Column>
                <Column field="precio" header="Precio" body={priceBodyTemplate} ></Column>
                <Column
                  align={"center"}
                  field="estado"
                  header="Estado"
                  body={statusBodyTemplate}
                ></Column>
                <Column body={actionBodyTemplate} align={"center"} exportable={false} ></Column>
              </DataTable>
            </div>
              <DialogProduct/>
          </div>
     
      );
};
