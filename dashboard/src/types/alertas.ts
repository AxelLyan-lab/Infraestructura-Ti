export type AlertaTipo =
  | 'temperatura_advertencia'
  | 'temperatura_critica'
  | 'humedad_advertencia'
  | 'humedad_critica'

export type AlertaRow = {
  id: number
  tipo_alerta: AlertaTipo
  valor: number
  mensaje: string
  fecha: string
}
