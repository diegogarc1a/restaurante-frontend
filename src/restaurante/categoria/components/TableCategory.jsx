import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Fragment } from "react";
import { DialogCategory } from "./DialogCategory";
import { useCategoryStore } from "../../../hooks";
import Swal from "sweetalert2";

export const TableCategory = () => {


  const { categories, setActiveCategory, openCategoryModal, startDeletingCategory  } = useCategoryStore();


  
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-center">
        <h4 className="m-2">Administrar Categorias</h4>
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

  const onEditCategory = (category) => () =>  {
    setActiveCategory(category)
    openCategoryModal();
};

const onDeleteCategory = (category) => () =>  {
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
      startDeletingCategory(category);
    }
  });
  
}

  const actionBodyTemplate = (category) => {
    return (
        <Fragment>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={onEditCategory(category)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={onDeleteCategory(category)}/>
        </Fragment>
    );
};

  return (
    <div className="grid flex justify-content-center flex-wrap">
      <div className="col-10">

          <DataTable
            header={header}
            value={categories}
            dataKey="id"
            tableStyle={{ minWidth: "50rem" }}
            stripedRows
            showGridlines 
          >
            <Column field="nombre" header="Nombre"></Column>
            <Column field="descripcion" header="Descripcion"></Column>
            <Column
              align={"center"}
              field="estado"
              header="Estado"
              body={statusBodyTemplate}
            ></Column>
            <Column body={actionBodyTemplate} align={"center"} exportable={false} ></Column>
          </DataTable>
        </div>
          <DialogCategory/>
      </div>
 
  );
};
