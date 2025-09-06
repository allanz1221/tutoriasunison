# Configuración de Variables de Entorno para Vercel

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en el dashboard de Vercel:

### 1. DATABASE_URL
```
mysql://root:Navojoa2019@104.131.106.205:3306/chatgpt_interface?schema=public
```

## Cómo configurar en Vercel:

1. Ve a tu proyecto en el dashboard de Vercel
2. Navega a Settings > Environment Variables
3. Agrega la variable `DATABASE_URL` con el valor mostrado arriba
4. Asegúrate de que esté habilitada para Production, Preview y Development

## Verificación de la Configuración:

Después de configurar las variables de entorno, puedes verificar que todo funcione correctamente visitando:
```
https://tutoriasunison.vercel.app/api/health
```

Esta URL te mostrará el estado de la aplicación y la conexión a la base de datos.

## Configuración Local:

1. Copia el archivo `database-config.env` como `.env` en la raíz del proyecto
2. O crea manualmente un archivo `.env` con:
   ```
   DATABASE_URL="mysql://root:Navojoa2019@104.131.106.205:3306/chatgpt_interface?schema=public"
   ```

## Solución de Problemas:

Si recibes un error 500 en la canalización:

1. **Verifica las variables de entorno** en Vercel
2. **Revisa los logs** en el dashboard de Vercel
3. **Prueba el health check** en `/api/health`
4. **Asegúrate de que la base de datos** esté accesible desde internet

## Notas Importantes:

- La base de datos MySQL debe estar accesible desde internet para que Vercel pueda conectarse
- Asegúrate de que el puerto 3306 esté abierto en el servidor
- Considera usar SSL en producción para mayor seguridad
- Los logs detallados están habilitados para ayudar con el debugging
