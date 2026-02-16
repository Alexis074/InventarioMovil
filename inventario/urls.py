"""
URLs para la API REST del sistema de inventario.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehiculoViewSet,
    CompartimentoViewSet,
    EquipoViewSet,
    RevisionViewSet,
)

# Crear router para ViewSets
router = DefaultRouter()
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculo')
router.register(r'compartimentos', CompartimentoViewSet, basename='compartimento')
router.register(r'equipos', EquipoViewSet, basename='equipo')
router.register(r'revisiones', RevisionViewSet, basename='revision')

app_name = 'inventario'

urlpatterns = [
    path('api/', include(router.urls)),
]
