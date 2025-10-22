import { computed, type Ref } from 'vue'
import type { Empleado, CentroMedico, Paciente, Consulta, Diagnostico } from '@/types/adminPortal'
import type { ComposeOption, EChartsCoreOption } from 'echarts/core'
import type { BarSeriesOption, PieSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  XAXisComponentOption, // Import specific component options
  YAXisComponentOption,
  TooltipOption, // Import generic TooltipOption for styling
} from 'echarts/components'
import * as echarts from 'echarts/core' // Import echarts namespace for nested types

// Base type for common styling access
type BaseChartOption = EChartsCoreOption & {
  tooltip?: TooltipOption // Use the generic TooltipOption for styling properties
}

// Export ECOption - combines base and specific chart/component options
export type ECOption = ComposeOption<
  | BaseChartOption
  | BarSeriesOption
  | PieSeriesOption
  | GridComponentOption
  | TooltipComponentOption // Keep for trigger, formatter etc.
  | LegendComponentOption
  | XAXisComponentOption // Include axis component options
  | YAXisComponentOption
>

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
  const getBaseChartOptions = (isDarkMode: boolean): BaseChartOption => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'inherit', color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
    tooltip: {
      // General tooltip styles are defined here using TooltipOption structure
      backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff',
      borderColor: isDarkMode ? '#38383a' : '#e5e5e5',
      textStyle: { color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
      // trigger: 'item', // Can set a default trigger here if desired
      // confine: true // Keep tooltip within chart area
    },
    // Provide defaults for potentially used components
    grid: { containLabel: true },
    xAxis: {},
    yAxis: {},
    legend: {},
    series: [],
  })

  // Helper to get tooltip text color safely
  const getTooltipTextStyle = (baseOptions: BaseChartOption) => {
    // Check if tooltip and textStyle exist before accessing color
    return { color: baseOptions.tooltip?.textStyle?.color }
  }

  // Helper to get general text color safely
  const getTextStyleColor = (baseOptions: BaseChartOption) => {
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

    return {
      // Don't spread baseOptions directly if it causes conflicts, apply specific parts
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
        axisLabel: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        splitLine: { lineStyle: { color: isDarkMode ? '#2c2c2e' : '#f0f0f0' } },
        axisLabel: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
      },
      series: [{ data, type: 'bar', color: '#0891b2', name: 'Consultas' }],
      tooltip: {
        // Specific tooltip config for this chart type
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        // Apply base styles manually
        backgroundColor: baseOptions.tooltip?.backgroundColor,
        borderColor: baseOptions.tooltip?.borderColor,
        textStyle: getTooltipTextStyle(baseOptions), // Use safe access helper
      },
      // legend: undefined, // No legend needed
    }
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
    return {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: baseOptions.tooltip?.backgroundColor,
        borderColor: baseOptions.tooltip?.borderColor,
        textStyle: getTooltipTextStyle(baseOptions), // Use safe access helper
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        textStyle: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
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
  })

  const pacientesDiagnosticadosOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const diagnosticados = totalPacientesDiagnosticados.value
    const noDiagnosticados = totalPacientes.value - diagnosticados

    return {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: baseOptions.tooltip?.backgroundColor,
        borderColor: baseOptions.tooltip?.borderColor,
        textStyle: getTooltipTextStyle(baseOptions), // Use safe access helper
      },
      legend: {
        top: 'bottom',
        left: 'center',
        textStyle: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
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
          }, // Safe access
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
  })

  const patientAgeDistributionOptions = computed(() => (isDarkMode: boolean): ECOption => {
    const baseOptions = getBaseChartOptions(isDarkMode)
    const ageGroups: { [key: string]: number } = { '0-18': 0, '19-30': 0, '31-45': 0, '46+': 0 }
    const currentYear = new Date().getFullYear()
    pacientes.value.forEach((p) => {
      if (p.fechaNacimiento) {
        try {
          const birthDate = new Date(p.fechaNacimiento + 'T00:00:00')
          if (isNaN(birthDate.getTime())) {
            console.warn(`Fecha de nacimiento inválida para paciente ${p.id}: ${p.fechaNacimiento}`)
            return
          }
          const birthYear = birthDate.getFullYear()
          const age = currentYear - birthYear

          if (age >= 0 && age <= 18) ageGroups['0-18']++
          else if (age >= 19 && age <= 30) ageGroups['19-30']++
          else if (age >= 31 && age <= 45) ageGroups['31-45']++
          else if (age >= 46) ageGroups['46+']++
        } catch (e) {
          console.warn(
            `Error procesando fecha de nacimiento para paciente ${p.id}: ${p.fechaNacimiento}`,
            e,
          )
        }
      }
    })
    return {
      backgroundColor: baseOptions.backgroundColor,
      textStyle: baseOptions.textStyle,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: baseOptions.tooltip?.backgroundColor,
        borderColor: baseOptions.tooltip?.borderColor,
        textStyle: getTooltipTextStyle(baseOptions), // Use safe access helper
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: Object.keys(ageGroups),
        axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        axisLabel: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
      },
      yAxis: {
        type: 'value',
        axisLine: { show: true, lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        splitLine: { lineStyle: { color: isDarkMode ? '#2c2c2e' : '#f0f0f0' } },
        axisLabel: { color: getTextStyleColor(baseOptions) }, // Use safe access helper
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
            color: getTextStyleColor(baseOptions), // Use safe access helper
          },
        },
      ],
    }
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
