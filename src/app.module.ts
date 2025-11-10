import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentUploaderModule } from "./document-uploader/document-uploader.module";
import { DataUpdatesModule } from "./dataupdates/dataupdates.module";

@Module({
  imports: [DocumentUploaderModule, DataUpdatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
