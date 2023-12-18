import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Remove the extra dot at the end
  
 

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true,
      cookie:
{ secure: false,
httpOnly: false,
maxAge: 10000
},
    }),
  );

  await app.listen(7000);
}
bootstrap();
