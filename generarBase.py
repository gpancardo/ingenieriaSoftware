import pandas as pd
import random as rd
from datetime import datetime, timedelta
import string

#Elementos de entrada
nombres=["ANA", "JORGE","PAULA","MIGUEL","YLIANNE","KAROL","VALERIA","MARTHA","PEDRO", "JUAN","JULIÁN","JOSÉ","MARÍA","SOL","SOFÍA","LUNA","FERNANDO"]
apellidos=["GARCÍA","MARTÍNEZ","LÓPEZ","ROBLES","OLMOS","ORTEGA","PÉREZ","RODRÍGUEZ","RAMÍREZ","CRUZ","FLORES","GÓMEZ","MORALES","REYES","JIMÉNEZ","TORRES","DÍAZ","RUÍZ","MENDOZA","AGUILAR","ORTIZ","MORENO","CASTILLO"]
fechas=[]
carreras=["COMUNICACIÓN Y PERIODISMO", "DERECHO", "IC" "ICO","ARQUITECTURA","DISEÑO INDUSTRIAL","ECONOMÍA","SOCIOLOGÍA", "IEE", "II","IM","PEDAGOGÍA","PDA","RRII"]

#Elementos de salida
nombresSalida=[]
cuenta=[]
carrerasSalida=[]
fechasSalida=[]
correoSalida=[]

#Función para generar nombre completo
def generarNombre():
    dosNombres=rd.randint(0,1)
    primerNombre=rd.choice(nombres)
    segundoNombre=[""]
    if dosNombres==1:
        segundoNombre=rd.choice(nombres)
    primerApellido=rd.choice(apellidos)
    segundoApellido=rd.choice(apellidos)
    nombreFormato=str(primerApellido)+" "+str(segundoApellido)+", "+str(primerNombre)+" "+str(segundoNombre)
    nombresSalida.append(nombreFormato)    

#Función para generar fecha
def generarFecha():
    fecha_inicial = datetime(2020, 1, 1)
    fecha_final = datetime(2023, 5, 31)
    diferencia = fecha_final - fecha_inicial
    dias = diferencia.days
    fecha_aleatoria = fecha_inicial + timedelta(days=rd.randint(0, dias))
    nuevaFecha= fecha_aleatoria.strftime('%Y-%m-%d')
    fechasSalida.append(nuevaFecha)

#Función para generar carrera
def generarCarrera():
    entradaCarrera=rd.choice(carreras)
    carrerasSalida.append(entradaCarrera)

#Función para generar número de cuenta
def generarNumero():
    cuentaNueva=rd.randint(111111111, 999999999)
    if cuentaNueva not in cuenta:
        cuenta.append(cuentaNueva)
    else:
        cuentaNueva=rd.randint(111111111, 999999999)

#Función para generar correos
def generarCorreo():
    letras = rd.choices(string.ascii_letters, k=9)
    cadena = ''.join(letras)
    nuevoCorreo = cadena+"@aragon.unam.mx"
    correoSalida.append(nuevoCorreo)
    
#Main. Pedir entrada
def main():
    cantidad=int(input("Cuántas entradas necesitas? "))
    proyecto=input("Cómo se llama tu proyecto? ")
    proyecto=proyecto+".csv"
    for i in range (cantidad):
        generarCarrera()
        generarFecha()
        generarNombre()
        generarNumero()
        generarCorreo()
    #Crear df
    df=pd.DataFrame({
    'numeroCuenta': cuenta,
    'nombreCompleto': nombresSalida,
    "email": correoSalida,
    'carrera': carrerasSalida,
    'fechaRegistro': fechasSalida
    })
    
    #Exportar df a csv
    df.to_csv(proyecto, index=False)


main()
