import { Fragment, useEffect } from "react";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { useVentaStore } from "../../../hooks";
import { InputNumber } from "primereact/inputnumber";


const detalleVenta = {
    cantidad: 1,
    descripcion: '',
    producto : {
        id: null,
        nombre: '',
    }
  };

export const DialogDetalleVenta = ({ productoDetalle, detalleVentaEdit }) => {
    const { addDetalleVenta, closeVentaModal, isVentaModalOpen } = useVentaStore();

    
    useEffect(() => {
            if( productoDetalle !== null){
            formik.setValues({cantidad: 1,
            descripcion: '',
            producto: {...productoDetalle}});    
            }
    
     }, [isVentaModalOpen])
    
     useEffect(() => {
        console.log(detalleVentaEdit);
        if( detalleVentaEdit !== null && detalleVentaEdit !== undefined){
            console.log("Entro");
            const dv = {...detalleVentaEdit};
            formik.setValues({id: dv.id, cantidad: dv.cantidad,
                descripcion: dv.descripcion,
            producto: {...dv.producto}});    
            }
    
     }, [isVentaModalOpen])


  const formik = useFormik({
      initialValues: detalleVenta,
      validate: (data) => {
          let errors = {};
          if (!data.cantidad) {
              errors.cantidad = 'La cantidad es requerida.';
          }
          if (!data.descripcion) {
              errors.descripcion = 'La descripcion es requerida.';
          }
          return errors;
      },
        onSubmit: (data) => {
        addDetalleVenta(data);
        onCloseDialog();
        formik.resetForm();
  }
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };


    const onCloseDialog = () => {
        closeVentaModal();
        formik.resetForm();
    }
  
  
    const ventaDialogFooter = (
      <Fragment>
        <Button label="Cancelar" outlined icon="pi pi-times" onClick={onCloseDialog} />
        <Button label="Guardar" icon="pi pi-check" onClick={formik.handleSubmit} type="submit" />
      </Fragment>
    );
  
   
    return (
              <Dialog header={'Agregar Producto'} visible={isVentaModalOpen} onHide={onCloseDialog} draggable={false} footer={ventaDialogFooter}
                  style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid"
              >
                    <div className="field">
                      <label htmlFor="producto" className='font-bold'>
                          Producto*
                      </label>
                      <InputText id="producto" name="producto" value={formik.values.producto.nombre} disabled />
                  </div>
                   <div className="field">
                      <label htmlFor="cantidad" className={classNames('font-bold', { 'p-error': isFormFieldValid('cantidad') })}>
                          Cantidad*
                      </label>
                        <InputNumber id="cantidad" name="cantidad" value={formik.values.cantidad} min={1} max={100}
                            onValueChange={formik.handleChange} showButtons buttonLayout="horizontal"
                            className={classNames({ 'p-invalid': isFormFieldValid('cantidad') })}
                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" 
                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" 
                        />
                      {getFormErrorMessage('cantidad')}
                  </div>
                  <div className="field">
                      <label htmlFor="descripcion" className={classNames('font-bold', { 'p-error': isFormFieldValid('descripcion') })}>
                          Descripción*
                      </label>
                      <InputText id="descripcion" name="descripcion" value={formik.values.descripcion} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('descripcion') })} />
                      {getFormErrorMessage('descripcion')}
                  </div>
              </Dialog>
    )
  }