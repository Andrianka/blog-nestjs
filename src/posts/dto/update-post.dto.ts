import { IsNotEmpty } from 'class-validator';

class UpdatePostDto {
  id: string;
  @IsNotEmpty() title: string;
  @IsNotEmpty() content: string;
}

export default UpdatePostDto;
