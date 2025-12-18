"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { orderService } from "@/services/order.service";

interface OrderCardProps {
  id: string;
  name: string;
  orderDate: string;
  deliveryDate: string;
  garmentType: string;
  price: number;
  status: "pagado" | "deposito";
  operativoStatus?: "no visto" | "en compra" | "en produccion" | "entregado";
  telegramChatId?: string;
  pedidoId: number;
}

export default function OrderCard({
  id,
  name,
  orderDate,
  deliveryDate,
  price,
  status,
  operativoStatus = "no visto",
  telegramChatId,
  pedidoId,
}: OrderCardProps) {
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isOperativoDropdownOpen, setIsOperativoDropdownOpen] = useState(false);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const operativoDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<
    "pagado" | "deposito"
  >(status);
  const [currentOperativoStatus, setCurrentOperativoStatus] = useState<
    "no visto" | "en compra" | "en produccion" | "entregado"
  >(operativoStatus);
  const [isSelected, setIsSelected] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const mapOperativoStatusToBackend = (
    status: "no visto" | "en compra" | "en produccion" | "entregado"
  ): "NO_VISTO" | "EN_COMPRA" | "EN_PRODUCCION" | "ENTREGADO" => {
    switch (status) {
      case "no visto":
        return "NO_VISTO";
      case "en compra":
        return "EN_COMPRA";
      case "en produccion":
        return "EN_PRODUCCION";
      case "entregado":
        return "ENTREGADO";
      default:
        return "NO_VISTO";
    }
  };

  const handleOperativoStatusChange = async (
    newStatus: "no visto" | "en compra" | "en produccion" | "entregado"
  ) => {
    try {
      setIsUpdating(true);
      const backendEstado = mapOperativoStatusToBackend(newStatus);
      await orderService.update(pedidoId, { estado: backendEstado });
      setCurrentOperativoStatus(newStatus);
      setIsOperativoDropdownOpen(false);
    } catch (error) {
      alert("Error al actualizar el estado. Por favor, intenta nuevamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (
    newStatus: "pagado" | "deposito"
  ) => {
    try {
      setIsUpdating(true);
      const pagado = newStatus === "pagado";
      await orderService.update(pedidoId, { pagado });
      setCurrentPaymentStatus(newStatus);
      setIsPaymentDropdownOpen(false);
    } catch (error) {
      alert(
        "Error al actualizar el estado de pago. Por favor, intenta nuevamente."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paymentDropdownRef.current &&
        !paymentDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPaymentDropdownOpen(false);
      }
      if (
        operativoDropdownRef.current &&
        !operativoDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOperativoDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string | null }>).detail;
      if (!detail) return;
      if (detail.id !== id) {
        setIsSelected(false);
      }
    };
    window.addEventListener(
      "order-card-selected",
      handleSelected as EventListener
    );
    return () =>
      window.removeEventListener(
        "order-card-selected",
        handleSelected as EventListener
      );
  }, [id]);

  const handleCardClick = () => {
    if (isSelected) {
      setIsSelected(false);
      window.dispatchEvent(
        new CustomEvent("order-card-selected", { detail: { id: null } })
      );
    } else {
      setIsSelected(true);
      window.dispatchEvent(
        new CustomEvent("order-card-selected", { detail: { id } })
      );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-[8px] shadow-sm border border-[#AA42F0] w-full relative p-3 sm:p-4 md:p-5 mt-0 mb-2 ${
        isSelected ? "bg-[#F3F0F5]" : "bg-[#FEFCFF]"
      }`}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h3 className="font-lato font-bold not-italic text-sm sm:text-base leading-[131%] tracking-normal text-[#770FBD]">
          ID: {id}
        </h3>

        <div className="relative" ref={paymentDropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
            }}
            className={`flex items-center justify-between gap-1.5 w-[106px] h-[26px] rounded-[13px] border border-[#257447] px-3 pr-3 py-1 font-[var(--font-lato),sans-serif] text-xs leading-[131%] tracking-[0%] ${
              currentPaymentStatus === "pagado"
                ? "bg-[#ECF9F1] text-[#319B5F] border-[#257447]"
                : "bg-[#FDF5E7] text-[#BD7D0F] border-[#FCD34D]"
            }`}
          >
            {currentPaymentStatus === "pagado" ? (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    src="/checkPedidos.png"
                    alt="Check"
                    width={12}
                    height={12}
                    className="w-3 h-3 object-contain"
                  />
                  <span className="font-[var(--font-lato),sans-serif] text-[12px] leading-[131%] text-[#319B5F]">
                    Pagado
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    src="/deposito.png"
                    alt="Depósito"
                    width={12}
                    height={12}
                    className="w-3 h-3 object-contain"
                  />
                  <span className="font-[var(--font-lato),sans-serif] text-[12px] leading-[131%] text-[#BD7D0F]">
                    Depósito
                  </span>
                </div>
              </>
            )}
            <Image
              src={
                currentPaymentStatus === "pagado"
                  ? "/dropdown.png"
                  : "/depositoDropdown.png"
              }
              alt="Abrir"
              width={currentPaymentStatus === "pagado" ? 22 : 12}
              height={currentPaymentStatus === "pagado" ? 16 : 8}
              className={`object-contain ${
                currentPaymentStatus === "pagado"
                  ? "w-[22px] h-[16px] filter:brightness(0) saturate(100%) invert(31%) sepia(90%) saturate(428%) hue-rotate(97deg) brightness(93%) contrast(91%)"
                  : "w-[12px] h-[8px] ml-3 filter:brightness(0) saturate(100%) invert(47%) sepia(69%) saturate(793%) hue-rotate(10deg) brightness(91%) contrast(97%)"
              }`}
            />
          </button>

          {isPaymentDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[106px] rounded-[12px] shadow-lg border border-[#257447] z-50 overflow-hidden bg-white">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentStatusChange("pagado");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[34px] rounded-t-[12px] px-3 py-2 font-[var(--font-lato),sans-serif] text-[12px] leading-[131%] tracking-[0%] bg-[#ECF9F1] text-[#319B5F] hover:bg-[#D1F2E0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/checkPedidos.png"
                  alt="Check"
                  width={12}
                  height={12}
                  className="w-3 h-3 object-contain"
                />
                <span className="font-[var(--font-lato),sans-serif] text-[12px] leading-[131%] text-[#319B5F]">
                  Pagado
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentStatusChange("deposito");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[34px] rounded-b-[12px] px-3 py-2 font-[var(--font-lato),sans-serif] text-xs leading-[131%] tracking-[0%] bg-[#FDF5E7] text-[#BD7D0F] hover:bg-[#FEF3C7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/deposito.png"
                  alt="Depósito"
                  width={12}
                  height={12}
                  className="w-3 h-3 object-contain"
                />
                <span className="font-[var(--font-lato),sans-serif] text-[12px] leading-[131%] text-[#BD7D0F]">
                  Depósito
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 sm:mb-5 font-lato leading-[131%] tracking-normal text-[13px] text-[#171717]">
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">
            Nombre:
          </span>
          <span className="wrap-break-word font-normal">{name}</span>
        </p>
        <p className="flex flex-wrap items-baseline">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">
            Encargo:
          </span>
          <span className="font-normal">{orderDate}</span>
          <span className="mx-1 sm:mx-2 text-gray-300">|</span>
          <span className="font-bold text-[#171717] ml-auto mr-1 sm:mr-1.5">
            Entrega:
          </span>
          <span className="ml-1 font-normal">{deliveryDate}</span>
        </p>
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">
            Precio total:
          </span>
          <span className="font-normal">
            {price > 0
              ? price.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })
              : "00000000$"}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {telegramChatId && (
          <div className="rounded-xl flex items-center whitespace-nowrap py-0.5 px-1.5 gap-1.5 font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black bg-[#E3F2FD] border border-[#BBDEFB]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 shrink-0"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 14.95 9.7 15.02 9.37C15.03 9.3 15.03 9.13 14.93 9.05C14.84 8.97 14.7 9 14.58 9.02C14.41 9.05 12.15 10.3 8.78 12.23C8.18 12.57 7.63 12.73 7.13 12.72C6.58 12.7 5.52 12.4 4.7 12.14C3.75 11.83 3.01 11.66 3.07 11.12C3.1 10.85 3.41 10.58 3.9 10.33C6.31 9.19 8.13 8.4 9.36 7.97C11.83 7.2 12.5 7.01 12.94 7C13.01 7 13.15 7.01 13.25 7.09C13.33 7.16 13.36 7.26 13.37 7.33C13.38 7.4 13.39 7.53 13.38 7.63C13.36 8.08 13.2 9.38 13.06 10.78C12.85 12.78 12.66 14.58 12.61 14.95C12.54 15.5 12.35 15.68 12.17 15.71C11.72 15.78 11.38 15.44 10.95 15.05L16.64 8.8Z"
                fill="#0088cc"
              />
            </svg>
            Telegram
          </div>
        )}

        <div className="relative ml-auto" ref={operativoDropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOperativoDropdownOpen(!isOperativoDropdownOpen);
            }}
            className="flex items-center whitespace-nowrap bg-[#8B68FD] text-[#FEFCFF] font-lato font-normal text-[12px] leading-[131%] tracking-normal rounded-xl h-[26px] px-3 gap-2 w-[140px]"
          >
            {currentOperativoStatus === "no visto" && (
              <>
                <Image
                  src="/iconoPresupuesto.png"
                  alt="No visto"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain shrink-0 filter:brightness(0) invert(1)"
                />
                <span className="text-[12px] leading-[131%] text-[#FEFCFF]">
                  No visto
                </span>
              </>
            )}
            {currentOperativoStatus === "en compra" && (
              <>
                <Image
                  src="/iconoCompra.png"
                  alt="En compra"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain shrink-0 filter:brightness(0) invert(1)"
                />
                En compra
              </>
            )}
            {currentOperativoStatus === "en produccion" && (
              <>
                <Image
                  src="/iconoProduccion.png"
                  alt="En producción"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain shrink-0 filter:brightness(0) invert(1)"
                />
                En producción
              </>
            )}
            {currentOperativoStatus === "entregado" && (
              <>
                <Image
                  src="/iconoEntregado.png"
                  alt="Entregado"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain shrink-0 filter:brightness(0) invert(1)"
                />
                <span className="text-[12px] leading-[131%] text-[#FEFCFF]">
                  Entregado
                </span>
              </>
            )}
            <ChevronDown size={12} className="w-3 h-3 text-[#FEFCFF]" />
          </button>

          {isOperativoDropdownOpen && (
            <div
              className="absolute left-0 mt-1 w-[140px] bg-[#D8CDFE] rounded-[12px] shadow-md border border-[#B59DF9] z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOperativoStatusChange("no visto");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] rounded-t-[12px] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/iconoPresupuesto.png"
                  alt="No visto"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain filter:brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(458%) hue-rotate(252deg) brightness(95%) contrast(86%)"
                />
                <span className="text-[11px] font-lato leading-[131%]">
                  No visto
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOperativoStatusChange("en compra");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/iconoCompra.png"
                  alt="En compra"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain filter:brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(458%) hue-rotate(252deg) brightness(95%) contrast(86%)"
                />
                <span className="text-[11px] font-lato leading-[131%]">
                  En compra
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOperativoStatusChange("en produccion");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/iconoProduccion.png"
                  alt="En producción"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain filter:brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(458%) hue-rotate(252deg) brightness(95%) contrast(86%)"
                />
                <span className="text-[11px] font-lato leading-[131%]">
                  En producción
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOperativoStatusChange("entregado");
                }}
                disabled={isUpdating}
                className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] rounded-b-[12px] font-lato text-[11px] leading-[131%] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src="/iconoEntregado.png"
                  alt="Entregado"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px] object-contain filter:brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(458%) hue-rotate(252deg) brightness(95%) contrast(86%)"
                />
                <span className="text-[11px] font-lato leading-[131%]">
                  Entregado
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
