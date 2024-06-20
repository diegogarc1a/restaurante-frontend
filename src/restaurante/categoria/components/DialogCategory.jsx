import { useFormik } from 'formik';
import { useCategoryStore } from '../../../hooks';
import { Fragment, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const category = {
  nombre: '',
  descripcion: '',
  estado: true
};

export const DialogCategory = () => {

  const { isCategoryModalOpen, closeCategoryModal, activeCategory, startSavingCategory  } = useCategoryStore();

  useEffect(() => {
      if( activeCategory !== null){
        formik.setValues({...activeCategory});
  }
  }, [activeCategory])

  const formik = useFormik({
      initialValues: category,
      validate: (data) => {
          let errors = {};
          if (!data.nombre) {
              errors.nombre = 'El nombre es requirido.';
          }
          if (!data.descripcion) {
              errors.descripcion = 'La descripcion es requirida.';
          }
          return errors;
      },
      onSubmit: (data) => {
      startSavingCategory(data);
      onCloseDialog();
      formik.resetForm();
  }
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };


  const onCloseDialog = () => {
      closeCategoryModal();
      formik.resetForm();
    }
  
  
    const categoryDialogFooter = (
      <Fragment>
        <Button label="Cancelar" outlined icon="pi pi-times" onClick={onCloseDialog} />
        <Button label="Guardar" icon="pi pi-check" onClick={formik.handleSubmit} type="submit" />
      </Fragment>
    );
  
   
    return (
              <Dialog header={activeCategory ? 'Modificar Categoria' : 'Agregar Categoria'} visible={isCategoryModalOpen} onHide={onCloseDialog} draggable={false} footer={categoryDialogFooter}
                  style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid"
              >
                   <div className="field">
                      <label htmlFor="nombre" className={classNames('font-bold', { 'p-error': isFormFieldValid('nombre') })}>
                          Nombre*
                      </label>
                      <InputText id="nombre" name="nombre" autoComplete='off' value={formik.values.nombre} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('nombre') })} />
                      {getFormErrorMessage('nombre')}
                  </div>
                  <div className="field">
                      <label htmlFor="descripcion" className={classNames('font-bold', { 'p-error': isFormFieldValid('descripcion') })}>
                          Descripción*
                      </label>
                      <InputText id="descripcion" name="descripcion" autoComplete='off' value={formik.values.descripcion} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('descripcion') })} />
                      {getFormErrorMessage('descripcion')}
                  </div>
              </Dialog>
    )
  }
  
