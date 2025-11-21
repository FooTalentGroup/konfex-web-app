"use client"
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BudgetFormData, BudgetSchema } from '@/types/IBudget';
import CustomInput from './CustomInput';
import CostSectionCard from './CostSectionCard';
import CustomSelect from './CustomSelect';
import CounterInput from './CounterInput';

function BudgetForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<BudgetFormData>({
    resolver: zodResolver(BudgetSchema),
    mode: "onChange", 
    defaultValues: {
      title: '',
      clientName: '',
      clientId: '',
      startDate: new Date().toISOString().split("T")[0],
      finishDate: "",
      profitabilityPercentage: 30,
      saveInfo: false,
      
      // Labor
      laborOrder: '',
      laborRate: undefined,
      laborHours: undefined,
      laborTotal: undefined,
      
      // Materials
      materialName: '',
      materialSize: '',
      materialQuantity: undefined,
      materialPrice: undefined,
      materialsCost: undefined,
      additionalCost: '',
      
      // Indirect Materials
      indirectMaterialName: '',
      indirectMaterialCost: undefined,
      
      // Indirect Costs
      electricityCost: undefined,
      waterCost: undefined,
      shippingCost: undefined,
      otherIndirectCosts: undefined,
    }
  });

  const watchedTotals = watch(['materialsCost', 'laborTotal']);
  const materialsCost = watchedTotals[0] || 0;
  const laborTotal = watchedTotals[1] || 0;

  const onSubmit: SubmitHandler<BudgetFormData> = (data) => {
    console.log("=== DATOS DEL FORMULARIO F1 ===");
    console.log(data);

    const backendPayload = {
      budget: {
        id: "000025", 
        title: data.title,
        client: {
          name: data.clientName || null,
          id: data.clientId || null,
        },
        dates: {
          start: data.startDate,
          finish: data.finishDate || null,
        },
        profitabilityPercentage: data.profitabilityPercentage,
      },
      costs: {
        directLabor: {
          order: data.laborOrder || null,
          rate: data.laborRate || 0,
          hours: data.laborHours || 0,
          total: (data.laborRate || 0) * (data.laborHours || 0),
        },
        directMaterials: {
          name: data.materialName || null,
          size: data.materialSize || null,
          quantity: data.materialQuantity || 0,
          unitPrice: data.materialPrice || 0,
          additionalCost: data.additionalCost || null,
          total: data.materialsCost || 0,
        },
        indirectMaterials: {
          name: data.indirectMaterialName || null,
          cost: data.indirectMaterialCost || 0,
        },
        indirectCosts: {
          electricity: data.electricityCost || 0,
          water: data.waterCost || 0,
          shipping: data.shippingCost || 0,
          others: data.otherIndirectCosts || 0,
          total: (data.electricityCost || 0) + (data.waterCost || 0) + 
                 (data.shippingCost || 0) + (data.otherIndirectCosts || 0),
        },
      },
      totals: {
        directLabor: (data.laborRate || 0) * (data.laborHours || 0),
        directMaterials: data.materialsCost || 0,
        indirectMaterials: data.indirectMaterialCost || 0,
        indirectCosts: (data.electricityCost || 0) + (data.waterCost || 0) + 
                       (data.shippingCost || 0) + (data.otherIndirectCosts || 0),
        subtotal: 0, 
        profitability: 0, 
        grandTotal: 0, 
      }
    };

    const subtotal = backendPayload.totals.directLabor + 
                     backendPayload.totals.directMaterials +
                     backendPayload.totals.indirectMaterials +
                     backendPayload.totals.indirectCosts;
    
    backendPayload.totals.subtotal = subtotal;
    backendPayload.totals.profitability = subtotal * (data.profitabilityPercentage / 100);
    backendPayload.totals.grandTotal = subtotal + backendPayload.totals.profitability;

    console.log("=== PAYLOAD PARA BACKEND ===");
    console.log(JSON.stringify(backendPayload, null, 2));

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
                <span className="font-semibold">ID: 000025</span>
              </p>

              <p className="text-gray-900">
                <span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-4">
              <CustomInput
                label="Título presupuesto"
                name="title"
                register={register}
                error={errors.title?.message}
                type="text"
                placeholder="Escribe el título"
                classname='bg-white'
              />

              <CustomSelect
                label='Nombre cliente'
                options={[
                  { label: 'Cliente 1', value: 'Cliente 1' },
                  { label: 'Cliente 2', value: 'Cliente 2' },
                ]}
                name='clientName'
                register={register}
                placeholder='Seleccionar cliente'
                classname='bg-white'
              />

              <CustomSelect
                label='ID cliente'
                options={[
                  { label: 'C001', value: 'C001' },
                  { label: 'C002', value: 'C002' },
                ]}
                name='clientId'
                register={register}
                placeholder='Seleccionar'
                classname='bg-white'
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Fecha finalización"
                  name="finishDate"
                  register={register}
                  error={errors.finishDate?.message}
                  type="date"
                  classname='bg-white'
                />

                <div className="relative">
                  <CustomInput
                    label="Rentabilidad %"
                    name="profitabilityPercentage"
                    register={register}
                    error={errors.profitabilityPercentage?.message}
                    type="number"
                    unit="%"
                    classname='bg-white'
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
                <span className="text-gray-600 text-sm">Guardar información</span>
              </label>
            </div>
          </CostSectionCard>

          {/* ---------------------------------------------------- */}
          {/* TARJETA 2: MANO DE OBRA DIRECTA         */}
          {/* ---------------------------------------------------- */}
          <CostSectionCard
            title="Mano de Obra Directa"
            totalAmount={120000}
          >
            <div className='space-y-4'>
              <CustomInput
                label='Orden de Producción'
                name='laborOrder'
                register={register}
                error={errors.laborOrder?.message}
                type="text"
                classname='bg-white'
                placeholder='Ej: Blusa manga larga'
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <CustomInput
                label="Tarifa salarial ($/hora)"
                name="laborRate"
                register={register}
                error={errors.laborRate?.message}
                type="number"
                unit='$'
                classname='bg-white'
              />
              <CounterInput
                name="laborHours"
                label="Horas trabajadas"
                watch={watch}
                setValue={setValue}
                min={0}
                max={24}
                step={1}
              />
            </div>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
              <span className="text-gray-600 text-sm">Guardar información</span>
            </label>
          </CostSectionCard>

          {/* ---------------------------------------------------- */}
          {/* TARJETA 3: MATERIALES DIRECTOS         */}
          <CostSectionCard
            title="Materiales Directos"
            totalAmount={120000}
          >
            <CustomInput
              label="Nombre prenda"
              name="materialName"
              register={register}
              error={errors.materialsCost?.message}
              type="text"
              classname='bg-white'
              placeholder='Ej: Blusa manga larga'
            />

            <div className='grid grid-cols-2 gap-4 mt-4'>
              <CustomSelect
                label='Talla'
                options={[
                  { label: 'S', value: 'S' },
                  { label: 'M', value: 'M' },
                  { label: 'L', value: 'L' },
                  { label: 'XL', value: 'XL' },
                ]}
                name='materialSize'
                register={register}
                placeholder='Seleccionar'
                classname='bg-white'
              />
              <CounterInput
                name="materialQuantity"
                label="Cantidad"
                watch={watch}
                setValue={setValue}
                min={0}
                max={9999}
                step={1}
              />
            </div>
            <div className='space-y-4 mt-2'>
              <CustomInput
                label="Precio unitario"
                name="materialPrice"
                register={register}
                error={errors.materialPrice?.message}
                type="number"
                unit="$"
                classname='bg-white'
                placeholder='35000'
              />
            </div>

            <div className='border border-gray-300 mx-0.5 mt-2'></div>

            <div className='grid grid-cols-2 gap-4 mt-2'>
              <CustomInput
                label='Costo adicional'
                name='additionalCost'
                register={register}
                error={errors.additionalCost?.message}
                type="text"
                classname='bg-white'
                placeholder='Ej.: Estampado, botones adicionales'
              />
              <CustomInput
                label='Costo'
                name='materialsCost'
                register={register}
                error={errors.materialsCost?.message}
                type="number"
                unit="$"
                classname='bg-white'
                placeholder='35000'
              />
              <button type='button' className='bg-primary-500 text-white py-1 rounded-2xl'>Añadir costo</button>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
                <span className="text-gray-600 text-sm">Guardar información</span>
              </label>
            </div>
          </CostSectionCard>

          {/* ---------------------------------------------------- */}
          {/* TARJETA 4: MATERIALES INDIRECTOS         */}
          {/* ---------------------------------------------------- */}
          <CostSectionCard
            title="Materiales Indirectos"
            totalAmount={0}
          >
            <CustomInput
              label="Nombre"
              name="indirectMaterialName"
              register={register}
              error={errors.indirectMaterialName?.message}
              type="text"
              classname='bg-white'
              placeholder='Ej.: Estampado, botones adicionales'
            />

            <CustomInput
              label="Costo unitario/unidades"
              name="indirectMaterialCost"
              register={register}
              error={errors.indirectMaterialCost?.message}
              type="number"
              unit="$"
              classname='bg-white'
              placeholder='35000'
            />

          </CostSectionCard>

          {/* ---------------------------------------------------- */}
          {/* TARJETA 5: COSTOS INDIRECTOS         */}
          {/* ---------------------------------------------------- */}
          <CostSectionCard
            title="Costos Indirectos varios"
            totalAmount={0}
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Electricidad"
                name="electricityCost"
                register={register}
                error={errors.electricityCost?.message}
                type="number"
                unit="$"
                classname='bg-white'
              />
              <CustomInput
                label="Agua"
                name="waterCost"
                register={register}
                error={errors.waterCost?.message}
                type="number"
                unit="$"
                classname='bg-white'
              />
              <CustomInput
                label="Envíos"
                name="shippingCost"
                register={register}
                error={errors.shippingCost?.message}
                type="number"
                unit="$"
                classname='bg-white'
              />
              <CustomInput
                label="Otros (Texto libre)"
                name="otherIndirectCosts"
                register={register}
                error={errors.otherIndirectCosts?.message}
                type="number"
                unit="$"
                classname='bg-white'
              />
            </div>
            <label className="flex items-center space-x-2 mt-2">
              <input type="checkbox" {...register("saveInfo")} className="h-4 w-4" />
              <span className="text-gray-600 text-sm">Guardar información</span>
            </label>
          </CostSectionCard>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-500 text-white py-2 px-4 rounded-2xl w-full mt-4"
          >
            {isSubmitting ? "Calculando..." : "Calcular"}
          </button>
        </form>
  )
}

export default BudgetForm
