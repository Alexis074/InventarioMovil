"""
Script para poblar la base de datos con datos iniciales.
Ejecutar: python manage.py shell < manage_seed.py
O mejor: python manage_seed.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inventario_bomberos.settings')
django.setup()

from inventario.models import Vehiculo, Compartimento, Equipo

def crear_datos_iniciales():
    """Crea los vehículos, compartimentos y equipos iniciales."""
    
    print("Creando vehículos...")
    
    # Lista de vehículos
    vehiculos_data = [
        {'codigo': 'PMH-01', 'nombre': 'Ambulancia PMH-01'},
        {'codigo': 'PMH-02', 'nombre': 'Ambulancia PMH-02'},
        {'codigo': 'PMH-03', 'nombre': 'Ambulancia PMH-03'},
        {'codigo': 'ABI-02', 'nombre': 'Autobomba ABI-02'},
        {'codigo': 'ATI-01', 'nombre': 'Autobomba Tanque ATI-01'},
        {'codigo': 'UFI-01', 'nombre': 'Unidad de Fumigación UFI-01'},
    ]
    
    # Compartimentos por vehículo (ejemplo para PMH-01)
    compartimentos_data = {
        'PMH-01': [
            {'nombre': 'Compartimento Izquierdo', 'orden': 1},
            {'nombre': 'Compartimento Derecho Delantero', 'orden': 2},
            {'nombre': 'Compartimento Derecho Trasero', 'orden': 3},
            {'nombre': 'Compartimento Interior', 'orden': 4},
        ],
        'PMH-02': [
            {'nombre': 'Compartimento Izquierdo', 'orden': 1},
            {'nombre': 'Compartimento Derecho Delantero', 'orden': 2},
            {'nombre': 'Compartimento Derecho Trasero', 'orden': 3},
            {'nombre': 'Compartimento Interior', 'orden': 4},
        ],
        'PMH-03': [
            {'nombre': 'Compartimento Izquierdo', 'orden': 1},
            {'nombre': 'Compartimento Derecho Delantero', 'orden': 2},
            {'nombre': 'Compartimento Derecho Trasero', 'orden': 3},
            {'nombre': 'Compartimento Interior', 'orden': 4},
        ],
        'ABI-02': [
            {'nombre': 'Compartimento Lateral Izquierdo', 'orden': 1},
            {'nombre': 'Compartimento Lateral Derecho', 'orden': 2},
            {'nombre': 'Compartimento Trasero', 'orden': 3},
        ],
        'ATI-01': [
            {'nombre': 'Compartimento Lateral Izquierdo', 'orden': 1},
            {'nombre': 'Compartimento Lateral Derecho', 'orden': 2},
            {'nombre': 'Compartimento Trasero', 'orden': 3},
        ],
        'UFI-01': [
            {'nombre': 'Compartimento Principal', 'orden': 1},
            {'nombre': 'Compartimento Secundario', 'orden': 2},
        ],
    }
    
    # Equipos ejemplo (se aplican a todos los compartimentos similares)
    equipos_ejemplo = [
        {'nombre': 'Manguera 50mm', 'cantidad_esperada': 2, 'orden': 1},
        {'nombre': 'Manguera 38mm', 'cantidad_esperada': 4, 'orden': 2},
        {'nombre': 'Lanza de agua', 'cantidad_esperada': 2, 'orden': 3},
        {'nombre': 'Extintor ABC 5kg', 'cantidad_esperada': 2, 'orden': 4},
        {'nombre': 'Extintor ABC 10kg', 'cantidad_esperada': 1, 'orden': 5},
        {'nombre': 'Hacha', 'cantidad_esperada': 1, 'orden': 6},
        {'nombre': 'Pala', 'cantidad_esperada': 1, 'orden': 7},
        {'nombre': 'Casco', 'cantidad_esperada': 4, 'orden': 8},
        {'nombre': 'Guantes', 'cantidad_esperada': 4, 'orden': 9},
        {'nombre': 'Botas', 'cantidad_esperada': 2, 'orden': 10},
    ]
    
    # Crear vehículos
    vehiculos_creados = {}
    for v_data in vehiculos_data:
        vehiculo, created = Vehiculo.objects.get_or_create(
            codigo=v_data['codigo'],
            defaults={'nombre': v_data['nombre']}
        )
        vehiculos_creados[v_data['codigo']] = vehiculo
        if created:
            print(f"  ✓ Creado: {vehiculo.codigo}")
        else:
            print(f"  → Ya existe: {vehiculo.codigo}")
    
    # Crear compartimentos
    print("\nCreando compartimentos...")
    for codigo, compartimentos_list in compartimentos_data.items():
        vehiculo = vehiculos_creados[codigo]
        for comp_data in compartimentos_list:
            compartimento, created = Compartimento.objects.get_or_create(
                vehiculo=vehiculo,
                nombre=comp_data['nombre'],
                defaults={'orden': comp_data['orden']}
            )
            if created:
                print(f"  ✓ {vehiculo.codigo} - {compartimento.nombre}")
    
    # Crear equipos (aplicar equipos ejemplo a todos los compartimentos)
    print("\nCreando equipos...")
    total_equipos = 0
    for vehiculo in Vehiculo.objects.all():
        for compartimento in vehiculo.compartimentos.all():
            for equipo_data in equipos_ejemplo:
                equipo, created = Equipo.objects.get_or_create(
                    compartimento=compartimento,
                    nombre=equipo_data['nombre'],
                    defaults={
                        'cantidad_esperada': equipo_data['cantidad_esperada'],
                        'orden': equipo_data['orden']
                    }
                )
                if created:
                    total_equipos += 1
    
    print(f"\n✓ Total equipos creados: {total_equipos}")
    print("\n✓ Datos iniciales creados exitosamente!")


if __name__ == '__main__':
    crear_datos_iniciales()
