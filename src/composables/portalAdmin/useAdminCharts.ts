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

// Registra los componentes necesarios de ECharts
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
  // Gráfico: Consultas últimos 7 días
  const chartOptionsConsultas = computed((): EChartsOption | null => {
    console.log('Calculando chart Consultas. Datos:', consultas.value) // Log para depuración
    // Verifica si hay datos de consultas
    if (!consultas.value || consultas.value.length === 0) {
      console.log('No hay consultas para gráfico.')
      return null
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Inicio del día actual
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6) // Inicio del primer día del rango (hoy - 6 días)

    const datesInRange: string[] = []
    const dateCounts: { [key: string]: number } = {}

    // Inicializa el contador para cada día en el rango
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo)
      date.setDate(sevenDaysAgo.getDate() + i)
      // Formato corto para el eje X (ej: 'lun. 21')
      const dateString = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
      datesInRange.push(dateString)
      dateCounts[dateString] = 0
    }

    // Cuenta las consultas que caen dentro del rango de fechas
    consultas.value.forEach((consulta) => {
      const consultaDate = new Date(consulta.fechaHora)
      const consultaDayStart = new Date(consultaDate)
      consultaDayStart.setHours(0, 0, 0, 0) // Obtiene el inicio del día de la consulta

      // Comprueba si el día de la consulta está dentro del rango
      if (consultaDayStart >= sevenDaysAgo && consultaDayStart <= today) {
        // Usa el mismo formato para buscar la clave
        const dateString = consultaDayStart.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
        })
        // Incrementa el contador (asegúrate de que la clave existe)
        if (dateCounts[dateString] !== undefined) {
          dateCounts[dateString]++
        }
      }
    })

    // Extrae los valores contados para la serie del gráfico
    const dataValues = datesInRange.map((date) => dateCounts[date])
    console.log('Valores calculados para gráfico Consultas:', dataValues) // Log para depuración

    // Si todos los días tienen 0 consultas, no muestra el gráfico
    if (dataValues.every((val) => val === 0)) {
      console.log('Todos los valores de consulta son 0.')
      return null
    }

    // Devuelve la configuración del gráfico de barras
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }, // Sombra al pasar el mouse sobre la barra
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, // Márgenes
      xAxis: {
        type: 'category',
        data: datesInRange, // Etiquetas del eje X (días)
        axisTick: { alignWithLabel: true },
      },
      yAxis: { type: 'value', minInterval: 1 }, // Eje Y numérico, solo enteros
      series: [
        {
          name: 'Consultas',
          type: 'bar', // Tipo de gráfico
          barWidth: '60%', // Ancho de las barras
          data: dataValues, // Datos (conteos)
          itemStyle: { color: '#0891b2' }, // Color de las barras
        },
      ],
      toolbox: { feature: { saveAsImage: { title: 'Guardar' } } }, // Botón para guardar imagen
    }
  })

  // Gráfico: Médicos por Centro Médico
  const chartOptionsMedicos = computed((): EChartsOption | null => {
    console.log('Calculando chart Médicos. Datos:', medicosDetallados.value, centrosMedicos.value) // Log para depuración
    // Verifica si hay datos de médicos y centros
    if (
      !medicosDetallados.value ||
      medicosDetallados.value.length === 0 ||
      !centrosMedicos.value ||
      centrosMedicos.value.length === 0
    ) {
      console.log('No hay médicos o centros para gráfico.')
      return null
    }

    // Mapa para buscar nombres de centro por ID eficientemente
    const centroNombres = new Map<number, string>()
    centrosMedicos.value.forEach((centro) => {
      centroNombres.set(centro.id, centro.nombre)
    })

    // Objeto para almacenar el conteo de médicos por nombre de centro
    const medicosPorCentro: { [key: string]: number } = {}
    // Inicializa el conteo en 0 para todos los centros existentes
    centrosMedicos.value.forEach((centro) => {
      medicosPorCentro[centro.nombre] = 0
    })
    // Inicializa contadores para categorías especiales
    medicosPorCentro['Sin Centro Asignado'] = 0
    medicosPorCentro['Centro Desconocido'] = 0

    // Itera sobre cada médico detallado para contar
    medicosDetallados.value.forEach((medico) => {
      // Verifica si el médico tiene un ID de centro válido
      if (typeof medico.centroMedicoId === 'number') {
        const nombreCentro = centroNombres.get(medico.centroMedicoId) // Busca el nombre del centro usando el ID
        if (nombreCentro) {
          // Si se encontró el nombre, incrementa el contador para ese centro
          // Usa '?? 0' para asegurar que si la clave no existiera (aunque la inicializamos), empiece desde 0
          medicosPorCentro[nombreCentro] = (medicosPorCentro[nombreCentro] ?? 0) + 1
        } else {
          // Si el ID existe pero no se encontró el nombre (ej. centro eliminado), incrementa 'Centro Desconocido'
          medicosPorCentro['Centro Desconocido'] = (medicosPorCentro['Centro Desconocido'] ?? 0) + 1
        }
      } else {
        // Si el médico no tiene centroMedicoId, incrementa 'Sin Centro Asignado'
        medicosPorCentro['Sin Centro Asignado'] = (medicosPorCentro['Sin Centro Asignado'] ?? 0) + 1
      }
    })

    // Convierte el objeto de conteos en un array para ECharts, filtrando los que tienen 0 médicos
    const pieData = Object.entries(medicosPorCentro)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, count]) => count > 0) // Mantiene solo entradas con count > 0
      .map(([name, value]) => ({ name, value })) // Formato { name: 'NombreCentro', value: 5 }
    console.log('Valores calculados para gráfico Médicos:', pieData) // Log para depuración

    // Si no quedan datos después de filtrar (todos los contadores eran 0), no muestra el gráfico
    if (pieData.length === 0) {
      console.log('PieData está vacío después de filtrar.')
      return null
    }

    // Devuelve la configuración del gráfico de pastel
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' }, // Muestra Nombre: Valor (Porcentaje) al pasar el mouse
      legend: { orient: 'vertical', left: 'left', top: 'center' }, // Leyenda a la izquierda, centrada verticalmente
      series: [
        {
          name: 'Médicos',
          type: 'pie', // Tipo de gráfico
          radius: '70%', // Tamaño del gráfico
          center: ['65%', '50%'], // Posición del centro (más a la derecha)
          data: pieData, // Datos calculados
          emphasis: {
            // Efecto al pasar el mouse sobre una sección
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
        },
      ],
      toolbox: { right: 10, feature: { saveAsImage: { title: 'Guardar' } } }, // Botón para guardar
    }
  })

  // Devuelve las opciones computadas para ser usadas en el componente
  return {
    chartOptionsConsultas,
    chartOptionsMedicos,
  }
}

// Exporta el tipo para que pueda ser usado fuera si es necesario
export type { EChartsOption }
