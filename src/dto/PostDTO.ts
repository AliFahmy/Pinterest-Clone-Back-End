import { IsString, IsDateString} from 'class-validator';

class PostDTO {
  @IsString()
  public picture: string;

  @IsString()
  public title: string;

  @IsString()
  public caption:Date;
}

export default PostDTO;