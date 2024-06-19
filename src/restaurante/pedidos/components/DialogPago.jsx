import PropTypes from 'prop-types';
import { useFormik } from "formik";
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { classNames } from "primereact/utils";
import { useState } from "react";
import { useVentaStore } from '../../../hooks';
import { Button } from 'primereact/button';

export const DialogPago = ({ visible, setVisible }) => {
  const { activeVenta, pagarPedido } = useVentaStore();
  const [recibido, setRecibido] = useState(null);

  const initialActiveVenta = {
    preciototal: 0,
    recibido: 0,
  };

  const activeVentaValues = activeVenta || initialActiveVenta;

  const formik = useFormik({
    initialValues: initialActiveVenta,
    validateOnChange: true,
    validate: (data) => {
      let errors = {};
      if (data.recibido == null || data.recibido == 0) {
        errors.recibido = 'Debe proporcionar lo recibido';
      }
      if (recibido != null && recibido < activeVentaValues.preciototal) {
        errors.recibido = 'Lo recibido debe ser mayor o igual a lo gastado';
      }
      return errors;
    },
    onSubmit: (data) => {
      console.log(recibido)
      pagarPedido(activeVentaValues.id, recibido);
      formik.resetForm();
      setVisible(false);
      setRecibido(null);
    }
  });

  const handleHide = () => {
    setVisible(false);
    setRecibido(null);
    formik.resetForm();
  }

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  const onCalcularCambio = () => {
    let cambio = 0;
    if (recibido!== null && activeVentaValues.preciototal!== null) {
      cambio = recibido - activeVentaValues.preciototal;
      return cambio.toFixed(2);
    }
    cambio = recibido - activeVentaValues.preciototal;
    return cambio.toFixed(2);
  }

  return (
    <Dialog header='Pagar pedido' visible={visible} draggable={false} onHide={ handleHide }
      style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid"
    >
      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="recibido" className={classNames('flex justify-content-left mb-2 font-bold', { 'p-error': isFormFieldValid('recibido') })}>
            Recibido
          </label>
          <InputNumber value={recibido} size={5} autoFocus
            className="text-base text-color border-round appearance-none outline-none focus:border-primary w-full" 
            id="recibido" name="recibido" inputId="currency-us" mode="currency" currency="USD" locale="en-US" 
            onChange={(e) => {
              setRecibido(e.value);
              formik.setFieldValue('recibido', e.value);
            }}
          />
          {getFormErrorMessage('recibido')}
        </div>
        <div className="field col">
          <label htmlFor="cambio" className='flex justify-content-left mb-2 font-bold'>
            Cambio
          </label>
          <div
            className="text-base text-color border-round appearance-none outline-none focus:border-primary w-full"
            style={{
              padding: '0.5rem',
              backgroundColor: onCalcularCambio() < 0? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 128, 0, 0.2)',
              color: onCalcularCambio() < 0? 'ed' : 'green'
            }}
          >
            ${onCalcularCambio()}
          </div>
        </div>
      </div>
      <div className="formgrid grid">
        <div className="field col-12 mt-4">
          <Button type="submit" label="Pagar" icon="pi pi-check" className="p-button-primary" onClick={ formik.handleSubmit } />
        </div>
      </div>
    </Dialog>
  );
};

DialogPago.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};