import './Navbar.module.css'
import { Badge } from "primereact/badge";
import { Menubar } from "primereact/menubar";
import { Link } from "react-router-dom";

export const Navbar = () => {

    
  const itemRenderer = (item) => (
    <Link to={item.path} className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.badge && <Badge className="ml-auto" value={item.badge} />}
        {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </Link>
);
const items = [
    {
        label: 'Dashboard',
        icon: 'pi pi-home',
        path: '/dashboard',
        template: itemRenderer,
    },
    {
        label: 'Categorias',
        icon: 'pi pi-book',
        path: '/categoria',
        template: itemRenderer
    },
    {
        label: 'Productos',
        icon: 'pi pi-table',
        path: '/producto',
        template: itemRenderer
    },
    {
        label: 'Ventas',
        icon: 'pi pi-shopping-bag',
        path: '/venta',
        template: itemRenderer
    },
    {
        label: 'Pedidos',
        icon: 'pi pi-shopping-cart',
        items: [
            {
                label: 'En proceso',
                icon: 'pi pi-spinner',
                path: '/pedidop',
                template: itemRenderer
            },
            {
                label: 'Terminados',
                icon: 'pi pi-check-circle',
                path: '/pedidot',
                template: itemRenderer
            },
            {
                label: 'Pagados',
                icon: 'pi pi-dollar',
                path: '/pedidopa',
                template: itemRenderer
            },
        ]
        
    }
];

const start = <img alt="logo" src="public/logo2.png" height="50" className="mr-2"></img>;

return (
        <Menubar 
            model={items} 
            start={start} 
            style={{ backgroundColor: '#E9B712' }}
        />
)
}
     