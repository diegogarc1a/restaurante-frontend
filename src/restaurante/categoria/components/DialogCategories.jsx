import { Dialog } from "primereact/dialog"
import { useCategoryStore } from "../../../hooks";
import { Fragment, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const category = {
  nombre: '',
  descripcion: '',
  estado: true
};

export const DialogCategories = () => {

  const { isCategoryModalOpen, closeCategoryModal  } = useCategoryStore();

  
  const { activeCategory, startSavingCategory } = useCategoryStore();
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState(category)

  const onInputChange = ({target}) => {
    setFormValues({
        ...formValues,
        [target.name]: target.value
    })
  }

    useEffect(() => {
    if( activeCategory !== null){
      setFormValues({...activeCategory});
    }
    }, [activeCategory])

  const onSubmit = async(event)=> {
    event.preventDefault();
    setFormSubmitted(true);

    if(formValues.nombre.length <= 0) return;
    if(formValues.descripcion.length <= 0) return;

    await startSavingCategory( formValues );
    onCloseDialog();
    setFormSubmitted(false);
  }

  const onCloseDialog = () => {
    setFormValues(category);
    closeCategoryModal();
  }


  const productDialogFooter = (
    <Fragment>
      <Button label="Cancelar" outlined icon="pi pi-times" onClick={onCloseDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={onSubmit}/>
    </Fragment>
  );

 
  return (

            <Dialog header="Agregar Categoria" visible={isCategoryModalOpen} onHide={onCloseDialog} draggable={false} footer={productDialogFooter}
                style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid"
            >
                 <div className="field">
                    <label htmlFor="nombre" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="nombre" name="nombre" value={formValues.nombre} onChange={onInputChange} required />
                </div>
                <div className="field">
                    <label htmlFor="descripcion" className="font-bold">
                        Descripción
                    </label>
                    <InputText id="descripcion" name="descripcion" value={formValues.descripcion} onChange={onInputChange} required />
                </div>
            </Dialog>
  )
}
