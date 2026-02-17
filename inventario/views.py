"""
ViewSets para la API REST del sistema de inventario.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import Count, Q

from .models import Vehiculo, Compartimento, Equipo, Revision, DetalleRevision
from .serializers import (
    VehiculoSerializer,
    VehiculoEstadoSerializer,
    CompartimentoSerializer,
    EquipoSerializer,
    RevisionSerializer,
    RevisionCreateSerializer,
)


class VehiculoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gestionar vehículos.
    Solo lectura (GET) para mantener integridad de datos.
    """
    queryset = Vehiculo.objects.filter(activo=True).prefetch_related(
        'compartimentos__equipos'
    )
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def estado(self, request, pk=None):
        """
        Calcula y retorna el estado actual de un vehículo.
        Endpoint: GET /api/vehiculos/{id}/estado/
        """
        vehiculo = self.get_object()
        responsable = request.query_params.get('responsable', None)

        # Obtener última revisión
        if responsable:
            ultima_revision = Revision.objects.filter(
                vehiculo=vehiculo,
                responsable=responsable
            ).order_by('-fecha').first()
        else:
            ultima_revision = Revision.objects.filter(
                vehiculo=vehiculo
            ).order_by('-fecha').first()

        # Calcular estado
        estado = vehiculo.calcular_estado(responsable)

        # Contar equipos
        total_equipos = Equipo.objects.filter(
            compartimento__vehiculo=vehiculo,
            activo=True
        ).count()

        # Si hay revisión, contar detalles
        equipos_revisados = 0
        equipos_si = 0
        equipos_no = 0

        if ultima_revision:
            detalles = ultima_revision.detalles_revision.all()
            equipos_revisados = detalles.count()
            equipos_si = detalles.filter(estado='si').count()
            equipos_no = detalles.filter(estado='no').count()

        data = {
            'vehiculo_id': vehiculo.id,
            'codigo': vehiculo.codigo,
            'nombre': vehiculo.nombre or '',
            'estado': estado,
            'ultima_revision_fecha': ultima_revision.fecha if ultima_revision else None,
            'ultima_revision_responsable': ultima_revision.responsable if ultima_revision else None,
            'total_equipos': total_equipos,
            'equipos_revisados': equipos_revisados,
            'equipos_si': equipos_si,
            'equipos_no': equipos_no,
        }

        serializer = VehiculoEstadoSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estados(self, request):
        """
        Retorna el estado de todos los vehículos.
        Endpoint: GET /api/vehiculos/estados/
        """
        responsable = request.query_params.get('responsable', None)
        vehiculos = Vehiculo.objects.filter(activo=True)

        estados = []
        for vehiculo in vehiculos:
            estado = vehiculo.calcular_estado(responsable)

            ultima_revision = None
            if responsable:
                ultima_revision = Revision.objects.filter(
                    vehiculo=vehiculo,
                    responsable=responsable
                ).order_by('-fecha').first()
            else:
                ultima_revision = Revision.objects.filter(
                    vehiculo=vehiculo
                ).order_by('-fecha').first()

            total_equipos = Equipo.objects.filter(
                compartimento__vehiculo=vehiculo,
                activo=True
            ).count()

            equipos_revisados = 0
            equipos_si = 0
            equipos_no = 0

            if ultima_revision:
                detalles = ultima_revision.detalles_revision.all()
                equipos_revisados = detalles.count()
                equipos_si = detalles.filter(estado='si').count()
                equipos_no = detalles.filter(estado='no').count()

            estados.append({
                'vehiculo_id': vehiculo.id,
                'codigo': vehiculo.codigo,
                'nombre': vehiculo.nombre or '',
                'estado': estado,
                'ultima_revision_fecha': ultima_revision.fecha if ultima_revision else None,
                'ultima_revision_responsable': ultima_revision.responsable if ultima_revision else None,
                'total_equipos': total_equipos,
                'equipos_revisados': equipos_revisados,
                'equipos_si': equipos_si,
                'equipos_no': equipos_no,
            })

        serializer = VehiculoEstadoSerializer(estados, many=True)
        return Response(serializer.data)


class CompartimentoViewSet(viewsets.ModelViewSet):
    """ViewSet para compartimentos (crear, listar, editar, eliminar)."""
    queryset = Compartimento.objects.filter(activo=True).prefetch_related('equipos')
    serializer_class = CompartimentoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Compartimento.objects.filter(activo=True).prefetch_related('equipos')
        vehiculo_id = self.request.query_params.get('vehiculo', None)
        if vehiculo_id:
            queryset = queryset.filter(vehiculo_id=vehiculo_id)
        return queryset


class EquipoViewSet(viewsets.ModelViewSet):
    """ViewSet para equipos (crear, listar, editar, eliminar)."""
    queryset = Equipo.objects.filter(activo=True)
    serializer_class = EquipoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Equipo.objects.filter(activo=True)
        compartimento_id = self.request.query_params.get('compartimento', None)
        vehiculo_id = self.request.query_params.get('vehiculo', None)
        if compartimento_id:
            queryset = queryset.filter(compartimento_id=compartimento_id)
        if vehiculo_id:
            queryset = queryset.filter(compartimento__vehiculo_id=vehiculo_id)
        return queryset


class RevisionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar revisiones.
    Permite crear y listar revisiones.
    """
    queryset = Revision.objects.select_related('vehiculo', 'usuario').prefetch_related(
        'detalles_revision__equipo__compartimento'
    ).all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return RevisionCreateSerializer
        return RevisionSerializer

    def get_queryset(self):
        queryset = Revision.objects.select_related('vehiculo', 'usuario').prefetch_related(
            'detalles_revision__equipo__compartimento'
        ).all()

        # Filtros opcionales
        vehiculo_id = self.request.query_params.get('vehiculo', None)
        responsable = self.request.query_params.get('responsable', None)

        if vehiculo_id:
            queryset = queryset.filter(vehiculo_id=vehiculo_id)
        if responsable:
            queryset = queryset.filter(responsable=responsable)

        return queryset.order_by('-fecha')

    def perform_create(self, serializer):
        """Asigna el usuario actual al crear una revisión."""
        revision = serializer.save()
        if self.request.user.is_authenticated:
            revision.usuario = self.request.user
            revision.save()

    def list(self, request, *args, **kwargs):
        """Sobrescribe list para agregar estadísticas calculadas."""
        response = super().list(request, *args, **kwargs)
        # Agregar cálculos a cada revisión en la respuesta
        for revision_data in response.data['results'] if 'results' in response.data else response.data:
            revision_id = revision_data.get('id')
            if revision_id:
                try:
                    revision = Revision.objects.get(id=revision_id)
                    detalles = revision.detalles_revision.all()
                    revision_data['estado_calculado'] = revision.calcular_estado()
                    revision_data['total_equipos'] = detalles.count()
                    revision_data['equipos_si'] = detalles.filter(estado='si').count()
                    revision_data['equipos_no'] = detalles.filter(estado='no').count()
                except Revision.DoesNotExist:
                    pass
        return response
