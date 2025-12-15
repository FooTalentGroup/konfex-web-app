"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string; // Formato DD/MM/YYYY
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  minDate?: Date;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className = "",
  error = false,
  disabled = false,
  minDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarPosition, setCalendarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mounted] = useState<boolean>(() => typeof window !== "undefined");

  // Calcular posición del calendario cuando se abre
  useEffect(() => {
    if (!isOpen || !containerRef.current || !mounted) return;

    const frame = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const calendarHeight = 350; // Altura aproximada del calendario
      const calendarWidth = 300;
      const spacing = 8; // Espacio entre el input y el calendario
      const padding = 10; // Padding mínimo desde los bordes
      
      // Calcular posición horizontal
      let left = rect.left;
      const windowWidth = window.innerWidth;
      
      // Ajustar horizontalmente para que no se salga de la pantalla
      if (left + calendarWidth > windowWidth - padding) {
        left = windowWidth - calendarWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }
      
      // Calcular posición vertical
      let top = rect.bottom + spacing;
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Si no hay espacio abajo, intentar mostrar arriba
      if (spaceBelow < calendarHeight + spacing) {
        if (spaceAbove > calendarHeight + spacing) {
          top = rect.top - calendarHeight - spacing;
        } else {
          top = Math.max(padding, (windowHeight - calendarHeight) / 2);
        }
      }
      
      if (top < padding) {
        top = padding;
      }
      
      if (top + calendarHeight > windowHeight - padding) {
        top = windowHeight - calendarHeight - padding;
      }
      
      setCalendarPosition({ top, left });
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, mounted]);

  // Cerrar el calendario al hacer clic fuera o al hacer scroll
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !(target as Element).closest('[data-calendar-popup]')
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      setIsOpen(false);
    }

    if (isOpen) {
      // Usar setTimeout para evitar que el clic que abre el calendario lo cierre inmediatamente
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isOpen]);

  // Convertir DD/MM/YYYY a Date
  const parseDate = useCallback((dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    ) {
      return date;
    }
    return null;
  }, []);

  // Sincronizar el mes/año actual con la fecha seleccionada
  useEffect(() => {
    if (!value) return;

    const frame = requestAnimationFrame(() => {
      const parsedDate = parseDate(value);
      if (parsedDate) {
        setCurrentMonth(parsedDate.getMonth());
        setCurrentYear(parsedDate.getFullYear());
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [value, parseDate]);

  // Convertir Date a DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Obtener el primer día del mes y cuántos días tiene
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtener el primer día de la semana del mes (0 = Domingo, 1 = Lunes, etc.)
  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Generar el array de días del mes
  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onChange(formatDate(selectedDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateDisabled = (day: number): boolean => {
    if (!minDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    const minDateOnly = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return dateOnly < minDateOnly;
  };

  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const selectedDate = parseDate(value);
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const days = getDaysArray();
  const selectedDate = parseDate(value);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={`w-full bg-white border rounded-lg p-3 pr-10 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 cursor-pointer ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        />
        <Calendar
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>

      {mounted &&
        isOpen &&
        !disabled &&
        calendarPosition &&
        createPortal(
          <div
            data-calendar-popup
            className="fixed bg-white rounded-lg shadow-2xl border border-[#D5A1F7] p-4 min-w-[300px]"
            style={{
              top: `${calendarPosition.top}px`,
              left: `${calendarPosition.left}px`,
              zIndex: 10000,
            }}
          >
            {/* Header del calendario */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div className="text-sm font-bold text-gray-800">
                {MONTHS[currentMonth]} {currentYear}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-xs font-semibold text-gray-500 text-center py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />
                  );
                }

                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    type="button"
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded transition-colors
                      ${
                        disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : selected
                          ? "bg-[#B65CF2] text-white font-semibold"
                          : today
                          ? "bg-[#E9D5FF] text-[#B65CF2] font-semibold"
                          : "text-gray-700 hover:bg-[#F3F0F5]"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Botón para limpiar fecha */}
            {value && (
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                type="button"
                className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
              >
                Limpiar fecha
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
