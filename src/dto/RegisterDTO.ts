import { IsString, IsDateString} from 'class-validator';

class RegisterDTO {
  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsDateString()
  public birthDate:Date;

  @IsString()
  public name:string;
  
  @IsString()
  public profilePicture:string;
  
}

export default RegisterDTO;