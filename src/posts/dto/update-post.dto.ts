import { IsNotEmpty } from 'class-validator';

class UpdatePostDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() content: string;
}

export default UpdatePostDto;
