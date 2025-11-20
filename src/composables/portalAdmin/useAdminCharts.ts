import { computed, type Ref } from 'vue'
import type { Consulta, MedicoDetallado, CentroMedico } from '@/types/adminPortal'
import * as echarts from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  BarChart,
  PieChart,
  CanvasRenderer,
])

export function useAdminCharts(
  consultas: Ref<Consulta[]>,
  medicosDetallados: Ref<MedicoDetallado[]>,
  centrosMedicos: Ref<CentroMedico[]>,
  isDarkMode: Ref<boolean>,
) {
  const lightColors = {
    textColor: '#1d1d1f',
    mutedColor: '#86868b',
    primaryColor: '#0891b2',
    tooltipBg: 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: '#e5e5e5',
  }
  const darkColors = {
    textColor: '#f5f5f7',
    mutedColor: '#98989d',
    primaryColor: '#0891b2',
    tooltipBg: 'rgba(28, 28, 30, 0.95)',
    tooltipBorder: '#38383a',
  }

  // 1. GRÁFICO DE CONSULTAS (ÚLTIMOS 7 DÍAS)
  const chartOptionsConsultas = computed((): EChartsOption | null => {
    const colors = isDarkMode.value ? darkColors : lightColors

    // Validación de seguridad: si no hay lista, retornamos null
    if (!consultas.value) return null

    const dateMap = new Map<string, number>()
    const categories: string[] = []

    const today = new Date()

    // Generar claves para los últimos 7 días
    // Ejemplo de clave generada: "2025-11-20"
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)

      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const key = `${year}-${month}-${day}`

      // Etiqueta visual (ej: "jue., 20")
      const label = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })

      dateMap.set(key, 0)
      categories.push(label)
    }

    // Procesar las consultas usando MANIPULACIÓN DE STRING PURA
    // Esto evita problemas de zonas horarias.
    // La fecha viene como: "2025-11-20T00:44:00" o "2025-11-20 00:44:00"
    consultas.value.forEach((consulta) => {
      if (!consulta.fechaHora) return

      // Tomamos solo los primeros 10 caracteres: "2025-11-20"
      const fechaSoloDia = consulta.fechaHora.substring(0, 10)

      if (dateMap.has(fechaSoloDia)) {
        dateMap.set(fechaSoloDia, dateMap.get(fechaSoloDia)! + 1)
      }
    })

    const dataValues = Array.from(dateMap.values())

    // IMPORTANTE: Quitamos el filtro que ocultaba el gráfico si todo era 0.
    // Así siempre verás los ejes aunque no haya datos ese día.

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        textStyle: { color: colors.textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: colors.mutedColor } },
        axisLabel: { color: colors.textColor },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { lineStyle: { color: colors.mutedColor } },
        axisLabel: { color: colors.textColor },
        splitLine: { lineStyle: { color: colors.tooltipBorder, type: 'dashed' } },
      },
      series: [
        {
          name: 'Consultas',
          type: 'bar',
          barWidth: '60%',
          data: dataValues,
          itemStyle: { color: colors.primaryColor, borderRadius: [4, 4, 0, 0] },
        },
      ],
    }
  })

  // 2. GRÁFICO DE MÉDICOS POR CENTRO
  const chartOptionsMedicos = computed((): EChartsOption | null => {
    const colors = isDarkMode.value ? darkColors : lightColors

    if (!medicosDetallados.value || !centrosMedicos.value) return null

    const centroNombres = new Map<number, string>()
    centrosMedicos.value.forEach((c) => centroNombres.set(c.id, c.nombre))

    const medicosPorCentro: Record<string, number> = {}
    centrosMedicos.value.forEach((c) => (medicosPorCentro[c.nombre] = 0))

    medicosDetallados.value.forEach((m) => {
      if (m.centroMedicoId && centroNombres.has(m.centroMedicoId)) {
        const nombre = centroNombres.get(m.centroMedicoId)!
        medicosPorCentro[nombre] = (medicosPorCentro[nombre] || 0) + 1
      }
    })

    const pieData = Object.entries(medicosPorCentro)
      .filter(([, val]) => val > 0)
      .map(([name, value]) => ({ name, value }))

    if (pieData.length === 0) return null

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        textStyle: { color: colors.textColor },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: { color: colors.textColor },
      },
      series: [
        {
          name: 'Médicos',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: isDarkMode.value ? '#1c1c1e' : '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          data: pieData,
        },
      ],
    }
  })

  return {
    chartOptionsConsultas,
    chartOptionsMedicos,
  }
}
