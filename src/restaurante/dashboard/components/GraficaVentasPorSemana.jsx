import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useVentaStore } from "../../../hooks";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

export const GraficaVentasPorSemana = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [ventasPorSemana, setVentasPorSemana] = useState([]);
    const { getVentasPorSemana } = useVentaStore();


    useEffect(() => {
        getVentasPorSemana().then(data => {
            setVentasPorSemana(data);
        })
    }, []);

    useEffect(() => {
        if (ventasPorSemana.length > 0) {
            let labels = [];
            let ingresosTotales = [];
            let cantidadVentas = [];
            let cantidadProductos = [];
    
            ventasPorSemana.forEach(function(item) {
                labels.push(item[0]);
                ingresosTotales.push(item[1]);
                cantidadVentas.push(item[2]);
                cantidadProductos.push(item[3]);
            });
    
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Ingresos Totales',
                        backgroundColor: getRandomColor(),
                        borderColor: getRandomColor(),
                        data: ingresosTotales
                    },
                    {
                        label: 'Cantidad de Ventas',
                        backgroundColor: getRandomColor(),
                        borderColor: getRandomColor(),
                        data: cantidadVentas
                    },
                    {
                        label: 'Cantidad de Productos Vendidos',
                        backgroundColor: getRandomColor(),
                        borderColor: getRandomColor(),
                        data: cantidadProductos
                    }
                ]
            };
            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor
                        }
                    },
                    title: {
                        display: true,
                        text: 'Información de las ventas de los ultimos 7 días',
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
    
            setChartData(data);
            setChartOptions(options);
        }
    }, [ventasPorSemana]);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} options={chartOptions}/>
        </div>
    )
}