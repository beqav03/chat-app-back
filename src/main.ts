import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',  // Allow frontend
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  });

  await app.listen(3000);
  console.log("Server running on port 3000");
}
bootstrap();