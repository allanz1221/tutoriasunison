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

## Configuración Local:

1. Copia el archivo `database-config.env` como `.env` en la raíz del proyecto
2. O crea manualmente un archivo `.env` con:
   ```
   DATABASE_URL="mysql://root:Navojoa2019@104.131.106.205:3306/chatgpt_interface?schema=public"
   ```

## Notas Importantes:

- La base de datos MySQL debe estar accesible desde internet para que Vercel pueda conectarse
- Asegúrate de que el puerto 3306 esté abierto en el servidor
- Considera usar SSL en producción para mayor seguridad
