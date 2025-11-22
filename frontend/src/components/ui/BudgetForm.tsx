"use client"
import React from 'react'
import { useForm, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { BudgetFormData } from '@/types/IBudget';
import { zodResolver } from '@hookform/resolvers/zod';
import { BudgetSchema } from '@/types/IBudget';
import CustomInput from './CustomInput';
import CostSectionCard from './CostSectionCard';
import CustomSelect from './CustomSelect';
import CounterInput from './CounterInput';
import { useBudgetCalculator } from '@/hooks/useBudgetCalculator';

interface BudgetFormProps {
  form: UseFormReturn<BudgetFormData>;
  metadata: { id: string; date: string }
}

function BudgetForm({ form, metadata }: BudgetFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = form;
  const { laborTotal, materialsTotal } = useBudgetCalculator(watch);


  const onSubmit: SubmitHandler<BudgetFormData> = (data: BudgetFormData) => {
    console.log("=== DATOS DEL FORMULARIO F1 ===");
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-bg-gray-500 rounded-t-lg">
      {/* ---------------------------------------------------- */}
      {/* TARJETA 1: INFORMACIÓN DEL PRESUPUESTO         */}
      {/* ---------------------------------------------------- */}
      <CostSectionCard
        title="Información del Presupuesto"
        totalAmount={0}
        hideTotal={true}
      >
        <div className="flex justify-between mb-4">
          <p className="text-gray-900">
            <span className="font-semibold">ID: {metadata.id}</span>
          </p>

          <p className="text-gray-900">
            <span className="font-semibold">Fecha:</span> {metadata.date}
          </p>
        </div>

        <div className="space-y-4">
          <CustomInput
            id="title"
            label="Título presupuesto"
            register={register('title', {
              required: 'El título es requerido',
            })}
            error={errors.title?.message}
            type="text"
            placeholder="Escribe el título"
            classname='bg-white'
          />

          <CustomSelect
            id='clientName'
            label='Nombre cliente'
            options={[
              { label: 'Cliente 1', value: 'Cliente 1' },
              { label: 'Cliente 2', value: 'Cliente 2' },
            ]}
            register={register('clientName', {
              required: 'El nombre del cliente es requerido',
            })}
            placeholder='Seleccionar cliente'
            classname='bg-white'
            error={errors.clientName?.message}
          />

          {/* <CustomSelect
                label='ID cliente'
                options={[
                  { label: 'C001', value: 'C001' },
                  { label: 'C002', value: 'C002' },
                ]}
                name='clientId'
                register={register('clientId', {
                  required: 'El ID del cliente es requerido',
                })}
                placeholder='Seleccionar'
                classname='bg-white'
              /> */}

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              id='endDate'
              label="Fecha finalización"
              register={register("finishDate", {
                required: "La fecha finalización es requerida",
              })}
              error={errors.finishDate?.message}
              type="date"
              classname='bg-white'
            />

            <div className="relative">
              <CustomInput
                id="profitabilityPercentage"
                label="Rentabilidad %"
                register={register("profitabilityPercentage", {
                  required: "La rentabilidad es requerida",
                  min: {
                    value: 0,
                    message: "La rentabilidad debe ser mayor o igual a 0",
                  },
                  valueAsNumber: true
                })}
                error={errors.profitabilityPercentage?.message}
                type="number"
                unit="%"
                classname='bg-white'
              />
            </div>
          </div>

          {/* <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
                <span className="text-gray-600 text-sm">Guardar información</span>
              </label> */}
        </div>
      </CostSectionCard>

      {/* ---------------------------------------------------- */}
      {/* TARJETA 2: MANO DE OBRA DIRECTA         */}
      {/* ---------------------------------------------------- */}
      <CostSectionCard
        title="Mano de Obra Directa"
        totalAmount={laborTotal}
      >
        <div className='space-y-4'>
          <CustomInput
            id='laborOrder'
            label='Orden de Producción'
            register={register('laborOrder', {
              required: 'La orden de producción es requerida',
            })}
            error={errors.laborOrder?.message}
            type="text"
            classname='bg-white'
            placeholder='Ej: Blusa manga larga'
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CustomInput
            id="laborRate"
            label="Tarifa salarial ($/hora)"
            register={register("laborRate", {
              required: "La tarifa salarial es requerida",
              min: {
                value: 0,
                message: "La tarifa salarial debe ser mayor o igual a 0",
              },
              valueAsNumber: true
            })}
            error={errors.laborRate?.message}
            type="number"
            unit='$'
            classname='bg-white'
          />
          <CounterInput
            id="laborHours"
            label="Horas trabajadas"
            value={watch("laborHours") ?? 0}
            setValue={(v) => setValue("laborHours", v)}
            register={register('laborHours', {
              required: "Las horas son obligatorias",
              min: { value: 0, message: "Debe ser mayor o igual a 0" },
              max: { value: 24, message: "Máximo 24 horas" },
              valueAsNumber: true
            })}
            min={0}
            max={24}
            step={1}
            error={errors.laborHours?.message}
          />
        </div>
        {/* <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
              <span className="text-gray-600 text-sm">Guardar información</span>
            </label> */}
      </CostSectionCard>

      {/* ---------------------------------------------------- */}
      {/* TARJETA 3: MATERIALES DIRECTOS         */}
      <CostSectionCard
        title="Materiales Directos"
        totalAmount={materialsTotal}
      >
        <CustomInput
          id="materialName"
          label="Nombre prenda"
          register={register("materialName", {
            required: "El costo de materiales es requerido",
          })}
          error={errors.materialName?.message}
          type="text"
          classname='bg-white'
          placeholder='Ej: Blusa manga larga'
        />

        <div className='grid grid-cols-2 gap-4 mt-4'>
          <CustomSelect
            id='materialSize'
            label='Talla'
            options={[
              { label: 'S', value: 'S' },
              { label: 'M', value: 'M' },
              { label: 'L', value: 'L' },
              { label: 'XL', value: 'XL' },
            ]}
            register={register('materialSize', {
              required: 'La talla es requerida',
            })}
            placeholder='Seleccionar'
            classname='bg-white'
            error={errors.clientName?.message}
          />
          <CounterInput
            id="materialQuantity"
            label="Cantidad"
            value={watch("materialQuantity") ?? 0}
            setValue={(newValue) =>
              setValue("materialQuantity", newValue, { shouldValidate: true })
            }
            register={register('materialQuantity', {
              required: "La cantidad es obligatoria",
              min: { value: 0, message: "Debe ser mayor o igual a 0" },
              valueAsNumber: true
            })}
            min={0}
            max={9999}
            step={1}
            error={errors.materialQuantity?.message}
          />
        </div>
        <div className='space-y-4 mt-2'>
          <CustomInput
            id="materialPrice"
            label="Precio unitario"
            register={register('materialPrice', {
              required: 'El precio unitario es requerido',
              min: {
                value: 0,
                message: 'El precio unitario debe ser mayor o igual a 0',
              },
              valueAsNumber: true
            })}
            error={errors.materialPrice?.message}
            type="number"
            unit="$"
            classname='bg-white'
            placeholder='35000'
          />
          <button type='button' className='bg-primary-500 text-white py-1 rounded-2xl w-full'>Añadir talla</button>
        </div>

        <div className='border border-gray-300 mx-0.5 mt-2'></div>

        <div className='grid grid-cols-2 gap-4 mt-2'>
          <CustomInput
            id="additionalCost"
            label='Costo adicional'
            register={register('additionalCost', {
              required: 'El costo adicional es requerido',
            })}
            error={errors.additionalCost?.message}
            type="text"
            classname='bg-white'
            placeholder='Ej.: Estampado, botones adicionales'
          />
          <CustomInput
            id="materialsCost"
            label='Costo'
            register={register('materialsCost', {
              required: 'El costo de materiales es requerido',
              valueAsNumber: true
            })}
            error={errors.materialsCost?.message}
            type="number"
            unit="$"
            classname='bg-white'
            placeholder='35000'
          />
          <button type='button' className='bg-primary-500 text-white py-1 rounded-2xl'>Añadir costo</button>
          {/* <label className="flex items-center space-x-2 mt-2">
            <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
            <span className="text-gray-600 text-sm">Guardar información</span>
          </label> */}
        </div>
      </CostSectionCard>

    </form>
  )
}

export default BudgetForm
