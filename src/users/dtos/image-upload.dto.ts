import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'User profile image file',
    name: 'profile-image',
  })
  userImage: any;
}
