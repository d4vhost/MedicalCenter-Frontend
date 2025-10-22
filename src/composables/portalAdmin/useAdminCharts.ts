import { computed, type Ref } from 'vue'
import type { Empleado, CentroMedico, Paciente, Consulta, Diagnostico } from '@/types/adminPortal'
// Import EChartsOption as the main type and specific component/series options as needed
import type { EChartsOption } from 'echarts/core'
import type { BarSeriesOption, PieSeriesOption } from 'echarts/charts' // Keep these, might be needed implicitly by EChartsOption
import type {
  TooltipComponentOption,
  // GridComponentOption, // Remove unused
  // LegendComponentOption // Remove unused
} from 'echarts/components'

// Use EChartsOption directly as the main type for chart configurations
export type ECOption = EChartsOption

// Define a type for the structure returned by getBaseChartOptions
// It includes properties from EChartsOption and specifically defines tooltip structure
interface BaseChartOptionsConfig extends EChartsOption {
  // We expect tooltip to be configured in the base, ensure its type matches
  tooltip?: TooltipComponentOption // Make tooltip optional here but required in the function return
}

// Function to get base styling options - explicitly return a type that requires tooltip
interface BaseChartReturnConfig extends BaseChartOptionsConfig {
  tooltip: TooltipComponentOption // Ensure tooltip is required in the return type
}

