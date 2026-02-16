"""
Configuración del admin de Django para el sistema de inventario.
"""
from django.contrib import admin
from .models import Vehiculo, Compartimento, Equipo, Revision, DetalleRevision


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'activo', 'fecha_creacion')
    list_filter = ('activo', 'fecha_creacion')
    search_fields = ('codigo', 'nombre')


@admin.register(Compartimento)
class CompartimentoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'vehiculo', 'orden', 'activo')
    list_filter = ('vehiculo', 'activo')
    search_fields = ('nombre', 'vehiculo__codigo')


@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'compartimento', 'cantidad_esperada', 'orden', 'activo')
    list_filter = ('compartimento__vehiculo', 'activo')
    search_fields = ('nombre', 'compartimento__nombre')


@admin.register(Revision)
class RevisionAdmin(admin.ModelAdmin):
    list_display = ('vehiculo', 'responsable', 'fecha', 'usuario')
    list_filter = ('vehiculo', 'fecha', 'responsable')
    search_fields = ('vehiculo__codigo', 'responsable')
    readonly_fields = ('fecha',)


@admin.register(DetalleRevision)
class DetalleRevisionAdmin(admin.ModelAdmin):
    list_display = ('revision', 'equipo', 'estado')
    list_filter = ('estado', 'revision__vehiculo')
    search_fields = ('equipo__nombre', 'revision__vehiculo__codigo')
