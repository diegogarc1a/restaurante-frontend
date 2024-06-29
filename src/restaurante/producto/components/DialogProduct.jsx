import { Fragment, useEffect, useState } from "react";
import { useCategoryStore, useProductStore } from "../../../hooks";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

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
    const [file, setFile] = useState(null);

  
    useEffect(() => {
      if( activeProduct !== null){
        formik.setValues({...activeProduct});
        setFile(null);
      }
      }, [activeProduct])

    const formik = useFormik({
      initialValues: product,
      validate: (data) => {
          let errors = {};
          if (!data.nombre) {
              errors.nombre = 'El nombre es requerido.';
          }
          if (!data.descripcion) {
              errors.descripcion = 'La descripcion es requerida.';
          }
          if (!data.tipo) {
            errors.tipo = 'El tipo es requerido.';
          }
          if (!data.precio) {
            errors.precio = 'El precio es requerido.';
          }
          if (!data.categoria.id) {
            errors.categoria = 'La categoria es requerida.';
          }
          return errors;
      },
      onSubmit: (data) => {
          const formData = new FormData();
          formData.append('producto', new Blob([JSON.stringify(data)], { type: 'application/json' }));
          formData.append('file', file);
          startSavingProduct( formData );
          setFile(null);
          onCloseDialog();
          formik.resetForm();
  }
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };



      useEffect(() => {
        startLoadingCategories( );
      }, [])
      

    const onCloseDialog = () => {
      closeProductModal();
      setFile(null);
      formik.resetForm();
    }
  
  
    const productDialogFooter = (
      <Fragment>
        <Button label="Cancelar" outlined icon="pi pi-times" onClick={onCloseDialog} />
        <Button label="Guardar" icon="pi pi-check" onClick={formik.handleSubmit} type="submit"/>
      </Fragment>
    );

    const tipos = ['Carne','Pollo','Bedida'];

    //Este se usa para subir imagen con le componente de PrimeReact
    // const onFileChange = (event) => {
    //     setFile(event.files[0]);
    //   }
  
      const onFileChange = (event) => {
        setFile(event.target.files[0]);
      }
   
    return (
              <Dialog header={activeProduct ? 'Modificar Producto' : 'Agregar Producto'} visible={isProductModalOpen} onHide={onCloseDialog} draggable={false} footer={productDialogFooter}
                  style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid" blockScroll='true'
              >
                   <div className="field">
                      <label htmlFor="nombre" className="font-bold">
                          Nombre*
                      </label>
                      <InputText id="nombre" name="nombre" 
                        value={formik.values.nombre} 
                        onChange={formik.handleChange} 
                        placeholder="Escriba el nombre" 
                        autoFocus 
                        autoComplete='off'
                        className={classNames({ 'p-invalid': isFormFieldValid('nombre') })} 
                      />
                      {getFormErrorMessage('nombre')}
                    </div>
                    <div className="field">
                        <label htmlFor="descripcion" className="font-bold">
                            Descripción*
                        </label>
                      <InputText id="descripcion" name="descripcion" 
                        value={formik.values.descripcion} 
                        onChange={formik.handleChange}  
                        autoComplete='off'
                        className={classNames({ 'p-invalid': isFormFieldValid('descripcion') })} 
                      />
                      {getFormErrorMessage('descripcion')}
                    </div>
                    <div className="field">
                        <label htmlFor="tipo" className="font-bold">
                            Tipo*
                        </label>
                        <Dropdown id="tipo" name="tipo" 
                          value={formik.values.tipo} 
                          onChange={formik.handleChange} options={tipos} 
                          optionLabel="" 
                          className={classNames( "w-full" ,{ 'p-invalid': isFormFieldValid('tipo') })}
                          placeholder="Seleccione un tipo" 
                        />
                        {getFormErrorMessage('tipo')}
                    </div>
                    <div className="field">
                        <label htmlFor="categoria" className="font-bold">
                            Categoria*
                        </label>
                        <Dropdown id="categoria" name="categoria" 
                          value={formik.values.categoria} 
                          onChange={formik.handleChange} 
                          options={categories} 
                          optionLabel="nombre" 
                          placeholder="Seleccione una categoria"
                          className={classNames( "w-full" ,{ 'p-invalid': isFormFieldValid('categoria') })}
                        />
                        {getFormErrorMessage('categoria')}
                    </div>
                    <div className="field">
                        <label htmlFor="precio" className="font-bold">
                            Precio*
                        </label>
                        <InputNumber id="precio" 
                          name="precio" 
                          inputId="currency-us" 
                          value={formik.values.precio} 
                          onValueChange={formik.handleChange} 
                          autoCapitalize=""
                          mode="currency" currency="USD" locale="en-US"
                          className={classNames({ 'p-invalid': isFormFieldValid('precio') })}
                        
                        />
                        {getFormErrorMessage('precio')}
                    </div>
                    <div className="field">
                    <label htmlFor="file" className="font-bold">
                        Imagen*
                    </label>
                    <InputText id="file" name="file" type="file"  accept="image/*" onChange={onFileChange} />
                    {/* <FileUpload mode="advanced" name="file" accept="image/*" maxFileSize={1000000} customUpload onSelect={onFileChange} /> */}
                    </div>
              </Dialog>
    )
  }
  