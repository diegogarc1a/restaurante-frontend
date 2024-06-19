import { GraficaVentasPorSemana } from "../components/GraficaVentasPorSemana";
import { GraficasDashboard } from "../components/GraficasDashboard";
import { HeaderDashboard } from "../components/HeaderDashboard";
import "./styles.css";

export const DashboardPage = () => {
  return (
    <>
      <div style={{ backgroundColor: "#f9fafb" }}>
        <HeaderDashboard />
        <div className="grid">
          <div className="col-12 md:col-12 lg:col-6 xl:col-6">
            <GraficasDashboard />
          </div>
          <div className="col-12 md:col-12 lg:col-6 xl:col-6">
            <GraficaVentasPorSemana/>
          </div>
        </div>
      </div>
    </>
  );
};
