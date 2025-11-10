import { IsOptional, IsJSON, IsString } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  schema: string; 
  @IsOptional()
  @IsString()
  fileType: string;
}