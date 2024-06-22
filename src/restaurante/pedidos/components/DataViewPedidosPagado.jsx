import { Fragment, useEffect, useRef, useState } from "react";
import { compareAsc, compareDesc, format, parse, parseISO  } from "date-fns";
import { es } from 'date-fns/locale';
import { useVentaStore } from "../../../hooks";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

import { Checkbox } from "primereact/checkbox";
import { Paginator } from "primereact/paginator";


export const DataViewPedidosPagado = ({estado}) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [first, setFirst] = useState(0);
    
    const { ventas, totalRecords, startLoadingVentas } = useVentaStore();

    useEffect(() => {
        startLoadingVentas(page,size, estado);
        console.log(page);
    }, [page, estado, size]);

    
      const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
      };


      const rowClassName = (data) => {
        if ('estadoFinal' in data) {
          return ((data.estadoFinal == false) ? '' : 'p-disabled')
          
        } else {
          return '';
        }
    }


    const gridItem = (pedido, index) => {
        
        return (
            <div className="sm:col-12 col-12 p-1" key={pedido.id}>
                <div className={classNames("p-4 border-1 border-round shadow-6", { 'bg-teal-100 text-teal-900' : index === 0 && pedido.estado === 'Proceso'})}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-user"></i>
                            <span className="font-semibold">{pedido.nombrecliente}</span>
                        </div>
                            <span className="font-semibold">
                                {pedido.fecha ? format(parseISO(pedido.fecha.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6')), 'cccc, dd MMMM y, h:mm:ss a', { locale: es }) : ''}
                            </span>
                            <div>
                            <Tag severity={ (pedido.estado === "Proceso") ? "danger" : "success" } rounded value={pedido.estado} icon="pi pi-info-circle"></Tag>

                            </div>

                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <DataTable value={pedido.listaDetalleVenta}
                        size="small" rowClassName={rowClassName}
                        className="col-12 p-1" 
                        stripedRows showGridlines  
                        tableStyle={{ minWidth: '20rem' }}

                        >
                            <Column align={"center"} field="cantidad" header="Cantidad"></Column>
                            <Column field="producto.nombre" header="Producto"></Column>
                            <Column field="descripcion" header="Descripcion"></Column>
                            
                        </DataTable>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-lg font-semibold">Total a pagar: {formatCurrency(pedido.preciototal)}
                        </span>
                      
                    </div>
                </div>
            </div>
        );
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setPage(event.page);
        setSize(event.rows);
    };
   
    const listTemplate = (pedidos) => {
        return <div className="grid grid-nogutter flex flex-wrap justify-content-center">{pedidos.map((pedido, index) => gridItem(pedido, index))}</div>;
    };

    const PaginatorCustom = () => {
        return (
            ventas && (
                <Paginator first={first} rows={size} totalRecords={totalRecords} rowsPerPageOptions={[5 ,10, 20, 30]} onPageChange={onPageChange}/>            
             )
              
        )
    }

    const header = () => {
        return (
        <div>
          
            <div className="flex justify-content-center m-2">
                <div className="ml-2">
                    {
                        ventas == [] && <span>No hay pedidos disponibles en {estado}</span> 
                    }
                </div>
                <div className="ml-2">
                    Pedidos pagados
                </div>
            </div>
                <div>
                <PaginatorCustom/>
                </div>
        </div>
        );
    };

    const footer = () => {
        return (
            <div>
                <PaginatorCustom/>
            </div>
        )
    }


    return (
        <div className="grid flex justify-content-center flex-wrap">
            <div className="col-12">
            <DataView value={ventas} listTemplate={listTemplate} header={header()} footer={footer()} emptyMessage="No hay pedidos disponibles"
            />

            </div>
        </div>
    )
}
        