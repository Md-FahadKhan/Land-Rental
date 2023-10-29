import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerModule } from './Manager/manager.module';
import { SellerModule } from './Seller/seller.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtMiddleware } from './Auth/jwt.middleware';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    ManagerModule,
    SellerModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'fahad',
      database: 'land-rentalDB', //Change to your database name
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('admin/*'); // Apply the middleware to routes that require JWT authentication
  }
}
