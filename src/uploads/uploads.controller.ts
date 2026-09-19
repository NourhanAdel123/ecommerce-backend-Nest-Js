import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Res,
  UploadedFiles,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

@Controller('/api/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file provided');
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  public uploadMutipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No files provided');
    const filenames = files.map((file) => file.filename);
    return { message: 'files uploaded successfully', filenames };
  }

  @Get(':image')
  public showUploadedImage(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: 'images' });
  }
}
