import { app } from './app';

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(
    `📚 Documentación de la API: http://localhost:${PORT}/api/v1/docs`
  );
  console.log(`🔍 Check de salud: http://localhost:${PORT}/api/v1/health`);
});