import { Fragment, useEffect, useState } from "react";
import { useCategoryStore, useProductStore } from "../../../hooks";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";

const product = {
    nombre: '',
    descripcion: '',
    tipo: '',
    precio: '',
    categoria: {
        id: ''
    }
}

export const DialogProduct = () => {
    const { isProductModalOpen , closeProductModal, activeProduct, startSavingProduct  } = useProductStore();
    const { startLoadingCategories, categories } = useCategoryStore();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValues, setFormValues] = useState(product)
    const [file, setFile] = useState(null);
 

    const onInputChange = ({target}) => {
      setFormValues({
          ...formValues,
          [target.name]: target.value
      })
    }
  
      useEffect(() => {
      if( activeProduct !== null){
        setFormValues({...activeProduct});
        // setFile(null);
      }
      }, [activeProduct])

      useEffect(() => {
        startLoadingCategories( );
      }, [])
      

    const onSubmit = async(event)=> {
        event.preventDefault();
        setFormSubmitted(true);
    
        if(formValues.nombre.length <= 0) return;
        if(formValues.descripcion.length <= 0) return;
        if(formValues.tipo.length <= 0) return;


        const formData = new FormData();
        formData.append('producto', new Blob([JSON.stringify(formValues)], { type: 'application/json' }));
        formData.append('file', file);
        
    
        await startSavingProduct( formData );
        onCloseDialog();
        setFormSubmitted(false);
      }

    const onCloseDialog = () => {
      setFormValues(product);
      closeProductModal();
    }
  
  
    const productDialogFooter = (
      <Fragment>
        <Button label="Cancelar" outlined icon="pi pi-times" onClick={onCloseDialog} />
        <Button label="Guardar" icon="pi pi-check" onClick={onSubmit}/>
      </Fragment>
    );

    const tipos = ['Carne','Pollo'];

    const onFileChange = (event) => {
        setFile(event.files[0]);
      }
  
   
    return (
              <Dialog header="Agregar Producto" visible={isProductModalOpen} onHide={onCloseDialog} draggable={false} footer={productDialogFooter}
                  style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid"
              >
                   <div className="field">
                      <label htmlFor="nombre" className="font-bold">
                          Nombre
                      </label>
                      <InputText id="nombre" name="nombre" value={formValues.nombre} onChange={onInputChange} placeholder="Escriba el nombre" required />
                  </div>
                  <div className="field">
                      <label htmlFor="descripcion" className="font-bold">
                          Descripción
                      </label>
                      <InputText id="descripcion" name="descripcion" value={formValues.descripcion} onChange={onInputChange} required />
                  </div>
                  <div className="field">
                      <label htmlFor="tipo" className="font-bold">
                          Tipo
                      </label>
                      <Dropdown id="tipo" name="tipo" value={formValues.tipo} onChange={onInputChange} options={tipos} optionLabel="" 
                        placeholder="Seleccione un tipo" className="w-full" />
                  </div>
                  <div className="field">
                      <label htmlFor="categoria" className="font-bold">
                          Categoria
                      </label>
                      <Dropdown id="categoria" name="categoria" value={formValues.categoria} onChange={onInputChange} options={categories} optionLabel="nombre" 
                        placeholder="Seleccione una categoria" className="w-full" />
                  </div>
                  <div className="field">
                      <label htmlFor="precio" className="font-bold">
                          Precio
                      </label>
                      <InputNumber id="precio" name="precio" inputId="currency-us" value={formValues.precio} onValueChange={onInputChange} mode="currency" currency="USD" locale="en-US" />
                  </div>
                  <div className="field">
                    <label htmlFor="file" className="font-bold">
                        Imagen
                    </label>
                    <InputText id="file" name="file" type="file" onChange={onFileChange} required />
                    {/* <FileUpload mode="advanced" name="file" accept="image/*" maxFileSize={1000000} customUpload onSelect={onFileChange} /> */}
                    </div>
              </Dialog>
    )
  }
  