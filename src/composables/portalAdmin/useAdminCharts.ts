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
) {
  const chartOptionsConsultas = computed((): EChartsOption | null => {
    console.log('Calculando chart Consultas. Datos:', consultas.value)
    if (!consultas.value || consultas.value.length === 0) {
      console.log('No hay consultas para gráfico.')
      return null
    }

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

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: datesInRange,
        axisTick: { alignWithLabel: true },
      },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'Consultas',
          type: 'bar',
          barWidth: '60%',
          data: dataValues,
          itemStyle: { color: '#0891b2' },
        },
      ],
      toolbox: { feature: { saveAsImage: { title: 'Guardar' } } },
    }
  })

  const chartOptionsMedicos = computed((): EChartsOption | null => {
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

    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 'left', top: 'center' },
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
        },
      ],
      toolbox: { right: 10, feature: { saveAsImage: { title: 'Guardar' } } },
    }
  })
  return {
    chartOptionsConsultas,
    chartOptionsMedicos,
  }
}
export type { EChartsOption }
