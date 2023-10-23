import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerModule } from './Manager/manager.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './Admin/admin.module';

@Module({
  imports: [
    ManagerModule,AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'saurav',
      database: 'land-rentalDB', //Change to your database name
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
