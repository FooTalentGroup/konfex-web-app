'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from './UserMenu';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconPath?: string;
  path?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, userName, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      iconPath: '/home.png',
      path: '/',
    },
    {
      id: 'inbox',
      label: 'Inbox',
      iconPath: '/inbox.png',
      path: '/inbox', 
    },
    {
      id: 'clientes',
      label: 'Clientes',
      iconPath: '/clientes.png',
      path: '/clientes', 
    },
    {
      id: 'calculadora',
      label: 'Calculadora',
      iconPath: '/calculadora.png',
      path: '/calculator',
    },
    {
      id: 'presupuestos',
      label: 'Presupuestos',
      iconPath: '/presupuesto.png',
      path: '/presupuestos',
    },
    {
      id: 'colecciones',
      label: 'Colecciones',
      iconPath: '/colecciones.png',
      path: '/colecciones', 
    },
    {
      id: 'materia-prima',
      label: 'Materia Prima',
      iconPath: '/materiaPrima.png',
      path: '/materia-prima',
    },
    {
      id: 'pedidos',
      label: 'Pedidos',
      iconPath: '/pedidos.png',
      path: '/pedidos', 
    },
    {
      id: 'gastos-negocio',
      label: 'Gastos del negocio',
      iconPath: '/negocio.png',
    },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '280px',
          backgroundColor: '#6A5379',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Image
              src="/image.png"
              alt="KONFEX Logo"
              width={100}
              height={32}
              className="object-contain"
              priority
            />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: '#B65CF2',
              }}
              aria-label="Cerrar menú"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* User Section */}
          <div className="px-4 py-3 border-b border-gray-600/30">
            <button
              ref={userButtonRef}
              onClick={handleUserClick}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-gray-600/20"
              aria-label="Menú de usuario"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/avatar.png"
                  alt="Avatar de usuario"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1 text-left">
                <span
                  className="text-sm font-semibold text-white truncate"
                  style={{
                    fontFamily: 'var(--font-lato), sans-serif',
                  }}
                >
                  {userName || 'Usuario'}
                </span>
                {user?.email && (
                  <span
                    className="text-xs text-gray-300 truncate"
                    style={{
                      fontFamily: 'var(--font-lato), sans-serif',
                    }}
                  >
                    {user.email}
                  </span>
                )}
              </div>
            </button>
            <UserMenu
              isOpen={isUserMenuOpen}
              onClose={handleCloseUserMenu}
              anchorRef={userButtonRef}
            />
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item, index) => {
              const isActive = item.path && pathname === item.path;
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: isActive ? '#D5A1F7' : 'transparent',
                      color: isActive ? '#000000' : '#FFFFFF',
                      fontFamily: 'var(--font-lato), sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#D5A1F7';
                        e.currentTarget.style.color = '#000000';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) {
                          icon.style.stroke = '#000000';
                          icon.style.fill = '#000000';
                        }
                        const img = e.currentTarget.querySelector('img');
                        if (img) {
                          img.style.filter = 'brightness(0) invert(0) contrast(1)';
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#FFFFFF';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) {
                          icon.style.stroke = '#FFFFFF';
                          icon.style.fill = 'none';
                        }
                        const img = e.currentTarget.querySelector('img');
                        if (img) {
                          img.style.filter = 'brightness(0) invert(1) contrast(2)';
                        }
                      }
                    }}
                  >
                    <span className="shrink-0">
                      {item.iconPath ? (
                        <Image
                          src={item.iconPath}
                          alt={item.label}
                          width={20}
                          height={20}
                          className="object-contain brightness-0 invert"
                          style={{
                            filter: isActive 
                              ? 'brightness(0) invert(0) contrast(1)' 
                              : 'brightness(0) invert(1) contrast(2)',
                          }}
                        />
                      ) : (
                        item.icon
                      )}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                  {index < menuItems.length - 1 && (
                    <div
                      className="mx-4 my-1"
                      style={{
                        height: '1px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div>
            <div
              className="mx-4 my-1"
              style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
              style={{
                color: '#FFFFFF',
                fontFamily: 'var(--font-lato), sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D5A1F7';
                e.currentTarget.style.color = '#000000';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.stroke = '#000000';
                  icon.style.fill = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) {
                  icon.style.stroke = '#FFFFFF';
                  icon.style.fill = 'none';
                }
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;