import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  });

  // Serve static files from the frontend build directory
  app.useStaticAssets(join(__dirname, '..', 'frontend', 'build'));

  // Serve the frontend's index.html for all routes
  app.setBaseViewsDir(join(__dirname, '..', 'frontend', 'build'));
  app.setViewEngine('html');

  await app.listen(3000);
}
bootstrap();