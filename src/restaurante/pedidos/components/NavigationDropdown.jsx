import { Dropdown } from 'primereact/dropdown';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronRightIcon } from 'primereact/icons/chevronright';

export const NavigationDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routes = [
    { label: 'Proceso', value: '/pedidop', icon: 'pi-refresh' },
    { label: 'Terminado', value: '/pedidot', icon: 'pi-check' },
    { label: 'Pagado', value: '/pedidopa', icon: 'pi-money-bill' },
  ];

  const handleSelect = (event) => {
    navigate(event.value);
  };

  const selectedRoute = routes.find((route) => route.value === location.pathname);

  const routeOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <i className={`pi ${option.icon}`} style={{ marginRight: '8px' }} />
        <div>{option.label}</div>
      </div>
    );
  };

  const selectedRouteTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <i className={`pi ${option.icon}`} style={{ marginRight: '8px' }} />
          <div>{option.label}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  return (
    <div className="flex flex justify-content-start mt-3 mb-3">
      <Dropdown
        options={routes}
        onChange={handleSelect}
        value={selectedRoute? selectedRoute.value : null}
        placeholder="Select a route"
        valueTemplate={selectedRouteTemplate}
        itemTemplate={routeOptionTemplate}
        dropdownIcon={(opts) => {
          return opts.iconProps['data-pr-overlay-visible']? <ChevronRightIcon {...opts.iconProps} /> : <ChevronDownIcon {...opts.iconProps} />;
        }}
      />
    </div>
  );
};