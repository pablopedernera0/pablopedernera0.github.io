# Docker y MySQL en AWS: tu servidor en la nube

Este cuestionario es sobre la práctica que hiciste en el AWS Academy Learner Lab. Tené la guía abierta al lado: las preguntas siguen sus pasos.

> Guía de la práctica: [pablopedernera0.github.io/docker-mysql-aws](https://pablopedernera0.github.io/docker-mysql-aws/)

## Lo que armaste

Una instancia EC2 con Ubuntu en la región **us-east-1**, dentro de la **VPC por defecto**, con cuatro servicios en Docker:

### Nginx

Una página web en el puerto **80**.

### phpMyAdmin

Administra MySQL desde el navegador, en el puerto **8080**.

### CRUD Flask

La app de alumnos, en el puerto **8888**.

### MySQL

La base de datos. **Sin puerto publicado** y sin regla en el security group.

## Las dos partes

1. **Parte 1 (Pasos 1 a 5):** la red (VPC, subredes, Internet gateway, tabla de rutas), el firewall (security group), la instancia (AMI, tipo, disco, IP pública) y la conexión.
2. **Parte 2 (Pasos 6 a 11):** Docker, los contenedores, el CRUD, el desafío final y apagar todo.

> Es un repaso: no lleva nota. Respondé todo, tocá **Finalizar** y esperá el código que da el profesor para ver tu resultado.
