import { Fragment, useRef, useState } from "react";
import { useVentaStore } from "../../../hooks";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar"
import { DialogDetalleVenta } from "./DialogDetalleVenta";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { SelectButton } from "primereact/selectbutton";
import { InputNumber } from "primereact/inputnumber";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";

const venta = {
    nombrecliente: '',
    preciototal: 0,
    estado: "Proceso",
    pagado: 'No',
    listaDetalleVenta : {},
}

export const DataViewCart = ({ cartVisible, setCartVisible }) => {
    const { detalleVentas, startSavingVenta, openVentaModal, deleteDetalleVenta } = useVentaStore();
    const [detalleVentaEdit, setDetalleVentaEdit] = useState(null);
    const options = ['No', 'Sí'];
    const [recibido, setRecibido] = useState(null);

    const formik = useFormik({
        initialValues: venta,
        validate: (data) => {
            let errors = {};
            if (!data.nombrecliente) {
                errors.nombrecliente = 'El nombre es requerido.';
            }
            if (data.pagado === 'Sí' && recibido === null) {
                errors.pagado = 'Debe proporcionar lo recibido';
            }
            if (data.pagado === 'Sí' && (recibido <= calculoTotalPagar())) {
                errors.pagado = 'Lo recibido debe ser mayor a lo gastado';
            }
            return errors;
        },
          onSubmit: (data) => {
            data.listaDetalleVenta = detalleVentas;
            if(data.listaDetalleVenta.length <= 0) {
                Swal.fire('Error','No hay productos en el carrito','error')
                setCartVisible(false);
                formik.resetForm();
            }else{
                data.pagado = (data.pagado === 'Sí') ? true : false;
                startSavingVenta( data );
                setCartVisible(false);
                formik.resetForm();
                setRecibido(null);

            }
    }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
  

    const onDelete = (detalleVenta, rowIndex) => {
        deleteDetalleVenta(detalleVenta, rowIndex)
    }
    
    const onEdit = (detalleVenta, index) => {
        detalleVenta = {...detalleVenta, index: index};
        setDetalleVentaEdit(detalleVenta);
        openVentaModal(); 
    }


    const actionBodyTemplate = (dv, {rowIndex}) => {
        return (
            <Fragment>
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(dv, rowIndex)}/>
            </Fragment>
        );
    };

   
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

    const onCalcularCambio = () => {
        let cambio = recibido - calculoTotalPagar();
        return cambio;
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

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
                <Column footer={totalVenta} />
                <Column/>
            </Row>
        </ColumnGroup>
    );

    return (
        <Sidebar visible={cartVisible} onHide={() => setCartVisible(false)} position="right" className="w-full md:w-30rem lg:w-30rem">
            <div className="field">
                <label htmlFor="nombrecliente" className={classNames('font-bold', { 'p-error': isFormFieldValid('nombrecliente') })}>
                          Nombre de Cliente: *
                </label>
                <InputText className={classNames('text-base text-color surface-overlay p-2 border-1 border-solid border-round appearance-none outline-none focus:border-primary w-full', { 'p-invalid': isFormFieldValid('nombrecliente') })}
                id="nombrecliente" name="nombrecliente" value={formik.values.nombrecliente} onChange={formik.handleChange} placeholder="Escriba nombre"  />
                {getFormErrorMessage('nombrecliente')}
                
            </div>   
            <DataTable value={detalleVentas} stripedRows size="small" key="id" header="Carrito de venta"
                selectionMode="single" onRowSelect={onRowSelect}
                footerColumnGroup={footerGroup}
                emptyMessage="Carrito de venta vacío..."
            >
                <Column field="producto.nombre" header="Producto" ></Column>
                <Column field="cantidad" header="Cantidad" align={"center"} ></Column>
                <Column field="descripcion" header="Descripcion" ></Column>
                <Column header="Precio/U" body={priceBodyTemplate}  ></Column>
                <Column body={actionBodyTemplate} align={"center"} exportable={false} ></Column>

            </DataTable>
             <div className="flex flex-column mt-2">
                <div>
                    <label htmlFor="item" className='flex justify-content-left mb-2 font-bold'>
                        ¿Pagar ya?
                    </label>
                    <SelectButton id="pagado" name="pagado" value={formik.values.pagado} onChange={(e) => formik.setFieldValue('pagado', e.value)} options={options} />
                    <div className="mt-2">
                    {
                        (formik.values.pagado === 'Sí')
                        ? (
                            <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="recibido" className={classNames('flex justify-content-left mb-2 font-bold', { 'p-error': isFormFieldValid('pagado') })}>
                                    Recibido
                                </label>
                                <InputNumber value={recibido} size={5} 
                                    className="text-base text-color border-round appearance-none outline-none focus:border-primary w-full" 
                                    id="recibido" name="recibido" inputId="currency-us" mode="currency" currency="USD" locale="en-US" 
                                    onChange={(e) => setRecibido(e.value)}
                                />
                                {getFormErrorMessage('pagado')}
                            </div>
                            <div className="field col">
                                <label htmlFor="recibido" className='flex justify-content-left mb-2 font-bold'>
                                    Cambio
                                </label>
                                <InputNumber value={onCalcularCambio()} size={5} disabled className="font-bold text-base text-color border-round appearance-none outline-none focus:border-primary w-full" id="cambio" name="cambio" inputId="currency-us" mode="currency" currency="USD" locale="en-US" placeholder="Cambio"/>
                            </div>
                        </div>
                        )
                        : ''
                    }
                    </div>
                </div>
                <Button className="flex align-items-center justify-content-center font-bold border-round m-2" 
                    type="submit" onClick={formik.handleSubmit} severity="success"
                >
                    Enviar pedido
                </Button>
             </div>
             <DialogDetalleVenta detalleVentaEdit={detalleVentaEdit} />
        </Sidebar>
    )
}
    