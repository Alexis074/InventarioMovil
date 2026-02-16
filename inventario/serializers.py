"""
Serializers para la API REST del sistema de inventario.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehiculo, Compartimento, Equipo, Revision, DetalleRevision


class UserSerializer(serializers.ModelSerializer):
    """Serializer para usuarios."""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']


class EquipoSerializer(serializers.ModelSerializer):
    """Serializer para equipos."""
    class Meta:
        model = Equipo
        fields = ['id', 'compartimento', 'nombre', 'cantidad_esperada', 'orden', 'activo']
        read_only_fields = ['id']


class CompartimentoSerializer(serializers.ModelSerializer):
    """Serializer para compartimentos con sus equipos."""
    equipos = EquipoSerializer(many=True, read_only=True)
    equipos_count = serializers.IntegerField(source='equipos.count', read_only=True)

    class Meta:
        model = Compartimento
        fields = ['id', 'vehiculo', 'nombre', 'orden', 'activo', 'equipos', 'equipos_count']
        read_only_fields = ['id']


class VehiculoSerializer(serializers.ModelSerializer):
    """Serializer básico para vehículos."""
    compartimentos = CompartimentoSerializer(many=True, read_only=True)
    compartimentos_count = serializers.IntegerField(source='compartimentos.count', read_only=True)

    class Meta:
        model = Vehiculo
        fields = [
            'id', 'codigo', 'nombre', 'imagen', 'activo',
            'fecha_creacion', 'fecha_actualizacion',
            'compartimentos', 'compartimentos_count'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion']


class VehiculoEstadoSerializer(serializers.Serializer):
    """Serializer para el estado calculado de un vehículo."""
    vehiculo_id = serializers.IntegerField()
    codigo = serializers.CharField()
    nombre = serializers.CharField()
    estado = serializers.CharField()  # 'pendiente', 'completo', 'critico'
    ultima_revision_fecha = serializers.DateTimeField(allow_null=True)
    ultima_revision_responsable = serializers.CharField(allow_null=True)
    total_equipos = serializers.IntegerField()
    equipos_revisados = serializers.IntegerField()
    equipos_si = serializers.IntegerField()
    equipos_no = serializers.IntegerField()


class DetalleRevisionSerializer(serializers.ModelSerializer):
    """Serializer para detalles de revisión."""
    equipo_nombre = serializers.CharField(source='equipo.nombre', read_only=True)
    equipo_compartimento = serializers.CharField(source='equipo.compartimento.nombre', read_only=True)

    class Meta:
        model = DetalleRevision
        fields = [
            'id', 'equipo', 'equipo_nombre', 'equipo_compartimento',
            'estado', 'observaciones'
        ]
        read_only_fields = ['id']


class RevisionSerializer(serializers.ModelSerializer):
    """Serializer para revisiones con sus detalles."""
    detalles_revision = DetalleRevisionSerializer(many=True, read_only=True)
    vehiculo_codigo = serializers.CharField(source='vehiculo.codigo', read_only=True)
    vehiculo_nombre = serializers.CharField(source='vehiculo.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True, allow_null=True)
    estado_calculado = serializers.CharField(read_only=True)
    total_equipos = serializers.IntegerField(read_only=True)
    equipos_si = serializers.IntegerField(read_only=True)
    equipos_no = serializers.IntegerField(read_only=True)

    class Meta:
        model = Revision
        fields = [
            'id', 'vehiculo', 'vehiculo_codigo', 'vehiculo_nombre',
            'usuario', 'usuario_nombre', 'responsable',
            'fecha', 'observaciones_generales',
            'detalles_revision', 'estado_calculado',
            'total_equipos', 'equipos_si', 'equipos_no'
        ]
        read_only_fields = ['id', 'fecha', 'estado_calculado', 'total_equipos', 'equipos_si', 'equipos_no']


class RevisionCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear una nueva revisión con sus detalles."""
    detalles = DetalleRevisionSerializer(many=True, write_only=True)

    class Meta:
        model = Revision
        fields = ['vehiculo', 'responsable', 'observaciones_generales', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        revision = Revision.objects.create(**validated_data)

        for detalle_data in detalles_data:
            DetalleRevision.objects.create(revision=revision, **detalle_data)

        return revision
