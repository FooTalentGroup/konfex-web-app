"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUnsavedChangesContext } from "@/contexts/UnsavedChangesContext";

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
  const { requestNavigation } = useUnsavedChangesContext();

  const menuItems: MenuItem[] = [
    {
      id: "inbox",
      label: "Inbox",
      iconPath: "/inbox.png",
      path: "/inbox",
    },
    {
      id: "clientes",
      label: "Clientes",
      iconPath: "/clientes.png",
      path: "/clients",
    },
    {
      id: "calculadora",
      label: "Calculadora",
      iconPath: "/calculadora.png",
      path: "/calculator",
    },
    {
      id: "presupuestos",
      label: "Presupuestos",
      iconPath: "/presupuesto.png",
      path: "/budgets",
    },
    {
      id: "colecciones",
      label: "Colecciones",
      iconPath: "/colecciones.png",
      path: "/collections",
    },
    {
      id: "materia-prima",
      label: "Materia Prima",
      iconPath: "/materiaPrima.png",
      path: "/raw-materials",
    },
    {
      id: "pedidos",
      label: "Pedidos",
      iconPath: "/pedidos.png",
      path: "/orders",
    },
    {
      id: "gastos-negocio",
      label: "Gastos del negocio",
      iconPath: "/negocio.png",
      path: "/business-expenses",
    },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.path) {
      // Check if we're on the calculator page
      if (pathname === "/calculator") {
        requestNavigation(item.path);
      } else {
        router.push(item.path);
      }
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full rounded-tr-[20px] rounded-br-[20px] z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "280px",
          backgroundColor: "#6A5379",
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
                backgroundColor: "#B65CF2",
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

          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item, index) => {
              const isActive = item.path && pathname === item.path;
              return (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: isActive ? "#D5A1F7" : "transparent",
                      color: isActive ? "#000000" : "#FFFFFF",
                      fontFamily: "var(--font-lato), sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#D5A1F7";
                        e.currentTarget.style.color = "#000000";
                        const icon = e.currentTarget.querySelector("svg");
                        if (icon) {
                          icon.style.stroke = "#000000";
                          icon.style.fill = "#000000";
                        }
                        const img = e.currentTarget.querySelector("img");
                        if (img) {
                          img.style.filter =
                            "brightness(0) invert(0) contrast(1)";
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#FFFFFF";
                        const icon = e.currentTarget.querySelector("svg");
                        if (icon) {
                          icon.style.stroke = "#FFFFFF";
                          icon.style.fill = "none";
                        }
                        const img = e.currentTarget.querySelector("img");
                        if (img) {
                          img.style.filter =
                            "brightness(0) invert(1) contrast(2)";
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
                              ? "brightness(0) invert(0) contrast(1)"
                              : "brightness(0) invert(1) contrast(2)",
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
                        height: "1px",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
