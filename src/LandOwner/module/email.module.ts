import { Module } from '@nestjs/common';
import { EmailService } from '../services/landowneremail.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // If you want to use it in other modules
})
export class EmailModule {}
