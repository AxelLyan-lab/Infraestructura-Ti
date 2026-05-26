-- Ampliar tipos de alerta (advertencia + crítica) y umbrales en el trigger
-- Temp: >30 advertencia, >45 crítica (solo un tipo por lectura: crítica tiene prioridad)
-- Hum: >60 advertencia, >80 crítica

alter table public.alertas drop constraint if exists alertas_tipo_alerta_chk;

alter table public.alertas
  add constraint alertas_tipo_alerta_chk check (
    tipo_alerta in (
      'temperatura_advertencia',
      'temperatura_critica',
      'humedad_advertencia',
      'humedad_critica'
    )
  );

comment on column public.alertas.tipo_alerta is
  'temperatura_advertencia | temperatura_critica | humedad_advertencia | humedad_critica';

create or replace function public.trg_sensores_generar_alertas()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cooldown constant interval := interval '10 minutes';
begin
  if new.temperatura > 45 then
    if not exists (
      select 1 from public.alertas a
      where a.tipo_alerta = 'temperatura_critica'
        and a.fecha > (now() - cooldown)
    ) then
      insert into public.alertas (tipo_alerta, valor, mensaje)
      values (
        'temperatura_critica',
        new.temperatura,
        format('Temperatura crítica: %s °C', round(new.temperatura::numeric, 1))
      );
    end if;
  elsif new.temperatura > 30 then
    if not exists (
      select 1 from public.alertas a
      where a.tipo_alerta = 'temperatura_advertencia'
        and a.fecha > (now() - cooldown)
    ) then
      insert into public.alertas (tipo_alerta, valor, mensaje)
      values (
        'temperatura_advertencia',
        new.temperatura,
        format('Advertencia: temperatura elevada: %s °C', round(new.temperatura::numeric, 1))
      );
    end if;
  end if;

  if new.humedad > 80 then
    if not exists (
      select 1 from public.alertas a
      where a.tipo_alerta = 'humedad_critica'
        and a.fecha > (now() - cooldown)
    ) then
      insert into public.alertas (tipo_alerta, valor, mensaje)
      values (
        'humedad_critica',
        new.humedad,
        format('Humedad crítica: %s %%', round(new.humedad::numeric, 1))
      );
    end if;
  elsif new.humedad > 60 then
    if not exists (
      select 1 from public.alertas a
      where a.tipo_alerta = 'humedad_advertencia'
        and a.fecha > (now() - cooldown)
    ) then
      insert into public.alertas (tipo_alerta, valor, mensaje)
      values (
        'humedad_advertencia',
        new.humedad,
        format('Advertencia: humedad elevada: %s %%', round(new.humedad::numeric, 1))
      );
    end if;
  end if;

  return new;
end;
$$;
