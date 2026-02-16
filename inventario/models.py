"""
Modelos para el sistema de inventario de vehículos de bomberos.
"""
from django.db import models
from django.contrib.auth.models import User


class Vehiculo(models.Model):
    """Modelo para representar un vehículo del cuartel."""
    codigo = models.CharField(max_length=20, unique=True, help_text="Código único del vehículo (ej: PMH-01)")
    nombre = models.CharField(max_length=100, blank=True, help_text="Nombre descriptivo del vehículo")
    imagen = models.ImageField(upload_to='vehiculos/', null=True, blank=True, help_text="Foto del vehículo")
    activo = models.BooleanField(default=True, help_text="Indica si el vehículo está activo en el inventario")
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
        ordering = ['codigo']

    def __str__(self):
        return f"{self.codigo} - {self.nombre or 'Sin nombre'}"

    def calcular_estado(self, responsable=None):
        """
        Calcula el estado general del vehículo basado en la última revisión.
        Retorna: 'pendiente', 'completo', 'critico'
        """
        if responsable:
            revisiones = self.revisiones.filter(responsable=responsable).order_by('-fecha')
        else:
            revisiones = self.revisiones.all().order_by('-fecha')

        if not revisiones.exists():
            return 'pendiente'

        ultima_revision = revisiones.first()
        detalles = ultima_revision.detalles_revision.all()

        if not detalles.exists():
            return 'pendiente'

        # Si hay algún equipo marcado como NO, es crítico
        tiene_no = detalles.filter(estado='no').exists()
        if tiene_no:
            return 'critico'

        # Si todos están marcados como SI, está completo
        todos_si = detalles.filter(estado='si').count() == detalles.count()
        if todos_si:
            return 'completo'

        return 'pendiente'


class Compartimento(models.Model):
    """Modelo para representar un compartimento dentro de un vehículo."""
    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.CASCADE,
        related_name='compartimentos',
        help_text="Vehículo al que pertenece este compartimento"
    )
    nombre = models.CharField(max_length=100, help_text="Nombre del compartimento (ej: Lateral izquierdo)")
    orden = models.PositiveIntegerField(default=0, help_text="Orden de visualización")
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Compartimento"
        verbose_name_plural = "Compartimentos"
        ordering = ['vehiculo', 'orden', 'nombre']
        unique_together = [['vehiculo', 'nombre']]

    def __str__(self):
        return f"{self.vehiculo.codigo} - {self.nombre}"


class Equipo(models.Model):
    """Modelo para representar un equipo/ítem dentro de un compartimento."""
    compartimento = models.ForeignKey(
        Compartimento,
        on_delete=models.CASCADE,
        related_name='equipos',
        help_text="Compartimento al que pertenece este equipo"
    )
    nombre = models.CharField(max_length=200, help_text="Nombre del equipo (ej: Manguera 50mm)")
    cantidad_esperada = models.PositiveIntegerField(default=1, help_text="Cantidad esperada de este equipo")
    orden = models.PositiveIntegerField(default=0, help_text="Orden de visualización")
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"
        ordering = ['compartimento', 'orden', 'nombre']

    def __str__(self):
        return f"{self.compartimento} - {self.nombre}"


class Revision(models.Model):
    """Modelo para representar una revisión completa de un vehículo."""
    vehiculo = models.ForeignKey(
        Vehiculo,
        on_delete=models.CASCADE,
        related_name='revisiones',
        help_text="Vehículo que se está revisando"
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='revisiones',
        help_text="Usuario que realizó la revisión"
    )
    responsable = models.CharField(
        max_length=100,
        help_text="Nombre o grupo responsable de la revisión"
    )
    fecha = models.DateTimeField(auto_now_add=True, help_text="Fecha y hora de la revisión")
    observaciones_generales = models.TextField(blank=True, help_text="Observaciones generales de la revisión")

    class Meta:
        verbose_name = "Revisión"
        verbose_name_plural = "Revisiones"
        ordering = ['-fecha']

    def __str__(self):
        return f"Revisión {self.vehiculo.codigo} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

    def calcular_estado(self):
        """Calcula el estado general de la revisión."""
        detalles = self.detalles_revision.all()
        if not detalles.exists():
            return 'pendiente'
        if detalles.filter(estado='no').exists():
            return 'critico'
        if detalles.filter(estado='si').count() == detalles.count():
            return 'completo'
        return 'pendiente'


class DetalleRevision(models.Model):
    """Modelo para representar el estado de un equipo específico en una revisión."""
    ESTADO_CHOICES = [
        ('si', 'SI'),
        ('no', 'NO'),
        ('pendiente', 'Pendiente'),
    ]

    revision = models.ForeignKey(
        Revision,
        on_delete=models.CASCADE,
        related_name='detalles_revision',
        help_text="Revisión a la que pertenece este detalle"
    )
    equipo = models.ForeignKey(
        Equipo,
        on_delete=models.CASCADE,
        related_name='detalles_revision',
        help_text="Equipo que se está revisando"
    )
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_CHOICES,
        default='pendiente',
        help_text="Estado del equipo: SI, NO, o Pendiente"
    )
    observaciones = models.TextField(blank=True, help_text="Observaciones específicas sobre este equipo")

    class Meta:
        verbose_name = "Detalle de Revisión"
        verbose_name_plural = "Detalles de Revisión"
        unique_together = [['revision', 'equipo']]

    def __str__(self):
        return f"{self.revision} - {self.equipo.nombre}: {self.get_estado_display()}"
