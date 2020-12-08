import { IsNotEmpty } from 'class-validator';

class CreatePostDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() content: string;
}

export default CreatePostDto;
