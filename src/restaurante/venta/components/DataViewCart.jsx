import { useEffect, useState } from "react";
import { useVentaStore } from "../../../hooks";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar"
import { DataView } from "primereact/dataview";
import { DialogDetalleVenta } from "./DialogDetalleVenta";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";

const venta = {
    nombrecliente: '',
    preciototal: 0,
    estado: "Proceso",
    listaDetalleVenta : {},
}

export const DataViewCart = ({ cartVisible, setCartVisible }) => {
    const { detalleVentas, startSavingVenta, openVentaModal } = useVentaStore();
    const [detalleVentaEdit, setDetalleVentaEdit] = useState(null);
    const [formValues, setFormValues] = useState(venta)


    const onEdit = (detalleVenta, index) => {
        detalleVenta = {...detalleVenta, id: index};
        setDetalleVentaEdit(detalleVenta);
        openVentaModal(); 
    }

    const onInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
      }
   
    const guardar = (event) => {
        event.preventDefault();
        if(detalleVentas.length !== 0){
            venta.nombrecliente = formValues.nombrecliente;
            venta.listaDetalleVenta = detalleVentas;
            
            startSavingVenta( venta );
            setCartVisible(false);
            formValues.nombrecliente = '';
        }else{
            setCartVisible(false);
            Swal.fire("Error","No hay productos agregados","error");
            formValues.nombrecliente = '';
        }
    }

    const itemTemplate = (dv, index) => {
        return (
           <>
            <div className="flex md:justify-content-left" onClick={() => onEdit(dv, index)}>
                <ul className="m-0 p-0 list-none border-1 surface-border border-round p-3 flex flex-column gap-2 w-full md:w-25rem">
                        <li
                            key={dv.id}
                            className={`p-2 hover:surface-hover border-round border-1 border-transparent transition-all transition-duration-200`}
                        >
                            <div className="flex flex-wrap p-2 align-items-center gap-3">
                                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={`${import.meta.env.VITE_API_URL}recursos/${dv.producto.foto}`} alt={dv.producto.descripcion} />
                                <div className="flex-1 flex flex-column gap-1">
                                    <span className="font-bold">{dv.producto.nombre}</span>
                                    <div className="flex align-items-center gap-2">
                                        <i key={dv.producto} className="text-sm">Cantidad</i>
                                        <span>{dv.cantidad}</span>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <span className="text-sm">{dv.descripcion}</span>
                                    </div>
                                </div>
                                <span className="font-bold text-900 ml-5">{dv.cantidad * dv.producto.precio}</span>
                                {/* <Button icon="pi pi-pencil" className="p-button-rounded"></Button> */}
                            </div>
                        </li>
                  
                </ul>
                </div>
           </>
        );
    };


    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((detalleVenta, index) => {
            return itemTemplate(detalleVenta, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };


    return (
        <Sidebar visible={cartVisible} onHide={() => setCartVisible(false)} position="right" className="w-full md:w-20rem lg:w-30rem">
            <div className="field">
                <label htmlFor="nombrecliente" className='font-bold'>
                          Nombre de cliente*
                </label>
                <InputText id="nombrecliente" name="nombrecliente" value={formValues.nombrecliente} onChange={onInputChange}  />
            </div>   
             <DataView value={detalleVentas} listTemplate={listTemplate} />
             <div className="mt-2">
                <h1>{detalleVentas.reduce((acc, curr) => acc + (curr.cantidad * curr.producto.precio), 0)}</h1>
                <Button type="submit" onClick={guardar}>Guardar</Button>
             </div>
             <DialogDetalleVenta detalleVentaEdit={detalleVentaEdit} />
        </Sidebar>
    )
}
    