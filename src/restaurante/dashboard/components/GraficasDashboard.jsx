import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useVentaStore } from '../../../hooks';

const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 20);
  const lightness = 50 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

export const GraficasDashboard = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [ventasPorProducto, setVentasPorProducto] = useState([]);
    const { getVentasPorProducto } = useVentaStore(); 

    useEffect(() => {
        getVentasPorProducto().then(data => {
            setVentasPorProducto(data);
        })
    }, []);

    useEffect(() => {
        if (ventasPorProducto.length > 0) {
            let labels = [];
            let info = [];

            ventasPorProducto.forEach(function(item) {
                labels.push(item[0]);
                info.push(item[1]);
            });

            const colors = Array(ventasPorProducto.length).fill(0).map(() => getRandomColor());


            const data = {
                labels: labels,
                datasets: [
                    {
                        data: info,
                        backgroundColor: colors,
                        hoverBackgroundColor: [
                            getRandomColor(),
                            getRandomColor(),
                            getRandomColor()
                        ]
                    }
                ]
            };
            const options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        },

                    title: {
                        display: true,
                        text: 'Ventas por producto',
                        font: {
                            size: 20,
                            weight: 'bold'
                        }
                    }
                         
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [ventasPorProducto]);

    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    )
}