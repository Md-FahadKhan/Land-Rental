import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Remove the extra dot at the end
  app.enableCors(); 
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000000, 
      },
    }),
  );

  await app.listen(7000);
}
bootstrap();
