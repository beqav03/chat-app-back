import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL, 
    "https://www.back-end.com.ge"
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization'
  });

  await app.listen(3000);
  console.log('Server running on port 3000');
}
bootstrap();