export function useAdminCharts(
  empleados: Ref<Empleado[]>,
  centrosMedicos: Ref<CentroMedico[]>,
  pacientes: Ref<Paciente[]>,
  consultas: Ref<Consulta[]>,
  diagnosticos: Ref<Diagnostico[]>,
) {
  const diagnosedPatientIds = computed(() => {
    const patientIds = new Set<number>()
    const consultasConDiagnostico = new Set(diagnosticos.value.map((d) => d.consultaId))
    consultas.value.forEach((c) => {
      if (consultasConDiagnostico.has(c.id)) {
        patientIds.add(c.pacienteId)
      }
    })
    return patientIds
  })

  const totalPacientesDiagnosticados = computed(() => diagnosedPatientIds.value.size)
  const totalPacientes = computed(() => pacientes.value.length)

  // Function to get base styling options
  const getBaseChartOptions = (isDarkMode: boolean): BaseChartReturnConfig => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'inherit', color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
    tooltip: {
      // Explicitly define tooltip structure here matching TooltipComponentOption
      trigger: 'item', // Default trigger
      confine: true, // Keep tooltip within chart area
      backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff',
      borderColor: isDarkMode ? '#38383a' : '#e5e5e5',
      textStyle: { color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
    },
    grid: { containLabel: true },
    xAxis: {},
    yAxis: {},
    legend: {},
    series: [],
  })

  // Helper to get tooltip text color safely
  const getTooltipTextStyle = (baseOptions: BaseChartReturnConfig) => {
    // textStyle within tooltip IS optional in TooltipComponentOption type definition
    return { color: baseOptions.tooltip.textStyle?.color } // Use optional chaining
  }

  // Helper to get general text color safely
  const getTextStyleColor = (baseOptions: BaseChartReturnConfig) => {
    return baseOptions.textStyle?.color
  }

  const consultasPorDiaOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const data = last7Days.map(
      (day) =>
        consultas.value.filter(
          (c) => c.fechaHora && new Date(c.fechaHora).toISOString().split('T')[0] === day,
        ).length,
    )

    // Construct the option object directly using EChartsOption structure
    const option: ECOption = {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: last7Days.map((d) =>
          new Date(d + 'T00:00:00').toLocaleDateString('es-EC', {
            day: '2-digit',
            month: 'short',
          }),
        ),
        axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        axisLabel: { color: getTextStyleColor(baseOptions) },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        splitLine: { lineStyle: { color: isDarkMode ? '#2c2c2e' : '#f0f0f0' } },
        axisLabel: { color: getTextStyleColor(baseOptions) },
      },
      series: [{ data, type: 'bar', color: '#0891b2', name: 'Consultas' }],
      tooltip: {
        // Tooltip configuration is part of EChartsOption
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: baseOptions.tooltip.backgroundColor,
        borderColor: baseOptions.tooltip.borderColor,
        textStyle: getTooltipTextStyle(baseOptions),
      },
    }
    return option
  })

  const medicosPorCentroOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const data = centrosMedicos.value
      .map((centro) => ({
        name: centro.nombre,
        value: empleados.value.filter((e) => e.rol === 'Medico' && e.centroMedicoId === centro.id)
          .length,
      }))
      .filter((item) => item.value > 0)

    const option: ECOption = {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: baseOptions.tooltip.backgroundColor,
        borderColor: baseOptions.tooltip.borderColor,
        textStyle: getTooltipTextStyle(baseOptions),
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        textStyle: { color: getTextStyleColor(baseOptions) },
        itemGap: 10,
        padding: 5,
      },
      series: [
        {
          name: 'Médicos por Centro',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '50%'],
          data,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
          label: { show: false },
          labelLine: { show: false },
        },
      ],
    }
    return option
  })

  const pacientesDiagnosticadosOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const diagnosticados = totalPacientesDiagnosticados.value
    const noDiagnosticados = totalPacientes.value - diagnosticados

    const option: ECOption = {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: baseOptions.tooltip.backgroundColor,
        borderColor: baseOptions.tooltip.borderColor,
        textStyle: getTooltipTextStyle(baseOptions),
      },
      legend: {
        top: 'bottom',
        left: 'center',
        textStyle: { color: getTextStyleColor(baseOptions) },
      },
      series: [
        {
          name: 'Estado Diagnóstico',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: getTextStyleColor(baseOptions),
            },
          },
          labelLine: { show: false },
          data: [
            {
              value: diagnosticados,
              name: 'Diagnosticados',
              itemStyle: { color: isDarkMode ? '#32d74b' : '#34c759' },
            },
            {
              value: noDiagnosticados,
              name: 'No Diagnosticados',
              itemStyle: { color: isDarkMode ? '#ff453a' : '#ff3b30' },
            },
          ].filter((item) => item.value > 0),
        },
      ],
    }
    return option
  })

  const patientAgeDistributionOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const ageGroups: { [key: string]: number } = { '0-18': 0, '19-30': 0, '31-45': 0, '46+': 0 }
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()

    pacientes.value.forEach((p) => {
      if (p.fechaNacimiento) {
        try {
          const parts = p.fechaNacimiento.split('-')
          if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
            const birthYear = parseInt(parts[0], 10)
            const birthMonth = parseInt(parts[1], 10) - 1
            const birthDay = parseInt(parts[2], 10)

            if (!isNaN(birthYear) && !isNaN(birthMonth) && !isNaN(birthDay)) {
              let age = currentYear - birthYear
              if (
                currentMonth < birthMonth ||
                (currentMonth === birthMonth && currentDay < birthDay)
              ) {
                age--
              }

              if (age >= 0 && age <= 18) ageGroups['0-18']++
              else if (age >= 19 && age <= 30) ageGroups['19-30']++
              else if (age >= 31 && age <= 45) ageGroups['31-45']++
              else if (age >= 46) ageGroups['46+']++
            } else {
              console.warn(
                `Fecha de nacimiento inválida (NaN) para paciente ${p.id}: ${p.fechaNacimiento}`,
              )
            }
          } else {
            console.warn(`Formato de fecha inesperado para paciente ${p.id}: ${p.fechaNacimiento}`)
          }
        } catch (e) {
          console.warn(
            `Error procesando fecha de nacimiento para paciente ${p.id}: ${p.fechaNacimiento}`,
            e,
          )
        }
      }
    })

    const option: ECOption = {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: baseOptions.tooltip.backgroundColor,
        borderColor: baseOptions.tooltip.borderColor,
        textStyle: getTooltipTextStyle(baseOptions),
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: Object.keys(ageGroups),
        axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        axisLabel: { color: getTextStyleColor(baseOptions) },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        splitLine: { lineStyle: { color: isDarkMode ? '#2c2c2e' : '#f0f0f0' } },
        axisLabel: { color: getTextStyleColor(baseOptions) },
      },
      series: [
        {
          name: 'Pacientes',
          data: Object.values(ageGroups),
          type: 'bar',
          color: '#22d3ee',
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            color: getTextStyleColor(baseOptions),
          },
        },
      ],
    }
    return option
  })

  return {
    consultasPorDiaOptions,
    medicosPorCentroOptions,
    pacientesDiagnosticadosOptions,
    patientAgeDistributionOptions,
    totalPacientes,
    totalPacientesDiagnosticados,
  }
}
