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
  // ---- NUEVO: Añadir isDarkMode como parámetro ----
  isDarkMode: Ref<boolean>,
) {
  // ---- NUEVO: Definir colores base para ambos temas ----
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
    primaryColor: '#0891b2', // Puedes mantener el mismo primario o ajustarlo
    tooltipBg: 'rgba(28, 28, 30, 0.95)',
    tooltipBorder: '#38383a',
  }

  const chartOptionsConsultas = computed((): EChartsOption | null => {
    // ---- NUEVO: Seleccionar colores según el tema ----
    const colors = isDarkMode.value ? darkColors : lightColors

    console.log('Calculando chart Consultas. Datos:', consultas.value)
    if (!consultas.value || consultas.value.length === 0) {
      console.log('No hay consultas para gráfico.')
      return null
    }

    // ... (lógica existente para preparar los datos de consultas) ...
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)

    const datesInRange: string[] = []
    const dateCounts: { [key: string]: number } = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(sevenDaysAgo.getDate() + i)
      const dateString = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
      datesInRange.push(dateString)
      dateCounts[dateString] = 0
    }

    consultas.value.forEach((consulta) => {
      const consultaDate = new Date(consulta.fechaHora)
      const consultaDayStart = new Date(consultaDate)
      consultaDayStart.setHours(0, 0, 0, 0)
      if (consultaDayStart >= sevenDaysAgo && consultaDayStart <= today) {
        const dateString = consultaDayStart.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
        })
        if (dateCounts[dateString] !== undefined) {
          dateCounts[dateString]++
        }
      }
    })

    const dataValues = datesInRange.map((date) => dateCounts[date])
    console.log('Valores calculados para gráfico Consultas:', dataValues)
    if (dataValues.every((val) => val === 0)) {
      console.log('Todos los valores de consulta son 0.')
      return null
    }
    // -----------------------------------------------------------------

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        // ---- NUEVO: Estilos de tooltip según tema ----
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        textStyle: { color: colors.textColor },
        // ---------------------------------------------
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: datesInRange,
        axisTick: { alignWithLabel: true },
        // ---- NUEVO: Color de etiquetas y línea del eje X ----
        axisLine: { lineStyle: { color: colors.mutedColor } },
        axisLabel: { color: colors.textColor },
        // ----------------------------------------------------
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        // ---- NUEVO: Color de etiquetas y línea del eje Y ----
        axisLine: { lineStyle: { color: colors.mutedColor } },
        axisLabel: { color: colors.textColor },
        splitLine: { lineStyle: { color: colors.tooltipBorder, type: 'dashed' } }, // Líneas de división más sutiles
        // ----------------------------------------------------
      },
      series: [
        {
          name: 'Consultas',
          type: 'bar',
          barWidth: '60%',
          data: dataValues,
          // ---- NUEVO: Usar color primario del tema ----
          itemStyle: { color: colors.primaryColor },
          // ---------------------------------------------
        },
      ],
      toolbox: {
        feature: { saveAsImage: { title: 'Guardar' } },
        // ---- NUEVO: Color de íconos del toolbox ----
        iconStyle: { borderColor: colors.mutedColor },
        // -----------------------------------------
      },
      // ---- NUEVO: Color de fondo (opcional, generalmente se hereda) ----
      // backgroundColor: 'transparent',
      // -----------------------------------------------------------------
    }
  })

  const chartOptionsMedicos = computed((): EChartsOption | null => {
    // ---- NUEVO: Seleccionar colores según el tema ----
    const colors = isDarkMode.value ? darkColors : lightColors

    console.log('Calculando chart Médicos. Datos:', medicosDetallados.value, centrosMedicos.value)
    if (
      !medicosDetallados.value ||
      medicosDetallados.value.length === 0 ||
      !centrosMedicos.value ||
      centrosMedicos.value.length === 0
    ) {
      console.log('No hay médicos o centros para gráfico.')
      return null
    }

    // ... (lógica existente para preparar los datos de médicos por centro) ...
    const centroNombres = new Map<number, string>()
    centrosMedicos.value.forEach((centro) => {
      centroNombres.set(centro.id, centro.nombre)
    })

    const medicosPorCentro: { [key: string]: number } = {}
    centrosMedicos.value.forEach((centro) => {
      medicosPorCentro[centro.nombre] = 0
    })
    medicosPorCentro['Sin Centro Asignado'] = 0
    medicosPorCentro['Centro Desconocido'] = 0

    medicosDetallados.value.forEach((medico) => {
      if (typeof medico.centroMedicoId === 'number') {
        const nombreCentro = centroNombres.get(medico.centroMedicoId)
        if (nombreCentro) {
          medicosPorCentro[nombreCentro] = (medicosPorCentro[nombreCentro] ?? 0) + 1
        } else {
          medicosPorCentro['Centro Desconocido'] = (medicosPorCentro['Centro Desconocido'] ?? 0) + 1
        }
      } else {
        medicosPorCentro['Sin Centro Asignado'] = (medicosPorCentro['Sin Centro Asignado'] ?? 0) + 1
      }
    })

    const pieData = Object.entries(medicosPorCentro)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }))
    console.log('Valores calculados para gráfico Médicos:', pieData)

    if (pieData.length === 0) {
      console.log('PieData está vacío después de filtrar.')
      return null
    }
    // --------------------------------------------------------------------------

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        // ---- NUEVO: Estilos de tooltip según tema ----
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        textStyle: { color: colors.textColor },
        // ---------------------------------------------
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        // ---- NUEVO: Color de texto de la leyenda ----
        textStyle: { color: colors.textColor },
        // ------------------------------------------
      },
      series: [
        {
          name: 'Médicos',
          type: 'pie',
          radius: '70%',
          center: ['65%', '50%'],
          data: pieData,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
          // ---- NUEVO: Color de etiquetas de las porciones ----
          label: { color: colors.textColor },
          labelLine: { lineStyle: { color: colors.mutedColor } },
          // ----------------------------------------------------
        },
      ],
      toolbox: {
        right: 10,
        feature: { saveAsImage: { title: 'Guardar' } },
        // ---- NUEVO: Color de íconos del toolbox ----
        iconStyle: { borderColor: colors.mutedColor },
        // -----------------------------------------
      },
      // ---- NUEVO: Color de fondo (opcional) ----
      // backgroundColor: 'transparent',
      // ------------------------------------------
    }
  })

  return {
    chartOptionsConsultas,
    chartOptionsMedicos,
  }
}
export type { EChartsOption }
